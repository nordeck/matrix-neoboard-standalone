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

import React, { PropsWithChildren, useContext } from 'react';
import { Application } from './Application';

const ApplicationContext = React.createContext<Application | undefined>(
  undefined,
);

export function ApplicationProvider({
  application,
  children,
}: PropsWithChildren<{
  application: Application;
}>) {
  return (
    <ApplicationContext.Provider value={application}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication(): Application {
  const context = useContext(ApplicationContext);

  if (context === undefined) {
    throw new Error(
      `useApplication can only be used inside of <ApplicationProvider>`,
    );
  }

  return context;
}
