const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying LicenZ Content Storage Contract to Sepolia Testnet...");
  console.log("This deployment is FREE using Sepolia testnet!");

  try {
    // Get the deployer account
    const signers = await ethers.getSigners();
    if (!signers || signers.length === 0) {
      throw new Error("No signers found. Check your private key configuration.");
    }
    
    const deployer = signers[0];
    console.log("Deploying from account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      console.log("Warning: Account has 0 ETH. You may need Sepolia testnet ETH.");
      console.log("Get free testnet ETH from: https://sepoliafaucet.js/");
    }

    // Get the contract factory
    console.log("Getting contract factory...");
    const LicenZContentSimple = await ethers.getContractFactory("LicenZContentSimple");
    console.log("Deploying simplified contract...");
    
    // Deploy the contract
    const licenZContent = await LicenZContentSimple.deploy();
    console.log("Waiting for deployment to complete...");
    
    // Wait for deployment to complete
    await licenZContent.waitForDeployment();

    // Get the deployed contract address
    const contractAddress = await licenZContent.getAddress();
    
    console.log("LicenZ Content Storage Contract deployed successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("Network: Sepolia Testnet");
    console.log("Deployer:", deployer.address);

    // Save deployment info
    const deploymentInfo = {
      contractName: "LicenZContentSimple",
      contractAddress: contractAddress,
      network: "sepolia",
      networkId: 11155111,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      features: [
        "On-chain content storage (simplified)",
        "IPFS hash linking", 
        "Content licensing",
        "Creator tracking",
        "No ERC721 complexity",
        "No backend database required"
      ],
      gasUsed: licenZContent.deploymentTransaction?.gasLimit?.toString() || "Unknown",
      explorer: `https://sepolia.etherscan.io/address/${contractAddress}`,
      rpcUrl: "https://rpc.sepolia.org"
    };

    // Write deployment info to file
    const fs = require('fs');
    const path = require('path');
    
    const deploymentPath = path.join(__dirname, '../deployment-info-sepolia.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("Deployment info saved to:", deploymentPath);
    console.log("\nContract deployment successful!");
    console.log("\nNext steps:");
    console.log("1. Update your frontend configuration with the new contract address");
    console.log("2. Remove backend database dependencies");
    console.log("3. Test content creation and retrieval directly from blockchain");
    console.log("4. Your content will now be permanently stored on-chain!");
    console.log("\nView your contract on Etherscan:");
    console.log(`   ${deploymentInfo.explorer}`);

    return licenZContent;
  } catch (error) {
    console.error("Deployment failed:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("You need Sepolia testnet ETH. Get free ETH from: https://sepoliafaucet.com/");
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
