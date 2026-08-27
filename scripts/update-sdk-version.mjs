/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';

const sdkSha = process.env.NEOBOARD_SDK_SHA;

if (!sdkSha || !/^[0-9a-fA-F]{40}$/.test(sdkSha)) {
  throw new Error(
    'NEOBOARD_SDK_SHA must contain a full 40-character commit SHA.',
  );
}

await writeFile(new URL('../sdk.version', import.meta.url), `${sdkSha}\n`);
