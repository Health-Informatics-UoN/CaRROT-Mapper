import React, { useState, useEffect, useRef } from 'react'
import {
    Button, Flex, Spinner, Container, ScaleFade, useDisclosure
} from "@chakra-ui/react"
import PageHeading from '../components/PageHeading'
import ToastAlert from '../components/ToastAlert'
import CCMultiSelectInput from '../components/CCMultiSelectInput'
import CCSelectInput from '../components/CCSelectInput'
import CCSwitchInput from '../components/CCSwitchInput'
import CCTextInput from '../components/CCTextInput'
import { useGet, usePatch, useDelete } from '../api/values'
import { arraysEqual } from '../utils/arrayFuncs'


const ScanReportAdminForm = ({ setTitle }) => {
    // scan report id in second to last block of the path
    let scanReportId = window.location.pathname.split("/")
    scanReportId = scanReportId[scanReportId.length - 2]

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [alert, setAlert] = useState({ hidden: true, title: '', description: '', status: 'error' })
    const [scanReport, setScanReport] = useState({})
    const [isAdmin, setIsAdmin] = useState(window.isAdmin)
    const [datasets, setDatasets] = useState();
    const [selectedDataset, setSelectedDataset] = useState()
    const [author, setAuthor] = useState();
    const [isPublic, setIsPublic] = useState()
    const [loadingMessage, setLoadingMessage] = useState("Loading page")
    const [formErrors, setFormErrors] = useState({})
    const [uploadLoading, setUploadLoading] = useState(false)
    const [viewers, setViewers] = useState([])
    const [editors, setEditors] = useState([])
    const [usersList, setUsersList] = useState(undefined)

    function getUsersFromIds(userIds, userObjects) {
        /**
         * Get an array user objects with ids in an array of ids.
         * 
         * userIds: Array[Number]
         * userObjects: Array[Object]
         */
        const idIterator = userIds.values()
        let users = []
        for (let id of idIterator) {
            for (let obj of userObjects) {
                if (id === obj.id) {
                    users.push(obj)
                }
            }
        }
        return users
    }

    // Set up page
    useEffect(
        async () => {
            setTitle(null)
            const queries = [
                useGet(`/scanreports/${scanReportId}`),
                useGet("/datasets/"),
                useGet("/users/"),
            ]
            // Get dataset, data partners and users
            const [scanReportQuery, datasetsQuery, usersQuery] = await Promise.all(queries)
            // Set up state from the results of the queries
            setScanReport(scanReportQuery)
            setDatasets(datasetsQuery)
            setSelectedDataset(
                datasetsQuery.find(element => element.id === scanReportQuery.parent_dataset)
            )
            setAuthor(
                usersQuery.find(element => element.id == scanReportQuery.author)
            )
            setIsPublic(scanReportQuery.visibility === "PUBLIC")
            setUsersList(usersQuery)
            setViewers(
                prevViewers => [
                    ...prevViewers,
                    ...getUsersFromIds(scanReportQuery.viewers, usersQuery),
                ]
            )
            setEditors(
                prevEditors => [
                    ...prevEditors,
                    ...getUsersFromIds(scanReportQuery.editors, usersQuery),
                ]
            )
            setLoadingMessage(null)  // stop loading when finished
        },
        [], // Required to stop this effect sending infinite requests
    )

    useEffect(
        async () => {
            setFormErrors({ ...formErrors, dataset: undefined })
        },
        [scanReport.dataset],
    )

    useEffect(
        async () => {
            setFormErrors({ ...formErrors, author: undefined })
        },
        [author],
    )

    useEffect(
        async () => {
            setFormErrors({ ...formErrors, viewers: undefined })
        },
        [viewers],
    )

    useEffect(
        async () => {
            setFormErrors({ ...formErrors, editors: undefined })
        },
        [editors],
    )

    useEffect(
        async () => {
            setFormErrors({ ...formErrors, parent_dataset: undefined })
        },
        [selectedDataset],
    )



    // Update scan report dataset (the actual name)
    function handleNameInput(newValue) {
        setScanReport({ ...scanReport, dataset: newValue })
    }

    // Update scan report visibility
    function handleVisibilitySwitch(newValue) {
        setIsPublic(newValue)
        setScanReport({ ...scanReport, visibility: newValue ? "PUBLIC" : "RESTRICTED" })
    }

    // Update scan report parent dataset
    function handleDatasetSelect(newValue) {
        const dataset = datasets.find(el => el.name === newValue)
        setSelectedDataset(dataset)
        setScanReport({ ...scanReport, parent_dataset: dataset.id })
    }

    // Update scan report author
    function handleAuthorSelect(newValue) {
        const newAuthor = usersList.find(el => el.username === newValue)
        setAuthor(newAuthor)
        setScanReport({ ...scanReport, author: newAuthor.id })
    }

    // Add scan report viewers
    function addViewer(newViewer) {
        newViewer = usersList.find(el => el.username === newViewer)
        setViewers(previous => [...previous, newViewer])
    }

    // Remove a scan report viewer
    function removeViewer(oldViewer) {
        const newViewers = viewers.filter(el => el.username !== oldViewer)
        setViewers(newViewers)
    }

    // Update scan report editors
    function addEditor(newEditor) {
        newEditor = usersList.find(el => el.username === newEditor)
        setEditors(previous => [...previous, newEditor])
    }

    // Remove a scan report viewer
    function removeEditor(oldEditor) {
        const newEditors = editors.filter(el => el.username !== oldEditor)
        setEditors(newEditors)
    }

    // Send updated scan report to the DB
    async function upload() {
        /**
         * Send a `PATCH` request updating the scan report and
         * refresh the page with the new data
         */
        const patchData = {
            dataset: scanReport.dataset,
            parent_dataset: selectedDataset.id,
            visibility: isPublic ? "PUBLIC" : "RESTRICTED",
        }
        // Add viewers if they've been altered
        const newViewers = viewers.map(x => x.id)
        if (!arraysEqual(newViewers, scanReport.viewers)) {
            patchData.viewers = newViewers
        }
        // Add editors if they've been altered
        const newEditors = editors.map(x => x.id)
        if (!arraysEqual(newEditors, scanReport.editors)) {
            patchData.editors = newEditors
        }
        try {
            setUploadLoading(true)
            const response = await usePatch(
                `/scanreports/${scanReportId}/`,
                patchData,
            )
            setUploadLoading(false)
            setScanReport(response)
            setAlert({
                hidden: false,
                status: 'success',
                title: 'Success',
                description: 'Scan report updated'
            })
            onOpen()
        } catch (error) {
            const error_response = await error.json()
            setUploadLoading(false)
            if (error_response) {
                setFormErrors(error_response)
            }
            setAlert({
                hidden: false,
                status: 'error',
                title: 'Could not update scan report',
                description: error.statusText ? error.statusText : ""
            })
            onOpen()
        }
    }

    if (loadingMessage) {
        //Render Loading State
        return (
            <div>
                <Flex padding="30px">
                    <Spinner />
                    <Flex marginLeft="10px">{loadingMessage ? loadingMessage : "Loading page"}</Flex>
                </Flex>
            </div>
        )
    }

    return (
        <Container maxW='container.xl'>
            {isOpen &&
                <ScaleFade initialScale={0.9} in={isOpen}>
                    <ToastAlert hide={onClose} title={alert.title} status={alert.status} description={alert.description} />
                </ScaleFade>
            }
            <PageHeading text={`Scan Report #${scanReport.id}`} />
            <CCTextInput
                id={"scanreport-name"}
                label={"Name"}
                value={scanReport.dataset}
                handleInput={handleNameInput}
                isDisabled={!isAdmin}
                formErrors={formErrors.dataset}
            />
            <CCSelectInput
                id={"scanreport-author"}
                label={"Author"}
                value={author.username}
                selectOptions={usersList.map(item => item.username)}
                handleInput={handleAuthorSelect}
                isDisabled={!isAdmin}
                formErrors={formErrors.dataset}
            />
            <CCSwitchInput
                id={"scanreport-visibility"}
                label={"Visibility"}
                isChecked={isPublic}
                isDisabled={!isAdmin}
                handleInput={handleVisibilitySwitch}
                checkedMessage={"PUBLIC"}
                notCheckedMessage={"RESTRICTED"}
            />
            {!isPublic &&
                <CCMultiSelectInput
                    id={"scanreport-viewers"}
                    label={"Viewers"}
                    isDisabled={!isAdmin}
                    selectOptions={usersList.map(item => item.username)}
                    currentSelections={viewers.map(item => item.username)}
                    handleInput={addViewer}
                    handleDelete={removeViewer}
                    formErrors={formErrors.viewers}
                />
            }
            <CCMultiSelectInput
                id={"scanreport-editors"}
                label={"Editors"}
                isDisabled={!isAdmin}
                selectOptions={usersList.map(item => item.username)}
                currentSelections={editors.map(item => item.username)}
                handleInput={addEditor}
                handleDelete={removeEditor}
                formErrors={formErrors.editors}
            />
            <CCSelectInput
                id={"scanreport-dataset"}
                label={"Dataset"}
                value={selectedDataset}
                selectOptions={datasets.map(item => item.name)}
                handleInput={handleDatasetSelect}
                isDisabled={!isAdmin}
                formErrors={formErrors.parent_dataset}
            />
            {isAdmin &&
                <Button isLoading={uploadLoading} loadingText='Uploading' mt="10px" onClick={upload}>Submit</Button>
            }
        </Container>
    )
}

export default ScanReportAdminForm