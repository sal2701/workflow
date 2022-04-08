import { Stack, Spacer, Heading, Text, Input, Button, Select, HStack, Checkbox } from "@chakra-ui/react";
import Container from "../components/Container";
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
  const [workflow_id, setWorkflowId] = useState("1")
  const handleWorkflowChange = (event) => {
    setWorkflowId(event.target.value)
  }
  const Answer = (data) =>
    <Select placeholder='Select option' onChange={handleWorkflowChange}> {
      data.map((x) =>
        <option value={x["pk"]}>{x["fields"]["workflow_name"]}</option>)
    }</Select >;
  const initialize_workflow = () => {
    console.log("sending request")
    axios.post('http://localhost:8000/workflow/initialize/', {
      wf_id: workflow_id
    })
      .then(function (response) {
        const data = JSON.parse(response.data)
        console.log(data);initialize_workflowinitialize_workflow
      })
      .catch(function (error) {
        console.log(error);
      });
    onClose();
  }
  return (
    <>
      <Button onClick={onOpen} hidden={created}>Initialize Workflow</Button>
      {/* <Button onClick={get_workflows}>Get Workflows</Button> */}



      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Initialize Workflow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pb={3}>
              <Input variant='outline' placeholder='Role' value={role} onChange={(e) => setRole(e.target.value)} />
              {Answer(workflow_data)}
              <Button colorScheme="teal" onClick={initialize_workflow}>Start</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const InitializeWorkflow = (props) => {

  const axios = require('axios')

  // const [created, setCreated] = useState(false)

  return (
    <>
      {BasicUsage(props.created, props.workflow_data)}
    </>
  )
}

export default InitializeWorkflow;