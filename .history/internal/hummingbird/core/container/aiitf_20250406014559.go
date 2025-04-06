package container

import (
	"iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

// AI服务名称
var AIApplicationName = di.TypeInstanceToName((*interfaces.AIApplication)(nil))

// 获取AI服务实例
func GetAIApplicationFrom(dic *di.Container) interfaces.AIApplication {
	return dic.Get(AIApplicationName).(interfaces.AIApplication)
}
