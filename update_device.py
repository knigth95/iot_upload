import sqlite3
import time
import logging

# 配置日志格式
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# 数据库路径（根据实际情况修改为绝对路径）
DB_PATH = 'manifest/docker/db-data/core-data/core.db'

def update_device_status():
    """更新设备状态为在线（如果当前状态为离线），并更新最后在线时间为毫秒级时间戳"""
    conn = None
    try:
        # 连接数据库
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 生成当前时间的毫秒级时间戳（13位数字）
        current_timestamp = int(time.time() * 1000)  # 核心修改点
        
        # 执行状态和时间更新操作（使用参数化查询）
        cursor.execute(
            "UPDATE device SET status = '在线', last_online_time = ? WHERE status = '离线'",
            (current_timestamp,)  # 注意这里必须是元组格式
        )
        updated_rows = cursor.rowcount
        conn.commit()
        
        # 记录日志
        if updated_rows > 0:
            logging.info(f"更新成功，影响设备数：{updated_rows}，最新时间戳：{current_timestamp}")
        else:
            logging.debug("所有设备状态正常，无需更新")
            
    except sqlite3.Error as e:
        logging.error(f"数据库操作失败: {str(e)}")
    except Exception as e:
        logging.error(f"发生意外错误: {str(e)}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    logging.info("启动设备状态监控服务...")
    while True:
        update_device_status()
        time.sleep(20)  # 暂停5秒
