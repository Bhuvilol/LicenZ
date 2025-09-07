package database

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"licenz-backend/models"
)

// PersistentDB provides persistent storage for content
type PersistentDB struct {
	content map[string]models.Content
	mutex   sync.RWMutex
	filePath string
}

// NewPersistentDB creates a new persistent database instance
func NewPersistentDB() *PersistentDB {
	db := &PersistentDB{
		content:  make(map[string]models.Content),
		filePath: "data/content.json",
	}
	
	// Load existing data
	db.loadFromDisk()
	
	// Ensure data directory exists
	os.MkdirAll(filepath.Dir(db.filePath), 0755)
	
	return db
}

// loadFromDisk loads content from JSON file
func (db *PersistentDB) loadFromDisk() {
	data, err := os.ReadFile(db.filePath)
	if err != nil {
		// File doesn't exist yet, start with empty database
		return
	}
	
	var contentList []models.Content
	if err := json.Unmarshal(data, &contentList); err != nil {
		fmt.Printf("Warning: Could not load content from disk: %v\n", err)
		return
	}
	
	// Convert slice to map
	for _, content := range contentList {
		db.content[content.ID] = content
	}
	
	fmt.Printf("✅ Loaded %d content items from disk\n", len(db.content))
}

// saveToDisk saves content to JSON file
func (db *PersistentDB) saveToDisk() error {
	// Create a copy of the content map to avoid deadlock
	db.mutex.RLock()
	contentList := make([]models.Content, 0, len(db.content))
	for _, content := range db.content {
		contentList = append(contentList, content)
	}
	db.mutex.RUnlock()
	
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
func (db *PersistentDB) CreateContent(content models.Content) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	db.content[content.ID] = content
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("Warning: Failed to save to disk: %v\n", err)
	}
	
	return nil
}

// GetContent retrieves content by ID
func (db *PersistentDB) GetContent(id string) (*models.Content, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	if content, exists := db.content[id]; exists {
		return &content, nil
	}
	return nil, nil // Content not found
}

// GetAllContent retrieves all content with optional filtering
func (db *PersistentDB) GetAllContent(limit, offset int, userID string) ([]models.Content, int, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
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
func (db *PersistentDB) UpdateContent(content models.Content) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	if _, exists := db.content[content.ID]; !exists {
		return nil // Content not found
	}
	
	content.UpdatedAt = time.Now()
	db.content[content.ID] = content
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("Warning: Failed to save to disk: %v\n", err)
	}
	
	return nil
}

// DeleteContent removes content by ID
func (db *PersistentDB) DeleteContent(id string) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	delete(db.content, id)
	
	// Save to disk
	if err := db.saveToDisk(); err != nil {
		fmt.Printf("Warning: Failed to save to disk: %v\n", err)
	}
	
	return nil
}

// GetContentCount returns the total number of content items
func (db *PersistentDB) GetContentCount() (int, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	return len(db.content), nil
}

// SearchContent searches content by prompt or style
func (db *PersistentDB) SearchContent(query string, limit int) ([]models.Content, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	var results []models.Content
	for _, content := range db.content {
		// Simple text search (can be enhanced later)
		if contains(content.Prompt, query) || contains(content.Style, query) {
			results = append(results, content)
			if len(results) >= limit {
				break
			}
		}
	}
	
	return results, nil
}

// Note: contains and containsSubstring functions are defined in memory.go

// GetFilePath returns the database file path
func (db *PersistentDB) GetFilePath() string {
	return db.filePath
}

// Backup creates a backup of the database
func (db *PersistentDB) Backup() error {
	backupPath := fmt.Sprintf("%s.backup.%d", db.filePath, time.Now().Unix())
	
	db.mutex.RLock()
	contentList := make([]models.Content, 0, len(db.content))
	for _, content := range db.content {
		contentList = append(contentList, content)
	}
	db.mutex.RUnlock()
	
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
