package streamclient

import "iot_pj/internal/dtos"

type StreamClient interface {
	Send(data dtos.RpcData)
	Recv() <-chan dtos.RpcData
}
