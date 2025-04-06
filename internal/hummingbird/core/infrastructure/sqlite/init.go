package sqlite

import (
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB 初始化数据库连接
func InitDB(dbInstance *gorm.DB) {
	db = dbInstance
}

// GetDB 获取数据库连接
func GetDB() *gorm.DB {
	return db
}
