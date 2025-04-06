package mysql

import (
	"iot_pj/internal/models"
)

// 获取AI建议列表
func (c *Client) GetAIRecommendations(offset, limit int) (recommendations []models.AIRecommendation, total uint32, err error) {
	db := c.Pool

	// 获取总数
	var count int64
	if err = db.Model(&models.AIRecommendation{}).Count(&count).Error; err != nil {
		return nil, 0, err
	}

	// 获取分页数据
	if err = db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&recommendations).Error; err != nil {
		return nil, 0, err
	}

	return recommendations, uint32(count), nil
}

// 根据ID获取AI建议
func (c *Client) GetAIRecommendationByID(id int) (recommendation models.AIRecommendation, err error) {
	db := c.Pool

	if err = db.Where("id = ?", id).First(&recommendation).Error; err != nil {
		return models.AIRecommendation{}, err
	}

	return recommendation, nil
}

// 创建AI建议
func (c *Client) CreateAIRecommendation(recommendation models.AIRecommendation) (models.AIRecommendation, error) {
	db := c.Pool

	if err := db.Create(&recommendation).Error; err != nil {
		return models.AIRecommendation{}, err
	}

	return recommendation, nil
}

// 获取AI问答历史
func (c *Client) GetAIQAHistory(offset, limit int, userID string) (qaList []models.AIQA, total uint32, err error) {
	db := c.Pool

	// 构建查询条件
	query := db.Model(&models.AIQA{})
	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}

	// 获取总数
	var count int64
	if err = query.Count(&count).Error; err != nil {
		c.loggingClient.Error(err.Error())
		return nil, 0, err
	}

	// 获取分页数据
	if err = query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&qaList).Error; err != nil {
		c.loggingClient.Error(err.Error())
		return nil, 0, err
	}

	return qaList, uint32(count), nil
}

// 根据ID获取AI问答
func (c *Client) GetAIQAByID(id int) (qa models.AIQA, err error) {
	db := c.Pool

	if err = db.Where("id = ?", id).First(&qa).Error; err != nil {
		c.loggingClient.Error(err.Error())
		return models.AIQA{}, err
	}

	return qa, nil
}

// 创建AI问答
func (c *Client) CreateAIQA(qa models.AIQA) (models.AIQA, error) {
	db := c.Pool

	if err := db.Create(&qa).Error; err != nil {
		c.loggingClient.Error(err.Error())
		return models.AIQA{}, err
	}

	return qa, nil
}
