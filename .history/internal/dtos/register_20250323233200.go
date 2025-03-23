package dtos
// RegisterResponse 注册响应结构体
type RegisterResponse struct {
    UserID    string `json:"userId"`
    Username  string `json:"username"`
    Email     string `json:"email"`
    CreatedAt int64  `json:"createdAt"`
}