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
