package database

import (
	"sync"
	"time"

	"licenz-backend/models"
)

// MemoryDB provides in-memory storage for development and testing
type MemoryDB struct {
	content map[string]models.Content
	mutex   sync.RWMutex
}

// NewMemoryDB creates a new in-memory database instance
func NewMemoryDB() *MemoryDB {
	return &MemoryDB{
		content: make(map[string]models.Content),
	}
}

// CreateContent stores a new content item
func (db *MemoryDB) CreateContent(content models.Content) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	db.content[content.ID] = content
	return nil
}

// GetContent retrieves content by ID
func (db *MemoryDB) GetContent(id string) (*models.Content, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	if content, exists := db.content[id]; exists {
		return &content, nil
	}
	return nil, nil // Content not found
}

// GetAllContent retrieves all content with optional filtering
func (db *MemoryDB) GetAllContent(limit, offset int, userID string) ([]models.Content, int, error) {
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
func (db *MemoryDB) UpdateContent(content models.Content) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	if _, exists := db.content[content.ID]; !exists {
		return nil // Content not found
	}
	
	content.UpdatedAt = time.Now()
	db.content[content.ID] = content
	return nil
}

// DeleteContent removes content by ID
func (db *MemoryDB) DeleteContent(id string) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()
	
	delete(db.content, id)
	return nil
}

// GetContentCount returns the total number of content items
func (db *MemoryDB) GetContentCount() (int, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()
	
	return len(db.content), nil
}

// SearchContent searches content by prompt or style
func (db *MemoryDB) SearchContent(query string, limit int) ([]models.Content, error) {
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

// contains is a helper function for simple text search
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || 
		(len(s) > len(substr) && (s[:len(substr)] == substr || 
		s[len(s)-len(substr):] == substr || 
		containsSubstring(s, substr))))
}

// containsSubstring checks if substr exists anywhere in s
func containsSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
