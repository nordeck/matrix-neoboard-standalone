// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
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
