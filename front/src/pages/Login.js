// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { HStack, Stack, Spacer, Heading, Box, Text, Input, Button, Select, Checkbox, FormControl } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authSlice from "../store/slices/auth";


const Login = () => {
	// const [username, setUsername] = useState("")
	// const [password, setPassword] = useState("")

	const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

	const handleLogin = (email, password) => {
		axios
			.post(`http://127.0.0.1:8000/api/auth/login/`, { email: email, password: password })
			.then((res) => {
				dispatch(
					authSlice.actions.setAuthTokens({
						token: res.data.access,
						refreshToken: res.data.refresh,
					})
				);
				dispatch(authSlice.actions.setAccount(res.data.user));
				setLoading(false);
				navigate("/");
			})
			.catch((err) => {
				console.log(err)
				setMessage(err.response.data.detail.toString());
			});
	};

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleLogin(values.email, values.password);
			console.log("Pressed")
			alert("lmao")
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Enter Email"),
      password: Yup.string().trim().required("Enter Password"),
    }),
  });

	return (
		<>
			<Container>
				<Heading mb={5}>Login</Heading>
				<form onSubmit={formik.handleSubmit}>
					<Stack>
						<Input variant='outline' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Username / Email' name="email" type="email" />
						{formik.errors.email ? <Box>{formik.errors.email}</Box> : null}
						<Input variant='outline' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Password' name="password" type="password"/>
						{formik.errors.password ? <Box>{formik.errors.password}</Box> : null}
						<Button colorScheme="green" type="submit">Login</Button>
					</Stack>
				</form>
			</Container>
		</>
	)
}

export default Login;