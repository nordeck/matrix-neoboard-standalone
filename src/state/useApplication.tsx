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
