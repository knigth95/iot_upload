package dtos

// RegisterRequest 注册请求结构体
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// RegisterResponse 注册响应结构体
type RegisterResponse struct {
    UserID    string `json:"userId"`
    Username  string `json:"username"`
    Email     string `json:"email"`
    CreatedAt int64  `json:"createdAt"`
}