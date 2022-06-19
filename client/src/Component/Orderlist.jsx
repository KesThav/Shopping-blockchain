import React, { Fragment, useContext, useState, useEffect } from 'react';
import { ContextAPI } from '../Middlewares/ContextAPI';
import RenderIf from './RenderIf';
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  DrawerBody,
  DrawerFooter,
  Input,
  useDisclosure,
  Button,
  Box,
  Text,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Orderlist = () => {
  const { basket, setBasket, users, account, currentUser, buyProduct } =
    useContext(ContextAPI);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const removeBasket = i => {
    setBasket(prev => {
      let left = prev.slice(0, i);
      let right = prev.slice(i + 1);
      localStorage.setItem('basket', JSON.stringify([...left, ...right]));
      return [...left, ...right];
    });
  };

  return (
    <div>
      <HamburgerIcon onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Order list</DrawerHeader>

          <DrawerBody>
            {basket.map((a, i) => (
              <Flex direction="row" justify="space-between">
                <Text fontSize="lg">{a[1]}</Text>
                <Text fontSize="lg">{a[4]} CHF</Text>
              </Flex>
            ))}
            <Divider />
            <Flex direction="row" justify="space-between">
              <Text fontSize="lg">Total</Text>
              <Text fontSize="lg">
                {basket
                  .map(a => a[4])
                  .reduce((a, b) => parseInt(a) + parseInt(b), 0)}{' '}
                CHF
              </Text>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={e => buyProduct(e, basket)}
              colorScheme="blue"
              disabled={
                basket.length === 0 ||
                (currentUser &&
                  currentUser.balance <
                    basket
                      .map(a => a[4])
                      .reduce((a, b) => parseInt(a) + parseInt(b), 0))
              }
            >
              {currentUser &&
              currentUser.balance >=
                basket
                  .map(a => a[4])
                  .reduce((a, b) => parseInt(a) + parseInt(b), 0)
                ? 'Confirm'
                : 'Not enough money'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Orderlist;
