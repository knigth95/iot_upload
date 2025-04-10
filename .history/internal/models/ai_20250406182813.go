package models

import (
	"iot_pj/internal/pkg/constants"
)

// AI建议模型
type AIRecommendation struct {
	Timestamps `gorm:"embedded"`
	ID         int                      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title      string                   `json:"title" gorm:"type:string;size:255;comment:标题"`
	Content    string                   `json:"content" gorm:"type:text;comment:内容"`
	RiskLevel  constants.AIRiskLevel    `json:"risk_level" gorm:"type:string;size:50;comment:风险等级"`
	DeviceID   string                   `json:"device_id" gorm:"type:string;size:255;comment:设备ID"`
	PropertyID string                   `json:"property_id" gorm:"type:string;size:255;comment:属性ID"`
}

// 表名
func (a *AIRecommendation) TableName() string {
	return "ai_recommendation"
}

// AI问答记录模型
type AIQA struct {
	Timestamps `gorm:"embedded"`
	ID         int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Question   string `json:"question" gorm:"type:text;comment:问题"`
	Answer     string `json:"answer" gorm:"type:text;comment:回答"`
	Model      string `json:"model" gorm:"type:string;size:100;comment:模型名称"`
	Username   string `json:"username" gorm:"type:string;size:255;comment:用户名"`
}


// 表名
func (a *AIQA) TableName() string {
	return "ai_qa"
}
