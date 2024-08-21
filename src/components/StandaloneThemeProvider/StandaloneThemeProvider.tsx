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

import { MuiThemeProvider } from '@matrix-widget-toolkit/mui';
import { useThemeSelection } from '@matrix-widget-toolkit/react';
import { ThemeProvider, useTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { standaloneLightTheme } from './theme';

/**
 * This component uses the MuiThemeProvider from matrix-widget-toolkit and
 * then uses ApplyStandaloneThemeProvider to apply and provide the standalone custom theme.
 */
export function StandaloneThemeProvider({ children }: PropsWithChildren<{}>) {
  return (
    <MuiThemeProvider>
      <ApplyStandaloneThemeProvider>{children}</ApplyStandaloneThemeProvider>{' '}
    </MuiThemeProvider>
  );
}

function ApplyStandaloneThemeProvider({ children }: PropsWithChildren<{}>) {
  const theme = useTheme();
  const { setTheme, theme: selectedTheme } = useThemeSelection();

  // Select light theme until a dark theme has has been properly implemented
  useEffect(() => {
    if (selectedTheme !== 'light') {
      setTheme('light');
    }
  }, [selectedTheme]);

  const standaloneTheme = useMemo(() => {
    return deepmerge(theme, standaloneLightTheme);
  }, [theme]);

  return <ThemeProvider theme={standaloneTheme}>{children}</ThemeProvider>;
}
