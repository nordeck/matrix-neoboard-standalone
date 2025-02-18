/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
