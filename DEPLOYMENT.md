# 🚀 LicenZ Deployment Guide

This guide will help you deploy the LicenZ platform to production. The project consists of three main components:

- **Frontend** (React + Vite) → Vercel/Netlify
- **Backend** (Go + Gin) → Railway/Heroku
- **Blockchain** (Hardhat) → Sepolia Testnet

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Go 1.21+ installed
- [ ] Git configured
- [ ] API keys for all services
- [ ] Testnet ETH for gas fees

## 🔑 Required API Keys

### AI Services
- **Stability AI**: Get from [platform.stability.ai](https://platform.stability.ai/)
- **OpenAI**: Get from [platform.openai.com](https://platform.openai.com/)
- **Replicate**: Get from [replicate.com](https://replicate.com/)

### Blockchain Services
- **Verbwire**: Get from [verbwire.com](https://www.verbwire.com/)
- **Infura**: Get from [infura.io](https://infura.io/)
- **Etherscan**: Get from [etherscan.io](https://etherscan.io/)

### IPFS Services
- **Pinata**: Get from [pinata.cloud](https://pinata.cloud/)

## 🎯 Deployment Options

### Option 1: Quick Deploy (Recommended)

Use the automated deployment script:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

### Option 2: Manual Deployment

Follow the step-by-step guide below.

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_STABILITY_API_KEY`
   - `VITE_VERBWIRE_API_KEY`
   - `VITE_BACKEND_URL`
   - `VITE_CHAIN_ID=11155111`

### Alternative: Netlify

1. **Build locally**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository

## ⚙️ Backend Deployment (Railway)

### Step 1: Prepare Backend

```bash
cd backend
go mod tidy
go build -o main .
```

### Step 2: Deploy to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd backend
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set PORT=8080
   railway variables set GIN_MODE=release
   ```

### Alternative: Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**:
   ```bash
   heroku create licenz-backend
   ```

3. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## ⛓️ Blockchain Deployment (Sepolia)

### Step 1: Prepare Environment

1. **Create `.env` file** in `blockchain/` directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Get Testnet ETH**:
   - Visit [sepoliafaucet.com](https://sepoliafaucet.com/)
   - Request test ETH for your wallet

### Step 2: Deploy Contracts

```bash
cd blockchain
npm install
npm run compile
npm run deploy:sepolia
```

### Step 3: Verify Contracts

```bash
npm run verify:sepolia
```

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_STABILITY_API_KEY=your_stability_api_key
VITE_VERBWIRE_API_KEY=your_verbwire_api_key
VITE_BACKEND_URL=https://your-backend-url.railway.app
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=sepolia
VITE_LICENZ_NFT_CONTRACT=0x...
VITE_LICENZ_LICENSE_CONTRACT=0x...
VITE_LICENZ_CONTENT_CONTRACT=0x...
```

### Backend Environment Variables

Set in Railway/Heroku dashboard:

```env
PORT=8080
GIN_MODE=release
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## 🧪 Testing Deployment

### 1. Test Frontend
- Visit your deployed frontend URL
- Connect MetaMask wallet
- Switch to Sepolia testnet
- Try generating AI content

### 2. Test Backend
- Check health endpoint: `https://your-backend-url.railway.app/api/health`
- Test content creation API
- Verify CORS is working

### 3. Test Blockchain
- Mint an NFT through the frontend
- Check transaction on [Sepolia Etherscan](https://sepolia.etherscan.io/)
- Verify NFT appears in your wallet

## 🔄 CI/CD with GitHub Actions

The project includes GitHub Actions for automated deployment:

1. **Set up Secrets** in GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `RAILWAY_TOKEN`
   - `VITE_STABILITY_API_KEY`
   - `VITE_VERBWIRE_API_KEY`

2. **Push to main branch** to trigger deployment

## 🚨 Troubleshooting

### Common Issues

1. **Frontend Build Fails**:
   - Check environment variables
   - Verify API keys are valid
   - Check for TypeScript errors

2. **Backend Deployment Fails**:
   - Verify Go version compatibility
   - Check port configuration
   - Review logs in Railway/Heroku

3. **Blockchain Deployment Fails**:
   - Ensure sufficient testnet ETH
   - Verify private key format
   - Check RPC URL is accessible

4. **CORS Issues**:
   - Update CORS origins in backend
   - Verify frontend URL is correct

### Getting Help

- Check deployment logs in respective platforms
- Review GitHub Actions logs
- Test locally first with production environment variables

## 📊 Monitoring

### Health Checks

- **Frontend**: Check if site loads and wallet connects
- **Backend**: Monitor `/api/health` endpoint
- **Blockchain**: Verify contract interactions

### Performance Monitoring

- Use Vercel Analytics for frontend
- Monitor Railway/Heroku metrics for backend
- Track gas usage for blockchain operations

## 🔐 Security Considerations

1. **Never commit private keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** for all services
4. **Regularly rotate API keys**
5. **Monitor for suspicious activity**

## 🎉 Success!

Once deployed, your LicenZ platform will be live and accessible to users worldwide. The decentralized nature ensures your AI-generated content is protected by blockchain technology.

### Next Steps

1. **Monitor performance** and user feedback
2. **Scale resources** as needed
3. **Add more features** based on user demand
4. **Consider mainnet deployment** for production use

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
