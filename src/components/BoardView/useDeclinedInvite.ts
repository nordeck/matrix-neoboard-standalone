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

import { useEffect, useState } from 'react';
import { getDeclinedInvitesKey } from '../../utils/declinedInvites';

export function useDeclinedInvite(userId: string, roomId: string): boolean {
  const [isDeclined, setIsDeclined] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (!userId || !roomId) {
        setIsDeclined(false);
        return;
      }

      const key = getDeclinedInvitesKey(userId);
      const raw = localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) ?? []) : [];

      setIsDeclined(Array.isArray(list) && list.includes(roomId));
    } catch (e) {
      console.error('Failed to read declined invites from localStorage', e);
      setIsDeclined(false);
    }
  }, [userId, roomId]);

  return isDeclined;
}
