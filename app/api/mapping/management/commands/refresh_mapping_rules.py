from django.core.management.base import BaseCommand
from mapping.services_rules import (
    remove_mapping_rules,
    save_mapping_rules,
    find_existing_scan_report_concepts,
)
from datetime import datetime


class Command(BaseCommand):
    help = (
        "Refresh all the mapping rules associated to the supplied Scan Report. "
        "This can take a _very_ long time (hours) to execute for large numbers of "
        "ScanReportConcepts. It can also hang at random intervals. If this occurs "
        "(a single ScanReportConcept takes <2s to complete, so it's easy to spot "
        "when it hangs) then reboot the container, then comment out the "
        "'remove_mapping_rules' line below and set skip_first to skip n "
        "ScanReportConcepts."
    )

    def add_arguments(self, parser):
        parser.add_argument("--report-id", required=True, type=int)

    def handle(self, *args, **options):
        _id = int(options["report_id"])
        request = None
        # If restarting this command, comment out the "remove_mapping_rules" line to
        # keep the previously generated rules, and then update the skip_first value
        # below to avoid reprocessing all the first ScanReportConcepts which already
        # have their mapping rules generated.
        remove_mapping_rules(request, _id)
        # get all associated ScanReportConcepts for this given ScanReport
        ## this method can take a couple of minutes to execute
        print("find_existing_scan_report_concepts")
        all_associated_concepts = find_existing_scan_report_concepts(request, _id)
        print("total SRConcepts:", len(all_associated_concepts))

        # save all of them
        nconcepts = 0
        nbadconcepts = 0
        start_time = datetime.utcnow()
        n_concepts_total = len(all_associated_concepts)
        print("total concepts to map: " + str(n_concepts_total))
        skip_first = 0
        n_concepts_total -= skip_first
        for concept_index, concept in enumerate(all_associated_concepts[skip_first:]):
            print("new concept " + str(concept_index) + " of " + str(n_concepts_total))
            this_start_time = datetime.utcnow()
            if save_mapping_rules(request, concept):
                nconcepts += 1
            else:
                nbadconcepts += 1
            latest_time = datetime.utcnow()
            print("this concept took: " + str(latest_time - this_start_time))
            average_period = (latest_time - start_time) / (concept_index + 1)
            print("average time per concept so far: " + str(average_period))
            # Print estimated end time, with a series of hashes on the end to mock a
            # progress bar - makes it easier to immediately spot if it's hanging.
            print(
                "  estimated end time: "
                + str(start_time + average_period * n_concepts_total)
                + "#" * (concept_index % 10)
            )

        if nbadconcepts == 0:
            print(request, f"Found and added rules for {nconcepts} existing concepts")
        else:
            print(
                request,
                f"Found and added rules for {nconcepts} existing concepts. However, couldn't add rules for {nbadconcepts} concepts.",
            )
