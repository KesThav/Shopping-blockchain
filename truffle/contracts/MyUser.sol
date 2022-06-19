// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyUser {
    //define user name
    //user address
    // user phone number
    // amount on the wallet

    struct User {
        address user_address;
        string name;
        string phone_number;
        int256 balance;
    }

    mapping(address => User) users;
    //keep track of all users
    address[] userlist;

    // function to create user data -> only user
    // verify that user does not exist

    function createUser(string memory _name, string memory _phone_number)
        external
    {
        require(
            bytes(users[msg.sender].name).length == 0,
            "You are already registered!"
        );
        users[msg.sender] = User(msg.sender, _name, _phone_number, 0);
        userlist.push(msg.sender);
    }

    // function to update user name -> only user
    // verify that user exist
    function updateUser(string memory _name, string memory _phone_number)
        external
    {
        require(
            bytes(users[msg.sender].name).length != 0,
            "You are not registered!"
        );
        users[msg.sender].name = _name;
        users[msg.sender].phone_number = _phone_number;
    }

    // function to delete user -> only user
    function deleteUser() external {
        delete users[msg.sender];
        for (uint256 i = 0; i < userlist.length; i++) {
            if (userlist[i] == msg.sender) {
                userlist[i] = userlist[userlist.length - 1];
                userlist.pop();
                break;
            }
        }
    }

    // return all users
    function getUsers() public view returns (User[] memory) {
        User[] memory temp = new User[](userlist.length);
        for (uint256 i = 0; i < userlist.length; i++) {
            temp[i] = users[userlist[i]];
        }
        return temp;
    }

    //return one user
    function getUser() public view returns (User memory) {
        return users[msg.sender];
    }

    function setBalance(int256 _balance) public {
        users[msg.sender].balance += _balance;
    }

    function decreaseBalance(int256 _balance, address _address) public {
        //require(
        //   users[_address].balance >= _balance,
        //    "Can not decrease amount !"
        //);
        users[_address].balance = users[_address].balance - _balance;
    }

    function _setBalance(int256 _balance, address _address) public {
        users[_address].balance += _balance;
    }
}
