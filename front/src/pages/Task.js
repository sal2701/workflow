// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox, Textarea, Center } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Task = () => {
    
    const location = useLocation()

    const task_instance_id = location.state.task_instance_id
    const task_id = location.state.task_id

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [workflow, setWorkflow] = useState("")
    const [action, setAction] = useState("WR")


    const fetchAction = (action) => {
        if( action == "WR" ) {
            return <>
                <Text fontSize='2xl'>Action 1 - Write</Text>
                <Textarea placeholder="Enter text"></Textarea>
            </>
        }
        else if( action == "UP" ) {
            return <>
                <Text fontSize='2xl'>Action 2 - Upload</Text>
                <Button maxW="sm">Upload file</Button>
            </>
        }
        else if( action == "AR" ) {
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
            .then( (response) => {
                const data = JSON.parse(response.data)

                console.log(data[0])
                setName(data[0].fields.task_name)
                setDescription(data[0].fields.description)
                setWorkflow(data[0].fields.workflow_id)
            })
            .catch( (error) => {
                console.log(error)
            })
    }, [])




	return (
		<>
		<Container>
			<Heading mb={5}>{name}</Heading>
            <Text>Part of Workflow {workflow}</Text>
			<Stack w={"400px"}>
                <Text fontSize='2xl'>Description</Text>
                <Text>{description}</Text>
                {fetchAction(action)}
                <Button bg={"teal"} color={"white"} w={"100px"}>Finish Task</Button>
			</Stack>
		</Container>
		</>
	)
}

export default Task;