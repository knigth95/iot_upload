package api

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type HistoryDataResponse struct {
	ID        int64     `json:"id"`
	Timestamp time.Time `json:"timestamp"`
	DeviceID  string    `json:"device_id"`
	SensorType string   `json:"sensor_type"`
	Value     float64   `json:"value"`
	Status    string    `json:"status"`
}

func RegisterHistoryDataRoutes(r *gin.Engine, db *sql.DB) {
	rg := r.Group("/api/v1/history")
	{
		rg.GET("/data", getHistoryData(db))
		rg.GET("/devices", getDeviceList(db))
		rg.GET("/sensor-types", getSensorTypes(db))
	}
}

func getHistoryData(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 解析查询参数
		startTime := c.Query("start_time")
		endTime := c.Query("end_time")
		deviceID := c.Query("device_id")
		sensorType := c.Query("sensor_type")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "100"))

		// 构建查询
		query := `SELECT id, timestamp, device_id, sensor_type, value, status 
				  FROM sensor_readings WHERE 1=1`
		args := []interface{}{}

		if startTime != "" {
			query += " AND timestamp >= ?"
			args = append(args, startTime)
		}
		if endTime != "" {
