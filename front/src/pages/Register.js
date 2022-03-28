// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import axios from "axios";


const Register = () => {

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const createUser = () => {
		// console.log(name)
		// console.log(description)
		console.log("sending request")

		axios.post('http://localhost:8000/api/auth/register/', {
			email: username,
			password: password
		})
			.then(function (response) {
				const data = response.data;
				console.log(data);


			})
			.catch(function (error) {
				console.log(error);
			});

	}

	return (
		<>
			<Container>
				<Heading mb={5}>SignUp</Heading>
				<Stack>
					<Input variant='outline' placeholder='Username / Email' onChange={(e) => setUsername(e.target.value)} />
					<Input variant='outline' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
					<Button colorScheme="green" onClick={createUser}>Register</Button>
				</Stack>
			</Container>
		</>
	)
}

export default Register;