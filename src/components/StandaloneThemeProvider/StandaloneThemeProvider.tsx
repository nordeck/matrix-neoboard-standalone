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
