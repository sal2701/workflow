// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Container from "../components/Container";
import React, { useEffect, useState } from "react";
import InitializeWorkflow from "../components/InitializeWorkflow";
import axios from "axios";
import { useSelector } from "react-redux";


const Initialize =  () => {

	const [created, setCreated] = useState(false)
	const [workflow_data,setWorkflowData] = useState([])

    const email = useSelector((state) => state.auth.account.email)

	useEffect(()=> {
		let self = this;
		axios.post('http://localhost:8000/user/initialize/', { "email_id": email})
            .then( (response) => {
				const data = JSON.parse(response.data)
				setWorkflowData(data)
            })
        },[])

		return (
			<>
				<Container>
					<Heading mb={5}>Initialize Workflow Page</Heading>
					<Stack>
						<InitializeWorkflow created={created} workflow_data={workflow_data} />
					</Stack>
				</Container>
			</>
		);
}

export default Initialize;