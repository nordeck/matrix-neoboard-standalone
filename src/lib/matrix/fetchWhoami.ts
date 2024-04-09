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

import { MatrixClient } from 'matrix-js-sdk';

/**
 * Start a temporary MatrixClient and issue a whoami request.
 */
export async function fetchWhoami(
  homeserverUrl: string,
  accessToken: string,
): Promise<ReturnType<MatrixClient['whoami']>> {
  const tempClient = new MatrixClient({
    baseUrl: homeserverUrl,
    accessToken,
    fetchFn: fetch.bind(window),
  });
  const whoAmIData = await tempClient.whoami();
  tempClient.stopClient();
  return whoAmIData;
}
