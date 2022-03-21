// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button, Select, HStack, Checkbox } from "@chakra-ui/react";
import Container from "../components/Container";
// import { useEffect, useState } from "react";
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


function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal">Add Task</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
			<ModalHeader>Add Task</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<Stack pb={3}>	
					<Input variant='outline' placeholder='Name' />
					<Input variant='outline' placeholder='Description' />
					<Select placeholder='Select option'>
						<option value='Write'>Write</option>
						<option value='Upload'>Upload</option>
						<option value='Approve/Reject'>Approve/Reject</option>
					</Select>
					<HStack>
						<Input variant='outline' placeholder='Prerequisites' />
						<Checkbox defaultChecked>All</Checkbox>
					</HStack>
					<Input variant='outline' placeholder='Role List' />
					<Button colorScheme="teal">Add Task</Button>
				</Stack>
			</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const Workflow = () => {

	const [workflow, setWorkflow] = useState(0)
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const axios = require('axios')

	const create_workflow = () => {
		// console.log(name)
		// console.log(description)
		console.log("sending request")

		axios.post('http://localhost:8000/workflow/', {
			name: name,
			num_tasks: 3,
			description: description
		  })
		  .then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
		});
	}

	return (
		<>
		<Container>
			<Heading mb={5}>Workflow Page</Heading>
			<Stack>
				<Input variant='outline' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
				<Input variant='outline' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
				{BasicUsage()}
				{/* <Button colorScheme="teal">Add Task</Button> */}
				<Button onClick={create_workflow} colorScheme="teal">Create Workflow</Button>
			</Stack>
		</Container>
		</>
	)
}

export default Workflow;