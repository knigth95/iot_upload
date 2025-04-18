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

package dingding

import (
	"bytes"
	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/logger"

	"github.com/kirinlabs/HttpRequest"
)

type DingDingClient struct {
	lc logger.LoggingClient
	p  *di.Container
}

func NewDingDingClient(lc logger.LoggingClient, p *di.Container) *DingDingClient {
	return &DingDingClient{
		lc: lc,
		p:  p,
	}
}

func (d *DingDingClient) Send(webhook string, text string) {
	req := HttpRequest.NewRequest()
	req.JSON()
	resp, err := req.Post(webhook, bytes.NewBuffer([]byte(text)))
	if err != nil {
		d.lc.Errorf("dingding send alert message error:", err.Error())
	}
	body, err := resp.Body()
	if err != nil {
		return
	}
	d.lc.Debug("dingding send message", string(body))
}
