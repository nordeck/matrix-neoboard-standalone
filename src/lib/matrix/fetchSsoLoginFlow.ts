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
import {
  DELEGATED_OIDC_COMPATIBILITY,
  ILoginFlow,
  ISSOFlow,
  MatrixClient,
} from 'matrix-js-sdk';
import { isProvided } from 'matrix-js-sdk/lib/extensible_events_v1/utilities';

/**
 * A `SSO` authentication types supported by the homeserver.
 */
type SsoFlow = {
  delegatedOidcCompatibility?: boolean;
};

/**
 * Use `/login` endpoint to fetch `m.login.sso` authentication type
 * and check if `delegated_oidc_compatibility` is supported.
 * @param homeserverUrl homeserver URL
 * @returns SsoFlow or undefined
 */
export async function fetchSsoLoginFlow(
  homeserverUrl: string,
): Promise<SsoFlow | undefined> {
  const matrixClient = new MatrixClient({
    baseUrl: homeserverUrl,
  });

  const loginFlows = await matrixClient.loginFlows();
  const ssoLoginFlow: ISSOFlow | undefined = loginFlows.flows.find(isISSOFlow);

  // return undefined if not present
  if (!ssoLoginFlow) {
    return undefined;
  }

  const delegatedOidcCompatibility =
    DELEGATED_OIDC_COMPATIBILITY.findIn(ssoLoginFlow);

  if (
    isProvided(delegatedOidcCompatibility) &&
    typeof delegatedOidcCompatibility !== 'boolean'
  ) {
    // return undefined if invalid
    return undefined;
  }

  return {
    delegatedOidcCompatibility,
  };
}

function isISSOFlow(loginFlow: ILoginFlow): loginFlow is ISSOFlow {
  return loginFlow.type === 'm.login.sso';
}
