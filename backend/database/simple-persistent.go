package database

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"licenz-backend/models"
)

// SimplePersistentDB provides simple persistent storage for content
type SimplePersistentDB struct {
	content  map[string]models.Content
	filePath string
}

// NewSimplePersistentDB creates a new simple persistent database instance
func NewSimplePersistentDB() *SimplePersistentDB {
	db := &SimplePersistentDB{
		content:  make(map[string]models.Content),
		filePath: "data/content.json",
	}
	
	// Ensure data directory exists
	os.MkdirAll(filepath.Dir(db.filePath), 0755)
	
	// Load existing data
	db.loadFromDisk()
	
	return db
}

// loadFromDisk loads content from JSON file
func (db *SimplePersistentDB) loadFromDisk() {
	data, err := os.ReadFile(db.filePath)
	if err != nil {
		// File doesn't exist yet, start with empty database
		fmt.Printf("📁 No existing database found, starting fresh\n")
		return
	}

	
	var contentList []models.Content
	if err := json.Unmarshal(data, &contentList); err != nil {
		fmt.Printf("⚠️ Warning: Could not load content from disk: %v\n", err)
		return
	}
	
	// Convert slice to map
	for _, content := range contentList {
		db.content[content.ID] = content
	}
	
	fmt.Printf("✅ Loaded %d content items from disk\n", len(db.content))
}

// saveToDisk saves content to JSON file
func (db *SimplePersistentDB) saveToDisk() error {
	contentList := make([]models.Content, 0, len(db.content))
	for _, content := range db.content {
		contentList = append(contentList, content)
	}
	
	data, err := json.MarshalIndent(contentList, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal content: %v", err)
	}
	
	if err := os.WriteFile(db.filePath, data, 0644); err != nil {
		return fmt.Errorf("failed to write to disk: %v", err)
	}
	
	return nil
}

// CreateContent stores a new content item
func (db *SimplePersistentDB) CreateContent(content models.Content) error {
	db.content[content.ID] = content
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("⚠️ Warning: Failed to save to disk: %v\n", err)
		return err
	}
	
	fmt.Printf("💾 Saved content %s to disk\n", content.ID)
	return nil
}

// GetContent retrieves content by ID
func (db *SimplePersistentDB) GetContent(id string) (*models.Content, error) {
	if content, exists := db.content[id]; exists {
		return &content, nil
	}
	return nil, nil // Content not found
}

// GetAllContent retrieves all content with optional filtering
func (db *SimplePersistentDB) GetAllContent(limit, offset int, userID string) ([]models.Content, int, error) {
	var contentList []models.Content
	for _, content := range db.content {
		// Filter by user if specified
		if userID != "" && content.UserID != userID {
			continue
		}
		contentList = append(contentList, content)
	}
	
	total := len(contentList)
	
	// Apply pagination
	if offset >= total {
		return []models.Content{}, total, nil
	}
	
	end := offset + limit
	if end > total {
		end = total
	}
	
	return contentList[offset:end], total, nil
}

// UpdateContent updates an existing content item
func (db *SimplePersistentDB) UpdateContent(content models.Content) error {
	if _, exists := db.content[content.ID]; !exists {
		return fmt.Errorf("content not found")
	}
	
	content.UpdatedAt = time.Now()
	db.content[content.ID] = content
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("⚠️ Warning: Failed to save to disk: %v\n", err)
		return err
	}
	
	return nil
}

// DeleteContent removes content by ID
func (db *SimplePersistentDB) DeleteContent(id string) error {
	delete(db.content, id)
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("⚠️ Warning: Failed to save to disk: %v\n", err)
		return err
	}
	
	return nil
}

// GetContentCount returns the total number of content items
func (db *SimplePersistentDB) GetContentCount() (int, error) {
	return len(db.content), nil
}

// SearchContent searches content by prompt or style
func (db *SimplePersistentDB) SearchContent(query string, limit int) ([]models.Content, error) {
	var results []models.Content
	for _, content := range db.content {
		// Simple text search
		if contains(content.Prompt, query) || contains(content.Style, query) {
			results = append(results, content)
			if len(results) >= limit {
				break
			}
		}
	}
	
	return results, nil
}

// GetFilePath returns the database file path
func (db *SimplePersistentDB) GetFilePath() string {
	return db.filePath
}

// Backup creates a backup of the database
func (db *SimplePersistentDB) Backup() error {
	backupPath := fmt.Sprintf("%s.backup.%d", db.filePath, time.Now().Unix())
	
	contentList := make([]models.Content, 0, len(db.content))
	for _, content := range db.content {
		contentList = append(contentList, content)
	}
	
	data, err := json.MarshalIndent(contentList, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal content for backup: %v", err)
	}
	
	if err := os.WriteFile(backupPath, data, 0644); err != nil {
		return fmt.Errorf("failed to create backup: %v", err)
	}
	
	fmt.Printf("✅ Database backed up to: %s\n", backupPath)
	return nil
}

