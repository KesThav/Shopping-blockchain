import React, { Fragment, useContext, useState } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogCloseButton,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { ContextAPI } from '../Middlewares/ContextAPI';

const AddProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { createProduct } = useContext(ContextAPI);
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState([]);

  const changeHandler = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const DialogOpen = () => {
    onOpen();
    setValues([]);
  };

  return (
    <Fragment>
      <Button onClick={DialogOpen} colorScheme="teal" variant="outline">
        Add product
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Create a product</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormLabel htmlFor="email">Name</FormLabel>
            <Input
              id="name"
              type="name"
              name="name"
              value={values.name}
              onChange={e => changeHandler(e)}
            />
            <FormLabel htmlFor="email">Image url</FormLabel>
            <Input
              id="image_url"
              type="image_url"
              name="image_url"
              value={values.image_url}
              onChange={e => changeHandler(e)}
            />
            <FormLabel htmlFor="email">Description</FormLabel>
            <Textarea
              id="description"
              type="description"
              name="description"
              value={values.description}
              onChange={e => changeHandler(e)}
            />
            <FormLabel htmlFor="email">Price</FormLabel>
            <Input
              id="price"
              type="number"
              name="price"
              value={values.price}
              onChange={e => changeHandler(e)}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              ml={3}
              onClick={e => createProduct(e, values)}
            >
              Create product
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default AddProduct;
