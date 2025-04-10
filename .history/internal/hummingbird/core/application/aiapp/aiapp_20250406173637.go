package aiapp

import (
"bytes"
"encoding/json"
"fmt"
"io/ioutil"
"net/http"
"time"

"iot_pj/internal/dtos"
"iot_pj/internal/hummingbird/core/container"
interfaces "iot_pj/internal/hummingbird/core/interface"
"iot_pj/internal/models"
"iot_pj/internal/pkg/constants"
"iot_pj/internal/pkg/di"
"iot_pj/internal/pkg/logger"
)

// AI API配置
const (
  AI_API_URL   = "https://api.deepseek.com/chat/completions"
  AI_API_KEY   = "sk-1d827493d3114c0395924e1ca4d4a141"
  AI_API_MODEL = "deepseek-chat"
)

// AI请求结构
type AIRequest struct {
  Model         string        `json:"model"`
  Messages      []AIMessage   `json:"messages"`
  MaxTokens     int           `json:"max_tokens"`
  Temperature   float64       `json:"temperature"`
  TopP          float64       `json:"top_p"`
  FrequencyPenalty float64    `json:"frequency_penalty"`
  PresencePenalty float64     `json:"presence_penalty"`
  ResponseFormat ResponseFormat `json:"response_format"`
  Stop          []string      `json:"stop"`
  Stream        bool          `json:"stream"`
  StreamOptions interface{}   `json:"stream_options"`
  Tools         interface{}   `json:"tools"`
  ToolChoice    interface{}   `json:"tool_choice"`
  Logprobs      bool          `json:"logprobs"`
  TopLogprobs   interface{}   `json:"top_logprobs"`
}

// AI消息结构
type AIMessage struct {
Role    string `json:"role"`
Content string `json:"content"`
}

// 响应格式
type ResponseFormat struct {
Type string `json:"type"`
}

// AI响应结构
type AIResponse struct {
ID      string   `json:"id"`
Object  string   `json:"object"`
Created int64    `json:"created"`
Choices []Choice `json:"choices"`
Usage   Usage    `json:"usage"`
}

// 选择结构
type Choice struct {
Index        int        `json:"index"`
Message      AIMessage  `json:"message"`
FinishReason string     `json:"finish_reason"`
}

// 使用情况结构
type Usage struct {
PromptTokens     int `json:"prompt_tokens"`
CompletionTokens int `json:"completion_tokens"`
TotalTokens      int `json:"total_tokens"`
}

// AI服务实现
type AIApplication struct {
dic           *di.Container
logger        logger.LoggingClient
dbClient      interfaces.DBClient
}

// 创建AI服务实例
func NewAIApplication(dic *di.Container) *AIApplication {
dbClient := container.DBClientFrom(func(name string) interface{} {
return dic.Get(name)
})
logger := container.LoggingClientFrom(func(name string) interface{} {
return dic.Get(name)
})

return &AIApplication{
dic:           dic,
logger:        logger,
dbClient:      dbClient,
}
}

// 获取AI建议列表
func (a *AIApplication) GetAIRecommendations(offset, limit int) ([]models.AIRecommendation, uint32, error) {
return a.dbClient.GetAIRecommendations(offset, limit)
}

// 根据ID获取AI建议
func (a *AIApplication) GetAIRecommendationByID(id int) (models.AIRecommendation, error) {
return a.dbClient.GetAIRecommendationByID(id)
}

// 创建AI建议
func (a *AIApplication) CreateAIRecommendation(req dtos.AIRecommendationRequest) (models.AIRecommendation, error) {
// 分析设备数据，生成建议
recommendation, err := a.analyzeDeviceData(req.DeviceID, req.PropertyID, req.StartTime, req.EndTime)
if err != nil {
return models.AIRecommendation{}, err
}

// 保存到数据库
return a.dbClient.CreateAIRecommendation(recommendation)
}

// 自动生成AI建议
func (a *AIApplication) GenerateAIRecommendation(deviceID, propertyID string) (models.AIRecommendation, error) {
// 获取当前时间和24小时前的时间
endTime := time.Now()
startTime := endTime.Add(-24 * time.Hour)

// 分析设备数据，生成建议
recommendation, err := a.analyzeDeviceData(deviceID, propertyID, startTime, endTime)
if err != nil {
return models.AIRecommendation{}, err
}

// 保存到数据库
return a.dbClient.CreateAIRecommendation(recommendation)
}

