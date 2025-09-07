const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Sepolia testnet...");

  // Get the contract factories
  const LicenZNFT = await ethers.getContractFactory("LicenZNFT");
  const LicenZLicense = await ethers.getContractFactory("LicenZLicense");
  const LicenZContent = await ethers.getContractFactory("LicenZContent");

  console.log("📦 Deploying LicenZNFT contract...");
  const licenZNFT = await LicenZNFT.deploy();
  await licenZNFT.waitForDeployment();
  const nftAddress = await licenZNFT.getAddress();
  console.log("✅ LicenZNFT deployed to:", nftAddress);

  console.log("📦 Deploying LicenZLicense contract...");
  const licenZLicense = await LicenZLicense.deploy();
  await licenZLicense.waitForDeployment();
  const licenseAddress = await licenZLicense.getAddress();
  console.log("✅ LicenZLicense deployed to:", licenseAddress);

  console.log("📦 Deploying LicenZContent contract...");
  const licenZContent = await LicenZContent.deploy();
  await licenZContent.waitForDeployment();
  const contentAddress = await licenZContent.getAddress();
  console.log("✅ LicenZContent deployed to:", contentAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      LicenZNFT: nftAddress,
      LicenZLicense: licenseAddress,
      LicenZContent: contentAddress
    },
    deployer: (await ethers.getSigners())[0].address
  };

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    `deployments/sepolia-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💡 Next steps:");
  console.log("1. Update your frontend config with the new contract addresses");
  console.log("2. Verify contracts on Etherscan");
  console.log("3. Test the contracts with your frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });