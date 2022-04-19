// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox, Textarea, Center } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";


const Task = () => {

    const location = useLocation()

    const task_instance_id = location.state.task_instance_id
    const task_id = location.state.task_id

    const [redirect, setRedirect] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [workflow, setWorkflow] = useState("")
    const [action, setAction] = useState("WR")
    const [selectedFile, setselectedFile] = useState(null)
    const [text_write, setTextWrite] = useState("")


    const fetchAction = (action) => {
        if (action == "WR") {
            return <>
                <Text fontSize='2xl'>Action 1 - Write</Text>
                <Textarea placeholder="Enter text" value={text_write} onChange={(e) => setTextWrite(e.target.value)}></Textarea>
            </>
        }
        else if (action == "UP") {
            return <>
                <Text fontSize='2xl'>Action 2 - Upload</Text>
                <Button maxW="sm">Upload file</Button>
            </>
        }
        else if (action == "AR") {
            return <>
                <Text fontSize='2xl'>Action 3 - Approve / Reject</Text>
                <Center>
                    <HStack>
                        <Button colorScheme="green">Approve</Button>
                        <Button colorScheme="red">Reject</Button>
                    </HStack>
                </Center>
            </>
        }
    }

    console.log(task_id)

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/task/${task_id}/`, {})
            .then((response) => {
                const data = JSON.parse(response.data)

                console.log(data[0])
                setName(data[0].fields.task_name)
                setDescription(data[0].fields.description)
                setWorkflow(data[0].fields.workflow_id)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const finishTask = () => {

        // Request made to the backend api 
        // Send formData object 
        axios({
            // Endpoint to send files 
            url: "http://127.0.0.1:8000/task/upload_file/",
            method: "POST",
            // Attaching the form data 
            data: {
                write: text_write,
                task_instance_id: task_instance_id,
            },
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch((response) => {
                console.log(response.data)
            })


        axios.post("http://127.0.0.1:8000/task_instance/status/complete/", {
            "task_instance_id": task_instance_id
        })
            .then((response) => {
                console.log(response.data)
                console.log("Job Done")
            })
            .catch((e) => {
                console.log(e)
            })
        setRedirect(true)
    }

    const onFileChange = event => {
        // Update the state 
        setselectedFile(event.target.files[0]);
    };

    // On file upload (click the upload button) 
    const onFileUpload = () => {
        // Create an object of formData 
        const formData = new FormData();

        // Update the formData object 
        formData.append(
            "upload",
            selectedFile,
            selectedFile.name
        );
        formData.append(
            "task_instance_id",
            task_instance_id,
        );

        // Details of the uploaded file 
        console.log(selectedFile);

        // Request made to the backend api 
        // Send formData object 
        axios({
            // Endpoint to send files 
            url: "http://127.0.0.1:8000/task/upload_file/",
            method: "POST",
            // Attaching the form data 
            data: formData,
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch((response) => {
                console.log(response.data)
            })
    };


    return (
        <>
            <Container>
                <Heading mb={5}>{name}</Heading>
                <Text>Part of Workflow {workflow}</Text>
                <Stack w={"400px"}>
                    <Input type="file" onChange={onFileChange} />
                    <Button onClick={onFileUpload}>
                        Upload!
                    </Button>
                    <Text fontSize='2xl'>Description</Text>
                    <Text>{description}</Text>
                    {fetchAction(action)}
                    <Button bg={"teal"} color={"white"} w={"100px"} onClick={finishTask}>Finish Task</Button>
                </Stack>
                {redirect && <Navigate to='/dashboard' replace={true} />}
            </Container>
        </>
    )
}

export default Task;