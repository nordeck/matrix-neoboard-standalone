/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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
import { startLoginFlow } from '../../auth';
import { isValidServerName } from '../../lib';

/**
 * Simple login component demonstrating the login flow.
 */
export function Login() {
  const { t } = useTranslation();
  const staticServerName = getEnvironment('REACT_APP_HOMESERVER');
  const hasValidServerName = isValidServerName(staticServerName);
  const [serverName, setServerName] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setMessage('');

      try {
        await startLoginFlow(
          hasValidServerName ? staticServerName : serverName,
        );
      } catch (error) {
        console.error('Login failed', error);
        setMessage('Login failed. Check your homeserver name.');
      }
    },
    [hasValidServerName, serverName, staticServerName],
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
        {hasValidServerName === false && (
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
