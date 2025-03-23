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
package route

import (
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/i18n"
	"iot_pj/internal/pkg/middleware"

	
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func LoadRestRoutes(r *gin.Engine, dic *di.Container) {
	// add pprof
	pprof.Register(r)

	r.Use(i18n.I18nHandlerGin())
	r.Use(middleware.CorrelationHeader())

	// load gateway router
	RegisterGateway(r, dic)
	// load open api
	RegisterOpenApi(r, dic)

	authGroup := r.Group("/api")
    {
        authGroup.POST("/register", authHandler.Register) // 新增路由
    }
}
