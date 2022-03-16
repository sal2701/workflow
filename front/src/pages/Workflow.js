// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button, Select, HStack, Checkbox } from "@chakra-ui/react";
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
							<option value='Write'>Write</option>
							<option value='Upload'>Upload</option>
							<option value='Approve/Reject'>Approve/Reject</option>
						</Select>
						<HStack>
							<Input variant='outline' placeholder='Prerequisites' />
							<Checkbox defaultChecked>All</Checkbox>
						</HStack>
						<Input variant='outline' placeholder='Role List' />
						<Button colorScheme="teal">Create Task</Button>
					</Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const Workflow = () => {

	return (
		<>
		<Container>
			<Heading mb={5}>Workflow Page</Heading>
			<Stack>
				<Input variant='outline' placeholder='Name' />
				<Input variant='outline' placeholder='Description' />
				{BasicUsage()}
				{/* <Button colorScheme="teal">Add Task</Button> */}
			</Stack>
		</Container>
		</>
	)
}

export default Workflow;