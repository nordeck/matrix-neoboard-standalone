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

import { Typography } from '@mui/material';
import {
  FullWidthButton,
  LoginWrapper,
  StyledFormInput,
  StyledFormLabel,
  StyledLoginForm,
} from './styles';

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { useTranslation } from 'react-i18next';
import { discoverClientConfig, fetchAuthIssuer } from '../../lib/discovery';
import { registerOidcClient, startOidcLogin } from '../../lib/oidc';

/**
 * Simple login component demonstrating the login flow.
 */
export function Login() {
  const { t } = useTranslation();
  const staticServerName = getEnvironment('REACT_APP_HOMESERVER');
  const hasStaticServerName = staticServerNameSet(staticServerName);
  const [serverName, setServerName] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setMessage('');

      try {
        // Find the homeserver's base URL
        const clientConfig = await discoverClientConfig(
          hasStaticServerName ? staticServerName : serverName,
        );
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
        console.error('Login failed', error);
        setMessage('Login failed. Check your homeserver name.');
      }
    },
    [hasStaticServerName, serverName, staticServerName],
  );

  const handleServerNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setServerName(event.target.value);
    },
    [setServerName],
  );

  return (
    <LoginWrapper>
      <Typography
        variant="h2"
        align="center"
        style={{ fontSize: '3rem', fontWeight: 500 }}
      >
        {t('login.title', 'NeoBoard')}
      </Typography>
      <Typography
        variant="h3"
        align="center"
        style={{ fontSize: '2rem', fontWeight: 500 }}
      >
        {t('login.subtitle', 'Visual Collaboration for Teams')}
      </Typography>

      <Typography
        variant="h4"
        align="center"
        style={{ fontSize: '1.25rem', fontWeight: 200, marginTop: '2rem' }}
      >
        {t(
          'login.lead',
          'NeoBoard is a whiteboard app suited for creative presentations, detailed diagrams and conducting productive meetings.',
        )}
      </Typography>
      <StyledLoginForm onSubmit={handleFormSubmit}>
        {hasStaticServerName === false && (
          <>
            <StyledFormLabel htmlFor="login-homeserver">
              {t('login.homeserver.label', 'Homeserver')}
            </StyledFormLabel>
            <StyledFormInput
              id="login-homeserver"
              value={serverName}
              placeholder={t('login.homeserver.placeholder', 'e.g. matrix.org')}
              onChange={handleServerNameChange}
              style={{ marginBottom: '0.5rem' }}
              autoFocus={true}
            />
          </>
        )}
        <FullWidthButton type="submit" variant="contained" color="primary">
          {t('login.button', 'Log In')}
        </FullWidthButton>
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
      </StyledLoginForm>
    </LoginWrapper>
  );
}

function staticServerNameSet(
  serverName: string | undefined,
): serverName is string {
  return serverName !== undefined && serverName.trim() !== '';
}
