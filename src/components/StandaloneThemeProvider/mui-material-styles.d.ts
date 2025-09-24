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

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    offsetHeight: string;
    navbar: NavbarOptions;
  }
  interface ThemeOptions {
    offsetHeight: string;
    navbar: NavbarOptions;
  }
  interface TypeBackground {
    loggedIn: string;
    card: string;
  }
}

type NavbarOptions = {
  color: {
    bgCanvasDefault: string;
    textActionAccent: string;
    textPrimary: string;
    iconOnSolidPrimary: string;
  };
  height: string;
};
