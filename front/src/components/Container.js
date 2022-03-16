import React from 'react'
import {
        useColorMode,
        Flex
} from '@chakra-ui/react'
// import { primaryTextColor, bgColor } from '../styles/darkMode';
import Navbar from './Navbar';

const Container = ({ children }) => {
    const { colorMode } = useColorMode();

    document.title="Conquer"
    return (
        <>
            <Navbar />
            <Flex
                as="main"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                // bg={bgColor[colorMode]}
                // color={primaryTextColor[colorMode]}
                px={8}
            >
                {children}
            </Flex>
        </>
    );
};

export default Container;