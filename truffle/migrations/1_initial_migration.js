const Migrations = artifacts.require("Migrations");
const MyProduct = artifacts.require("MyProduct");
const MyPayment = artifacts.require("MyPayment");
const MyUser = artifacts.require("MyUser");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MyProduct);
  deployer.deploy(MyPayment);
  deployer.deploy(MyUser);
};
