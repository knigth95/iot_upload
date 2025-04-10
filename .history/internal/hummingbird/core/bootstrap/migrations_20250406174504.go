package bootstrap

import (
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/models"
	"iot_pj/internal/pkg/di"

	"gorm.io/gorm"
)

// 数据库迁移
func MigrateAITables(dic *di.Container) error {
	dbClient := container.DBClientFrom(func(name string) interface{} {
		return dic.Get(name)
	})
	db := dbClient.GetDBInstance()

	// 自动迁移AI相关表
	err := db.AutoMigrate(
		&models.AIRecommendation{},
		&models.AIQA{},
	)

	return err
}

// 初始化AI表数据
func InitAIData(db *gorm.DB) error {
	// 创建示例AI建议数据
	recommendations := []models.AIRecommendation{
		{
			Title:      "温度传感器-001-温度",
			Content:    "温度超过安全阈值，建议检查冷却系统",
			RiskLevel:  "high",
			DeviceID:   "device-001",
			PropertyID: "temperature",
		},
		{
			Title:      "湿度传感器-002-湿度",
			Content:    "湿度波动较大，建议检查密封性",
			RiskLevel:  "medium",
			DeviceID:   "device-002",
			PropertyID: "humidity",
		},
		{
			Title:      "压力传感器-003-压力",
			Content:    "压力稳定，建议保持当前维护频率",
			RiskLevel:  "low",
			DeviceID:   "device-003",
			PropertyID: "pressure",
		},
	}

	// 批量插入示例数据
	if err := db.Create(&recommendations).Error; err != nil {
		return err
	}

	return nil
}
