package handlers

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"licenz-backend/database"
	"licenz-backend/models"
)

// Global database instance
var db *database.SimplePersistentDB

// Initialize database
func init() {
	fmt.Println("🔧 Initializing persistent database...")
	db = database.NewSimplePersistentDB()
	fmt.Printf("✅ Database initialized: %s\n", db.GetFilePath())
}

// CreateContent handles POST /api/content
func CreateContent(c *gin.Context) {
	var req models.CreateContentRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ContentResponse{
			Success: false,
			Error:   "Invalid request data: " + err.Error(),
		})
		return
	}

	// Generate unique ID
	contentID := uuid.New().String()
	
	// Create content object
	now := time.Now()
	content := models.Content{
		ID:          contentID,
		Prompt:      req.Prompt,
		Style:       req.Style,
		ImageData:   req.ImageData,
		ContentHash: req.ContentHash,
		Seed:        req.Seed,
		CFGScale:    req.CFGScale,
		Steps:       req.Steps,
		Height:      req.Height,
		Width:       req.Width,
		Model:       req.Model,
		GeneratedAt: now,
		CreatedAt:   now,
		UpdatedAt:   now,
		UserID:      req.UserID,
		IsPublic:    true,
		IsLicensed:  false,
		NFTMinted:   false,
	}

	// Store content in persistent database
	if err := db.CreateContent(content); err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to save content: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.ContentResponse{
		Success: true,
		Message: "Content created successfully and saved to disk",
		Data:    &content,
	})
}

// GetAllContent handles GET /api/content
func GetAllContent(c *gin.Context) {
	// Get query parameters
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")
	userID := c.Query("user_id")
	
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	
	if limit > 100 {
		limit = 100
	}
	
	// Get content from persistent database
	contentList, total, err := db.GetAllContent(limit, offset, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to retrieve content: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.ContentListResponse{
		Success: true,
		Message: "Content retrieved successfully from persistent storage",
		Data:    contentList,
		Total:   total,
	})
}

// GetContentByID handles GET /api/content/:id
func GetContentByID(c *gin.Context) {
	contentID := c.Param("id")
	
	// Get content from persistent database
	content, err := db.GetContent(contentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to retrieve content: " + err.Error(),
		})
		return
	}
	
	if content == nil {
		c.JSON(http.StatusNotFound, models.ContentResponse{
			Success: false,
			Error:   "Content not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.ContentResponse{
		Success: true,
		Message: "Content retrieved successfully",
		Data:    content,
	})
}

// DeleteContent handles DELETE /api/content/:id
func DeleteContent(c *gin.Context) {
	contentID := c.Param("id")
	
	// Delete content from persistent database
	if err := db.DeleteContent(contentID); err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to delete content: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.ContentResponse{
		Success: true,
		Message: "Content deleted successfully from persistent storage",
	})
}

// DownloadContent handles GET /api/content/:id/download
func DownloadContent(c *gin.Context) {
	contentID := c.Param("id")
	
	// Get content from persistent database
	content, err := db.GetContent(contentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to retrieve content: " + err.Error(),
		})
		return
	}
	
	if content == nil {
		c.JSON(http.StatusNotFound, models.ContentResponse{
			Success: false,
			Error:   "Content not found",
		})
		return
	}

	// Decode base64 image data
	imageData, err := base64.StdEncoding.DecodeString(content.ImageData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Invalid image data",
		})
		return
	}

	// Set response headers for download
	c.Header("Content-Disposition", "attachment; filename="+contentID+".png")
	c.Header("Content-Type", "image/png")
	c.Header("Content-Length", strconv.Itoa(len(imageData)))
	
	// Send the image data
	c.Data(http.StatusOK, "image/png", imageData)
}

// SearchContent handles GET /api/content/search
func SearchContent(c *gin.Context) {
	query := c.Query("q")
	limitStr := c.DefaultQuery("limit", "20")
	
	limit, _ := strconv.Atoi(limitStr)
	if limit > 50 {
		limit = 50
	}
	
	if query == "" {
		c.JSON(http.StatusBadRequest, models.ContentResponse{
			Success: false,
			Error:   "Search query is required",
		})
		return
	}
	
	// Search content in persistent database
	results, err := db.SearchContent(query, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to search content: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.ContentListResponse{
		Success: true,
		Message: "Search completed successfully",
		Data:    results,
		Total:   len(results),
	})
}

// GetContentStats handles GET /api/content/stats
func GetContentStats(c *gin.Context) {
	// Get content count from persistent database
	count, err := db.GetContentCount()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ContentResponse{
			Success: false,
			Error:   "Failed to get content count: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Content statistics retrieved successfully",
		"total":   count,
		"stats": map[string]interface{}{
			"total_content": count,
			"storage_type":  "persistent_disk",
			"database_file": db.GetFilePath(),
		},
	})
}
