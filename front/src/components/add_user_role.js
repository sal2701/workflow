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
// import Select from 'react-select'
import { useState, useEffect } from "react";
import axios from "axios";



function BasicUsage(created, workflow_data) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [role, setRole] = useState("")
    const [workflow_id, setWorkflowId] = useState("1")
    // const [workflow_data, setWorkflowData] = useState([])
    const [user_data, setUserData] = useState([])
    const [role_data, setRoleData] = useState([])
    const [user, setUser] = useState("")

    const handleWorkflowChange = (event) => {
        setWorkflowId(event.target.value)
    }
    const handleUserChange = (event) => {
        setUser(event.target.value)
    }
    const handleRoleChange = (event) => {
        setRole(event.target.value)
    }


    const WorkflowOption = (data) =>
        <Select placeholder='Select option' onChange={handleWorkflowChange}>{
            data.map((x) =>
                <option value={x["pk"]}>{x["fields"]["workflow_name"]}</option>)
        }</Select>;

    const UserOption = (data) =>
        <Select placeholder='Select option' onChange={handleUserChange}>{
            data.map((x) =>
                <option value={x["pk"]}>{x["fields"]["role"]}</option>)
        }</Select>;

    const RoleOption = (data) =>
        <Select placeholder='Select option' onChange={handleRoleChange}>{
            data.map((x) =>
                <option value={x["pk"]}>{x["fields"]["username"]}</option>)
        }</Select>;

    const create_user_role = () => {
        console.log("sending request")


        axios.post('http://localhost:8000/user-role/create/', {
            role: role,
            user: user,
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

    return (
        <>
            <Button onClick={onOpen} hidden={created}>Add User Role</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add User Role</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack pb={3}>
                            {WorkflowOption(workflow_data)}
                            {UserOption(user_data)}
                            {RoleOption(role_data)}
                            <Button colorScheme="teal" onClick={create_user_role}>Create Role</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

const AddUserRole = (props) => {

    const axios = require('axios')

    // const [created, setCreated] = useState(false)

    return (
        <>
            {BasicUsage(props.created, props.workflow_data)}
        </>
    )
}

export default AddUserRole;