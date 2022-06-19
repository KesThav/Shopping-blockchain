// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyProduct {
    //product detail
    struct Product {
        string uuid;
        string name;
        string description;
        address seller;
        int256 price;
        string status;
        string image;
    }

    mapping(string => Product) products;
    string[] productlist;

    function createProduct(
        string memory _name,
        string memory _description,
        int256 _price,
        string memory _uuid,
        string memory image
    ) external {
        products[_uuid] = Product(
            _uuid,
            _name,
            _description,
            msg.sender,
            _price,
            "Available",
            image
        );
        productlist.push(_uuid);
    }

    //get one product
    function getProduct(string memory _uuid)
        public
        view
        returns (Product memory)
    {
        return products[_uuid];
    }

    //get product from one user
    function getProducts(address _seller)
        public
        view
        returns (Product[] memory)
    {
        Product[] memory temp;
        for (uint256 i = 0; i < productlist.length; i++) {
            if (products[productlist[i]].seller == _seller) {
                temp[i] = products[productlist[i]];
            }
        }
        return temp;
    }

    //get all products
    function getProductsAll() public view returns (Product[] memory) {
        Product[] memory temp = new Product[](productlist.length);
        for (uint256 i = 0; i < productlist.length; i++) {
            temp[i] = products[productlist[i]];
        }
        return temp;
    }

    //set status -> use to update when payment
    function setProductStatus(string memory _uuid, string memory _status)
        public
    {
        products[_uuid] = Product(
            products[_uuid].uuid,
            products[_uuid].name,
            products[_uuid].description,
            products[_uuid].seller,
            products[_uuid].price,
            _status,
            products[_uuid].image
        );
    }
}
