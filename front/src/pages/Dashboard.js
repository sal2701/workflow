// import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Stack, Spacer, Heading, Text, Input, Button, Box, HStack, VStack } from "@chakra-ui/react";
import Container from "../components/Container";
import { useEffect, useState } from "react";

const Dashboard = () => {

	return (
		<>
		<Container>
			<Heading mb={5}>Pending Tasks</Heading>
			<Stack>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 1</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 2</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 3</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 4</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 5</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
      <Box maxW='lg' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <VStack>
          <Text color='black.500' fontSize='2xl'>Task 6</Text>
          <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</Text>
          <Button>Go to Task</Button>
        </VStack>
      </Box>
			</Stack>
		</Container>
		</>
	)
}

export default Dashboard;