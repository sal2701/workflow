import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
  Container
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import SiteRoutes from './SiteRoutes';
// function App() {
//   return (
//     <ChakraProvider theme={theme}>
//       <Box textAlign="center" fontSize="xl">
//         <Grid minH="100vh" p={3}>
//           <ColorModeSwitcher justifySelf="flex-end" />
//           <VStack>
//             <Button colorScheme="teal" size="md">New Workflow</Button>
//             <Button colorScheme="teal" size="md">List Workflow</Button>
//           </VStack>
//         </Grid>
//       </Box>
//     </ChakraProvider>
//   );
// }

// export default App;

// const GlobalStyle = ({children}) => {

// 	const { colorMode } = useColorMode()
// 	return (
// 		<>
// 		<Global
// 			styles={css`
// 				${colorMode === 'light' ? prismLightTheme : prismDarkTheme};
// 				::selection {
// 					background-color: #90CDF4;
// 					color: #fefefe;
// 				}
// 				::-moz-selection {
// 					background: #ffb7b7;
// 					color: #fefefe;
// 				}
// 				html {
// 					min-width: 356px;
// 					scroll-behavior: smooth;
// 				}
// 				#root {
// 					display: flex;
// 					flex-direction: column;
// 					min-height: 100vh;
// 					background: ${bgColor[colorMode]};
// 				}
// 			`}
// 		/>
// 		{children}
// 		</>
// 	)
// }
const App = () => {
	return (
		<ChakraProvider resetCSS >
			{/* <GlobalStyle>  */}
        <SiteRoutes />
			{/* </GlobalStyle>			 */}
		</ChakraProvider>
	)
}

export default App
