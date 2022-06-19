import React, { useEffect, useState, useRef, createContext } from 'react';
import Web3 from 'web3';
import userCtr from 'contracts/MyUser.json';
import productCtr from 'contracts/MyProduct.json';
import paymentCtr from 'contracts/myPayment.json';
import crypto from 'crypto';
import { ContextAPI } from './Middlewares/ContextAPI';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  OrderedList,
} from '@chakra-ui/react';
import Landing from './Component/Landing';
import Orderlist from './Component/Orderlist';
import Dashboard from './Component/Dashboard';
import './App.css';

function App() {
  const provideUrl = process.env.PROVIDER_URL || 'http://localhost:7545';

  const [account, setAccount] = useState(null);
  const [productContract, setProductContract] = useState(null);
  const [paymentContract, setPaymentContract] = useState(null);
  const [userContract, setUserContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProduct] = useState([]);
  const [users, setUser] = useState([]);
  const [registered, setRegister] = useState(false);
  const [basket, setBasket] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let provider = window.ethereum;

      if (typeof provider !== 'undefined') {
        provider
          .request({ method: 'eth_requestAccounts' })
          .then(accounts => {
            setAccount(accounts[0]);
          })
          .catch(err => {
            console.log(err);
            return;
          });

        window.ethereum.on('accountsChanged', function (accounts) {
          setAccount(accounts[0]);
        });
      }

      const web3 = new Web3(provider);

      const networkId = await web3.eth.net.getId();

      if (networkId) {
        setUserContract(
          new web3.eth.Contract(
            userCtr.abi,
            userCtr.networks[networkId].address
          )
        );

        setProductContract(
          new web3.eth.Contract(
            productCtr.abi,
            productCtr.networks[networkId].address
          )
        );

        setPaymentContract(
          new web3.eth.Contract(
            paymentCtr.abi,
            paymentCtr.networks[networkId].address
          )
        );
      }
      setLoading(false);
    };
    init();
    setLoading(true);
    allProducts();
    setLoading(true);
    getUsers();
    setLoading(true);
    getCurrentUser();
    setBasket(JSON.parse(localStorage.getItem('basket')) || []);
  }, [loading]);

  //----------------------------------------------------User functions -----------------------------------------------------//

  //create One user
  const createUser = async (e, values) => {
    e.preventDefault();
    if (userContract) {
      try {
        console.log(values);
        await userContract.methods
          .createUser(values.name, values.phone_number)
          .send({ from: account })
          .then(res => console.log(res));
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  //update user
  const updateUser = async (e, values) => {
    e.preventDefault();
    if (userContract) {
      try {
        await userContract.methods
          .updateUser(values.name, values.phone_number)
          .send({ from: account })
          .then(res => console.log(res));
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  //set balance
  const setBalance = async (e, newbalance) => {
    e.preventDefault();
    if (userContract) {
      try {
        await userContract.methods
          .setBalance(newbalance)
          .send({ from: account })
          .then(res => console.log(res));
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  //get all users
  const getUsers = async () => {
    const temp = [];
    if (userContract) {
      try {
        let res = await userContract.methods.getUsers().call();
        res &&
          res.forEach(user => {
            temp.push({
              user_address: user.user_address,
              name: user.name,
              phone_number: user.phone_number,
              balance: user.balance,
            });
          });
        setUser(temp);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  //get current user
  const getCurrentUser = async () => {
    if (userContract) {
      try {
        let res = await userContract.methods.getUser().call({ from: account });
        res && setCurrentUser(res);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  //----------------------------------------------------Product functions -----------------------------------------------------//

  const allProducts = async () => {
    if (productContract) {
      const temp = [];
      const data = await productContract.methods.getProductsAll().call();
      data &&
        data.forEach(item => {
          temp.push({
            uuid: item.uuid,
            name: item.name,
            description: item.description,
            seller: item.seller,
            price: item.price,
            status: item.status,
          });
        });
      setLoading(false);
      setProduct(data);
    }
  };

  const createProduct = async (e, values) => {
    e.preventDefault();
    if (productContract) {
      try {
        let num = Math.random();
        let hash = crypto
          .createHash('sha256')
          .update(values.name + values.description + values.price + num)
          .digest('hex');
        await productContract.methods
          .createProduct(
            values.name,
            values.description,
            values.price,
            hash,
            values.image_url
          )
          .send({ from: account })
          .then(res => console.log(res));
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //----------------------------------------------------Payment functions--------------------------------------------------------//

  const buyProduct = async (e, newvalues) => {
    let temp = [];
    if (userContract && paymentContract && productContract) {
      for (let i = 0; i < newvalues.length; i++) {
        temp.push(newvalues[i][0]);
      }
      console.log(temp);
      try {
        await paymentContract.methods
          .buyProduct(temp, productContract._address, userContract._address)
          .send({
            from: account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          });
        localStorage.removeItem('basket');
        setBasket([]);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  const getPendingTransactions = async () => {
    let temp = [];
    if (paymentContract) {
      let res = await paymentContract.methods.getPendingTransaction().call();
      res &&
        res.forEach(res => {
          temp.push({
            buyer_address: res.buyer_address,
            pendingAmount: res.pendingAmount,
            product_uuid: res.product_uuid,
            seller_address: res.seller_address,
            status: res.status,
          });
        });
      setPending(temp);
      setLoading(false);
    }
  };

  const releasePayment = async (e, value) => {
    e.preventDefault();
    if (paymentContract && productContract && userContract) {
      try {
        await paymentContract.methods
          .releasePayment(
            value,
            productContract._address,
            userContract._address
          )
          .send({ from: account });
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }
  };
  //-----------------------------------------------------------------------------------------------------------------------------//

  return (
    <ContextAPI.Provider
      value={{
        createProduct,
        allProducts,
        products,
        loading,
        setLoading,
        getUsers,
        users,
        createUser,
        updateUser,
        registered,
        basket,
        setBasket,
        account,
        currentUser,
        setBalance,
        buyProduct,
        getPendingTransactions,
        pending,
        releasePayment,
        getCurrentUser,
      }}
    >
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/orderlist" element={<Orderlist />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </ContextAPI.Provider>
  );
}

export default App;
