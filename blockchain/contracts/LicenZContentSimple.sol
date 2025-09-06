// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LicenZ Content Storage (Simplified)
 * @dev On-chain content storage system without ERC721 complexity
 * Content metadata and ownership stored directly on Ethereum blockchain
 */
contract LicenZContentSimple {
    // Content structure stored on-chain
    struct Content {
        uint256 id;
        address creator;
        string prompt;
        string ipfsHash;        // IPFS hash of the actual image/content
        string style;
        uint256 cfgScale;
        uint256 steps;
        uint256 height;
        uint256 width;
        string model;
        uint256 createdAt;
        bool isLicensed;
        uint256 licensePrice;
        string licenseTerms;
        address licensee;
        uint256 licensedAt;
    }

    // Mapping from token ID to content
    mapping(uint256 => Content) public contents;
    
    // Mapping from creator address to their content IDs
    mapping(address => uint256[]) public creatorContent;
    
    // Mapping from IPFS hash to token ID (prevents duplicates)
    mapping(string => uint256) public ipfsToToken;
    
    // Content counter
    uint256 private _tokenIds = 0;

    // Events
    event ContentCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string prompt,
        string ipfsHash,
        uint256 createdAt
    );

    event ContentLicensed(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 price,
        uint256 licensedAt
    );

    event ContentUpdated(
        uint256 indexed tokenId,
        string prompt,
        string licenseTerms,
        uint256 licensePrice
    );

    /**
     * @dev Create new content
     * @param prompt The AI generation prompt
     * @param ipfsHash IPFS hash of the content
     * @param style Style preset used
     * @param cfgScale CFG scale parameter
     * @param steps Number of steps
     * @param height Image height
     * @param width Image width
     * @param model AI model used
     */
    function createContent(
        string memory prompt,
        string memory ipfsHash,
        string memory style,
        uint256 cfgScale,
        uint256 steps,
        uint256 height,
        uint256 width,
        string memory model
    ) public returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(ipfsToToken[ipfsHash] == 0, "Content with this IPFS hash already exists");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        Content memory newContent = Content({
            id: newTokenId,
            creator: msg.sender,
            prompt: prompt,
            ipfsHash: ipfsHash,
            style: style,
            cfgScale: cfgScale,
            steps: steps,
            height: height,
            width: width,
            model: model,
            createdAt: block.timestamp,
            isLicensed: false,
            licensePrice: 0,
            licenseTerms: "",
            licensee: address(0),
            licensedAt: 0
        });

        contents[newTokenId] = newContent;
        creatorContent[msg.sender].push(newTokenId);
        ipfsToToken[ipfsHash] = newTokenId;

        emit ContentCreated(newTokenId, msg.sender, prompt, ipfsHash, block.timestamp);
        
        return newTokenId;
    }

    /**
     * @dev License content to another address
     * @param tokenId The content token ID
     * @param price License price in wei
     * @param terms License terms
     */
    function setLicense(
        uint256 tokenId,
        uint256 price,
        string memory terms
    ) public {
        require(contents[tokenId].creator != address(0), "Content does not exist");
        require(contents[tokenId].creator == msg.sender, "Only content owner can set license");
        
        Content storage content = contents[tokenId];
        content.isLicensed = true;
        content.licensePrice = price;
        content.licenseTerms = terms;

        emit ContentUpdated(tokenId, content.prompt, terms, price);
    }

    /**
     * @dev Purchase license for content
     * @param tokenId The content token ID
     */
    function purchaseLicense(uint256 tokenId) public payable {
        require(contents[tokenId].creator != address(0), "Content does not exist");
        require(contents[tokenId].isLicensed, "Content is not licensed");
        require(msg.value >= contents[tokenId].licensePrice, "Insufficient payment");
        require(contents[tokenId].licensee == address(0), "Content already licensed");

        Content storage content = contents[tokenId];
        content.licensee = msg.sender;
        content.licensedAt = block.timestamp;

        // Transfer payment to content creator
        payable(contents[tokenId].creator).transfer(msg.value);

        emit ContentLicensed(tokenId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Get content by token ID
     * @param tokenId The content token ID
     */
    function getContent(uint256 tokenId) public view returns (Content memory) {
        require(contents[tokenId].creator != address(0), "Content does not exist");
        return contents[tokenId];
    }

    /**
     * @dev Get all content IDs for a creator
     * @param creator The creator address
     */
    function getCreatorContent(address creator) public view returns (uint256[] memory) {
        return creatorContent[creator];
    }

    /**
     * @dev Get content count for a creator
     * @param creator The creator address
     */
    function getCreatorContentCount(address creator) public view returns (uint256) {
        return creatorContent[creator].length;
    }

    /**
     * @dev Check if IPFS hash already exists
     * @param ipfsHash The IPFS hash to check
     */
    function isIPFSHashUsed(string memory ipfsHash) public view returns (bool) {
        return ipfsToToken[ipfsHash] != 0;
    }

    /**
     * @dev Get token ID by IPFS hash
     * @param ipfsHash The IPFS hash
     */
    function getTokenByIPFS(string memory ipfsHash) public view returns (uint256) {
        return ipfsToToken[ipfsHash];
    }

    /**
     * @dev Get total content count
     */
    function getTotalContentCount() public view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Get content by IPFS hash
     * @param ipfsHash The IPFS hash
     */
    function getContentByIPFS(string memory ipfsHash) public view returns (Content memory) {
        uint256 tokenId = ipfsToToken[ipfsHash];
        require(tokenId != 0, "Content not found for this IPFS hash");
        return contents[tokenId];
    }

    /**
     * @dev Update content metadata (only owner)
     * @param tokenId The content token ID
     * @param newPrompt New prompt text
     * @param newTerms New license terms
     * @param newPrice New license price
     */
    function updateContent(
        uint256 tokenId,
        string memory newPrompt,
        string memory newTerms,
        uint256 newPrice
    ) public {
        require(contents[tokenId].creator != address(0), "Content does not exist");
        require(contents[tokenId].creator == msg.sender, "Only content owner can update");
        
        Content storage content = contents[tokenId];
        content.prompt = newPrompt;
        content.licenseTerms = newTerms;
        content.licensePrice = newPrice;

        emit ContentUpdated(tokenId, newPrompt, newTerms, newPrice);
    }

    /**
     * @dev Check if content exists
     * @param tokenId The token ID
     */
    function contentExists(uint256 tokenId) public view returns (bool) {
        return contents[tokenId].creator != address(0);
    }
}
