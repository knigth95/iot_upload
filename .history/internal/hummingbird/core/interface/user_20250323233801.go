package interfaces

import (
	"context"


	"gitlab.com/tedge/edgex/internal/dtos" // 修改为绝对路径
)

type UserItf interface {
	UserLogin(ctx context.Context, req dtos.LoginRequest) (res dtos.LoginResponse, err error)
	InitInfo() (res dtos.InitInfoResponse, err error)
	InitPassword(ctx context.Context, req dtos.InitPasswordRequest) error
	UpdateUserPassword(ctx context.Context, username string, req dtos.UpdatePasswordRequest) error
	OpenApiUserLogin(ctx context.Context, req dtos.LoginRequest) (res *dtos.TokenDetail, err error)
	CreateTokenDetail(userName string) (*dtos.TokenDetail, error)
	InitJwtKey()
	// 在UserItf接口中添加
	UserRegister(ctx context.Context, req dtos.RegisterRequest) error
}
