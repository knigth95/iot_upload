//go:build !community
// +build !community

package application

import (
	"context"
	resourceContainer "iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/logger"
	"time"

	//"gitlab.com/tedge/edgex/internal/dtos"
	//"gitlab.com/tedge/edgex/internal/pkg/constants"
	//"gitlab.com/tedge/edgex/internal/pkg/container"
	//pkgContainer "iot_pj/internal/pkg/container"
	"iot_pj/internal/pkg/crontab"
	//"gitlab.com/tedge/edgex/internal/pkg/di"
	//"gitlab.com/tedge/edgex/internal/pkg/errort"
	//"gitlab.com/tedge/edgex/internal/pkg/logger"
	//resourceContainer "gitlab.com/tedge/edgex/internal/tedge/resource/container"
	//"gitlab.com/tedge/edgex/internal/tools/atopclient"
)

func InitSchedule(dic *di.Container, lc logger.LoggingClient) {
	lc.Info("init schedule")

	// 每天 1 点
	crontab.Schedule.AddFunc("0 1 * * *", func() {
		lc.Debugf("schedule statistic device msg conut: %v", time.Now().Format("2006-01-02 15:04:05"))
		deviceItf := resourceContainer.DeviceItfFrom(dic.Get)
		err := deviceItf.DevicesReportMsgGather(context.Background())
		if err != nil {
			lc.Error("schedule statistic device err:", err)
		}
	})

	crontab.Start()
}
