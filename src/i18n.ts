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
