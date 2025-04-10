-- 模拟最新数据（当前时间）
INSERT INTO `events` (
  id, 
  product_id, 
  event_type, 
  code, 
  output_params, 
  created
) VALUES (
  LOWER(HEX(RANDOMBLOB(16))),  -- SQLite UUID替代方案
  '4128652051',
  'PROPERTY_REPORT',
  'Light',
  '{"value": 8500, "unit": "lux"}',
  (strftime('%s','now') * 1000)
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
  '3a5e4678-e887-4937-9204-000000000001',  -- 手动生成UUID
  '4128652051',
  'PROPERTY_REPORT',
  'Light',
  '{"value": 120, "unit": "lux"}',
  1743955981589
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
  '3a5e4678-e887-4937-9204-000000000002',  -- 序列化UUID
  '4128652051',
  'PROPERTY_REPORT',
  'Light',
  '{"value": 45000, "unit": "lux"}',
  1743959581589
);