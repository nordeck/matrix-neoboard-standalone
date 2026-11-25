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

const CACHE_NAME = 'neoboard-board-previews-v1';

export async function savePreviewSvg(
  roomId: string,
  svgHtml: string,
): Promise<void> {
  if (!('caches' in window)) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(
    `/board-preview/${roomId}`,
    new Response(svgHtml, { headers: { 'Content-Type': 'image/svg+xml' } }),
  );
}

export async function getPreviewSvg(roomId: string): Promise<string | null> {
  if (!('caches' in window)) return null;
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/board-preview/${roomId}`);
  return response ? response.text() : null;
}
