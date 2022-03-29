// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Container from "../components/Container";
import React, { useEffect, useState } from "react";

import AddRole from "../components/add_role";
import AddUserRole from "../components/add_user_role";
import AddTaskRole from "../components/add_task_role";
import DeleteWorkflow from "../components/delete_workflow";



import axios from "axios";


class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			created: false,
			workflow_data: [],
			role_data: [],
			task_data: [],
			user_data: [],
			redirect: false
		};
		this.routeChange = this.routeChange.bind(this);
	}




	componentDidMount() {
		let self = this;
		axios.get('http://localhost:8000/workflow/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				self.setState({ workflow_data: data })
				console.log(data);
			})
			.catch(function (error) {
				console.log(error);
			});
		axios.get('http://localhost:8000/role/create/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				self.setState({ role_data: data })
				console.log(data);
			})
			.catch(function (error) {
				console.log(error);
			});

		axios.get('http://localhost:8000/task/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				self.setState({ task_data: data })
				console.log(data);
			})
			.catch(function (error) {
				console.log(error);
			});

		axios.get('http://localhost:8000/users/', {
		})
			.then(function (response) {
				const data = JSON.parse(response.data)
				self.setState({ user_data: data })
				console.log(data);
			})
			.catch(function (error) {
				console.log(error);
			});


	}

	routeChange() {
		// console.log("called")
		this.setState({ redirect: true })
	}


	render() {
		return (
			<>
				<Container>
					<Heading mb={5}>Admin Page</Heading>
					<Stack>
						<AddRole created={this.state.created} workflow_data={this.state.workflow_data} />
						<AddUserRole created={this.state.created} workflow_data={this.state.workflow_data} role_data={this.state.role_data} user_data = {this.state.user_data}/>
						<AddTaskRole created={this.state.created} workflow_data={this.state.workflow_data} role_data={this.state.role_data} task_data={this.state.task_data}/>
						<Button>Edit User</Button>
						<DeleteWorkflow created={this.state.created} workflow_data={this.state.workflow_data}/>
						<Button onClick={this.routeChange}>Add Workflow</Button>
						{this.state.redirect && (<Navigate to="/workflow" replace={true} />)}
					</Stack>
				</Container>
			</>
		);
	}
}

export default Admin;