package main

import (
	"fmt"
	"log"
	"time"

	"licenz-backend/database"
	"licenz-backend/models"
)

func main() {
	fmt.Println("🎨 Adding sample content to persistent database...")
	
	// Create simple persistent database
	db := database.NewSimplePersistentDB()
	
	// Sample content data
	sampleContent := []models.Content{
		{
			ID:          "1",
			UserID:      "demo-user-1",
			Prompt:      "A beautiful sunset over mountains with golden light",
			Style:       "photographic",
			Model:       "stable-diffusion-xl-1024-v1-0",
			ImageData:   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder
			CreatedAt:   time.Now().Add(-24 * time.Hour),
			UpdatedAt:   time.Now().Add(-24 * time.Hour),
		},
		{
			ID:          "2",
			UserID:      "demo-user-1",
			Prompt:      "A futuristic city with flying cars and neon lights",
			Style:       "digital-art",
			Model:       "stable-diffusion-xl-1024-v1-0",
			ImageData:   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder
			CreatedAt:   time.Now().Add(-12 * time.Hour),
			UpdatedAt:   time.Now().Add(-12 * time.Hour),
		},
		{
			ID:          "3",
			UserID:      "demo-user-1",
			Prompt:      "A serene forest with ancient trees and morning mist",
			Style:       "cinematic",
			Model:       "stable-diffusion-xl-1024-v1-0",
			ImageData:   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder
			CreatedAt:   time.Now().Add(-6 * time.Hour),
			UpdatedAt:   time.Now().Add(-6 * time.Hour),
		},
	}
	
	// Add content to database
	for _, content := range sampleContent {
		if err := db.CreateContent(content); err != nil {
			log.Printf("Failed to create content %s: %v", content.ID, err)
		} else {
			fmt.Printf("✅ Added content: %s - %s\n", content.ID, content.Prompt)
		}
	}
	
	// Get total count
	count, err := db.GetContentCount()
	if err != nil {
		log.Printf("Failed to get content count: %v", err)
	} else {
		fmt.Printf("\n📊 Total content in database: %d\n", count)
	}
	
	// Show database file path
	fmt.Printf("💾 Database saved to: %s\n", db.GetFilePath())
	fmt.Printf("🔄 Your content will now survive server restarts!\n")
	
	// Create backup
	if err := db.Backup(); err != nil {
		log.Printf("Failed to create backup: %v", err)
	} else {
		fmt.Printf("💾 Backup created successfully\n")
	}
	
	fmt.Println("\n🎉 Sample content added successfully!")
	fmt.Println("🚀 Restart your backend server - your content will still be there!")
}
