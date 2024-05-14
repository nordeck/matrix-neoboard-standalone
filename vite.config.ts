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
import { Plugin, PluginOption, defineConfig } from 'vite';

const plugins: [Plugin | PluginOption] = [react()];

if (process.env.VITE_DEV_SSL === 'true') {
  plugins.push(basicSsl());
}

// https://vitejs.dev/config/
export default defineConfig({
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
      'react',
      'react-dom',
      '@matrix-widget-toolkit/react',
      'react-redux',
    ],
  },
  plugins,
  define: {
    global: 'window',
    'process.env': {},
  },
});