// 分析设备数据，生成建议
func (a *AIApplication) analyzeDeviceData(deviceID, propertyID string, startTime, endTime time.Time) (models.AIRecommendation, error) {
// 获取设备属性数据
// 这里应该调用设备服务获取历史数据，简化处理
deviceData := fmt.Sprintf("设备ID: %s, 属性: %s, 时间范围: %s 至 %s", 
deviceID, propertyID, startTime.Format("2006-01-02 15:04:05"), endTime.Format("2006-01-02 15:04:05"))

// 调用AI模型分析数据
analysisPrompt := fmt.Sprintf("分析以下IoT设备数据，识别潜在风险并提供改进建议：\n%s", deviceData)
analysisResult, err := a.callAIModel(analysisPrompt)
if err != nil {
a.logger.Error(fmt.Sprintf("调用AI模型分析数据失败: %s", err.Error()))
return models.AIRecommendation{}, err
}

// 根据分析结果确定风险级别
var riskLevel constants.AIRiskLevel
if len(analysisResult) > 0 {
// 简单的风险级别判断逻辑，可以根据实际需求调整
if contains(analysisResult, "严重") || contains(analysisResult, "紧急") || contains(analysisResult, "危险") {
riskLevel = constants.AIRiskLevelHigh
} else if contains(analysisResult, "注意") || contains(analysisResult, "警告") || contains(analysisResult, "异常") {
riskLevel = constants.AIRiskLevelMedium
} else {
riskLevel = constants.AIRiskLevelLow
}
} else {
// 如果AI没有返回结果，使用默认的风险级别判断逻辑
nameLength := len(deviceID)
if nameLength % 3 == 0 {
riskLevel = constants.AIRiskLevelHigh
} else if nameLength % 3 == 1 {
riskLevel = constants.AIRiskLevelMedium
} else {
riskLevel = constants.AIRiskLevelLow
}
}

// 创建建议对象
recommendation := models.AIRecommendation{
Title:      fmt.Sprintf("设备-%s-%s分析", deviceID, propertyID),
Content:    analysisResult,
RiskLevel:  riskLevel,
DeviceID:   deviceID,
PropertyID: propertyID,
}

return recommendation, nil
}

// 辅助函数：检查字符串是否包含特定子串
func contains(s, substr string) bool {
return bytes.Contains([]byte(s), []byte(substr))
}

// 获取AI问答历史
func (a *AIApplication) GetAIQAHistory(offset, limit int, userID string) ([]models.AIQA, uint32, error) {
return a.dbClient.GetAIQAHistory(offset, limit, userID)
}

// 根据ID获取AI问答
func (a *AIApplication) GetAIQAByID(id int) (models.AIQA, error) {
return a.dbClient.GetAIQAByID(id)
}

// 创建AI问答
func (a *AIApplication) CreateAIQA(req dtos.AIQARequest, userID string) (models.AIQA, error) {
// 调用AI模型获取回答
answer, err := a.callAIModel(req.Question)
if err != nil {
a.logger.Error(fmt.Sprintf("调用AI模型获取问答回复失败: %s", err.Error()))
return models.AIQA{}, err
}

// 确定使用的模型
model := AI_API_MODEL
if req.Model != "" {
model = req.Model
}

// 创建问答记录
qa := models.AIQA{
  Question: req.Question,
  Answer:   answer,
  Model:    model,
  username: username,
}

// 保存到数据库
return a.dbClient.CreateAIQA(qa)
}

// 调用AI模型
func (a *AIApplication) callAIModel(prompt string) (string, error) {
  // 构建请求体
  reqBody := AIRequest{
    Model: AI_API_MODEL,
    Messages: []AIMessage{
      {
        Role:    "user",
        Content: prompt,
      },
    },
    MaxTokens:     2048,
    Temperature:   1,
    TopP:          1,
    FrequencyPenalty: 0,
    PresencePenalty: 0,
    ResponseFormat: ResponseFormat{
      Type: "text",
    },
    Stop:         nil,
    Stream:       false,
    StreamOptions: nil,
    Tools:        nil,
    ToolChoice:   "none",
    Logprobs:     false,
    TopLogprobs:  nil,
  }

// 将请求体转换为JSON
jsonData, err := json.Marshal(reqBody)
if err != nil {
return "", fmt.Errorf("JSON编码失败: %v", err)
}

// 创建HTTP请求
req, err := http.NewRequest("POST", AI_API_URL, bytes.NewBuffer(jsonData))
if err != nil {
return "", fmt.Errorf("创建HTTP请求失败: %v", err)
}

// 设置请求头
req.Header.Set("Authorization", "Bearer "+AI_API_KEY)
req.Header.Set("Content-Type", "application/json")

// 发送请求
client := &http.Client{Timeout: 30 * time.Second}
resp, err := client.Do(req)
if err != nil {
return "", fmt.Errorf("发送HTTP请求失败: %v", err)
}
defer resp.Body.Close()

// 读取响应体
body, err := ioutil.ReadAll(resp.Body)
if err != nil {
return "", fmt.Errorf("读取响应体失败: %v", err)
}

// 检查响应状态码
if resp.StatusCode != http.StatusOK {
return "", fmt.Errorf("API请求失败，状态码: %d，响应: %s", resp.StatusCode, string(body))
}

// 解析响应
var aiResp AIResponse
err = json.Unmarshal(body, &aiResp)
if err != nil {
return "", fmt.Errorf("解析响应失败: %v", err)
}

// 检查是否有有效的回复
if len(aiResp.Choices) == 0 {
return "", fmt.Errorf("AI没有返回有效的回复")
}

// 返回AI回复内容
return aiResp.Choices[0].Message.Content, nil
}
