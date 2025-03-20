package jobrunner

import (
	"iot_pj/internal/dtos"
	coreContainer "iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/models"
	"iot_pj/internal/pkg/container"

	"iot_pj/internal/pkg/timer/jobs"
	"time"

	"iot_pj/internal/pkg/di"
)

type JobRunFunc func(jobId string, job jobs.JobSchedule)

func NewJobRunFunc(dic *di.Container) JobRunFunc {
	logger := container.LoggingClientFrom(dic.Get)

	return func(jobId string, job jobs.JobSchedule) {
		start := time.Now()
		defer func() {
			logger.Infof("JobRunFunc cost: %v ms", time.Since(start).Milliseconds())
		}()

		logger.Infof("JobId: %v, job in: %+v", jobId, job.RuntimeJobStu)

		//调用驱动
		s := job.JobData
		deviceApp := coreContainer.DeviceItfFrom(dic.Get)
		res := deviceApp.DeviceAction(dtos.JobAction{
			ProductId:   s.ActionData[0].ProductId,
			ProductName: s.ActionData[0].ProductName,
			DeviceId:    s.ActionData[0].DeviceId,
			DeviceName:  s.ActionData[0].DeviceName,
			Code:        s.ActionData[0].Code,
			DateType:    s.ActionData[0].DateType,
			Value:       s.ActionData[0].Value,
		})

		dbClient := coreContainer.DBClientFrom(dic.Get)
		_, err := dbClient.AddSceneLog(models.SceneLog{
			SceneId: job.JobID,
			Name:    job.JobName,
			ExecRes: res.ToString(),
		})
		if err != nil {
			logger.Errorf("add sceneLog err %v", err.Error())
		}

	}
}
