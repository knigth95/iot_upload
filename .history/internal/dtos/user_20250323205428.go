package dtos

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UpdatePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required"`
}

type UpdateLangRequest struct {
	Lang string `json:"lang" binding:"required"`
}

type InitPasswordRequest struct {
	NewPassword string `json:"newPassword" binding:"required"`
}

/************** Response **************/

type LoginResponse struct {
	User      UserResponse `json:"user"`
	Token     string       `json:"token"`
	ExpiresAt int64        `json:"expiresAt"`
}

type UserResponse struct {
	Username string `json:"username"`
	Lang     string `json:"lang"`
}

type InitInfoResponse struct {
	IsInit bool `json:"isInit"`
}

type TokenDetail struct {
	AccessId     string `json:"access_id"`
	RefreshId    string `json:"refresh_id"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	AtExpires    int64  `json:"at_expires"`
	RtExpires    int64  `json:"rt_expires"`
}

// RegisterRequest 注册请求结构体
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}


// internal/hummingbird/core/controller/http/gateway/user.go
package gateway

import (
    "fmt"
    "iot_pj/internal/dtos"
    "iot_pj/internal/pkg/constants"
    "iot_pj/internal/pkg/errort"
    "iot_pj/internal/pkg/httphelper"
    "iot_pj/internal/pkg/middleware"

    "github.com/gin-gonic/gin"
)

// @Tags    用户系统
// @Summary 用户注册
// @Produce json
// @Param   register_request body     dtos.RegisterRequest true "用户注册参数"
// @Success 200           {object} httphelper.CommonResponse
// @Router  /api/v1/auth/register [post]
func (ctl *controller) Register(c *gin.Context) {
    lc := ctl.lc
    var req dtos.RegisterRequest
    if err := c.ShouldBind(&req); err != nil {
        httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultReqParamsError, err), c.Writer, lc)
        return
    }
    edgeXErr := ctl.getUserApp().RegisterUser(c, req)
    if edgeXErr != nil {
        httphelper.RenderFail(c, edgeXErr, c.Writer, lc)
        return
    }
    httphelper.ResultSuccess(nil, c.Writer, lc)
}