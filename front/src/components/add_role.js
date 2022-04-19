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
import { useState, useEffect } from "react";
import axios from "axios";



function BasicUsage(created, workflow_data) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [role, setRole] = useState("")
  const create_role = () => {
    console.log("sending request")
    axios.post('http://localhost:8000/role/create/', {
      role: role,
    })
      .then(function (response) {
        const data = JSON.parse(response.data)
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
    onClose();
  }
  return (
    <>
      <Button onClick={onOpen} hidden={created}>Add Role</Button>
      {/* <Button onClick={get_workflows}>Get Workflows</Button> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pb={3}>
              <Input variant='outline' placeholder='Role' value={role} onChange={(e) => setRole(e.target.value)} />
              {/* {Answer(workflow_data)} */}
              <Button colorScheme="teal" onClick={create_role}>Create Role</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const AddRole = (props) => {
  const axios = require('axios')
  return (
    <>
      {BasicUsage(props.created, props.workflow_data)}
    </>
  )
}
export default AddRole;