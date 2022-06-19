pragma solidity >=0.4.22 <0.9.0;

import "./MyUser.sol";
import "./MyProduct.sol";

contract myPayment {
    //import MyUser smart contract
    MyUser userContr = new MyUser();

    //import MyProduct smart contract
    MyProduct prodContr = new MyProduct();

    //Once paid, the transaction is pending until the order has been delivered
    struct PendingTransaction {
        address buyer_address;
        address seller_address;
        int256 pendingAmount;
        string product_uuid;
        string status;
    }

    mapping(string => PendingTransaction) pending;

    string[] pendinglist;

    modifier onlyUser() {
        require(
            bytes(userContr.getUser().name).length != 0,
            "You are not registered!"
        );
        _;
    }

    function buyProduct(
        string[] memory _uuid,
        address product_address,
        address user_address //address[] memory _seller
    ) public {
        //verify that buyer and seller has not the same adress
        //require(_buyer != _seller, "Can not buy your own product !");
        //verify that buyer has enough money
        //require(
        //    userContr.getUser().balance <= prodContr.getProduct(_uuid).price,
        //    "Not enough money to buy the product !"
        //);
        //verify that the product can be bought -> Status == Available
        //require(
        //    keccak256(abi.encodePacked(prodContr.getProduct(_uuid).status)) ==
        //      "Available",
        //    "Product can not be bought !"
        //);
        //create a pending transaction -> buyer money should to reduce
        for (uint256 i = 0; i < _uuid.length; i++) {
            pending[_uuid[i]] = PendingTransaction(
                msg.sender,
                MyProduct(product_address).getProduct(_uuid[i]).seller,
                MyProduct(product_address).getProduct(_uuid[i]).price,
                _uuid[i],
                "Pending"
            );
            pendinglist.push(_uuid[i]);

            //set Product status to pending

            MyProduct(product_address).setProductStatus(_uuid[i], "Pending");

            //reduce buying money
            MyUser(user_address).decreaseBalance(
                MyProduct(product_address).getProduct(_uuid[i]).price,
                msg.sender
            );
        }
    }

    //get pendingTransaction
    function getPendingTransaction()
        public
        view
        returns (PendingTransaction[] memory)
    {
        PendingTransaction[] memory temp = new PendingTransaction[](
            pendinglist.length
        );
        for (uint256 i = 0; i < pendinglist.length; i++) {
            temp[i] = pending[pendinglist[i]];
        }

        return temp;
    }

    //return one pending transaction
    function getOnePendingTransaction(string memory _uuid)
        public
        view
        returns (PendingTransaction memory)
    {
        return pending[_uuid];
    }

    //release payment
    function releasePayment(
        string memory _uuid,
        address product_address,
        address user_address
    ) public {
        //add the pending amount to seller account
        PendingTransaction memory pen = pending[_uuid];
        MyUser(user_address)._setBalance(pen.pendingAmount, pen.seller_address);
        pen.status = "Closed";
        pending[_uuid] = pen;

        //remove pending payment
        //delete pending[_uuid];
        //for (uint256 i = 0; i < pendinglist.length; i++) {
        //    if (
        //        keccak256(abi.encodePacked(pendinglist[i])) ==
        //        keccak256(abi.encodePacked(_uuid))
        //    ) {
        //        pendinglist[i] = pendinglist[pendinglist.length - 1];
        //        pendinglist.pop();
        //    }
        //}
        //change product status to Sold
        MyProduct(product_address).setProductStatus(_uuid, "Sold");
    }
}
