// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";

const Login = () => {

	return (
		<>
		<Container>
			<Heading mb={5}>Task</Heading>
			<Stack>
        <Input variant='outline' placeholder='Username / Email' />
        <Input variant='outline' placeholder='Password' />
        <Button colorScheme="green">Login</Button>
			</Stack>
		</Container>
		</>
	)
}

export default Login;