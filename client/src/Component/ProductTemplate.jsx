import React, { useContext, useState } from 'react';
import { Box, Image, Badge, Button, Flex } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { ContextAPI } from '../Middlewares/ContextAPI';

const ProductTemplate = ({ product }) => {
  const {
    setBasket,
    currentUser,
    allProducts,
    setLoading,
    loading,
    getCurrentUser,
  } = useContext(ContextAPI);
  const [isHovering, setIsHovering] = useState(null);
  const property = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
    imageAlt: 'Rear view of modern home with pool',
  };
  const addToBasket = product => {
    const arr = JSON.parse(localStorage.getItem('basket')) || [];
    arr.push(product);
    localStorage.setItem('basket', JSON.stringify(arr));
    setBasket(arr);
  };
  return (
    product &&
    product.map(
      p =>
        p.status !== 'Pending' &&
        p.status !== 'Sold' && (
          <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m="10px"
            style={{ boxSizing: 'border-box' }}
            w={350}
          >
            <Image
              src={p.image}
              alt={property.imageAlt}
              h="300"
              objectFit="cover"
              boxSize="350px"
            />

            <Box p="6">
              <Box display="flex" alignItems="baseline"></Box>

              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={1}
              >
                {p.name}
              </Box>

              <Box display="flex" mt="2" alignItems="center">
                <Box as="span" color="gray.600" fontSize="sm">
                  {p.description}
                </Box>
              </Box>
            </Box>
            <Flex p="2" direction="row-reverse">
              <Button
                colorScheme="teal"
                disabled={
                  JSON.parse(localStorage.getItem('basket'))
                    ?.map(a => a[0])
                    .includes(p.uuid) || p.seller === currentUser.user_address
                }
                onClick={() => addToBasket(p)}
              >
                {isHovering === p.uuid ? 'Add to cart' : `CHF ${p.price}`}
              </Button>
            </Flex>
          </Box>
        )
    )
  );
};

export default ProductTemplate;
