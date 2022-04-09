// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button, Box, HStack, VStack } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {

  const [redirect, setRedirect] = useState(false)
  const [taskInstance, setTaskInstance] = useState(null)
  const [taskId, setTaskId] = useState(null)
  const [pending, setPending] = useState([])
  const [CreatedWorkflows, setCreatedWorkflows] = useState([])

  const email = useSelector((state) => state.auth.account.email)

  useEffect(() => {
    axios.post("http://127.0.0.1:8000/user/tasks/", { "email_id": email})
      .then( (response) => {
        var tasks = JSON.parse(response.data)
        tasks.map( (task) => {
          task.task_object = JSON.parse(task.task_object)
        })
        // tasks.task_object = JSON.parse(tasks.task_object)
        setPending(tasks)
        console.log("tasks")
        console.log(tasks)
      })
    axios.post("http://127.0.0.1:8000/workflow_instance/status/", { "email_id": email})
      .then( (response) => {
        var workflows = JSON.parse(response.data)
        console.log("created workflows")
        console.log(workflows)
        setCreatedWorkflows(workflows)
        // setPending(tasks)
        // console.log(tasks)
      })
  }, [])
  
  const goToTask = (task_instance_id, task_id) => {
    console.log("task_instance_id")
    console.log(task_instance_id)
    setTaskInstance(task_instance_id)
    setTaskId(task_id)

    axios.post("http://127.0.0.1:8000/task_instance/status/progress/", {
          "email_id": email,
          "task_instance_id": task_instance_id
        })
        .then( (response) => {
          console.log(response.data)
        })
        .catch( (e) => {
          console.log(e)
        })

    setRedirect(true)
  }


	return (
		<>
		<Container>
			<Heading mb={5}>Pending Tasks</Heading>
			<Stack>
      {
        pending.map( (task) => {
          return <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <VStack>
              <Text color='black.500' fontSize='2xl'>{task.task_object[0].fields.task_name}</Text>
              <Text color='black.500' fontSize='md'>{task.workflow_name}</Text>
              <Text>{task.task_object[0].fields.description}</Text>
              <Button onClick={() => {
                var id = task.task_instance_id
                var task_id = task.task_object[0].pk
                console.log("id")
                console.log(id)
                goToTask(id, task_id)
              }}
              >Go to Task</Button>
            </VStack>
          </Box>
        })
      }
      </Stack>
      <Heading mb={5}>Created Workflows</Heading>
			<Stack>
      {
        CreatedWorkflows.map( (workflow) => {
          return <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <VStack>
              <Text color='black.500' fontSize='2xl'>{workflow.fields.instance_name}</Text>
              <Text color='black.500' fontSize='md'>Total Workflow - {workflow.fields.total_tasks}</Text>
              <Text fontSize='md'>Progress - {workflow.fields.completed_tasks} / {workflow.fields.total_tasks} Done</Text>
              <Text></Text>
            </VStack>
          </Box>
        })
      }
      {redirect && <Navigate to='/task' state={{ task_instance_id: taskInstance, task_id: taskId }} replace={true}/>}
			</Stack>
		</Container>
		</>
	)
}

export default Dashboard;