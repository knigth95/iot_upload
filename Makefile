.PHONY: build clean test docker run

GO=CGO_ENABLED=0 GOOS=linux go
GOCGO=CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go

cmd/iot-core/iot-core:
	$(GOCGO) build -ldflags "-s -w" -o $@ ./cmd/iot-core

cmd/mqtt-broker/mqtt-broker:
	$(GO) build -ldflags "-s -w" -o $@ ./cmd/mqtt-broker

generate/api:
	cd cmd/iot-core && swag init --parseDependency --parseInternal --parseDepth 10

.PHONY: start
start:
	go run cmd/iot-core/main.go -c cmd/iot-core/res/configuration.toml

.PHONY: chmod
chmod:
	sudo chmod -R a+rwx manifest/docker/
	sudo chmod -R a+rwx manifest/docker/db-data/leveldb-core-data/

.PHONY: build
build:
	docker buildx build --platform linux/amd64 -t "knight0209/iot-core:3.0" -f cmd/iot-core/Dockerfile --push .
