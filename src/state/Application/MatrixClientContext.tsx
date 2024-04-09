/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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
