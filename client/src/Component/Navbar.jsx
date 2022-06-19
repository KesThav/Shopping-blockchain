import React from 'react';
import { Box, Heading, Flex, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, AtSignIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Orderlist from './Orderlist';

// Note: This code could be better,
// so I'd recommend you to understand how I solved and you could write yours better :)
// Good luck! 🍀

// Update: Check these awesome headers from Choc UI 👇
// https://choc-ui.tech/docs/elements/headers
const Header = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={3}
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'tighter'}>
          <Link to="/">Shop</Link>
        </Heading>
      </Flex>

      <Flex justify="space-between" align="center" direction="row" w={50}>
        <Link to="/dashboard">
          <AtSignIcon />
        </Link>
        <Orderlist />
      </Flex>
    </Flex>
  );
};

export default Header;
