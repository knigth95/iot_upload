/*******************************************************************************
 * Copyright 2019 Dell Inc.
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

package container

import (
	"iot_pj/internal/hummingbird/core/config"
	"iot_pj/internal/pkg/di"
)

// ConfigurationName contains the name of the resource's config.ConfigurationStruct implementation in the DIC.
var ConfigurationName = di.TypeInstanceToName((*config.ConfigurationStruct)(nil))

// ConfigurationFrom helper function queries the DIC and returns resource's config.ConfigurationStruct implementation.
func ConfigurationFrom(get di.Get) *config.ConfigurationStruct {
	return get(ConfigurationName).(*config.ConfigurationStruct)
}
