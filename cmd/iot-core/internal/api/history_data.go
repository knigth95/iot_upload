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
			query += " AND timestamp <= ?"
			args = append(args, endTime)
		}
		if deviceID != "" {
			query += " AND device_id = ?"
			args = append(args, deviceID)
		}
		if sensorType != "" {
			query += " AND sensor_type = ?"
			args = append(args, sensorType)
		}

		// 添加分页
		query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
		args = append(args, pageSize, (page-1)*pageSize)

		// 执行查询
		rows, err := db.Query(query, args...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var results []HistoryDataResponse
		for rows.Next() {
			var data HistoryDataResponse
			if err := rows.Scan(
				&data.ID,
				&data.Timestamp,
				&data.DeviceID,
				&data.SensorType,
				&data.Value,
				&data.Status,
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			results = append(results, data)
		}

		c.JSON(http.StatusOK, gin.H{
			"data": results,
			"page": page,
			"page_size": pageSize,
		})
	}
}

func getDeviceList(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT DISTINCT device_id FROM sensor_readings")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var devices []string
		for rows.Next() {
			var device string
			if err := rows.Scan(&device); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			devices = append(devices, device)
		}

		c.JSON(http.StatusOK, gin.H{"devices": devices})
	}
}

func getSensorTypes(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT DISTINCT sensor_type FROM sensor_readings")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var types []string
		for rows.Next() {
			var sensorType string
			if err := rows.Scan(&sensorType); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			types = append(types, sensorType)
		}

		c.JSON(http.StatusOK, gin.H{"sensor_types": types})
	}
}