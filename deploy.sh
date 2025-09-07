#!/bin/bash

# LicenZ Deployment Script
echo "🚀 Starting LicenZ deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go 1.21+ first."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build the project
    print_status "Building frontend for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build completed successfully!"
        print_status "Frontend is ready for deployment to Vercel/Netlify"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    go mod tidy
    
    # Build the project
    print_status "Building backend for production..."
    go build -o main .
    
    if [ $? -eq 0 ]; then
        print_success "Backend build completed successfully!"
        print_status "Backend is ready for deployment to Railway/Heroku"
    else
        print_error "Backend build failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy blockchain contracts
deploy_blockchain() {
    print_status "Deploying blockchain contracts..."
    
    cd blockchain
    
    # Install dependencies
    print_status "Installing blockchain dependencies..."
    npm install
    
    # Compile contracts
    print_status "Compiling smart contracts..."
    npm run compile
    
    if [ $? -eq 0 ]; then
        print_success "Smart contracts compiled successfully!"
        print_warning "Remember to deploy contracts to testnet manually:"
        print_warning "npm run deploy:sepolia"
    else
        print_error "Smart contract compilation failed!"
        exit 1
    fi
    
    cd ..
}

# Main deployment function
main() {
    echo "🎯 LicenZ Deployment Script"
    echo "=========================="
    
    check_requirements
    
    # Ask user which components to deploy
    echo ""
    echo "Which components would you like to deploy?"
    echo "1) Frontend only"
    echo "2) Backend only"
    echo "3) Blockchain only"
    echo "4) All components"
    echo "5) Exit"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_blockchain
            ;;
        4)
            deploy_frontend
            deploy_backend
            deploy_blockchain
            ;;
        5)
            print_status "Deployment cancelled by user."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment process completed!"
    echo ""
    print_status "Next steps:"
    print_status "1. Deploy frontend to Vercel/Netlify"
    print_status "2. Deploy backend to Railway/Heroku"
    print_status "3. Deploy smart contracts to Sepolia testnet"
    print_status "4. Update environment variables with deployed URLs"
    print_status "5. Test the complete application"
}

# Run main function
main
