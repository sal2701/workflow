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
import { useSelector } from 'react-redux';

const App = () => {
  return (
    <ChakraProvider resetCSS >
      <SiteRoutes />
    </ChakraProvider>
  )
}

export default App
