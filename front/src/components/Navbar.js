import {
    useDisclosure,
    useColorMode,
    Button,
    Flex,
    Box,
    IconButton,
    useColorModeValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    Link as ChakraLink,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { SunIcon, MoonIcon, HamburgerIcon } from '@chakra-ui/icons';
// import { useMediaQuery } from 'react-responsive';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authSlice from '../store/slices/auth';
import { connect } from 'react-redux';

const LINKS = [
    {
        href: '/workflow',
        key: "101",
        text: 'workflow'
    },
    {
        href: '/dashboard',
        key: "102",
        text: 'dashboard'
    },
    {
        href: '/admin',
        key: "103",
        text: 'admin'
    },
    {
        href: '/login',
        key: "105",
        text: 'login'
    },
    {
        href: '/register',
        key: "106",
        text: 'register'
    }
];


const NavContainer = styled(Flex)`
position: sticky;
z-index: 100;
top: 0;
backdrop-filter: saturate(180%) blur(20px);
transition: background-color 0.1 ease-in-out;
`;

const Navbar = (props) => {
    const { colorMode, toggleColorMode } = useColorMode();
    // const bg = useColorModeValue(navBgColor.light, navBgColor.dark);
    const isBigScreen = true;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [auth, setAuth] = useState(null)

    const auth = useSelector((state) => state.auth)
    // console.log("auth navbar")
    // console.log(auth)

    const handleLogout = () => {
        // console.log(auth)
        dispatch(authSlice.actions.logout());
        navigate("/login");
    };

    const getLink = ({ href, key, text }) => {
        
        const truncateAddress = (address) => {
            return address.length>10 ? address.slice(0, 10) + "..." + address.slice(-4): address;
        };
        if( auth.account ){
            if(text == 'login')
                return <Menu>
                <MenuButton
                    as={Button}
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'pink.400'}
                    href={'#'}
                    _hover={{
                        bg: 'pink.300',
                    }}
                >
                    {truncateAddress(auth.account.email)}
                </MenuButton>
                <MenuList>
                    <MenuItem
                        as={ChakraLink}                            
                        href={"/workflow/"}
                        isExternal
                        key={key}
                        // color={primaryTextColor[colorMode]}
                    >
                        Profile
                    </MenuItem>
                    <MenuItem 
                        onClick={handleLogout}
                        key={key + "10"}
                        // color={primaryTextColor[colorMode]}
                    >
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
            {/* </ChakraLink> */}
            if(text == 'register')
                return
        }
        
        return <ChakraLink key={key} href={href} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" p={[6, 4]} fontSize={['xl', 'lg']}>
                {text}
            </Button>
        </ChakraLink>
    };

    return (
        <NavContainer
            borderRadius='2xl'
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            maxWidth="1000px"
            width="100%"
            // bg={bg}
            as="nav"
            p={8}
            mt={[0, 8]}
            mb={8}
            mx="auto"
        >

            {isBigScreen && (
                <IconButton
                    borderRadius='10px'
                    aria-label="toggle dark mode"
                    icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleColorMode}
                />
            )}

            {isBigScreen ? (
                <Box>{LINKS.map(getLink)}</Box>
            ) : (
                <IconButton
                    borderRadius='10px'
                    aria-label="toggle ham"
                    icon={<HamburgerIcon />}
                    onClick={onOpen}
                />
            )}

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody>
                            <Flex
                                direction="column"
                                justifyContent="center"
                                height="100%"
                                alignItems="center"
                            >
                                <IconButton
                                    borderRadius='10px'
                                    boxSize="50px"
                                    mb="6"
                                    aria-label="toggle dark mode"
                                    icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                                    onClick={toggleColorMode}
                                />
                                {LINKS.map(getLink)}
                            </Flex>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </NavContainer>
    );
};

export default (Navbar);
