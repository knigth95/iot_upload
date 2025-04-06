package bootstrap

import (
	"iot_pj/internal/hummingbird/core/application/aiapp"
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/pkg/di"
)

// 注册AI服务
func RegisterAIService(dic *di.Container) {
	dic.Update(di.ServiceConstructorMap{
		container.AIApplicationName: func(get di.Get) interface{} {
			return aiapp.NewAIApplication(dic)
		},
	})
}
