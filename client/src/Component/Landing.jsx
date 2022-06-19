import React, { useContext, useEffect } from 'react';
import { ContextAPI } from '../Middlewares/ContextAPI';
import RenderIf from './RenderIf';
import ProductTemplate from './ProductTemplate';
import { Flex } from '@chakra-ui/react';
import AddProduct from './AddProduct';

const Landing = () => {
  const { products, currentUser, allProducts } = useContext(ContextAPI);

  useEffect(() => {
    allProducts();
  }, [products]);

  return (
    <RenderIf account={currentUser}>
      <Flex direction="row-reverse" p="10" style={{ boxSizing: 'border-box' }}>
        <AddProduct />
      </Flex>
      <Flex wrap="wrap" grow="1" align="center" justify="left">
        {products && <ProductTemplate product={products} />}
      </Flex>
    </RenderIf>
  );
};

export default Landing;
