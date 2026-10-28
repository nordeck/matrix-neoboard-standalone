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

import { CircularProgress } from '@mui/material';
import {
  FullWidthButton,
  StyledFormInput,
  StyledFormLabel,
  StyledLoginForm,
} from './styles';

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { discoverHomeserverUrl } from '../../auth';
import { isValidServerName } from '../../lib';
import { useApplication } from '../../state/useApplication';
import { makeSelectMembership, RootState, waitForSelector } from '../../store';
import { registerGuest } from './registerGuest';

export function GuestLogin({
  roomId,
  primary = false,
}: {
  roomId: string;
  primary?: boolean;
}) {
  const store = useStore<RootState>();
  const application = useApplication();

  const { t } = useTranslation();
  const staticServerName = getEnvironment('REACT_APP_HOMESERVER');

  const [guestDisplayName, setGuestDisplayName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [guestMessage, setGuestMessage] = useState('');

  const handleJoinAsGuest = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setGuestMessage('');

      if (!roomId) {
        return;
      }

      if (!staticServerName || !isValidServerName(staticServerName)) {
        return;
      }

      const displayName = guestDisplayName.trim();

      if (!displayName) {
        setGuestMessage(
          t('login.guestDisplayNameRequired', 'Please enter a display name.'),
        );
        return;
      }

      setIsJoining(true);

      try {
        const homeserverUrl = await discoverHomeserverUrl(staticServerName);

        if (!homeserverUrl) {
          throw new Error('Could not get homeserver base URL');
        }

        const matrixCredentials = await registerGuest(
          homeserverUrl,
          displayName,
        );

        if (!matrixCredentials) {
          setGuestMessage(
            t(
              'login.guestRegistrationFailed',
              'Guest registration failed. Please try again.',
            ),
          );
          return;
        }

        application.getCredentials().setMatrixCredentials(matrixCredentials);
        await application.attemptStartFromStoredSession(
          async (matrixClient) => {
            await matrixClient.knockRoom(roomId);

            const selectInvite = makeSelectMembership(
              matrixCredentials.userId,
              roomId,
              'invite',
            );
            await waitForSelector(store, selectInvite);

            await matrixClient.joinRoom(roomId);

            const selectJoin = makeSelectMembership(
              matrixCredentials.userId,
              roomId,
              'join',
            );
            await waitForSelector(store, selectJoin);
          },
        );
      } catch (error) {
        console.error('Join as guest failed', error);
        setGuestMessage(
          t(
            'login.guestJoinFailed',
            'Failed to join as guest. Please try again.',
          ),
        );
      } finally {
        setIsJoining(false);
      }
    },
    [store, application, roomId, staticServerName, guestDisplayName, t],
  );

  const handleGuestDisplayNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setGuestDisplayName(event.target.value);
    },
    [setGuestDisplayName],
  );

  return (
    <StyledLoginForm onSubmit={handleJoinAsGuest}>
      <StyledFormLabel htmlFor="login-joinAsGuest">
        {t('login.displayName', 'Display name')}
      </StyledFormLabel>
      <StyledFormInput
        id="login-joinAsGuest"
        value={guestDisplayName}
        onChange={handleGuestDisplayNameChange}
        disabled={isJoining}
        style={{ marginBottom: '0.5rem' }}
        autoFocus={primary}
      />
      <FullWidthButton
        type="submit"
        variant={primary ? 'contained' : 'outlined'}
        color="primary"
        disabled={!guestDisplayName.trim() || isJoining}
      >
        {isJoining ? (
          <>
            <CircularProgress size={20} style={{ marginRight: '0.5rem' }} />
            {t('login.joiningAsGuest', 'Joining…')}
          </>
        ) : (
          t('login.joinAsGuest', 'Join as guest')
        )}
      </FullWidthButton>
      {guestMessage !== '' && (
        <small
          style={{
            color: 'red',
            marginTop: '.25rem',
          }}
        >
          {guestMessage}
        </small>
      )}
    </StyledLoginForm>
  );
}
