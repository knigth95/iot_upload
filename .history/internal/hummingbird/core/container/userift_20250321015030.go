package container

import (
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

// UserItfName
var UserItfName = di.TypeInstanceToName((*interfaces.UserItf)(nil))

// UserItfFrom
func UserItfFrom(get di.Get) interfaces.UserItf {
	return get(UserItfName).(interfaces.UserItf)
}
