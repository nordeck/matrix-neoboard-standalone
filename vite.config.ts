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

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
import {
  Plugin,
  PluginOption,
  defineConfig,
  searchForWorkspaceRoot,
} from 'vite';

const plugins: [Plugin | PluginOption] = [react()];

if (process.env.VITE_DEV_SSL === 'true') {
  plugins.push(basicSsl());
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@matrix-org/matrix-sdk-crypto-wasm'],
  },
  esbuild: {
    // needed to fix neoboard yjs errors, see: https://github.com/vitejs/vite/issues/11722
    target: 'es2020',
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      strictRequires: true,
    },
  },
  resolve: {
    dedupe: [
      '@matrix-widget-toolkit/mui',
      '@matrix-widget-toolkit/react',
      '@mui/material',
      'i18next',
      'i18next-browser-languagedetector',
      'react',
      'react-18next',
      'react-dom',
      'react-redux',
    ],
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '../matrix-neoboard/packages/react-sdk/src/components/BoardBar/pdf/',
        '../matrix-neoboard/node_modules/@fontsource/',
        '../matrix-neoboard/node_modules/pdfmake/build/',
      ],
    },
  },
  plugins,
  // Use the env prefix from CRA for backward compatibility.
  envPrefix: 'REACT_APP_',
});
