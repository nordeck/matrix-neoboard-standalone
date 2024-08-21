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

import { WhiteboardReactI18nBackend } from '@nordeck/matrix-neoboard-react-sdk';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { setLocale } from './lib';

// Vite seems to handle imports relative to `node_modules/.vite` for dependencies
// This causes the import to fail in the browser
export const WidgetToolkitI18nBackend = resourcesToBackend((lng, ns, clb) => {
  import(
    /* @vite-ignore */ `@matrix-widget-toolkit/mui/locales/${lng}/${ns}.json`
  )
    .then((resources) => clb(null, resources))
    .catch((err) => clb(err, undefined));
});

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(ChainedBackend)
  .init({
    ns: ['translation', 'widget-toolkit', 'neoboard'],
    backend: {
      backends: [
        HttpBackend,
        WhiteboardReactI18nBackend,
        WidgetToolkitI18nBackend,
      ],
      backendOptions: [{ loadPath: `/locales/{{lng}}/{{ns}}.json` }],
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
