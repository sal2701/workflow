// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Text, Input, Button, Select, Checkbox, Box } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Register = () => {

	const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

	const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleRegister(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Enter Email"),
      password: Yup.string().trim().required("Enter Password"),
    }),
  });

	const handleRegister = (email, password) => {
		// console.log(name)
		// console.log(description)
		console.log("sending request")

		axios.post('http://localhost:8000/api/auth/register/', {
			email: email,
			password: password
		})
			.then(function (response) {
				const data = response.data;
				console.log(data);
				navigate('/workflow')
			})
			.catch(function (error) {
				console.log(error);
			});

	}

	return (
		<>
			<Container>
				<Heading mb={5}>SignUp</Heading>
				<form onSubmit={formik.handleSubmit}>
					<Stack>
						<Input variant='outline' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Username / Email' name="email" type="email" />
						{formik.errors.email ? <Box>{formik.errors.email}</Box> : null}
						<Input variant='outline' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Password' name="password" type="password" />
						{formik.errors.password ? <Box>{formik.errors.password}</Box> : null}
						<Button colorScheme="green" type="submit">Register</Button>
					</Stack>
				</form>
			</Container>
		</>
	)
}

export default Register;