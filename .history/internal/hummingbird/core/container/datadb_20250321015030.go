package container

import (
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

var DataDBClientInterfaceName = di.TypeInstanceToName((*interfaces.DataDBClient)(nil))

func DataDBClientFrom(get di.Get) interfaces.DataDBClient {
	return get(DataDBClientInterfaceName).(interfaces.DataDBClient)
}
