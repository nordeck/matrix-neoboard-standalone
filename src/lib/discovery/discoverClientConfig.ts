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

import Joi from 'joi';
import { AutoDiscovery, ClientConfig } from 'matrix-js-sdk';

/**
 * Discover the client config, i.e. the homeserver base URL.
 *
 * If serverNameOrUrl is already an URL, return it.
 * Otherwise query the well-known configuration.
 *
 * @param serverNameOrUrl - Servername or URL, that should be used to discover the config.
 * @returns The client configuration
 */
export async function discoverClientConfig(
  serverNameOrUrl: string,
): Promise<ClientConfig> {
  const validationResult = Joi.string().uri().validate(serverNameOrUrl);

  if (validationResult.error === undefined) {
    // serverNameOrUrl looks like an URL. Return it.
    return {
      'm.homeserver': {
        state: AutoDiscovery.SUCCESS,
        base_url: validationResult.value,
      },
      'm.identity_server': {
        state: AutoDiscovery.PROMPT,
      },
    };
  }

  // use the native fetch API
  AutoDiscovery.setFetchFn(fetch.bind(window));

  return await AutoDiscovery.findClientConfig(serverNameOrUrl);
}
