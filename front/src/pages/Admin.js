// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useEffect, useState } from "react";

import AddRole from "../components/add_role";




const Admin = () => {

	const [created, setCreated] = useState(false)


	let navigate = useNavigate(); 
  	const routeChange = () =>{ 
    let path = `/workflow`; 
    navigate(path);
  }

	return (
		<>
		<Container>
			<Heading mb={5}>Admin Page</Heading>
			<Stack>
		<AddRole created={created}/>
        <Button>Edit User</Button>
        <Button>Delete Workflow</Button>
        <Button onClick={routeChange}>Add Workflow</Button>
			</Stack>
		</Container>
		</>
	)
}

export default Admin;