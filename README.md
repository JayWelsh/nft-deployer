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

## IPFS Metadata Hash

For the IPFS Metadata hash, this refers to the IPFS hash of the token Metadata that has been uploaded to an IPFS provider such as your own IPFS node or something like [Pinata.cloud](https://pinata.cloud/)

Here is an example of NFT metadata, the "image" property should have the `QmXa7itoeFWYsSGxJuZg2FhnUGTsnhc5YemSdzMEbBGW4F` portion of the metadata replaced with your NFT media, the rest of the content should also be adjusted to be applicable to your piece:

```
{
   "name":"The name of your NFT",
   "description":"The description of your NFT",
   "image":"ipfs://QmXa7itoeFWYsSGxJuZg2FhnUGTsnhc5YemSdzMEbBGW4F",
   "attributes":[
      {
         "trait_type":"Type",
         "value":"NFT + Physical"
      },
      {
         "trait_type":"Artist",
         "value":"The Name Of The Artist"
      },
      {
         "trait_type":"Edition",
         "value":"1/1"
      },
      {
         "trait_type":"Dimensions",
         "value":"28.6 x 19.7 x 5 cm / 11.25 x 7.75 x 2 in"
      },
      {
         "trait_type":"Case Dimensions",
         "value":"33.02 x 22.23 x 6.99 cm / 13 x 8.75 x 2.75 in"
      },
      {
         "trait_type":"Medium",
         "value":"Acrylic & Ink"
      },
      {
         "trait_type":"Support",
         "value":"Canvas"
      }
   ]
}
```

Uploading the following JSON data to IPFS will return a hash, in this case `QmbAywJY1pvRkzUBAtDrRXBcT5agncKhmy1PcA1877xxth` which resolves to [this](https://vagabond.mypinata.cloud/ipfs/QmbAywJY1pvRkzUBAtDrRXBcT5agncKhmy1PcA1877xxth), this `QmbAywJY1pvRkzUBAtDrRXBcT5agncKhmy1PcA1877xxth` would then be used in the `Metadata IPFS Hash` field on the minting page.
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