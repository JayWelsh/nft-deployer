# NFT Deployer

Handles the deployment of NFT contracts as well as minting of NFTs on said contracts.

Right now only deploys and mints ERC721 contracts/tokens.

[Demo](https://vagabond.mypinata.cloud/ipfs/QmW8ft5vEG7DcEkzZz2zEcgUYTHzNyPBJY4r3tXA4zTN8D/#/)

## The ERC721 Contract

This is the smart contract that is deployed by this tool, it simply passes a `name` (sort of like a "full name", e.g. Ether) and `symbol` (sort of like a "short name" e.g. ETH) into the constructor of the contract.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

// 3.1.0-solc-0.7 openzeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721NFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory tokenName, string memory tokenSymbol) public ERC721(tokenName, tokenSymbol) {}

    function mint(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

}
```
## Environment Variables

If you have an Infura API key, add it to the `.env.sample` file and then rename the file to `.env`

## Install Dependencies

### `npm install` or `yarn`

## Start app

### `npm start` or `yarn start`

## Supported Networks

- Ethereum Mainnet
- Rinkeby
- Goerli
- Kovan
- Ropsten