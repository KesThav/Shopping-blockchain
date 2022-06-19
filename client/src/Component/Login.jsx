import React, { Fragment, useEffect, useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Heading,
  Input,
  Button,
} from '@chakra-ui/react';
import { ContextAPI } from '../Middlewares/ContextAPI';

const Login = () => {
  const { createUser, currentUser, updateUser, getCurrentUser } =
    useContext(ContextAPI);
  const [values, setValues] = useState([]);

  useEffect(() => {
    getCurrentUser();
  }, [currentUser]);

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.100" p={12} rounded={6}>
          <Heading mb={6}>Log in</Heading>
          <FormLabel htmlFor="email">Name</FormLabel>
          <Input
            id="Name"
            type="text"
            name="name"
            value={values.name}
            onChange={e => handleChange(e)}
          />
          <FormLabel htmlFor="email">Phone number</FormLabel>
          <Input
            id="Name"
            type="text"
            name="phone_number"
            value={values.phone_number}
            onChange={e => handleChange(e)}
            style={{ marginBottom: '10px' }}
          />
          <Button
            colorScheme="telegram"
            variant="solid"
            onClick={e => createUser(e, values)}
          >
            Log in
          </Button>
        </Flex>
      </Flex>
    </Fragment>
  );
};

export default Login;
