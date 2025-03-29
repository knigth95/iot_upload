import json
from sqlalchemy import create_engine, inspect, MetaData, Table
import pandas as pd
from datetime import datetime
from pathlib import Path

# 配置数据库连接
current_dir = Path(__file__).parent.absolute()
db_path = current_dir / "manifest/docker/db-data/core-data/core.db"
engine = create_engine(f"sqlite:///{db_path}")

def datetime_handler(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

# 获取元数据
metadata = MetaData()
metadata.reflect(bind=engine)
inspector = inspect(engine)

# 导出数据到字典
database_data = {}
for table_name in inspector.get_table_names():
    # 获取表的列名（即使表为空）
    columns = [col["name"] for col in inspector.get_columns(table_name)]
    
    # 读取表数据
    try:
        df = pd.read_sql_table(table_name, engine)
        data = df.to_dict(orient="records")
    except pd.errors.DatabaseError as e:
        # 处理空表情况
        data = []
    
    # 保存字段结构和数据
    database_data[table_name] = {
        "columns": columns,  # 始终包含字段名
        "data": data        # 数据为空则为 []
    }

# 写入 JSON 文件
with open("database_export_with_columns.json", "w", encoding="utf-8") as f:
    json.dump(database_data, f, indent=2, ensure_ascii=False, default=datetime_handler)

print("导出完成，空表已包含字段信息！")
