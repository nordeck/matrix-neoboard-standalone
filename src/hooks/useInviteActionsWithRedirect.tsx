/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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
  SnackbarDismissAction,
  useSnackbar,
} from '@nordeck/matrix-neoboard-react-sdk';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { InviteEntry } from '../store/api/selectors/selectInvites';
import { useInviteActions } from './useInviteActions';

export function useInviteActionsWithRedirect(invite: InviteEntry) {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onRejectSuccess = useCallback(() => {
    showSnackbar({
      key: 'invite-declined',
      message: t(
        'invitesDialog.inviteDeclined',
        'You declined the invitation to the board “{{roomName}}” and no longer have access. You will now be redirected to the dashboard.',
        { roomName: invite.roomName ?? invite.roomId },
      ),
      action: <SnackbarDismissAction />,
      autoHideDuration: 8000,
    });

    navigate('/dashboard', { state: { inviteDeclined: true }, replace: true });
  }, [showSnackbar, t, navigate, invite.roomName, invite.roomId]);

  return useInviteActions(invite, { onRejectSuccess });
}
