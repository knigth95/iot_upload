package gateway

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"iot_pj/internal/dtos"
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/httphelper"
	"iot_pj/internal/pkg/jwtauth/user"
)

// AI控制器
type AIController struct {
	dic        *di.Container
	aiService  interfaces.AIApplication
}

// 创建AI控制器
func NewAIController(dic *di.Container) *AIController {
	return &AIController{
		dic:        dic,
		aiService:  container.GetAIApplicationFrom(dic),
	}
}

// 获取AI建议列表
// @Summary 获取AI建议列表
// @Description 获取AI建议列表
// @Tags AI
// @Accept json
// @Produce json
// @Param offset query int false "偏移量"
// @Param limit query int false "限制数量"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/recommendations [get]
func (c *AIController) GetAIRecommendations(ctx *gin.Context) {
	offset, limit := httphelper.GetPage(ctx)

	recommendations, total, err := c.aiService.GetAIRecommendations(offset, limit)
	if err != nil {
		httphelper.HandleError(ctx, err, "获取AI建议列表失败")
		return
	}

	httphelper.ResponseWithPage(ctx, recommendations, offset, limit, total)
}

// 根据ID获取AI建议
// @Summary 根据ID获取AI建议
// @Description 根据ID获取AI建议
// @Tags AI
// @Accept json
// @Produce json
// @Param id path int true "AI建议ID"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 404 {object} httphelper.Response "AI建议不存在"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/recommendations/{id} [get]
func (c *AIController) GetAIRecommendationByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		httphelper.HandleBadRequest(ctx, "无效的ID")
		return
	}

	recommendation, err := c.aiService.GetAIRecommendationByID(id)
	if err != nil {
		httphelper.HandleError(ctx, err, "获取AI建议失败")
		return
	}

	httphelper.ResponseSuccess(ctx, recommendation)
}

// 创建AI建议
// @Summary 创建AI建议
// @Description 创建AI建议
// @Tags AI
// @Accept json
// @Produce json
// @Param request body dtos.AIRecommendationRequest true "AI建议请求参数"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/recommendations [post]
func (c *AIController) CreateAIRecommendation(ctx *gin.Context) {
	var req dtos.AIRecommendationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		httphelper.HandleBadRequest(ctx, "无效的请求参数")
		return
	}

	recommendation, err := c.aiService.CreateAIRecommendation(req)
	if err != nil {
		httphelper.HandleError(ctx, err, "创建AI建议失败")
		return
	}

	httphelper.ResponseSuccess(ctx, recommendation)
}

// 生成AI建议
// @Summary 生成AI建议
// @Description 根据设备ID和属性ID生成AI建议
// @Tags AI
// @Accept json
// @Produce json
// @Param deviceId query string true "设备ID"
// @Param propertyId query string true "属性ID"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/recommendations/generate [post]
func (c *AIController) GenerateAIRecommendation(ctx *gin.Context) {
	deviceID := ctx.Query("deviceId")
	propertyID := ctx.Query("propertyId")

	if deviceID == "" || propertyID == "" {
		httphelper.HandleBadRequest(ctx, "设备ID和属性ID不能为空")
		return
	}

	recommendation, err := c.aiService.GenerateAIRecommendation(deviceID, propertyID)
	if err != nil {
		httphelper.HandleError(ctx, err, "生成AI建议失败")
		return
	}

	httphelper.ResponseSuccess(ctx, recommendation)
}

// 获取AI问答历史
// @Summary 获取AI问答历史
// @Description 获取AI问答历史
// @Tags AI
// @Accept json
// @Produce json
// @Param offset query int false "偏移量"
// @Param limit query int false "限制数量"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/qa/history [get]
func (c *AIController) GetAIQAHistory(ctx *gin.Context) {
	offset, limit := httphelper.GetPage(ctx)
	userID := user.GetUserIDFromContext(ctx)

	qaList, total, err := c.aiService.GetAIQAHistory(offset, limit, userID)
	if err != nil {
		httphelper.HandleError(ctx, err, "获取AI问答历史失败")
		return
	}

	httphelper.ResponseWithPage(ctx, qaList, offset, limit, total)
}

// 创建AI问答
// @Summary 创建AI问答
// @Description 创建AI问答
// @Tags AI
// @Accept json
// @Produce json
// @Param request body dtos.AIQARequest true "AI问答请求参数"
// @Success 200 {object} httphelper.Response "成功"
// @Failure 400 {object} httphelper.Response "请求参数错误"
// @Failure 500 {object} httphelper.Response "内部服务器错误"
// @Router /api/v1/ai/qa [post]
func (c *AIController) CreateAIQA(ctx *gin.Context) {
	var req dtos.AIQARequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		httphelper.HandleBadRequest(ctx, "无效的请求参数")
		return
	}

	userID := user.GetUserIDFromContext(ctx)
	qa, err := c.aiService.CreateAIQA(req, userID)
	if err != nil {
		httphelper.HandleError(ctx, err, "创建AI问答失败")
		return
	}

	httphelper.ResponseSuccess(ctx, qa)
}
