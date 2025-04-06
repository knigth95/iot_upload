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
package core

import (
	"context"
	"iot_pj/internal/hummingbird/core/bootstrap"
	"iot_pj/internal/hummingbird/core/bootstrap/database"
	"iot_pj/internal/hummingbird/core/config"
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/hummingbird/core/initialize"
	"iot_pj/internal/hummingbird/core/route"
	"iot_pj/internal/pkg/bootstrap"
	"iot_pj/internal/pkg/constants"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/flags"
	"iot_pj/internal/pkg/handlers"
	pkghandlers "iot_pj/internal/pkg/handlers"
	"iot_pj/internal/pkg/startup"
	"os"

	"github.com/gin-gonic/gin"
)

func Main(ctx context.Context, cancel context.CancelFunc, router *gin.Engine) {
	f := flags.New()
	f.Parse(os.Args[1:])

	configuration := &config.ConfigurationStruct{}
	di.GContainer = di.NewContainer(di.ServiceConstructorMap{
		container.ConfigurationName: func(get di.Get) interface{} {
			return configuration
		},
	})
	startupTimer := startup.NewStartUpTimer(constants.CoreServiceKey)

	bootstrap.Run(
		ctx,
		cancel,
		f,
		constants.CoreServiceKey,
		constants.ConfigStemCore+constants.ConfigMajorVersion,
		configuration,
		startupTimer,
		di.GContainer,
		[]handlers.BootstrapHandler{
			database.NewDatabase(configuration).BootstrapHandler,
			initialize.NewBootstrap(router).BootstrapHandler,
			pkghandlers.NewHttpServer(router, true).BootstrapHandler,
			route.NewWebBootstrap().BootstrapHandler,
		})
}
