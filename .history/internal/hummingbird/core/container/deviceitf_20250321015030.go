package container

import (
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

// DeviceItfName
var DeviceItfName = di.TypeInstanceToName((*interfaces.DeviceItf)(nil))

// DeviceItfFrom
func DeviceItfFrom(get di.Get) interfaces.DeviceItf {
	return get(DeviceItfName).(interfaces.DeviceItf)
}
