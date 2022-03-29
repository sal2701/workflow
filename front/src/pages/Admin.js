// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useEffect, useState } from "react";

import AddRole from "../components/add_role";
import AddUserRole from "../components/add_user_role";

import axios from "axios";


const Admin = () => {

	const [created, setCreated] = useState(false)
	const [workflow_data, setWorkflowData] = useState([])
	const [role_data, setRoleData] = useState([])


	useEffect(() => {

		axios.get('http://localhost:8000/workflow/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				setWorkflowData(data);
				console.log(workflow_data);
			})
			.catch(function (error) {
				console.log(error);
			});
		axios.get('http://localhost:8000/role/create/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				setRoleData(data);
				console.log(role_data);
			})
			.catch(function (error) {
				console.log(error);
			});

	});


	let navigate = useNavigate();
	const routeChange = () => {
		let path = `/workflow`;
		navigate(path);
	}

	return (
		<>
			<Container>
				<Heading mb={5}>Admin Page</Heading>
				<Stack>
					<AddRole created={created} workflow_data={workflow_data} />
					<AddUserRole created={created} workflow_data={workflow_data} role_data={role_data} />
					<Button>Edit User</Button>
					<Button>Delete Workflow</Button>
					<Button onClick={routeChange}>Add Workflow</Button>
				</Stack>
			</Container>
		</>
	)
}

export default Admin;