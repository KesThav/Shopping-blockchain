import React from 'react';
import { useContext } from 'react';
import { ContextAPI } from '../Middlewares/ContextAPI';
import RenderIf from './RenderIf';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Text,
  Box,
  StatLabel,
  StatNumber,
  Stat,
  Button,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import SetBalance from './SetBalance';

const Dashboard = () => {
  const {
    getCurrentUser,
    currentUser,
    getPendingTransactions,
    pending,
    releasePayment,
    allProducts,
  } = useContext(ContextAPI);

  useEffect(() => {
    getPendingTransactions();
    getCurrentUser();
    allProducts();
  }, [pending, currentUser]);
  return (
    <RenderIf account={currentUser}>
      <Box p="10" w="100">
        <Flex direction="row">
          <Stat p="10" borderWidth="1px" w="60">
            <Flex align="center">
              <Avatar size="xl" mr="10" />
              <Box>
                <Text fontSize="md">Name: {currentUser?.name} </Text>
                <Text fontSize="md">
                  phone number: {currentUser?.phone_number}
                </Text>
                <Text fontSize="md">address: {currentUser?.user_address}</Text>
              </Box>
            </Flex>
          </Stat>
          <Stat p="10" borderWidth="1px" w="60">
            <StatLabel mb="2">Current balance</StatLabel>
            <StatNumber>
              <Flex align="center">
                <Text fontSize="lg" mr="4">
                  CHF
                  {currentUser?.balance}
                </Text>
                <SetBalance />
              </Flex>
            </StatNumber>
          </Stat>
        </Flex>
        <Flex w="100vw">
          <Box borderWidth="1px" p="10" mr="10" mt="3" height="500px">
            <TableContainer>
              <Text fontSize="lg">Pending transactions</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {['Seller', 'Product', 'Amount', 'Actions'].map(t => (
                      <Th>{t}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {pending.length === 0
                    ? pending
                        .filter(p => p.status !== 'Closed')
                        .filter(
                          p => p.seller_address !== currentUser?.user_address
                        )
                        .map(p => (
                          <Tr key={p.product_uuid}>
                            <Td>{p.seller_address}</Td>
                            <Td>{p.name}</Td>
                            <Td>{p.pendingAmount}</Td>
                            <Td>
                              <Button
                                onClick={e => releasePayment(e, p.product_uuid)}
                              >
                                Release payment
                              </Button>
                            </Td>
                          </Tr>
                        ))
                    : 'No pending transactions'}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box borderWidth="1px" p="10" mr="10" mt="3">
            <TableContainer>
              <Text fontSize="lg">Closed transactions</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {['Product', 'Amount'].map(t => (
                      <Th>{t}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {pending.length === 0
                    ? pending
                        .filter(p => p.status === 'Closed')
                        .filter(
                          p => p.seller_address !== currentUser?.user_address
                        )
                        .map(p => (
                          <Tr key={p.product_uuid}>
                            <Td>{p.product_uuid}</Td>
                            <Td>{p.pendingAmount}</Td>
                            <Td></Td>
                          </Tr>
                        ))
                    : 'No closed transactions'}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </Box>
    </RenderIf>
  );
};

export default Dashboard;
