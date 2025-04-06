package container

import (
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/logger"
)

// LoggingClientInterfaceName 日志客户端名称
var LoggingClientInterfaceName = di.TypeInstanceToName((*logger.LoggingClient)(nil))

// LoggingClientFrom 获取日志客户端实例
func LoggingClientFrom(get di.Get) logger.LoggingClient {
	return get(LoggingClientInterfaceName).(logger.LoggingClient)
}
