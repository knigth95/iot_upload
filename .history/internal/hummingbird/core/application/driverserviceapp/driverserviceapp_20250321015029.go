package driverserviceapp

import (
	"context"
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/container"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/logger"
)

type driverServiceApp struct {
	dic *di.Container
	lc  logger.LoggingClient

	*driverServiceAppM
}

func NewDriverServiceApp(ctx context.Context, dic *di.Container) interfaces.DriverServiceApp {
	return &driverServiceApp{
		dic: dic,
		lc:  container.LoggingClientFrom(dic.Get),

		driverServiceAppM: newDriverServiceApp(ctx, dic),
	}
}
