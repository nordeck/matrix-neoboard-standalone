// SPDX-FileCopyrightText: 2024 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { setLocale } from './lib';

import neoboardDe from '../../matrix-neoboard/packages/react-sdk/src/locales/de/neoboard.json';
import neobaordEn from '../../matrix-neoboard/packages/react-sdk/src/locales/en/neoboard.json';

import toolkitDe from '../node_modules/@matrix-widget-toolkit/mui/build/locales/de/widget-toolkit.json';
import toolkitEn from '../node_modules/@matrix-widget-toolkit/mui/build/locales/en/widget-toolkit.json';

import standaloneDe from './locales/de/translation.json';
import standaloneEn from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    ns: ['translation', 'widget-toolkit', 'neoboard'],
    // Inline all resources in a low-tech way.
    // No need for additional dependencies or loaders.
    resources: {
      de: {
        neoboard: neoboardDe,
        ['widget-toolkit']: toolkitDe,
        translation: standaloneDe,
      },
      en: {
        neoboard: neobaordEn,
        ['widget-toolkit']: toolkitEn,
        translation: standaloneEn,
      },
    },
    debug: import.meta.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    supportedLngs: ['en', 'de'],
    nonExplicitSupportedLngs: true,
  });

setLocale(i18n.language);

i18n.on('languageChanged', () => {
  setLocale(i18n.language);
});

export default i18n;
