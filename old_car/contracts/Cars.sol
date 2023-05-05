//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarArt.sol";
import "./CarAnimation.sol";
import "./Utilities.sol";

contract Cars is ERC721A, Ownable {
    CarArt public carArt;
    CarAnimation public carAnimation;

    uint public price = 0.01 ether;
    uint public maxSupply = 1000;

    struct Car {
        string color;
    }
    mapping(uint => Car) cars;

    constructor(CarArt _carArt, CarAnimation _carAnimation) ERC721A("Cars", "Cars") {
        carArt = _carArt;
        carAnimation = _carAnimation;

        _mint(msg.sender, 1);
    }

    function setPrice(uint _price) external onlyOwner {
        price = _price;
    }

    function reduceSupply(uint _lowerSupply) external onlyOwner {
        require(_lowerSupply < maxSupply, "New supply must be lower than the current supply");
        maxSupply = _lowerSupply;
    }

    function mint(uint256 quantity) external payable {
        require(msg.value >= price * quantity, "Insufficient fee");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        _mint(msg.sender, quantity);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if(!_exists(tokenId)) {
            revert URIQueryForNonexistentToken();
        }

        string memory image = carArt.makeImage();
        string memory animation = carAnimation.makeAnimation();

        string memory json = string(
            abi.encodePacked(
                '{'
                    '"name": "Car #', utils.uint2str(tokenId), '",'
                    '"description": "Car",'
                    '"attributes": [],'
                    '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(image)), '",'
                    '"animation_url": "data:text/html;base64,', Base64.encode(bytes(animation)), '"'
                '}'
            )
        );
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(json))));
    }

    function withdraw() external onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}
