/*******************************************************************************
 * Copyright 2017 Dell Inc.
 * Copyright (c) 2019 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/
package initialize

import (
	"context"
	"iot_pj/internal/dtos"
	"iot_pj/internal/hummingbird/core/application"
	"iot_pj/internal/hummingbird/core/application/alertcentreapp"
	"iot_pj/internal/hummingbird/core/application/categorytemplate"
	"iot_pj/internal/hummingbird/core/application/dataresource"
	"iot_pj/internal/hummingbird/core/application/deviceapp"
	"iot_pj/internal/hummingbird/core/application/dmi"
	"iot_pj/internal/hummingbird/core/application/docapp"
	"iot_pj/internal/hummingbird/core/application/driverapp"
	"iot_pj/internal/hummingbird/core/application/driverserviceapp"
	"iot_pj/internal/hummingbird/core/application/homepageapp"
	"iot_pj/internal/hummingbird/core/application/languagesdkapp"
	"iot_pj/internal/hummingbird/core/application/messageapp"
	"iot_pj/internal/hummingbird/core/application/messagestore"
	"iot_pj/internal/hummingbird/core/application/monitor"
	"iot_pj/internal/hummingbird/core/application/persistence"
	"iot_pj/internal/hummingbird/core/application/productapp"
	"iot_pj/internal/hummingbird/core/application/quicknavigationapp"
	"iot_pj/internal/hummingbird/core/application/ruleengine"
	"iot_pj/internal/hummingbird/core/application/scene"
	"iot_pj/internal/hummingbird/core/application/thingmodelapp"
	"iot_pj/internal/hummingbird/core/application/thingmodeltemplate"
	"iot_pj/internal/hummingbird/core/application/timerapp"
	"iot_pj/internal/hummingbird/core/application/unittemplate"
	"iot_pj/internal/hummingbird/core/application/userapp"
	"iot_pj/internal/hummingbird/core/config"
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/hummingbird/core/controller/rpcserver/driverserver"
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/hummingbird/core/route"
	"iot_pj/internal/pkg/constants"
	pkgContainer "iot_pj/internal/pkg/container"
	"iot_pj/internal/pkg/cos"
	"iot_pj/internal/pkg/crontab"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/handlers"
	"iot_pj/internal/pkg/logger"
	"iot_pj/internal/pkg/startup"
	"iot_pj/internal/pkg/timer/jobrunner"
	"iot_pj/internal/tools/ekuiperclient"
	"iot_pj/internal/tools/hpcloudclient"
	"iot_pj/internal/tools/notify/sms"
	"iot_pj/internal/tools/streamclient"
	"sync"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Bootstrap contains references to dependencies required by the BootstrapHandler.
type Bootstrap struct {
	router *gin.Engine
}

// NewBootstrap is a factory method that returns an initialized Bootstrap receiver struct.
func NewBootstrap(router *gin.Engine) *Bootstrap {
	return &Bootstrap{
		router: router,
	}
}

func (b *Bootstrap) BootstrapHandler(ctx context.Context, wg *sync.WaitGroup, _ startup.Timer, dic *di.Container) bool {

	configuration := container.ConfigurationFrom(dic.Get)
	lc := pkgContainer.LoggingClientFrom(dic.Get)

	if !b.initClient(ctx, wg, dic, configuration, lc) {
		return false
	}

	if !initApp(ctx, configuration, dic) {
		return false
	}

	// rpc 服务
	if ok := initRPCServer(ctx, wg, dic); !ok {
		return false
	}
	lc.Infof("init rpc server")

	// http 路由
	route.LoadRestRoutes(b.router, dic)

	// 业务逻辑
	application.InitSchedule(dic, lc)

	wg.Add(1)
	go func() {
		defer wg.Done()

		<-ctx.Done()
		crontab.Stop()
	}()

	return true
}

func (b *Bootstrap) initClient(ctx context.Context, wg *sync.WaitGroup, dic *di.Container, configuration *config.ConfigurationStruct, lc logger.LoggingClient) bool {

	appMode, err := dmi.New(dic, ctx, wg, dtos.DriverConfigManage{
		DockerManageConfig: dtos.DockerManageConfig{
			ContainerConfigPath: configuration.DockerManage.ContainerConfigPath,
			DockerApiVersion:    configuration.DockerManage.DockerApiVersion,
			DockerRunMode:       constants.NetworkModeHost,
			DockerSelfName:      constants.CoreServiceName,
			Privileged:          configuration.DockerManage.Privileged,
		},
	})
	if err != nil {
		lc.Error("create driver model interface error %v", err)
		return false
	}

	dic.Update(di.ServiceConstructorMap{
		interfaces.DriverModelInterfaceName: func(get di.Get) interface{} {
			return appMode
		},
	})
	homePageApp := homepageapp.NewHomePageApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.HomePageAppName: func(get di.Get) interface{} {
			return homePageApp
		},
	})

	languageApp := languagesdkapp.NewLanguageSDKApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.LanguageSDKAppName: func(get di.Get) interface{} {
			return languageApp
		},
	})

	monitorApp := monitor.NewMonitor(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.MonitorAppName: func(get di.Get) interface{} {
			return monitorApp
		},
	})

	streamClient := streamclient.NewStreamClient(lc)
	dic.Update(di.ServiceConstructorMap{
		pkgContainer.StreamClientName: func(get di.Get) interface{} {
			return streamClient
		},
	})

	driverApp := driverapp.NewDriverApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.DriverAppName: func(get di.Get) interface{} {
			return driverApp
		},
	})

	driverServiceApp := driverserviceapp.NewDriverServiceApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.DriverServiceAppName: func(get di.Get) interface{} {
			return driverServiceApp
		},
	})

	productApp := productapp.NewProductApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.ProductAppName: func(get di.Get) interface{} {
			return productApp
		},
	})

	thingModelApp := thingmodelapp.NewThingModelApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.ThingModelAppName: func(get di.Get) interface{} {
			return thingModelApp
		},
	})

	deviceApp := deviceapp.NewDeviceApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.DeviceItfName: func(get di.Get) interface{} {
			return deviceApp
		},
	})

	alertCentreApp := alertcentreapp.NewAlertCentreApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.AlertRuleAppName: func(get di.Get) interface{} {
			return alertCentreApp
		},
	})

	ruleEngineApp := ruleengine.NewRuleEngineApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.RuleEngineAppName: func(get di.Get) interface{} {
			return ruleEngineApp
		},
	})

	sceneApp := scene.NewSceneApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.SceneAppName: func(get di.Get) interface{} {
			return sceneApp
		},
	})

	conJobApp := timerapp.NewCronTimer(ctx, jobrunner.NewJobRunFunc(dic), dic)
	dic.Update(di.ServiceConstructorMap{
		container.ConJobAppName: func(get di.Get) interface{} {
			return conJobApp
		},
	})

	dataResourceApp := dataresource.NewDataResourceApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.DataResourceName: func(get di.Get) interface{} {
			return dataResourceApp
		},
	})

	cosApp := cos.NewCos("", "", "")
	dic.Update(di.ServiceConstructorMap{
		container.CosAppName: func(get di.Get) interface{} {
			return cosApp
		},
	})

	categoryTemplateApp := categorytemplate.NewCategoryTemplateApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.CategoryTemplateAppName: func(get di.Get) interface{} {
			return categoryTemplateApp
		},
	})

	unitTemplateApp := unittemplate.NewUnitTemplateApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.UnitTemplateAppName: func(get di.Get) interface{} {
			return unitTemplateApp
		},
	})

	docsApp := docapp.NewDocsApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.DocsAppName: func(get di.Get) interface{} {
			return docsApp
		},
	})

	quickNavigationApp := quicknavigationapp.NewQuickNavigationApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.QuickNavigationAppName: func(get di.Get) interface{} {
			return quickNavigationApp
		},
	})

	thingModelTemplateApp := thingmodeltemplate.NewThingModelTemplateApp(ctx, dic)
	dic.Update(di.ServiceConstructorMap{
		container.ThingModelTemplateAppName: func(get di.Get) interface{} {
			return thingModelTemplateApp
		},
	})

	hpcloudServiceApp := hpcloudclient.NewHpcloud(lc)
	dic.Update(di.ServiceConstructorMap{
		container.HpcServiceAppName: func(get di.Get) interface{} {
			return hpcloudServiceApp
		},
	})

	smsServiceApp := sms.NewSmsClient(lc, "",
		"", "")
	dic.Update(di.ServiceConstructorMap{
		container.SmsServiceAppName: func(get di.Get) interface{} {
			return smsServiceApp
		},
	})

	limitMethodApp := application.NewLimitMethodConf(*configuration)
	dic.Update(di.ServiceConstructorMap{
		pkgContainer.LimitMethodConfName: func(get di.Get) interface{} {
			return limitMethodApp
		},
	})

	ekuiperApp := ekuiperclient.New(configuration.Clients["Ekuiper"].Address(), lc)
	dic.Update(di.ServiceConstructorMap{
		container.EkuiperAppName: func(get di.Get) interface{} {
			return ekuiperApp
		},
	})

	persistItf := persistence.NewPersistApp(dic)
	dic.Update(di.ServiceConstructorMap{
		container.PersistItfName: func(get di.Get) interface{} {
			return persistItf
		},
	})

	userItf := userapp.New(dic)
	dic.Update(di.ServiceConstructorMap{
		container.UserItfName: func(get di.Get) interface{} {
			return userItf
		},
	})

	messageItf := messageapp.NewMessageApp(dic, configuration.Clients["Ekuiper"].Address())
	dic.Update(di.ServiceConstructorMap{
		container.MessageItfName: func(get di.Get) interface{} {
			return messageItf
		},
	})

	messageStoreItf := messagestore.NewMessageStore(dic)
	dic.Update(di.ServiceConstructorMap{
		container.MessageStoreItfName: func(get di.Get) interface{} {
			return messageStoreItf
		},
	})
	return true
}

func initRPCServer(ctx context.Context, wg *sync.WaitGroup, dic *di.Container) bool {
	lc := pkgContainer.LoggingClientFrom(dic.Get)
	_, err := handlers.NewRPCServer(ctx, wg, dic, func(serve *grpc.Server) {
		driverserver.RegisterRPCService(lc, dic, serve)
		reflection.Register(serve)
	})
	if err != nil {
		lc.Errorf("initRPCServer err:%v", err)
		return false
	}
	return true
}
