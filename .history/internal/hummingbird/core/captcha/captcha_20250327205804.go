package captcha

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"iot_pj/internal/pkg/errort"
	"iot_pj/internal/pkg/logger"
	"math/big"
	"net/smtp"
	"strings"
	"time"
)

const (
	emailHost     = "smtp.163.com"
	emailPort     = 25
	emailUsername = "knight_iot0209@163.com"
	emailPassword = "DT6e5dEjfMxC8yKt"
	captchaExpire = 5 * time.Minute
)

type CaptchaService struct {
	store    map[string]captchaInfo
	lc       logger.LoggingClient
}

type captchaInfo struct {
	code      string
	email     string
	expiresAt time.Time
}

func New(lc logger.LoggingClient) *CaptchaService {
	return &CaptchaService{
		store: make(map[string]captchaInfo),
		lc:    lc,
	}
}

// GenerateCaptcha 生成6位数字验证码
func (s *CaptchaService) GenerateCaptcha() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(900000))
	return fmt.Sprintf("%06d", n.Int64()+100000)
}

// SendEmailCaptcha 发送验证码到邮箱
func (s *CaptchaService) SendEmailCaptcha(ctx context.Context, email string) (string, error) {
	// 验证邮箱格式
	if !strings.Contains(email, "@") {
		return "", errort.NewCommonEdgeX(errort.DefaultBadRequest, "邮箱格式不正确", nil)
	}

	// 生成验证码和key
	code := s.GenerateCaptcha()
	key := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%d", time.Now().UnixNano())))

	// 发送邮件
	auth := smtp.PlainAuth("", emailUsername, emailPassword, emailHost)
	to := []string{email}
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: 验证码\r\n\r\n"+
		"您的验证码是: %s，5分钟内有效。\r\n", email, code))

	err := smtp.SendMail(fmt.Sprintf("%s:%d", emailHost, emailPort), auth, emailUsername, to, msg)
	if err != nil {
		s.lc.Errorf("发送邮件失败: %v", err)
		return "", errort.NewCommonEdgeX(errort.DefaultSystemError, "发送验证码失败", err)
	}

	// 存储验证码
	s.store[key] = captchaInfo{
		code:      code,
		email:     email,
		expiresAt: time.Now().Add(captchaExpire),
	}

	return key, nil
}

// VerifyCaptcha 验证验证码
func (s *CaptchaService) VerifyCaptcha(key, code, email string) error {
	info, exists := s.store[key]
	if !exists {
		return errort.NewCommonEdgeX(errort.DefaultBadRequest, "验证码已过期", nil)
	}

	if time.Now().After(info.expiresAt) {
		delete(s.store, key)
		return errort.NewCommonEdgeX(errort.DefaultBadRequest, "验证码已过期", nil)
	}

	if info.code != code || info.email != email {
		return errort.NewCommonEdgeX(errort.DefaultBadRequest, "验证码错误", nil)
	}

	// 验证成功后删除
	delete(s.store, key)
	return nil
}