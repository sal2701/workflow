// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button, Select, HStack, Checkbox } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
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
import AddTask from "../components/add_task";
import { useSelector } from "react-redux";


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
								<option value='WR'>Write</option>
								<option value='UP'>Upload</option>
								<option value='AR'>Approve/Reject</option>
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
	const [wf_id, setWorkflowid] = useState(0)
	const [predecessors, setPredecessors] = useState(0)
	const [successors, setSuccessors] = useState(0)
	const [action, setAction] = useState("")
	const [created, setCreated] = useState(false)
	const [count, setCount] = useState(0)
	const [task_data, setTaskData] = useState([])
	const [redirect, setRedirect] = useState(false)
	const axios = require('axios')

	const auth = useSelector((state) => state.auth)
	// console.log('auth')
	// console.log(auth)

	const initialize_workflow = () => {
		// console.log(name)
		// console.log(description)
		console.log("sending request")

		axios.post('http://localhost:8000/workflow/', {
			name: name,
			num_tasks: 0,
			description: description
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				setWorkflow(data[0]["pk"])
				console.log(data);


			})
			.catch(function (error) {
				console.log(error);
			});

		setCreated(true)
	}

	const create_workflow = () => {
		// console.log(name)
		// console.log(description)
		console.log("sending request")

		axios.post('http://localhost:8000/workflow/update/', {
			id: workflow,
			num_tasks: count,
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				setWorkflow(data[0]["pk"])
				console.log(data);


			})
			.catch(function (error) {
				console.log(error);
			});

		axios.post('http://localhost:8000/task/gettasks/', {
			pk:workflow
		  })
			.then(function (response) {
				const data = JSON.parse(response.data)
				console.log(data);

				const payload = data.map( (d) => {
					return {
						id: d['pk'].toString(),
						type: 'default',
						data: {
							label: d["fields"]["task_name"]
						},
						position: {
							x: 250,
							y: 5
						},
						className: 'light'
					}
				})
				console.log("payload")
				console.log(payload)

				setTaskData(payload);

				console.log(count);
				setRedirect(true)
				setCreated(true)
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
					<Input variant='outline' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
					<Input variant='outline' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
					{/* {BasicUsage()} */}
					{/* <Button colorScheme="teal">Add Task</Button> */}
					<Button onClick={initialize_workflow} hidden={created} colorScheme="teal">Initialize Workflow</Button>
					<AddTask created={created} workflow_id={workflow} count={count} setCount={setCount} />
					<Button onClick={create_workflow} hidden={!created} colorScheme="teal">Finish Workflow</Button>
					{redirect && (<Navigate to='/task_graph' state={{ task_data: task_data, workflow: workflow }} replace={true} />)}
				</Stack>
			</Container>
		</>
	)
}

export default Workflow;