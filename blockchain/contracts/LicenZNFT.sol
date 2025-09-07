// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LicenZNFT
 * @dev NFT contract for AI-generated content licensing platform
 */
contract LicenZNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Mapping from content hash to token ID
    mapping(bytes32 => uint256) public contentHashToTokenId;
    
    // Mapping from token ID to content hash
    mapping(uint256 => bytes32) public tokenIdToContentHash;
    
    // Mapping from token ID to creator
    mapping(uint256 => address) public tokenCreators;
    
    // Mapping from token ID to creation timestamp
    mapping(uint256 => uint256) public tokenCreationTime;
    
    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        bytes32 indexed contentHash,
        string tokenURI,
        uint256 timestamp
    );
    
    event ContentHashUpdated(
        uint256 indexed tokenId,
        bytes32 indexed oldHash,
        bytes32 indexed newHash
    );
    
    constructor() ERC721("LicenZ AI Content", "LZAI") Ownable() {}
    
    /**
     * @dev Mint a new NFT for AI-generated content
     * @param to The address that will own the minted NFT
     * @param contentHash The hash of the AI-generated content
     * @param uri The URI for the token metadata
     * @return The ID of the newly minted token
     */
    function mintNFT(
        address to,
        bytes32 contentHash,
        string memory uri
    ) public returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(contentHash != bytes32(0), "Invalid content hash");
        require(bytes(uri).length > 0, "Empty token URI");
        require(contentHashToTokenId[contentHash] == 0, "Content already minted");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        // Store content hash and creator information
        contentHashToTokenId[contentHash] = newTokenId;
        tokenIdToContentHash[newTokenId] = contentHash;
        tokenCreators[newTokenId] = msg.sender;
        tokenCreationTime[newTokenId] = block.timestamp;
        
        emit NFTMinted(newTokenId, msg.sender, contentHash, uri, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Get token information by content hash
     * @param contentHash The hash of the content
     * @return tokenId The token ID
     * @return creator The creator address
     * @return creationTime The creation timestamp
     */
    function getTokenByContentHash(bytes32 contentHash) 
        public 
        view 
        returns (uint256 tokenId, address creator, uint256 creationTime) 
    {
        tokenId = contentHashToTokenId[contentHash];
        require(tokenId != 0, "Content not minted");
        
        creator = tokenCreators[tokenId];
        creationTime = tokenCreationTime[tokenId];
    }
    
    /**
     * @dev Check if content hash is already minted
     * @param contentHash The hash of the content
     * @return True if content is minted, false otherwise
     */
    function isContentMinted(bytes32 contentHash) public view returns (bool) {
        return contentHashToTokenId[contentHash] != 0;
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return Total token count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
