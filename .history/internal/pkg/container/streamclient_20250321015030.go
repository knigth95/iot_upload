package container

import (
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/tools/streamclient"
)

var StreamClientName = di.TypeInstanceToName((*streamclient.StreamClient)(nil))

func StreamClientFrom(get di.Get) streamclient.StreamClient {
	return get(StreamClientName).(streamclient.StreamClient)
}
