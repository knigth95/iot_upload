type UserItf interface {
    SendVerificationCode(ctx context.Context, req dtos.VerificationCodeRequest) error
    Register(ctx context.Context, req dtos.RegisterRequest) error
    // ... 其他接口方法 ...
} 