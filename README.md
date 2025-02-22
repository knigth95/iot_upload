# 项目简介

本项目为物联网平台系统，实现实时数据采集、元数据管理、规则引擎、设备监控等多种功能。项目中采用多种组件构建，其中包括：

- **消息队列与规则引擎**：使用 MQTT Broker、EMQX 服务和 ekuiper 进行消息传递及实时规则处理。
- **数据库存储**：采用两种数据库引擎分别服务于不同的数据需求：
  - **SQLite**：用于存储系统的元数据（如产品属性、操作、模板、文档、单位、事件、物模型模板、快捷导航、语言 SDK 等）。
  - **LevelDB**：用于存储实时数据，采用键值对方式实现高效读写。

---

## 前置内容

### MQTT Broker 与 EMQX 服务

- 安装必要组件：
  ```bash
  yay -S mosquitto mosquitto-clients docker-buildx
  docker pull emqx/emqx
  docker pull lfedge/ekuiper
  ```
- 配置文件说明：
  - `/etc/resolv.conf`：配置 Docker 网络
  - `/etc/mosquitto/mosquitto.conf`：Mosquitto 配置文件
- 重启 Docker 服务：
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl restart docker
  ```
- 启动 Mosquitto 服务：
  ```bash
  sudo systemctl start mosquitto
  sudo systemctl enable mosquitto
  ```
- 启动 EMQX 与 ekuiper 服务：
  ```bash
  docker run -d --name emqx -p 1883:1883 -p 18083:18083 emqx/emqx:latest
  docker run -d --name ekuiper -p 9081:9081 -e MQTT_SOURCE__DEFAULT__SERVER="tcp://broker.emqx.io:1883" lfedge/ekuiper:latest
  docker start $(docker ps -aq)
  ```
- 启动业务服务：
  ```bash
  go run cmd/iot-core/main.go -c cmd/iot-core/res/configuration.toml
  ```

---

## 数据库说明
- **配置**  
  根据 `configuration.toml` 修改init_db.sh配置SQLite和指定目录用于存储 LevelDB 数据文件。
### 1. SQLite 数据库（元数据存储）

- **用途**  
  存储系统中涉及元数据的数据，包括但不限于：
  - `properties`：设备或产品属性信息
  - `actions`：设备动作或操作记录
  - `category_template`：类别模板（不同场景或产品分组）
  - `doc`：文档及接口说明
  - `unit`：计量单位
  - `events`：设备或系统事件数据
  - `thing_model_template`：物模型模板信息
  - `quick_navigation`：快捷导航配置（如服务监控、规则引擎、添加产品、添加设备）
  - `language_sdk`：开发语言 SDK 相关信息（如 Go SDK 等）

- **数据库初始化**
  ```bash
  chmod +x init_db.sh
  ./init_db.sh
  ```

### 2. LevelDB 数据库（实时数据存储）
- **初始测试**
- `SQLtest.go`用于写入简单的测试数据
- **存储机制**  
  与 SQLite 不同，LevelDB 不以单一数据库文件的形式存在。运行写操作时，LevelDB 在指定目录下会自动生成一系列文件，例如：
  - `CURRENT`
  - `MANIFEST-xxxx`
  - 多个 `.ldb` 或 `.sst` 文件
  - 日志文件（如 `LOG`）  
  初始状态下目录可能为空，但一旦写入数据，系统会在该目录生成相关文件。
