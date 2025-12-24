/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
 *
 * NeoBoard Standalone is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * NeoBoard Standalone is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard Standalone. If not, see <https://www.gnu.org/licenses/>.
 */
import { ILoginFlow, ISSOFlow, MatrixClient } from 'matrix-js-sdk';

/**
 * Use `/login` endpoint to fetch `m.login.sso` authentication type.
 * @param homeserverUrl homeserver URL
 * @returns ISSOFlow or undefined
 */
export async function fetchSsoLoginFlow(
  homeserverUrl: string,
): Promise<ISSOFlow | undefined> {
  const matrixClient = new MatrixClient({
    baseUrl: homeserverUrl,
  });

  const loginFlows = await matrixClient.loginFlows();
  const ssoLoginFlow: ISSOFlow | undefined = loginFlows.flows.find(isISSOFlow);

  // return undefined if not present
  if (!ssoLoginFlow) {
    return undefined;
  }

  return ssoLoginFlow;
}

function isISSOFlow(loginFlow: ILoginFlow): loginFlow is ISSOFlow {
  return loginFlow.type === 'm.login.sso';
}
