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

package dtos

import (
	"iot_pj/internal/models"
	"iot_pj/internal/pkg/constants"
)

type DataResourceSearchQueryRequest struct {
	BaseSearchConditionQuery `schema:",inline"`
	Type                     string `schema:"type,omitempty"`
	Health                   string `schema:"health,omitempty"`
}

type DataResourceInfo struct {
	Name   string                 `json:"name"`
	Type   string                 `json:"type"`
	Option map[string]interface{} `json:"option"`
}

type AddDataResourceReq struct {
	Name   string                 `json:"name"`
	Type   string                 `json:"type"`
	Option map[string]interface{} `json:"option"`
}

type UpdateDataResource struct {
	Id     string                  `json:"id"`
	Name   *string                 `json:"name"`
	Type   *string                 `json:"type"`
	Option *map[string]interface{} `json:"option"`
}

func ReplaceDataResourceModelFields(ds *models.DataResource, patch UpdateDataResource) {
	if patch.Name != nil {
		ds.Name = *patch.Name
	}
	if patch.Type != nil {
		ds.Type = constants.DataResourceType(*patch.Type)
	}
	if patch.Option != nil {
		ds.Option = *patch.Option
		ds.Option["sendSingle"] = true
	}
	ds.Health = false

}
