import json
import pandas as pd
import requests
import time
import os
from django.db.models import Q
from .models import (
    NLPModel,
    ScanReport,
    ScanReportField,
    ScanReportValue,
    ScanReportAssertion,
    ScanReportConcept,
    DataDictionary,
)
from data.models import ConceptRelationship, Concept
from coconnect.tools.omop_db_inspect import OMOPDetails
from .services import get_concept_from_concept_code, find_standard_concept


def get_data_from_nlp(url, headers, post_response_url):
    """
    This function takes a list of POST'ed URLs and returns
    a list of responses.
    """

    get_response = []
    for url in post_response_url:

        req = requests.get(url, headers=headers)
        job = req.json()

        while job["status"] != "succeeded":
            req = requests.get(url, headers=headers)
            job = req.json()
            print("Waiting...")
            time.sleep(3)
        else:
            get_response.append(job["results"])
            print("Done!")

    return get_response


def process_nlp_response(get_response):
    """
    This function takes as input an NLP GET response
    and returns a list of concept codes.

    Input: get_response - A list of GET responses
    Output: codes - A list of concept Codes

    """
    keep = ["ICD9", "ICD10", "RXNORM", "SNOMEDCT_US", "SNOMED"]
    codes = []

    for url in get_response:
        for dict_entry in url["documents"]:
            for entity in dict_entry["entities"]:
                if "links" in entity.keys():
                    for link in entity["links"]:
                        if link["dataSource"] in keep:
                            codes.append(
                                [
                                    dict_entry["id"],
                                    entity["text"],
                                    entity["category"],
                                    entity["confidenceScore"],
                                    link["dataSource"],
                                    link["id"],
                                ]
                            )
    return codes


def concept_code_to_id(codes):
    """
    This functions looks up standard and valid conceptIDs for concept codes
    Appends conceptID to item in list, returns a dictionary of data
    """
    codes_dict = []
    keys = [
        "pk",
        "nlp_entity",
        "nlp_entity_type",
        "nlp_confidence",
        "nlp_vocab",
        "nlp_code",
        "conceptid",
    ]
    for item in codes:
        x = get_concept_from_concept_code(
            concept_code=str(item[5]), vocabulary_id=str(item[4])
        )
        item.append(x[1].concept_id)
        codes_dict.append(dict(zip(keys, item)))

    return codes_dict


def start_nlp(search_term):

    print(">>>>> Running NLP in services_nlp.py for", search_term)
    field = ScanReportField.objects.get(pk=search_term)
    scan_report_id = field.scan_report_table.scan_report.id

    # Define NLP things
    url = "https://ccnett2.cognitiveservices.azure.com/text/analytics/v3.1-preview.3/entities/health/jobs?stringIndexType=TextElements_v8"
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ.get("NLP_API_KEY"),
        "Content-Type": "application/json; utf-8",
    }

    # Create empty list to later hold job URLs
    post_response_url = []

    # Checks to see if the field is 'pass_from_source'
    # If True, we pass field-level data i.e. a single string (field description)
    # If False, we pass all values associated with that field
    if field.pass_from_source:

        print(">>> Working at field level...")

        # Create a single dictionary item for the field description
        # Convert to JSON for NLP, POST the data to NLP API, save the job URL
        document = {
            "documents": [
                {"language": "en", "id": field.id, "text": field.field_description}
            ]
        }
        payload = json.dumps(document)
        response = requests.post(url, headers=headers, data=payload)
        post_response_url.append(response.headers["operation-location"])

        # Get the data back from NLP API, convert code to conceptIDs
        get_response = get_data_from_nlp(
            url=url, headers=headers, post_response_url=post_response_url
        )
        codes = process_nlp_response(get_response)
        print("CODES >>>", codes)
        # Look up standard and valid conceptIDs for concept codes
        # Append conceptID to item in list, turn into a dictionary
        codes_dict = concept_code_to_id(codes)

        # Check each item in values and see whether NLP got a result
        # If NLP finds something, save the result to ScanReportConcept
        match = list(filter(lambda item: item["pk"] == str(field.id), codes_dict))

        for item in match:
            scan_report_field = ScanReportField.objects.get(pk=item["pk"])
            concept = Concept.objects.get(pk=item["conceptid"])

            ScanReportConcept.objects.create(
                nlp_entity=item["nlp_entity"],
                nlp_entity_type=item["nlp_entity_type"],
                nlp_confidence=item["nlp_confidence"],
                nlp_vocabulary=item["nlp_vocab"],
                nlp_concept_code=item["nlp_code"],
                concept=concept,
                content_object=scan_report_field,
            )

    else:

        print(">>> Working at values level...")
        # Grab assertions for the ScanReport
        assertions = ScanReportAssertion.objects.filter(scan_report__id=scan_report_id)
        neg_assertions = assertions.values_list("negative_assertion")

        # Grab values associated with the ScanReportField
        # Remove values in the negative assertions list
        scan_report_values = ScanReportValue.objects.filter(
            scan_report_field=search_term
        ).filter(~Q(value__in=neg_assertions))

        # Create list of items to be sent to the NLP service
        documents = []
        for item in scan_report_values:
            documents.append(
                {"language": "en", "id": item.id, "text": item.value_description}
            )

        # POST Request(s)
        chunk_size = 10  # Set chunk size (max=10)
        post_response_url = []
        for i in range(0, len(documents), chunk_size):
            chunk = {"documents": documents[i : i + chunk_size]}
            payload = json.dumps(chunk)
            response = requests.post(url, headers=headers, data=payload)
            print(
                response.status_code,
                response.reason,
                response.headers["operation-location"],
            )
            post_response_url.append(response.headers["operation-location"])

        get_response = get_data_from_nlp(
            url=url, headers=headers, post_response_url=post_response_url
        )
        codes = process_nlp_response(get_response)
        codes_dict = concept_code_to_id(codes)

        # Mini function to see if all conceptIDs are the same
        def all_same(items):
            return all(x == items[0] for x in items)


        # Check each item in values and see whether NLP got a result
        # If NLP finds something, save the result to ScanReportConcept
        # If all conceptIDs across vocabs are the same, save only SNOMED
        # Else save each conceptID to ScanReportConcept
        for value in scan_report_values:
            print('SCAN_REPORT_VALUE >>> ', value)
            match = list(filter(lambda item: item["pk"] == str(value.id), codes_dict))
            print('MATCH >>> ', match)
            ids = [li['conceptid'] for li in match]
            print('IDs Type', type(ids))

            if len(ids) > 0:

                # If all conceptIDs are the same
                if all_same(ids):

                    # Grab the SNOMED dictionary element
                    same = list(filter(lambda item: item['nlp_vocab'] == 'SNOMEDCT_US', match))
                    print('same >>> ', same)
                    print('primary key >>> ', same[0]["pk"])
                    scan_report_value = ScanReportValue.objects.get(pk=same[0]["pk"])
                    print('scan report value >>> ', scan_report_value)
                    concept = Concept.objects.get(pk=same[0]["conceptid"])
                    print('concept >>>', concept)

                    ScanReportConcept.objects.create(
                        nlp_entity=same[0]["nlp_entity"],
                        nlp_entity_type=same[0]["nlp_entity_type"],
                        nlp_confidence=same[0]["nlp_confidence"],
                        nlp_vocabulary=same[0]["nlp_vocab"],
                        nlp_concept_code=same[0]["nlp_code"],
                        concept=concept,
                        content_object=scan_report_value,
                    )

            else:

                for item in match:
                    scan_report_value = ScanReportValue.objects.get(pk=item["pk"])
                    concept = Concept.objects.get(pk=item["conceptid"])

                    ScanReportConcept.objects.create(
                        nlp_entity=item["nlp_entity"],
                        nlp_entity_type=item["nlp_entity_type"],
                        nlp_confidence=item["nlp_confidence"],
                        nlp_vocabulary=item["nlp_vocab"],
                        nlp_concept_code=item["nlp_code"],
                        concept=concept,
                        content_object=scan_report_value,
                    )

    return True


