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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoggedIn } from '../state';
import type { InviteEntry } from '../store/api/selectors/selectInvites';

type UseInviteActionsOptions = {
  onAcceptSuccess?: () => void;
  onRejectSuccess?: () => void;
};

export function useInviteActions(
  invite: InviteEntry,
  options?: UseInviteActionsOptions,
) {
  const { standaloneClient } = useLoggedIn();

  const callbacksRef = useRef<UseInviteActionsOptions | undefined>(options);

  useEffect(() => {
    callbacksRef.current = options;
  }, [options, options?.onAcceptSuccess, options?.onRejectSuccess]);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [error, setError] = useState(false);
  const [hasPendingAction, setHasPendingAction] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAcceptInvite = useCallback(async () => {
    setHasPendingAction(true);
    setError(false);

    try {
      await standaloneClient.joinRoom(invite.roomId);
      if (isMountedRef.current) {
        setSuccess(true);
        callbacksRef.current?.onAcceptSuccess?.();
      }
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError(true);
      }
    } finally {
      if (isMountedRef.current) {
        setHasPendingAction(false);
      }
    }
  }, [invite.roomId, standaloneClient]);

  const handleRejectInvite = useCallback(async () => {
    setHasPendingAction(true);
    setError(false);

    try {
      await standaloneClient.leaveRoom(invite.roomId);
      if (isMountedRef.current) {
        setSuccess(true);
        callbacksRef.current?.onRejectSuccess?.();
      }
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError(true);
      }
    } finally {
      if (isMountedRef.current) {
        setHasPendingAction(false);
      }
    }
  }, [invite.roomId, standaloneClient]);

  return {
    handleAcceptInvite,
    handleRejectInvite,
    hasPendingAction,
    error,
    success,
    setSuccess,
  } as const;
}
