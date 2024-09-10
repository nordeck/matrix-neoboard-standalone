/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MatrixClient, parseErrorResponse } from 'matrix-js-sdk';

export interface IMediaAssetObject {
  mxc: string;
}

export class MediaAsset {
  private client: MatrixClient;

  public constructor(
    private prepared: IMediaAssetObject,
    client: MatrixClient,
  ) {
    this.client = client;
  }

  public get srcMxc(): string {
    return this.prepared.mxc;
  }

  public get srcHttp(): string | null {
    return (
      this.client.mxcUrlToHttp(
        this.srcMxc,
        undefined,
        undefined,
        undefined,
        false,
        true,
        true,
      ) || null
    );
  }

  public async downloadSource(): Promise<Response> {
    const src = this.srcHttp;
    if (!src) {
      throw new Error('error|download_media');
    }
    const res = await fetch(src, {
      headers: {
        Authorization: `Bearer ${this.client.getAccessToken()}`,
      },
    });
    if (!res.ok) {
      throw parseErrorResponse(res, await res.text());
    }
    return res;
  }
}
