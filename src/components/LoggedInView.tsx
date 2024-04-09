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
import { MatrixClientProvider, useMatrixClient } from '../state';

function LoggedInDemo() {
  const matrixClient = useMatrixClient();
  return <div>Matrix ID: {matrixClient.getUserId()}</div>;
}

type LoggedInViewProps = {
  matrixClient: MatrixClient;
};

export function LoggedInView({ matrixClient }: LoggedInViewProps) {
  return (
    <MatrixClientProvider matrixClient={matrixClient}>
      <h3>Logged in</h3>
      <LoggedInDemo />
    </MatrixClientProvider>
  );
}
