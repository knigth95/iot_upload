package dtos

import (
	"time"
)

// AI建议请求参数
type AIRecommendationRequest struct {
	DeviceID   string    `json:"device_id,omitempty"`
	PropertyID string    `json:"property_id,omitempty"`
	StartTime  time.Time `json:"start_time,omitempty"`
	EndTime    time.Time `json:"end_time,omitempty"`
}

// AI建议响应
type AIRecommendationResponse struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	RiskLevel string    `json:"risk_level"` // high, medium, low
	Timestamp time.Time `json:"timestamp"`
}

// AI问答请求参数
type AIQARequest struct {
	Question    string  `json:"question"`
	Model       string  `json:"model,omitempty"`
	Temperature float64 `json:"temperature,omitempty"`
	MaxTokens   int     `json:"max_tokens,omitempty"`
}

// AI问答响应
type AIQAResponse struct {
	ID        int       `json:"id"`
	Question  string    `json:"question"`
	Answer    string    `json:"answer"`
	Model     string    `json:"model"`
	Timestamp time.Time `json:"timestamp"`
}

// AI历史记录查询请求
type AIHistoryRequest struct {
	Type      string    `json:"type"` // recommendation, qa
	StartTime time.Time `json:"start_time,omitempty"`
	EndTime   time.Time `json:"end_time,omitempty"`
	Limit     int       `json:"limit,omitempty"`
	Offset    int       `json:"offset,omitempty"`
}
