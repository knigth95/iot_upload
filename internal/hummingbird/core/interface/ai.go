package interfaces

import (
	"iot_pj/internal/dtos"
	"iot_pj/internal/models"
)

// AI服务接口
type AIApplication interface {
	// AI建议相关
	GetAIRecommendations(offset, limit int) ([]models.AIRecommendation, uint32, error)
	GetAIRecommendationByID(id int) (models.AIRecommendation, error)
	CreateAIRecommendation(req dtos.AIRecommendationRequest) (models.AIRecommendation, error)
	GenerateAIRecommendation(deviceID, propertyID string) (models.AIRecommendation, error)

	// AI问答相关
	GetAIQAHistory(offset, limit int, userID string) ([]models.AIQA, uint32, error)
	GetAIQAByID(id int) (models.AIQA, error)
	CreateAIQA(req dtos.AIQARequest, userID string) (models.AIQA, error)
}
