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

import { Typography } from '@mui/material';
import { LoginWrapper } from './styles';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isSkipGuestLogin } from '../../lib/isSkipGuestLogin.ts';
import { isSkipUserLogin } from '../../lib/isSkipUserLogin.ts';
import { getRedirectPath } from '../../redirectPath';
import { GuestLogin } from './GuestLogin.tsx';
import { UserLogin } from './UserLogin.tsx';

/**
 * Simple login component demonstrating the login flow.
 */
export function Login() {
  const { t } = useTranslation();

  const [roomId, setRoomId] = useState<string | undefined>();

  useEffect(() => {
    const redirectPath = getRedirectPath();
    if (!redirectPath) {
      return;
    }

    const prefix = '/board/';
    const roomId = redirectPath.startsWith(prefix)
      ? redirectPath.slice(prefix.length)
      : undefined;

    setRoomId(roomId);
  }, []);

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

      {!isSkipUserLogin() && <UserLogin />}
      {!isSkipGuestLogin() && roomId && (
        <GuestLogin roomId={roomId} primary={isSkipUserLogin()} />
      )}
    </LoginWrapper>
  );
}
