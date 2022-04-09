// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, UnorderedList, Heading, Box, Text, Input, Button, Select, Checkbox, FormControl, Image, List, ListItem } from "@chakra-ui/react";
import Container from "./Container";

const Homepage = () => {

	return (
		<>
			<Container>
				<Heading mb={5}>Workflow Manager</Heading>
				<Box display="flex">
					<Image src="http://picsum.photos/300" m={3}/>
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
			</Container>
		</>
	)
}

export default Homepage;