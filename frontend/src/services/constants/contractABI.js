/**
 * Contract ABI for LicenZContentSimple smart contract
 * Centralized ABI definitions for better maintainability
 */

export const LICENZ_CONTENT_ABI = [
  "function createContent(string prompt, string ipfsHash, string style, uint256 cfgScale, uint256 steps, uint256 height, uint256 width, string model) public returns (uint256)",
  "function getContent(uint256 tokenId) public view returns (tuple(uint256 id, address creator, string prompt, string ipfsHash, string style, uint256 cfgScale, uint256 steps, uint256 height, uint256 width, string model, uint256 createdAt, bool isLicensed, uint256 licensePrice, string licenseTerms, address licensee, uint256 licensedAt))",
  "function getCreatorContent(address creator) public view returns (uint256[])",
  "function getCreatorContentCount(address creator) public view returns (uint256)",
  "function getTotalContentCount() public view returns (uint256)",
  "function getContentByIPFS(string ipfsHash) public view returns (tuple(uint256 id, address creator, string prompt, string ipfsHash, string style, uint256 cfgScale, uint256 steps, uint256 height, uint256 width, string model, uint256 createdAt, bool isLicensed, uint256 licensePrice, string licenseTerms, address licensee, uint256 licensedAt))",
  "function setLicense(uint256 tokenId, uint256 price, string terms) public",
  "function purchaseLicense(uint256 tokenId) public payable",
  "function updateContent(uint256 tokenId, string newPrompt, string newTerms, uint256 newPrice) public",
  "function contentExists(uint256 tokenId) public view returns (bool)"
];

export const DEFAULT_CONTENT_PARAMS = {
  style: 'photographic',
  cfgScale: 7,
  steps: 30,
  height: 1024,
  width: 1024,
  model: 'stable-diffusion-xl-1024-v1-0'
};


