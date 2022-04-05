// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Box, Text, Input, Button, Select, Checkbox, FormControl } from "@chakra-ui/react";
import Container from "./Container";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authSlice from "../store/slices/auth";


const Unauthorised = () => {

	return (
		<>
			<Container>
				<Heading mb={5}>Unauthorised</Heading>
        <Text>This page is accessible only to admins.</Text>
			</Container>
		</>
	)
}

export default Unauthorised;