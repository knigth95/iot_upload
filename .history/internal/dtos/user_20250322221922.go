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
    Username    string `json:"username" binding:"required"`
    Password    string `json:"password" binding:"required"`
    Lang        string `json:"lang" binding:"required"`
    GatewayKey  string `json:"gateway_key"`
    OpenApiKey  string `json:"open_api_key"`
    Email       string `json:"email"`
}

// ToUser 将注册请求转换为 User 模型
func (r *RegisterRequest) ToUser() models.User {
    return models.User{
        Username:   r.Username,
        Password:   r.Password,
        Lang:       r.Lang,
        GatewayKey: r.GatewayKey,
        OpenApiKey: r.OpenApiKey,
        Email:      r.Email,
    }
}