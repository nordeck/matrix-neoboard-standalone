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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { ThemeOptions } from '@mui/material';
import { getEnvironmentAppearance } from '../../lib';

const fontFamily = [
  'Roboto',
  'Inter',
  'Noto Sans',
  'Ubuntu',
  'Cantarel',
  'Arial',
  'Helvetica',
  'sans-serif',
  'Twemoji',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Noto Color Emoji"',
].join(',');

type AppearanceDefaults = {
  lightPrimaryColor: string;
  lightPrimaryColorLight: string;
  lightPrimaryColorDark: string;
  lightBackgroundLoggedIn: string;
  lightBackgroundCard: string;
  offsetHeight: string;
};

const neoboardAppearanceDefaults: AppearanceDefaults = {
  lightPrimaryColor: '#e85e10',
  lightPrimaryColorLight: '#ff8a42',
  lightPrimaryColorDark: '#b52e00',
  lightBackgroundLoggedIn: '#fcf9f3',
  lightBackgroundCard: '#fce2cf',
  offsetHeight: '10vh',
};

const opendeskAppearanceDefaults: AppearanceDefaults = {
  lightPrimaryColor: '#5e27dd',
  lightPrimaryColorLight: '#612cdd',
  lightPrimaryColorDark: '#5a25d4',
  lightBackgroundLoggedIn: '#eee6fb',
  lightBackgroundCard: '#d2c1f4',
  offsetHeight: '64px',
};

const appearance = getEnvironmentAppearance();

let appearanceDefaults: AppearanceDefaults;
if (appearance === 'neoboard') {
  appearanceDefaults = neoboardAppearanceDefaults;
} else if (appearance === 'opendesk') {
  appearanceDefaults = opendeskAppearanceDefaults;
} else {
  throw new Error(`unexpected REACT_APP_APPEARANCE value ${appearance}`);
}

const lightPrimaryColor = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR',
  appearanceDefaults.lightPrimaryColor,
);

const lightPrimaryColorLight = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR_LIGHT',
  appearanceDefaults.lightPrimaryColorLight,
);

const lightPrimaryColorDark = getEnvironment(
  'REACT_APP_LIGHT_PRIMARY_COLOR_DARK',
  appearanceDefaults.lightPrimaryColorDark,
);

const lightBackgroundLoggedIn = getEnvironment(
  'REACT_APP_LIGHT_BACKGROUND_LOGGED_IN',
  appearanceDefaults.lightBackgroundLoggedIn,
);

const lightBackgroundCard = getEnvironment(
  'REACT_APP_LIGHT_BACKGROUND_CARD',
  appearanceDefaults.lightBackgroundCard,
);

// opendesk navbar styling
const textActionAccent = getEnvironment(
  'REACT_APP_OPENDESK_BANNER_TEXT_ACTION_ACCENT',
  '#5e27dd',
);

// opendesk navbar styling
const textPrimary = getEnvironment(
  'REACT_APP_OPENDESK_BANNER_COLOR_TEXT_PRIMARY',
  '#1b1d22',
);

export const standaloneLightTheme: ThemeOptions = {
  palette: {
    primary: {
      main: lightPrimaryColor,
      light: lightPrimaryColorLight,
      dark: lightPrimaryColorDark,
    },
    background: {
      loggedIn: lightBackgroundLoggedIn,
      card: lightBackgroundCard,
      paper: '#fff',
    },
  },
  typography: {
    fontFamily,
  },
  offsetHeight: appearanceDefaults.offsetHeight,
  navbar: {
    color: {
      bgCanvasDefault: '#ffffff',
      textActionAccent,
      textPrimary,
      iconOnSolidPrimary: '#ffffff',
    },
    height: '63px',
  },
};
