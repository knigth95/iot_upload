/*******************************************************************************
 * Copyright 2017.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/

package interfaces

import (
	"context"
	"github.com/winc-link/hummingbird/internal/dtos"
	"github.com/winc-link/hummingbird/internal/models"
	"github.com/winc-link/hummingbird/internal/pkg/timer/jobs"
)

type SceneApp interface {
	AddScene(ctx context.Context, req dtos.SceneAddRequest) (string, error)
	UpdateScene(ctx context.Context, req dtos.SceneUpdateRequest) error
	SceneById(ctx context.Context, sceneId string) (models.Scene, error)
	SceneStartById(ctx context.Context, sceneId string) error
	SceneStopById(ctx context.Context, sceneId string) error
	DelSceneById(ctx context.Context, sceneId string) error
	SceneSearch(ctx context.Context, req dtos.SceneSearchQueryRequest) ([]models.Scene, uint32, error)
	CheckSceneByDeviceId(ctx context.Context, deviceId string) error
	SceneLogSearch(ctx context.Context, req dtos.SceneLogSearchQueryRequest) ([]models.SceneLog, uint32, error)
	EkuiperNotify(ctx context.Context, req map[string]interface{}) error
}

type ConJob interface {
	AddJobToRunQueue(j *jobs.JobSchedule) error
	DeleteJob(id string)
}
