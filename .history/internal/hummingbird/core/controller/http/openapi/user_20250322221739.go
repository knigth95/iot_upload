/*******************************************************************************
 * Copyright 2017.
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

package openapi

import (
	buildInErrors "errors"

	"iot_pj/internal/dtos"
	"iot_pj/internal/pkg/errort"
	jwt2 "iot_pj/internal/tools/jwt"
	"iot_pj/internal/tools/openapihelper"

	"github.com/gin-gonic/gin"
)

func (ctl *controller) Login(c *gin.Context) {
	var lc = ctl.lc
	var req dtos.LoginRequest
	if err := c.ShouldBind(&req); err != nil {
		lc.Error(err.Error())
		openapihelper.ReaderFail(c, errort.ParamsError)
		return
	}
	tokenDetail, edgeXErr := ctl.getUserApp().OpenApiUserLogin(c, req)
	if edgeXErr != nil {
		lc.Error(edgeXErr.Error())
		openapihelper.ReaderFail(c, errort.OpenApiErrorCode(errort.NewCommonEdgeXWrapper(edgeXErr).Code()))
		return
	}
	result := struct {
		AccessToken  string `json:"access_token"`
		ExpireTime   int64  `json:"expire"`
		RefreshToken string `json:"refresh_token"`
	}{
		AccessToken:  tokenDetail.AccessToken,
		ExpireTime:   tokenDetail.AtExpires,
		RefreshToken: tokenDetail.RefreshToken,
	}
	openapihelper.ReaderSuccess(c, result)
}

func (ctl *controller) RefreshToken(c *gin.Context) {
	refreshToken := c.Param("refreshToken")
	if refreshToken == "" {
		openapihelper.ReaderFail(c, errort.TokenValid)
		return
	}
	jwt := jwt2.NewJWT(jwt2.RefreshKey)
	claim, err := jwt.ParseToken(refreshToken)
	if err != nil {
		switch {
		case buildInErrors.Is(err, jwt2.TokenExpired):
			openapihelper.ReaderFail(c, errort.TokenExpired)
		case buildInErrors.Is(err, jwt2.TokenInvalid):
			openapihelper.ReaderFail(c, errort.TokenValid)
		default:
			openapihelper.ReaderFail(c, errort.SystemErrorCode)
		}
		return
	}
	tokenDetail, err := ctl.getUserApp().CreateTokenDetail(claim.Username)
	if err != nil {
		openapihelper.ReaderFail(c, errort.SystemErrorCode)
		return
	}
	result := struct {
		AccessToken  string `json:"access_token"`
		ExpireTime   int64  `json:"expire"`
		RefreshToken string `json:"refresh_token"`
	}{
		AccessToken:  tokenDetail.AccessToken,
		ExpireTime:   tokenDetail.AtExpires,
		RefreshToken: tokenDetail.RefreshToken,
	}
	openapihelper.ReaderSuccess(c, result)
}
package openapi

import (
    "github.com/gin-gonic/gin"
    "iot_upload/internal/dtos"
    "iot_upload/internal/openapihelper"
    "iot_upload/internal/errort"
)

func (ctl *controller) Register(c *gin.Context) {
    var req dtos.RegisterRequest
    if err := c.ShouldBind(&req); err != nil {
        ctl.lc.Error(err.Error())
        openapihelper.ReaderFail(c, errort.ParamsError)
        return
    }

    // 这里应该实现将用户信息插入数据库的逻辑
    // 示例代码，假设存在一个 UserService 用于处理用户相关操作
    err := ctl.getUserApp().CreateUser(c, req)
    if err != nil {
        ctl.lc.Error(err.Error())
        openapihelper.ReaderFail(c, errort.OpenApiErrorCode(errort.NewCommonEdgeXWrapper(err).Code()))
        return
    }

    openapihelper.ReaderSuccess(c, "注册成功")
}