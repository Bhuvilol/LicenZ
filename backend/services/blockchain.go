package services

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log"
	"math/big"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// ContentStorageService handles blockchain interactions
type ContentStorageService struct {
	client        *ethclient.Client
	contractAddr  common.Address
	contractABI   abi.ABI
	privateKey    *ecdsa.PrivateKey
	fromAddress   common.Address
}

// Content represents AI-generated content stored on blockchain
type Content struct {
	ID           *big.Int `json:"id"`
	IpfsHash     string   `json:"ipfsHash"`
	Prompt       string   `json:"prompt"`
	Style        string   `json:"style"`
	Creator      string   `json:"creator"`
	Timestamp    *big.Int `json:"timestamp"`
	IsNFT        bool     `json:"isNFT"`
	NftTokenID   string   `json:"nftTokenID"`
	Model        string   `json:"model"`
	Width        *big.Int `json:"width"`
	Height       *big.Int `json:"height"`
	Seed         string   `json:"seed"`
	CfgScale     *big.Int `json:"cfgScale"`
	Steps        *big.Int `json:"steps"`
	ContentHash  string   `json:"contentHash"`
	Exists       bool     `json:"exists"`
}

// NewContentStorageService creates a new blockchain service
func NewContentStorageService(rpcURL, contractAddress, privateKeyHex string) (*ContentStorageService, error) {
	// Connect to Sepolia testnet
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Sepolia: %v", err)
	}

	// Parse private key
	privateKey, err := crypto.HexToECDSA(strings.TrimPrefix(privateKeyHex, "0x"))
	if err != nil {
		return nil, fmt.Errorf("invalid private key: %v", err)
	}

	// Get public key and address
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("failed to get public key")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	// Parse contract ABI (simplified for this example)
	contractABI, err := abi.JSON(strings.NewReader(`[
		{
			"inputs": [
				{"name": "ipfsHash", "type": "string"},
				{"name": "prompt", "type": "string"},
				{"name": "style", "type": "string"},
				{"name": "model", "type": "string"},
				{"name": "width", "type": "uint256"},
				{"name": "height", "type": "uint256"},
				{"name": "seed", "type": "string"},
				{"name": "cfgScale", "type": "uint256"},
				{"name": "steps", "type": "uint256"},
				{"name": "contentHash", "type": "string"}
			],
			"name": "storeContent",
			"outputs": [{"name": "", "type": "uint256"}],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [{"name": "user", "type": "address"}],
			"name": "getUserContentIds",
			"outputs": [{"name": "", "type": "uint256[]"}],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [{"name": "contentId", "type": "uint256"}],
			"name": "getContent",
			"outputs": [{"name": "", "type": "tuple"}],
			"stateMutability": "view",
			"type": "function"
		}
	]`))
	if err != nil {
		return nil, fmt.Errorf("failed to parse ABI: %v", err)
	}

	return &ContentStorageService{
		client:       client,
		contractAddr: common.HexToAddress(contractAddress),
		contractABI:  contractABI,
		privateKey:   privateKey,
		fromAddress:  fromAddress,
	}, nil
}

// StoreContent stores AI-generated content on the blockchain
func (s *ContentStorageService) StoreContent(content *Content) (*big.Int, error) {
	// Prepare function call data
	data, err := s.contractABI.Pack("storeContent",
		content.IpfsHash,
		content.Prompt,
		content.Style,
		content.Model,
		content.Width,
		content.Height,
		content.Seed,
		content.CfgScale,
		content.Steps,
		content.ContentHash,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to pack function call: %v", err)
	}

	// Get current gas price
	gasPrice, err := s.client.SuggestGasPrice(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to get gas price: %v", err)
	}

	// Get nonce
	nonce, err := s.client.PendingNonceAt(context.Background(), s.fromAddress)
	if err != nil {
		return nil, fmt.Errorf("failed to get nonce: %v", err)
	}

	// Estimate gas
	msg := ethereum.CallMsg{
		From:  s.fromAddress,
		To:    &s.contractAddr,
		Data:  data,
		Value: big.NewInt(0),
	}
	gasLimit, err := s.client.EstimateGas(context.Background(), msg)
	if err != nil {
		return nil, fmt.Errorf("failed to estimate gas: %v", err)
	}

	// Create transaction
	tx := types.NewTransaction(
		nonce,
		s.contractAddr,
		big.NewInt(0),
		gasLimit,
		gasPrice,
		data,
	)

	// Sign transaction
	chainID, err := s.client.NetworkID(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to get chain ID: %v", err)
	}

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), s.privateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to sign transaction: %v", err)
	}

	// Send transaction
	err = s.client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return nil, fmt.Errorf("failed to send transaction: %v", err)
	}

	log.Printf("✅ Content stored on blockchain! Transaction: %s", signedTx.Hash().Hex())

	// Wait for transaction confirmation
	receipt, err := s.waitForTransaction(signedTx.Hash())
	if err != nil {
		return nil, fmt.Errorf("transaction failed: %v", err)
	}

	// Parse the returned content ID from transaction receipt
	// This is a simplified version - in practice you'd parse the logs
	contentID := big.NewInt(receipt.BlockNumber.Int64()) // Simplified for example

	return contentID, nil
}

// GetUserContent retrieves all content for a specific user
func (s *ContentStorageService) GetUserContent(userAddress string) ([]*Content, error) {
	// Get user's content IDs
	data, err := s.contractABI.Pack("getUserContentIds", common.HexToAddress(userAddress))
	if err != nil {
		return nil, fmt.Errorf("failed to pack function call: %v", err)
	}

	msg := ethereum.CallMsg{
		From: s.fromAddress,
		To:   &s.contractAddr,
		Data: data,
	}

	result, err := s.client.CallContract(context.Background(), msg, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to call contract: %v", err)
	}

	// Parse the result to get content IDs
	// This is a simplified version - you'd need to properly decode the array
	var contentIDs []*big.Int
	// ... parsing logic here

	// Get content details for each ID
	var contents []*Content
	for _, id := range contentIDs {
		content, err := s.GetContent(id)
		if err != nil {
			log.Printf("Warning: failed to get content %s: %v", id.String(), err)
			continue
		}
		contents = append(contents, content)
	}

	return contents, nil
}

// GetContent retrieves a specific content by ID
func (s *ContentStorageService) GetContent(contentID *big.Int) (*Content, error) {
	data, err := s.contractABI.Pack("getContent", contentID)
	if err != nil {
		return nil, fmt.Errorf("failed to pack function call: %v", err)
	}

	msg := ethereum.CallMsg{
		From: s.fromAddress,
		To:   &s.contractAddr,
		Data: data,
	}

	result, err := s.client.CallContract(context.Background(), msg, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to call contract: %v", err)
	}

	// Parse the result to get content details
	// This is a simplified version - you'd need to properly decode the struct
	content := &Content{
		ID: contentID,
		// ... parse other fields from result
	}

	return content, nil
}

// waitForTransaction waits for a transaction to be mined
func (s *ContentStorageService) waitForTransaction(txHash common.Hash) (*types.Receipt, error) {
	for {
		receipt, err := s.client.TransactionReceipt(context.Background(), txHash)
		if err != nil {
			if err == ethereum.NotFound {
				// Transaction not yet mined, wait a bit
				time.Sleep(2 * time.Second)
				continue
			}
			return nil, err
		}

		if receipt.Status == 1 {
			return receipt, nil
		}

		return nil, fmt.Errorf("transaction failed with status 0")
	}
}

// Close closes the blockchain connection
func (s *ContentStorageService) Close() {
	if s.client != nil {
		s.client.Close()
	}
}
