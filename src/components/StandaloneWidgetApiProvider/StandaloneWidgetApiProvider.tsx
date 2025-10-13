// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
