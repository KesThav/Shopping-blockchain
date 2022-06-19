import React, { Fragment } from 'react';
import Login from './Login';
import Navbar from './Navbar';

const RenderIf = ({ account, children }) => {
  return (
    <Fragment>
      {account?.user_address !==
      '0x0000000000000000000000000000000000000000' ? (
        <Fragment>
          <Navbar />
          {children}
        </Fragment>
      ) : (
        <Login />
      )}
    </Fragment>
  );
};

export default RenderIf;
