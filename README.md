# LicenZ

A decentralized content licensing platform built with React, Go, and Ethereum smart contracts.

## Project Structure

The project is organized into three main folders for better separation of concerns:

### 📱 **Frontend** (`/frontend`)
- React application with Tailwind CSS
- User interface components
- Wallet integration
- Content management
- Design system and UI components

### 🔧 **Backend** (`/backend`)
- Go server with Gin framework
- REST API endpoints
- Database operations
- Content storage and management
- AI service integration

### ⛓️ **Blockchain** (`/blockchain`)
- Ethereum smart contracts (Hardhat)
- NFT minting functionality
- License creation and management
- Contract deployment scripts
- Blockchain service integration

## Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.21+)
- MetaMask or compatible wallet

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
go mod tidy
go run main.go
```

### Blockchain Development
```bash
cd blockchain
npm install
npm run compile
npm run node  # Start local Hardhat node
npm run deploy  # Deploy contracts
```

## Features

- **AI Content Generation**: Create unique content using AI services
- **NFT Minting**: Mint generated content as NFTs on Ethereum
- **License Management**: Create and manage content licenses
- **Wallet Integration**: MetaMask wallet connection
- **Responsive Design**: Modern, mobile-friendly interface

## Smart Contracts

- **LicenZLicense**: Manages content licensing
- **LicenZNFT**: Handles NFT minting and ownership

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

