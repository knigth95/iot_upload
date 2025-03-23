package gateway

import (
	"fmt"
	"iot_pj/internal/dtos"
	"iot_pj/internal/pkg/constants"
	"iot_pj/internal/pkg/errort"
	"iot_pj/internal/pkg/httphelper"
	"iot_pj/internal/pkg/middleware"

	"github.com/gin-gonic/gin"
	//"iot_pj/internal/pkg/middleware"
	//_ "iot_pj/cmd/edge-core/docs"  // 千万不要忘了导入把你上一步生成的docs
	//gs "github.com/swaggo/gin-swagger"
	//"github.com/swaggo/gin-swagger/swaggerFiles"
	"gitlab.com/tedge/edgex/internal/dtos" // 修改为绝对路径
    "gitlab.com/tedge/edgex/internal/pkg/constants"
)



// @Tags    用户系统
// @Summary 用户登录
// @Produce json
// @Param   login_request body     dtos.LoginRequest true "用户登录参数"
// @Success 200           {object} httphelper.CommonResponse
// @Router  /api/v1/auth/login [post]
func (ctl *controller) Login(c *gin.Context) {
	lc := ctl.lc
	var req dtos.LoginRequest
	if err := c.ShouldBind(&req); err != nil {
		httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultReqParamsError, err), c.Writer, lc)
		return
	}
	res, edgeXErr := ctl.getUserApp().UserLogin(c, req)
	if edgeXErr != nil {
		httphelper.RenderFail(c, edgeXErr, c.Writer, lc)
		return
	}
	//fmt.Println("res:", res)
	httphelper.ResultSuccess(res, c.Writer, lc)
}

// @Tags    用户系统
// @Summary 获取网关账号是否初始化
// @Produce json
// @Success 200 {object} httphelper.CommonResponse
// @Router  /api/v1/auth/initInfo [get]
func (ctl *controller) InitInfo(c *gin.Context) {
	lc := ctl.lc
	res, edgeXErr := ctl.getUserApp().InitInfo()
	if edgeXErr != nil {
		httphelper.RenderFail(c, edgeXErr, c.Writer, lc)
		return
	}

	httphelper.ResultSuccess(res, c.Writer, lc)
}

// @Tags    用户系统
// @Summary 密码初始化
// @Produce json
// @Param   init_password_request body     dtos.InitPasswordRequest true "密码初始化参数"
// @Success 200                   {object} httphelper.CommonResponse
// @Router  /api/v1/auth/init-password [post]
func (ctl *controller) InitPassword(c *gin.Context) {
	lc := ctl.lc
	var req dtos.InitPasswordRequest
	if err := c.ShouldBind(&req); err != nil {
		httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultReqParamsError, err), c.Writer, lc)
		return
	}

	edgeXErr := ctl.getUserApp().InitPassword(c, req)
	if edgeXErr != nil {
		httphelper.RenderFail(c, edgeXErr, c.Writer, lc)
		return
	}

	httphelper.ResultSuccess(nil, c.Writer, lc)
}

// @Tags    用户系统
// @Summary 密码修改
// @Produce json
// @Param   request body     dtos.UpdatePasswordRequest true "密码修改参数"
// @Success 200     {object} httphelper.CommonResponse
// @Router  /api/v1/auth/password [put]
func (ctl *controller) UpdatePassword(c *gin.Context) {
	lc := ctl.lc
	var req dtos.UpdatePasswordRequest
	if err := c.ShouldBind(&req); err != nil {
		httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultReqParamsError, err), c.Writer, lc)
		return
	}

	// 获取登录用户信息
	value, ok := c.Get(constants.JwtParsedInfo)
	if !ok {
		err := fmt.Errorf("token is invalid")
		httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultTokenPermission, err), c.Writer, lc)
		return
	}
	claim, ok := value.(*middleware.CustomClaims)
	if !ok {
		err := fmt.Errorf("request token is invalid")
		httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultTokenPermission, err), c.Writer, lc)
		return
	}

	edgeXErr := ctl.getUserApp().UpdateUserPassword(c, claim.Username, req)
	if edgeXErr != nil {
		httphelper.RenderFail(c, edgeXErr, c.Writer, lc)
		return
	}

	httphelper.ResultSuccess(nil, c.Writer, lc)
}

// 在user.go中添加
func (ctl *controller) Register(c *gin.Context) {
    lc := ctl.lc
    var req dtos.RegisterRequest
    if err := c.ShouldBind(&req); err != nil {
        httphelper.RenderFail(c, errort.NewCommonErr(errort.DefaultReqParamsError, err), c.Writer, lc)
        return
    }

    if err := ctl.getUserApp().UserRegister(c, req); err != nil {
        httphelper.RenderFail(c, err, c.Writer, lc)
        return
    }
    
    httphelper.ResultSuccess(nil, c.Writer, lc)
}
