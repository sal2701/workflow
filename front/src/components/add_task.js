import { Stack, Spacer, Heading, Text, Input, Button, Select, HStack, Checkbox } from "@chakra-ui/react";
import Container from "../components/Container";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { useState } from "react";
import axios from "axios";

function BasicUsage(workflow_id, created, count, setCount) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [predecessors, setPredecessors] = useState(0)
    const [successors, setSuccessors] = useState(0)
    const [action, setAction] = useState("WR")
    const [role, setRole] = useState(0)
    const handleChange = (event) => {
        setAction(event.target.value)
    }

    const create_task = () => {
        console.log("sending request")
        count+=1
        setCount(count)
		axios.post('http://localhost:8000/task/', {
			name: name,
			wf_id: workflow_id,
			description: description,
            id: count,
            predecessors: predecessors,
            successors: successors,
            action: action
		  })
		  .then(function (response) {
			const data = JSON.parse(response.data)
			console.log(data);
		  })
		  .catch(function (error) {
			console.log(error);
		});
		onClose();
    }
    return (
    <>
      <Button onClick={onOpen} hidden={!created} colorScheme="teal">Add Task</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
			<ModalHeader>Add Task for {workflow_id}</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<Stack pb={3}>	
					<Input variant='outline' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
					<Input variant='outline' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
					<Select placeholder='Select option' onChange={handleChange}>
						<option value='WR'>Write</option>
						<option value='UP'>Upload</option>
						<option value='AR'>Approve/Reject</option>
					</Select>
					<Button colorScheme="teal" onClick={create_task}>Create Task</Button>
				</Stack>
			</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
const AddTask = (props) => {
	const axios = require('axios')
	return (
		<>
		    {BasicUsage(props.workflow_id, props.created, props.count, props.setCount)}
		</>
	)
}
export default AddTask;