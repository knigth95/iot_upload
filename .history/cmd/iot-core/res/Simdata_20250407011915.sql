-- Active: 1743911047579@@127.0.0.1@3306
-- 模拟最新数据（当前时间）
INSERT INTO `events` (
  id, 
  product_id, 
  event_type, 
  code, 
  output_params, 
  created
) VALUES (
  UUID(),
  '4128652051',  -- 来自thing_model_template的光照传感器产品ID
  'PROPERTY_REPORT',
  'Light',
  '{"value": 8500, "unit": "lux"}',  -- 光照值+单位
  UNIX_TIMESTAMP() * 1000  -- 自动生成当前时间戳（毫秒级）
);

-- 模拟历史数据1（凌晨低光照）
INSERT INTO `events` (
  id, 
  product_id, 
  event_type, 
  code, 
  output_params, 
  created
) VALUES (
  UUID(),
  '4128652051',
  'PROPERTY_REPORT',
  'Light',
  '{"value": 120, "unit": "lux"}',
  1743955981589  -- 对应接口中的起始时间
);

-- 模拟历史数据2（正午高光照）
INSERT INTO `events` (
  id, 
  product_id, 
  event_type, 
  code, 
  output_params, 
  created
) VALUES (
  UUID(),
  '4128652051',
  'PROPERTY_REPORT',
  'Light',
  '{"value": 45000, "unit": "lux"}',
  1743959581589  -- 对应接口中的结束时间
);