// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { MatrixClient } from 'matrix-js-sdk';
import { PropsWithChildren, createContext, useContext } from 'react';

const MatrixClientContext = createContext<MatrixClient | null>(null);

type MatrixClientProviderProps = {
  matrixClient: MatrixClient;
};

export function MatrixClientProvider({
  matrixClient,
  children,
}: PropsWithChildren<MatrixClientProviderProps>) {
  return (
    <MatrixClientContext.Provider value={matrixClient}>
      {children}
    </MatrixClientContext.Provider>
  );
}

export function useMatrixClient(): MatrixClient {
  const value = useContext(MatrixClientContext);

  if (value === null) {
    throw new Error(
      'useMatrixClient can only be used inside of <MatrixClientProvider>',
    );
  }

  return value;
}
