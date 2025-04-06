package interfaces

import (
	"iot_pj/internal/models"
)

// DeviceApplication 设备应用接口
type DeviceApplication interface {
	// GetDeviceByID 根据ID获取设备
	GetDeviceByID(id string) (models.Device, error)
}
