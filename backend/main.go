package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"licenz-backend/handlers"
)

func main() {
	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	// Create a new Gin router
	r := gin.Default()

	// Configure CORS for frontend communication
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API routes group
	api := r.Group("/api")
	{
			// Content management (Persistent Storage)
	api.POST("/content", handlers.CreateContent)
	api.GET("/content", handlers.GetAllContent)
	api.GET("/content/:id", handlers.GetContentByID)
	api.DELETE("/content/:id", handlers.DeleteContent)
	api.GET("/content/:id/download", handlers.DownloadContent)
	api.GET("/content/search", handlers.SearchContent)
	api.GET("/content/stats", handlers.GetContentStats)

		// AI generation tracking
		api.POST("/generate", handlers.TrackGeneration)
		api.GET("/generate/history", handlers.GetGenerationHistory)

		// Health and status
		api.GET("/health", healthCheck)
		api.GET("/status", getStatus)
	}

	// Root route
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "LicenZ Backend is running! 🚀",
			"status":  "success",
			"version": "1.0.0",
			"features": []string{
				"AI Content Management",
				"Content Storage & Retrieval",
				"Generation History",
				"API Health Monitoring",
			},
		})
	})

	// Start the server
	log.Println("🚀 Starting LicenZ backend server on port 8080...")
	log.Println("📡 Server will be available at: http://localhost:8080")
	log.Println("🔗 API endpoints available at: http://localhost:8080/api")
	log.Fatal(r.Run(":8080"))
}

// Health check endpoint
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "LicenZ Backend",
		"timestamp": time.Now().UTC(),
		"uptime":    "running",
	})
}

// Status endpoint with detailed information
func getStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "operational",
		"service":   "LicenZ Backend",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC(),
		"endpoints": gin.H{
			"content":    "/api/content",
			"generate":   "/api/generate",
			"health":     "/api/health",
			"status":     "/api/status",
		},
		"features": gin.H{
			"ai_generation": "enabled",
			"content_storage": "enabled",
			"api_management": "enabled",
		},
	})
}
