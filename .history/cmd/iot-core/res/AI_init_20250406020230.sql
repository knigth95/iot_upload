-- 创建AI建议表
CREATE TABLE IF NOT EXISTS ai_recommendation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,  -- 标题
    content TEXT NOT NULL,        -- 内容
    risk_level VARCHAR(50) NOT NULL,  -- 风险等级
    device_id VARCHAR(255),       -- 设备ID
    property_id VARCHAR(255),     -- 属性ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);

-- 创建AI问答表
CREATE TABLE IF NOT EXISTS ai_qa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,       -- 问题
    answer TEXT NOT NULL,         -- 回答
    model VARCHAR(100),           -- 模型名称
    user_id VARCHAR(255),         -- 用户ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_device_id ON ai_recommendation(device_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_risk_level ON ai_recommendation(risk_level);
CREATE INDEX IF NOT EXISTS idx_ai_qa_user_id ON ai_qa(user_id);