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
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useParams } from 'react-router';

type SelectedRoomContextType = {
  selectedRoomId: string | undefined;
};

const SelectedRoomContext = createContext<SelectedRoomContextType | undefined>(
  undefined,
);

export const useSelectedRoom = () => {
  const context = useContext(SelectedRoomContext);
  if (!context) {
    throw new Error(
      'useSelectedRoom must be used within a SelectedRoomProvider',
    );
  }
  return context;
};

export const SelectedRoomProvider = ({ children }: { children: ReactNode }) => {
  const { roomId } = useParams();
  const location = useLocation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setSelectedRoomId(undefined);
    } else if (roomId) {
      setSelectedRoomId(roomId);
    }
  }, [roomId, location.pathname]);

  return (
    <SelectedRoomContext.Provider value={{ selectedRoomId }}>
      {children}
    </SelectedRoomContext.Provider>
  );
};
