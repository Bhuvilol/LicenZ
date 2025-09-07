package models

import (
	"time"
)

// Content represents AI-generated content stored in the system
type Content struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	Prompt      string    `json:"prompt" bson:"prompt"`
	Style       string    `json:"style" bson:"style"`
	ImageURL    string    `json:"ImageURL" bson:"image_url"`
	ImageData   string    `json:"ImageData" bson:"image_data"` // Base64 encoded image
	ContentHash string    `json:"ContentHash" bson:"content_hash"`
	Seed        int64     `json:"seed" bson:"seed,omitempty"`
	
	// Generation parameters
	CFGScale    float64 `json:"CFGScale" bson:"cfg_scale"`
	Steps       int     `json:"steps" bson:"steps"`
	Height      int     `json:"height" bson:"height"`
	Width       int     `json:"width" bson:"width"`
	
	// Metadata
	Model       string    `json:"model" bson:"model"`
	GeneratedAt time.Time `json:"generated_at" bson:"generated_at"`
	CreatedAt   time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" bson:"updated_at"`
	
	// User and ownership
	UserID      string `json:"UserID" bson:"user_id,omitempty"`
	IsPublic    bool   `json:"is_public" bson:"is_public"`
	
	// Licensing and NFT info
	IsLicensed  bool   `json:"is_licensed" bson:"is_licensed"`
	LicenseType string `json:"license_type" bson:"license_type,omitempty"`
	NFTMinted   bool   `json:"nft_minted" bson:"nft_minted"`
	NFTTokenID  string `json:"nft_token_id" bson:"nft_token_id,omitempty"`
}

// CreateContentRequest represents the request to create new content
type CreateContentRequest struct {
	Prompt      string  `json:"prompt" binding:"required"`
	Style       string  `json:"style" binding:"required"`
	ImageData   string  `json:"ImageData" binding:"required"`
	ContentHash string  `json:"ContentHash" binding:"required"`
	Seed        int64   `json:"seed,omitempty"`
	CFGScale    float64 `json:"CFGScale"`
	Steps       int     `json:"steps"`
	Height      int     `json:"height"`
	Width       int     `json:"width"`
	Model       string  `json:"model"`
	UserID      string  `json:"UserID,omitempty"`
}

// ContentResponse represents the response for content operations
type ContentResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message,omitempty"`
	Data    *Content `json:"data,omitempty"`
	Error   string   `json:"error,omitempty"`
}

// ContentListResponse represents the response for content listing
type ContentListResponse struct {
	Success bool      `json:"success"`
	Message string    `json:"message,omitempty"`
	Data    []Content `json:"data,omitempty"`
	Total   int       `json:"total"`
	Error   string    `json:"error,omitempty"`
}

// GenerationRequest represents an AI generation request
type GenerationRequest struct {
	Prompt   string  `json:"prompt" binding:"required"`
	Style    string  `json:"style" binding:"required"`
	CFGScale float64 `json:"cfg_scale"`
	Steps    int     `json:"steps"`
	Height   int     `json:"height"`
	Width    int     `json:"width"`
	UserID   string  `json:"user_id,omitempty"`
}

// GenerationResponse represents the response for generation tracking
type GenerationResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Data    struct {
		GenerationID string `json:"generation_id"`
		Status       string `json:"status"`
		EstimatedTime int   `json:"estimated_time_seconds"`
	} `json:"data,omitempty"`
	Error string `json:"error,omitempty"`
}
