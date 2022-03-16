// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox, Textarea, Center } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";

const Task = () => {

	return (
		<>
		<Container>
			<Heading mb={5}>Task</Heading>
			<Stack>
        <Text fontSize='2xl'>Description</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>

        <Text fontSize='2xl'>Action 1 - Write</Text>
        <Textarea placeholder="Enter text"></Textarea>

        <Text fontSize='2xl'>Action 2 - Upload</Text>
        <Button maxW="sm">Upload file</Button>

        <Text fontSize='2xl'>Action 3 - Approve / Reject</Text>
        <Center>
        <HStack>
            <Button colorScheme="green">Approve</Button>
            <Button colorScheme="red">Reject</Button>
        </HStack>
        </Center>
			</Stack>
		</Container>
		</>
	)
}

export default Task;