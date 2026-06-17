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

import { useMemo } from 'react';
import { getDeclinedInvitesKey } from '../../utils/declinedInvites';

export function useDeclinedInvite(userId: string, roomId: string): boolean {
  return useMemo(() => {
    if (!userId || !roomId) return false;
    try {
      const key = getDeclinedInvitesKey(userId);
      const declinedInvites = localStorage.getItem(key);
      const declinedInvitesList = declinedInvites
        ? JSON.parse(declinedInvites)
        : [];
      return (
        Array.isArray(declinedInvitesList) &&
        declinedInvitesList.includes(roomId)
      );
    } catch (e) {
      console.error('Failed to read declined invites from localStorage', e);
      return false;
    }
  }, [userId, roomId]);
}
