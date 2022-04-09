// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, UnorderedList, Heading, Box, Text, Input, Button, Select, Checkbox, FormControl, Image, List, ListItem, Center } from "@chakra-ui/react";
import Container from "./Container";

import workflowImage from "../images/workflow_transparent.png"

const Homepage = () => {

	return (
		<>
			<Container>
				<Heading mb={5}>Workflow Manager</Heading>
				<Center>
					<Box display="flex">
						<Image src={workflowImage} m={3} w="300px"/>
						{/* <Image src="http://picsum.photos/300" m={3} w="30%"/> */}
						<Box mt="5%" ml="5%">
							<Text fontSize="3xl">Use Workflow Manager to</Text>
							<UnorderedList>	
								<ListItem>
									<Text fontSize="2xl">Create Workflows with multiple tasks</Text>
								</ListItem>
								<ListItem>
									<Text fontSize="2xl">Click & Drag options to create complex workflows!</Text>
								</ListItem>
								<ListItem>
									<Text fontSize="2xl">Assign Roles to each Task</Text>
								</ListItem>
								<ListItem>
									<Text fontSize="2xl">A personalised dashboard</Text>
								</ListItem>
							</UnorderedList>
						</Box>
					</Box>
				</Center>
			</Container>
		</>
	)
}

export default Homepage;