def nlp_single_string(pk, dict_string):

    """
    This function allows you to pass a single text string to NLP
    and return a list of all valid and standard OMOP codes for the
    computed entity

    Returns a pandas dataframe

    """

    # Translate queryset into JSON-like dict for NLP
    documents = []
    documents.append(
        {
            "language": "en",
            "id": 1,
            "text": dict_string,
        }
    )

    chunk = {"documents": documents}

    # Define NLP URL/headers
    url = "https://ccnett2.cognitiveservices.azure.com/text/analytics/v3.1-preview.3/entities/health/jobs?stringIndexType=TextElements_v8"
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ.get("NLP_API_KEY"),
        "Content-Type": "application/json; utf-8",
    }

    # Create payload, POST to the NLP servoce
    payload = json.dumps(chunk)
    response = requests.post(url, headers=headers, data=payload)
    post_response_url = response.headers["operation-location"]
    time.sleep(3)

    # GET the response
    req = requests.get(post_response_url, headers=headers)
    job = req.json()

    # Loop to wait for the job to finish running
    get_response = []
    while job["status"] != "succeeded":
        req = requests.get(post_response_url, headers=headers)
        job = req.json()
        time.sleep(3)
    else:
        get_response.append(job["results"])

    resp = str(get_response[0])

    NLPModel.objects.filter(id=pk).update(json_response=resp)

    return True


def get_json_from_nlpmodel(json):

    """
    A small function to process the JSON string saved in NLPModel
    """

    # Define which codes we want to keep. Add more here as required.
    codes = []
    keep = ["ICD9", "ICD10", "RXNORM", "SNOMEDCT_US"]

    json_response = json

    # Mad nested for loops to get at the data in the response
    for dict_entry in json_response["documents"]:
        for entity in dict_entry["entities"]:
            if "links" in entity.keys():
                for link in entity["links"]:
                    if link["dataSource"] in keep:
                        codes.append(
                            [
                                dict_entry["id"],
                                entity["text"],
                                entity["category"],
                                entity["confidenceScore"],
                                link["dataSource"],
                                link["id"],
                            ]
                        )

    # Create pandas datafram of results
    codes_df = pd.DataFrame(
        codes,
        columns=["key", "entity", "category", "confidence", "vocab", "code"],
    )

    # Load in OMOPDetails class from Co-Connect Tools
    omop_lookup = OMOPDetails()

    # This block looks up each concept *code* and returns
    # OMOP standard conceptID
    results = []
    for index, row in codes_df.iterrows():
        results.append(omop_lookup.lookup_code(row["code"]))

    full_results = pd.concat(results, ignore_index=True)

    full_results = full_results.merge(codes_df, left_on="concept_code", right_on="code")
    full_results = full_results.values.tolist()

    return full_results