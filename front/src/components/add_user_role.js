// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Select as ChakraSelect, Button, HStack, Checkbox } from "@chakra-ui/react";
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
import Select from 'react-select'
import { useState, useEffect } from "react";
import axios from "axios";



function BasicUsage(created, workflow_data, role_data, user_data) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [roles, setRole] = useState([])
    const [workflow_id, setWorkflowId] = useState("1")
    // const [workflow_data, setWorkflowData] = useState([])
    // const [user_data, setUserData] = useState([])
    // const [role_data, setRoleData] = useState([])
    const [user, setUser] = useState("")

    const handleWorkflowChange = (event) => {
        setWorkflowId(event.target.value)
    }
    const handleUserChange = (event) => {
        setUser(event.target.value)
    }
    const handleRoleChange = (event) => {
        const roles = [];
        for (var i = 0; i < event.length; i++) {
            roles.push(event[i].value);
        }
        setRole(roles);
    }

    var roleOptions = role_data.map((x) => {
        console.log(x["fields"]["workflow_id"] == workflow_id)
        if(workflow_id == x["fields"]["workflow_id"]) {
            console.log('andhar')
            return { 
                value: x["pk"],
                label: x["fields"]["role"]
            }
        }
        return {}
    }
    );

    roleOptions = roleOptions.filter( (val) => {
        return Object.keys(val).length > 1
    })
    
    const UserOption = (data) =>
        <ChakraSelect placeholder='Select option' onChange={handleUserChange}>{
            data.map((x) =>
                <option value={x["pk"]}>{x["fields"]["email"]}</option>)
        }</ChakraSelect>;

    const WorkflowOption = (data) =>
        <ChakraSelect placeholder='Select option' onChange={handleWorkflowChange}>{
            data.map((x) =>
                <option value={x["pk"]}>{x["fields"]["workflow_name"]}</option>)
        }</ChakraSelect>;


    const create_user_role = () => {
        console.log("sending request");


        axios.post('http://localhost:8000/user-role/create/', {
            role: roles,
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
                            <Select placeholder='Select option' options={roleOptions} onChange={handleRoleChange} isMulti={true} />
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
            {BasicUsage(props.created, props.workflow_data, props.role_data, props.user_data)}
        </>
    )
}

export default AddUserRole;