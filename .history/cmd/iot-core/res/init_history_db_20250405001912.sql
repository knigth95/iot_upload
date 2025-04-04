-- Active: 1743440112382@@127.0.0.1@3306
-- 创建历史数据表
CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    device_id TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value REAL NOT NULL,
    status TEXT CHECK(status IN ('normal', 'warning', 'error')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX idx_sensor_readings_device ON sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_sensor ON sensor_readings(sensor_type);

-- 生成模拟数据
WITH RECURSIVE dates(date) AS (
    SELECT datetime('now', '-6 months')
    UNION ALL
    SELECT datetime(date, '+1 hour')
    FROM dates
    WHERE date < datetime('now')
)
INSERT INTO sensor_readings (timestamp, device_id, sensor_type, value, status)
SELECT 
    date,
    'device_' || (abs(random()) % 5 + 1),
    CASE abs(random()) % 3
        WHEN 0 THEN 'temperature'
        WHEN 1 THEN 'humidity'
        ELSE 'pressure'
    END,
    CASE 
        WHEN sensor_type = 'temperature' THEN 
            -- 温度数据：日周期 + 随机波动
            20 + 10 * sin(julianday(date)/365 * 2 * pi()) 
            + 5 * sin(julianday(date) * 24 * 2 * pi()) 
            + (random() % 30 - 15)/10.0
        WHEN sensor_type = 'humidity' THEN
            -- 湿度数据：日周期 + 随机波动
            50 + 20 * sin(julianday(date)/365 * 2 * pi())
            + 10 * sin(julianday(date) * 24 * 2 * pi())
            + (random() % 40 - 20)/10.0
        ELSE
            -- 压力数据：较稳定 + 随机波动
            1000 + (random() % 200 - 100)/10.0
    END,
    CASE 
        WHEN random() % 100 < 2 THEN 'error'
        WHEN random() % 100 < 5 THEN 'warning'
        ELSE 'normal'
    END
FROM dates
CROSS JOIN (
    SELECT CASE abs(random()) % 3
        WHEN 0 THEN 'temperature'
        WHEN 1 THEN 'humidity'
        ELSE 'pressure'
    END AS sensor_type
);