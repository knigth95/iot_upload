export const Register = (data: {
  username: string;
  password: string;
  email: string;
}) => {
  return request.post('/api/v1/auth/register', data);
};

// 在用户服务实现中添加密码加密
import "golang.org/x/crypto/bcrypt"

func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

// 在注册时调用
hashedPwd, err := hashPassword(req.Password)