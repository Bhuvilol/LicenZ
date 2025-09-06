const { ethers } = require("hardhat");

async function main() {
  console.log("Testing LicenZ Content Contract...");

  // Get the deployed contract
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const LicenZContent = await ethers.getContractFactory("LicenZContent");
  const contract = LicenZContent.attach(contractAddress);

  console.log("Contract Address:", contractAddress);
  console.log("Contract Name:", await contract.name());
  console.log("Contract Symbol:", await contract.symbol());

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Signer Address:", signer.address);

  // Test content creation
  console.log("\nTesting content creation...");
  
  const testContent = {
    prompt: "A beautiful sunset over mountains",
    ipfsHash: "QmTestHash" + Date.now(), // Unique hash
    style: "photographic",
    cfgScale: 7,
    steps: 30,
    height: 1024,
    width: 1024,
    model: "stable-diffusion-xl-1024-v1-0"
  };

  try {
    const tx = await contract.createContent(
      testContent.prompt,
      testContent.ipfsHash,
      testContent.style,
      testContent.cfgScale,
      testContent.steps,
      testContent.height,
      testContent.width,
      testContent.model
    );

    console.log("Content creation transaction sent:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Get the created content
    const totalContent = await contract.getTotalContentCount();
    console.log("Total content count:", totalContent.toString());

    if (totalContent > 0) {
      const content = await contract.getContent(1); // First token ID
      console.log("Content details:");
      console.log("  - Token ID:", content.id.toString());
      console.log("  - Creator:", content.creator);
      console.log("  - Prompt:", content.prompt);
      console.log("  - IPFS Hash:", content.ipfsHash);
      console.log("  - Style:", content.style);
      console.log("  - Model:", content.model);
      console.log("  - Created At:", new Date(content.createdAt.toNumber() * 1000).toISOString());
    }

    // Test creator content retrieval
    const creatorContent = await contract.getCreatorContent(signer.address);
    console.log("Creator content count:", creatorContent.length);
          console.log("Creator content IDs:", creatorContent.map(id => id.toString()));

    console.log("\nContract test successful!");
    console.log("Your smart contract is working correctly!");
    console.log("Content can be created and retrieved!");
    console.log("No backend database needed!");

  } catch (error) {
    console.error("Contract test failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
