-- Active: 1743911047579@@127.0.0.1@3306
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
    username TEXT NOT NULL,         -- 用户名
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 修改时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_device_id ON ai_recommendation(device_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_risk_level ON ai_recommendation(risk_level);
CREATE INDEX IF NOT EXISTS idx_ai_qa_username ON ai_qa(username);

-- 插入示例AI建议数据
INSERT INTO ai_recommendation (title, content, risk_level, device_id, property_id)
VALUES
('温度传感器-001-温度', '温度超过安全阈值，建议检查冷却系统', 'high', 'device-001', 'temperature'),
('湿度传感器-002-湿度', '湿度波动较大，建议检查密封性', 'medium', 'device-002', 'humidity'),
('压力传感器-003-压力', '压力稳定，建议保持当前维护频率', 'low', 'device-003', 'pressure');