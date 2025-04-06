package constants

// AI风险等级
type AIRiskLevel string

const (
	AIRiskLevelHigh   AIRiskLevel = "high"
	AIRiskLevelMedium AIRiskLevel = "medium"
	AIRiskLevelLow    AIRiskLevel = "low"
)

// AI模型类型
type AIModelType string

const (
	AIModelDeepSeek AIModelType = "deepseek-ai/DeepSeek-V3"
	AIModelQwen     AIModelType = "Qwen/QwQ-32B"
)
