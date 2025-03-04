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

import { useWidgetApi } from '@matrix-widget-toolkit/react';
import { createContext, PropsWithChildren, useContext } from 'react';
import { StandaloneWidgetApi } from '../../toolkit/standalone';

const StandaloneWidgetApiContext = createContext<
  StandaloneWidgetApi | undefined
>(undefined);

export function StandaloneWidgetApiProvider({
  children,
}: PropsWithChildren<{}>) {
  const widgetApi = useWidgetApi();

  return (
    <StandaloneWidgetApiContext.Provider
      value={widgetApi as StandaloneWidgetApi}
    >
      {children}
    </StandaloneWidgetApiContext.Provider>
  );
}

export function useStandaloneWidgetApi(): StandaloneWidgetApi {
  const context = useContext(StandaloneWidgetApiContext);

  if (!context) {
    throw new Error(
      'useStandaloneWidgetApi can only be used inside a <StandaloneWidgetApiProvider>',
    );
  }

  return context;
}
