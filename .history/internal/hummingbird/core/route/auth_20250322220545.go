// routes/auth.go
package routes

import (
	"iot_pj/internal/hummingbird/core/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine) {
	authGroup := r.Group("/api/v1/auth")
	{
		authGroup.POST("/register", controllers.Register)

	}
}