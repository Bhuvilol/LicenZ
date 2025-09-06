// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title LicenZLicense
 * @dev Smart contract for managing content licensing on the blockchain
 */
contract LicenZLicense is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _licenseIds;
    
    // License structure
    struct License {
        uint256 licenseId;
        bytes32 contentHash;
        uint256 price;
        string terms;
        address creator;
        bool isActive;
        uint256 createdAt;
        uint256 purchasedAt;
        address purchaser;
        bool isPurchased;
    }
    
    // Mapping from license ID to license details
    mapping(uint256 => License) public licenses;
    
    // Mapping from content hash to license IDs
    mapping(bytes32 => uint256[]) public contentLicenses;
    
    // Mapping from creator to their licenses
    mapping(address => uint256[]) public creatorLicenses;
    
    // Mapping from purchaser to their purchased licenses
    mapping(address => uint256[]) public purchaserLicenses;
    
    // Platform fee percentage (2.5% = 250 basis points)
    uint256 public platformFeePercentage = 250; // 2.5%
    
    // Events
    event LicenseCreated(
        uint256 indexed licenseId,
        bytes32 indexed contentHash,
        address indexed creator,
        uint256 price,
        string terms,
        uint256 timestamp
    );
    
    event LicensePurchased(
        uint256 indexed licenseId,
        address indexed purchaser,
        uint256 price,
        uint256 timestamp
    );
    
    event LicenseDeactivated(
        uint256 indexed licenseId,
        address indexed creator,
        uint256 timestamp
    );
    
    event PlatformFeeUpdated(
        uint256 oldFee,
        uint256 newFee,
        uint256 timestamp
    );
    
    constructor() Ownable() {}
    
    /**
     * @dev Create a new license for content
     * @param contentHash The hash of the content being licensed
     * @param price The price of the license in wei
     * @param terms The terms and conditions of the license
     * @return The ID of the newly created license
     */
    function createLicense(
        bytes32 contentHash,
        uint256 price,
        string memory terms
    ) public returns (uint256) {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(price > 0, "Price must be greater than 0");
        require(bytes(terms).length > 0, "Terms cannot be empty");
        
        _licenseIds.increment();
        uint256 newLicenseId = _licenseIds.current();
        
        License memory newLicense = License({
            licenseId: newLicenseId,
            contentHash: contentHash,
            price: price,
            terms: terms,
            creator: msg.sender,
            isActive: true,
            createdAt: block.timestamp,
            purchasedAt: 0,
            purchaser: address(0),
            isPurchased: false
        });
        
        licenses[newLicenseId] = newLicense;
        contentLicenses[contentHash].push(newLicenseId);
        creatorLicenses[msg.sender].push(newLicenseId);
        
        emit LicenseCreated(newLicenseId, contentHash, msg.sender, price, terms, block.timestamp);
        
        return newLicenseId;
    }
    
    /**
     * @dev Purchase a license
     * @param licenseId The ID of the license to purchase
     */
    function purchaseLicense(uint256 licenseId) public payable nonReentrant {
        License storage license = licenses[licenseId];
        require(license.licenseId != 0, "License does not exist");
        require(license.isActive, "License is not active");
        require(!license.isPurchased, "License already purchased");
        require(msg.value == license.price, "Incorrect payment amount");
        require(msg.sender != license.creator, "Creator cannot purchase their own license");
        
        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 creatorAmount = msg.value - platformFee;
        
        // Transfer payment to creator
        (bool creatorSuccess, ) = license.creator.call{value: creatorAmount}("");
        require(creatorSuccess, "Failed to transfer payment to creator");
        
        // Transfer platform fee to contract owner
        if (platformFee > 0) {
            (bool ownerSuccess, ) = owner().call{value: platformFee}("");
            require(ownerSuccess, "Failed to transfer platform fee");
        }
        
        // Update license status
        license.isPurchased = true;
        license.purchaser = msg.sender;
        license.purchasedAt = block.timestamp;
        
        purchaserLicenses[msg.sender].push(licenseId);
        
        emit LicensePurchased(licenseId, msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Deactivate a license (only creator can do this)
     * @param licenseId The ID of the license to deactivate
     */
    function deactivateLicense(uint256 licenseId) public {
        License storage license = licenses[licenseId];
        require(license.licenseId != 0, "License does not exist");
        require(msg.sender == license.creator, "Only creator can deactivate license");
        require(license.isActive, "License already deactivated");
        require(!license.isPurchased, "Cannot deactivate purchased license");
        
        license.isActive = false;
        
        emit LicenseDeactivated(licenseId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get license details
     * @param licenseId The ID of the license
     * @return License details
     */
    function getLicense(uint256 licenseId) public view returns (License memory) {
        require(licenseId > 0 && licenseId <= _licenseIds.current(), "Invalid license ID");
        return licenses[licenseId];
    }
    
    /**
     * @dev Check if license is valid and active
     * @param licenseId The ID of the license
     * @return True if license is valid and active
     */
    function isLicenseValid(uint256 licenseId) public view returns (bool) {
        License memory license = licenses[licenseId];
        return license.licenseId != 0 && license.isActive && !license.isPurchased;
    }
    
    /**
     * @dev Get all licenses for a specific content
     * @param contentHash The hash of the content
     * @return Array of license IDs
     */
    function getLicensesForContent(bytes32 contentHash) public view returns (uint256[] memory) {
        return contentLicenses[contentHash];
    }
    
    /**
     * @dev Get all licenses created by an address
     * @param creator The creator address
     * @return Array of license IDs
     */
    function getLicensesByCreator(address creator) public view returns (uint256[] memory) {
        return creatorLicenses[creator];
    }
    
    /**
     * @dev Get all licenses purchased by an address
     * @param purchaser The purchaser address
     * @return Array of license IDs
     */
    function getLicensesByPurchaser(address purchaser) public view returns (uint256[] memory) {
        return purchaserLicenses[purchaser];
    }
    
    /**
     * @dev Get total number of licenses
     * @return Total license count
     */
    function totalLicenses() public view returns (uint256) {
        return _licenseIds.current();
    }
    
    /**
     * @dev Update platform fee percentage (only owner)
     * @param newFeePercentage New fee percentage in basis points
     */
    function updatePlatformFee(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = newFeePercentage;
        
        emit PlatformFeeUpdated(oldFee, newFeePercentage, block.timestamp);
    }
    
    /**
     * @dev Withdraw accumulated platform fees (only owner)
     */
    function withdrawPlatformFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
    
    /**
     * @dev Get contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
