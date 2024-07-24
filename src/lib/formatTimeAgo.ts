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

/**
 * Format a timestamp to a relative format.
 *
 * @param timestamp - Timestamp to format
 * @returns relative format, e.g. "3 hours ago"
 */
export function formatTimeAgo(timestamp: number): string {
  const diff = (new Date().getTime() - timestamp) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const locale = document.documentElement.lang;
  const formatTime = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    return formatTime.format(-years, 'year');
  }

  if (months > 0) {
    return formatTime.format(-months, 'month');
  }

  if (days > 0) {
    return formatTime.format(-days, 'day');
  }

  if (hours > 0) {
    return formatTime.format(-hours, 'hour');
  }

  return formatTime.format(-minutes, 'minute');
}
