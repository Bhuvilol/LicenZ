const { ethers } = require("hardhat");

async function main() {
  console.log("Checking LicenZ Content Contract State...");

  // Get the deployed contract
  const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const LicenZContent = await ethers.getContractFactory("LicenZContent");
  const contract = LicenZContent.attach(contractAddress);

  console.log("Contract Address:", contractAddress);
  console.log("Contract Name:", await contract.name());
  console.log("Contract Symbol:", await contract.symbol());

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Signer Address:", signer.address);

  try {
    // Check total content count
    const totalContent = await contract.getTotalContentCount();
    console.log("\nTotal content count:", totalContent.toString());

    if (totalContent > 0) {
      console.log("\nExisting content:");
      
      // Get all content
      for (let i = 1; i <= totalContent; i++) {
        try {
          const content = await contract.getContent(i);
          console.log(`\n  Content #${i}:`);
          console.log("    - Token ID:", content.id.toString());
          console.log("    - Creator:", content.creator);
          console.log("    - Prompt:", content.prompt);
          console.log("    - IPFS Hash:", content.ipfsHash);
          console.log("    - Style:", content.style);
          console.log("    - Model:", content.model);
          console.log("    - Created At:", new Date(content.createdAt.toNumber() * 1000).toISOString());
          console.log("    - Licensed:", content.isLicensed);
          console.log("    - License Price:", ethers.formatEther(content.licensePrice), "ETH");
        } catch (error) {
          console.log(`    - Error reading content #${i}:`, error.message);
        }
      }

      // Check creator content
      const creatorContent = await contract.getCreatorContent(signer.address);
      console.log("\nCreator content count:", creatorContent.length);
      console.log("Creator content IDs:", creatorContent.map(id => id.toString()));
    }

    console.log("\nContract state check completed!");

  } catch (error) {
    console.error("Contract check failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Check failed:", error);
    process.exit(1);
  });
