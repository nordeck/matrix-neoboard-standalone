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

import { discoverAndValidateOIDCIssuerWellKnown } from 'matrix-js-sdk';
import { ensureNoTrailingSlash } from 'matrix-js-sdk/lib/utils';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { discoverClientConfig, fetchAuthIssuer } from '../lib/discovery';
import { registerOidcClient, startOidcLogin } from '../lib/oidc';

/**
 * Simple login component demonstrating the login flow.
 */
export function Login() {
  const [serverName, setServerName] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setMessage('');

      try {
        // Find the homeserver's base URL
        const clientConfig = await discoverClientConfig(serverName);
        const rawBaseUrl = clientConfig['m.homeserver'].base_url;

        if (rawBaseUrl === undefined || rawBaseUrl === null) {
          setMessage('Login failed. Check your homeserver name.');
          return;
        }

        const baseUrl = ensureNoTrailingSlash(rawBaseUrl);

        // Fetch the auth issuer, to find out where the actual authentication is performed
        const { issuer } = await fetchAuthIssuer(baseUrl);

        // Fetch the OIDC configuration from the auth issuer
        const oidcClientConfig =
          await discoverAndValidateOIDCIssuerWellKnown(issuer);

        // Register an OIDC client and start the authentication
        const clientId = await registerOidcClient(oidcClientConfig);
        startOidcLogin(oidcClientConfig, clientId, baseUrl);
      } catch (error) {
        console.log('Login failed', error);
        setMessage('Login failed. Check your homeserver name.');
      }
    },
    [serverName],
  );

  const handleServerNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setServerName(event.target.value);
    },
    [setServerName],
  );

  return (
    <div>
      <h4 style={{ marginTop: '2rem' }}>Log in to NeoBoard</h4>
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <label>Homeserver</label>
        <input
          value={serverName}
          placeholder="e.g. matrix.org"
          onChange={handleServerNameChange}
          style={{ marginBottom: '0.5rem' }}
          autoFocus={true}
        />
        <button>login</button>
        {message !== '' && (
          <small
            style={{
              color: 'red',
              marginTop: '.25rem',
            }}
          >
            {message}
          </small>
        )}
      </form>
    </div>
  );
}
