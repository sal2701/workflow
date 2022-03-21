// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";

const Admin = () => {

	return (
		<>
		<Container>
			<Heading mb={5}>Admin Page</Heading>
			<Stack>
		<Button>Add User</Button>
        <Button>Delete User</Button>
        <Button>Delete Workflow</Button>
        <Button>Add Workflow</Button>
        <Button>Duplicate Workflow</Button>
			</Stack>
		</Container>
		</>
	)
}

export default Admin;