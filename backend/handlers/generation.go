package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"licenz-backend/models"
)

// TrackGeneration handles POST /api/generate
func TrackGeneration(c *gin.Context) {
	var req models.GenerationRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.GenerationResponse{
			Success: false,
			Error:   "Invalid request data: " + err.Error(),
		})
		return
	}

	// Generate unique generation ID
	generationID := uuid.New().String()
	
	// For now, just return a success response
	// In a real implementation, this would track the generation request
	c.JSON(http.StatusOK, models.GenerationResponse{
		Success: true,
		Message: "Generation request tracked successfully",
		Data: struct {
			GenerationID string `json:"generation_id"`
			Status       string `json:"status"`
			EstimatedTime int   `json:"estimated_time_seconds"`
		}{
			GenerationID: generationID,
			Status:       "queued",
			EstimatedTime: 30, // 30 seconds estimate
		},
	})
}

// GetGenerationHistory handles GET /api/generate/history
func GetGenerationHistory(c *gin.Context) {
	// For now, return empty history
	// In a real implementation, this would return actual generation history
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Generation history retrieved successfully",
		"data":    []interface{}{},
		"total":   0,
	})
}
