// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

/**
 * Checks whether a server name string is set and valid.
 *
 * @param serverName - the home server name to check
 * @returns true if the server name is set and valid, false otherwise
 */
export function isValidServerName(
  serverName: string | undefined,
): serverName is string {
  if (!serverName?.trim()) {
    return false;
  }

  try {
    const urlString = serverName.includes('://')
      ? serverName
      : `https://${serverName}`;

    const url = new URL(urlString);

    // Check if hostname looks like a valid domain
    return (
      !!url.hostname &&
      url.hostname.includes('.') &&
      url.hostname.split('.').every((part) => part.length > 0)
    );
  } catch {
    return false;
  }
}
