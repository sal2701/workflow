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
  const [workflow_id, setWorkflowId] = useState("1")
  // const [workflow_data, setWorkflowData] = useState([])


  // useEffect(() => {
  // Update the document title using the browser API

  // axios.get('http://localhost:8000/users/', {
  // })
  //     .then(function (response) {
  //         const data = JSON.parse(response.data)
  //         setWorkflowData(data);
  //         console.log(workflow_data);
  //     })
  //     .catch(function (error) {
  //         console.log(error);
  //     });

  // axios.get('http://localhost:8000/role/', {
  // })
  //     .then(function (response) {
  //         const data = JSON.parse(response.data)
  //         setWorkflowData(data);
  //         console.log(workflow_data);
  //     })
  //     .catch(function (error) {
  //         console.log(error);
  //     });

  // });

  const handleWorkflowChange = (event) => {
    setWorkflowId(event.target.value)
  }

  const Answer = (data) =>
    <Select placeholder='Select option' onChange={handleWorkflowChange}> {
      data.map((x) =>
        <option value={x["pk"]}>{x["fields"]["workflow_name"]}</option>)
    }</Select >;


  const create_role = () => {
    console.log("sending request")


    axios.post('http://localhost:8000/role/create/', {
      role: role,
      wf_id: workflow_id
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

  // const get_workflows = () => {
  //   console.log("sending request")


  //   axios.get('http://localhost:8000/workflow/', {
  //   })
  //     .then(function (response) {
  //       const data = JSON.parse(response.data)
  //       setWorkflowData(data);
  //       console.log(workflow_data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }


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
              {Answer(workflow_data)}
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

  // const [created, setCreated] = useState(false)

  return (
    <>
      {BasicUsage(props.created, props.workflow_data)}
    </>
  )
}

export default AddRole;