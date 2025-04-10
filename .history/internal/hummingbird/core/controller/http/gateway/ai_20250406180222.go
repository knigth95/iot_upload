package gateway

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"iot_pj/internal/dtos"
	"iot_pj/internal/hummingbird/core/container"
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

// AI控制器
type AIController struct {
dic       *di.Container
aiService interfaces.AIApplication
}

// 创建AI控制器
func NewAIController(dic *di.Container) *AIController {
return &AIController{
dic:       dic,
aiService: container.GetAIApplicationFrom(dic.Get),
}
}

// 获取AI建议列表
func (c *AIController) GetAIRecommendations(ctx *gin.Context) {
offset, _ := strconv.Atoi(ctx.DefaultQuery("offset", "0"))
limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))

recommendations, total, err := c.aiService.GetAIRecommendations(offset, limit)
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "获取AI建议列表失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    recommendations,
"total":   total,
"offset":  offset,
"limit":   limit,
})
}

// 根据ID获取AI建议
func (c *AIController) GetAIRecommendationByID(ctx *gin.Context) {
idStr := ctx.Param("id")
id, err := strconv.Atoi(idStr)
if err != nil {
ctx.JSON(http.StatusBadRequest, gin.H{
"code":    400,
"message": "无效的ID",
})
return
}

recommendation, err := c.aiService.GetAIRecommendationByID(id)
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "获取AI建议失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    recommendation,
})
}

// 创建AI建议
func (c *AIController) CreateAIRecommendation(ctx *gin.Context) {
var req dtos.AIRecommendationRequest
if err := ctx.ShouldBindJSON(&req); err != nil {
ctx.JSON(http.StatusBadRequest, gin.H{
"code":    400,
"message": "无效的请求参数",
"error":   err.Error(),
})
return
}

recommendation, err := c.aiService.CreateAIRecommendation(req)
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "创建AI建议失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    recommendation,
})
}

// 生成AI建议
func (c *AIController) GenerateAIRecommendation(ctx *gin.Context) {
deviceID := ctx.Query("deviceId")
propertyID := ctx.Query("propertyId")

if deviceID == "" || propertyID == "" {
ctx.JSON(http.StatusBadRequest, gin.H{
"code":    400,
"message": "设备ID和属性ID不能为空",
})
return
}

ctx, cancel := context.WithTimeout(ctx, 120*time.Second)
defer cancel()

recommendation, err := c.aiService.GenerateAIRecommendation(deviceID, propertyID)
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "生成AI建议失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    recommendation,
})
}

// 获取AI问答历史
func (c *AIController) GetAIQAHistory(ctx *gin.Context) {
offset, _ := strconv.Atoi(ctx.DefaultQuery("offset", "0"))
limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
// 不再根据用户ID过滤
qaList, total, err := c.aiService.GetAIQAHistory(offset, limit, "")
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "获取AI问答历史失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    qaList,
"total":   total,
"offset":  offset,
"limit":   limit,
})
}

// 创建AI问答
func (c *AIController) CreateAIQA(ctx *gin.Context) {
var req dtos.AIQARequest
if err := ctx.ShouldBindJSON(&req); err != nil {
ctx.JSON(http.StatusBadRequest, gin.H{
"code":    400,
"message": "无效的请求参数",
"error":   err.Error(),
})
return
}

userID := ctx.GetString("userId")
qa, err := c.aiService.CreateAIQA(req, userID)
if err != nil {
ctx.JSON(http.StatusInternalServerError, gin.H{
"code":    500,
"message": "创建AI问答失败",
"error":   err.Error(),
})
return
}

ctx.JSON(http.StatusOK, gin.H{
"code":    200,
"message": "success",
"data":    qa,
})
}

