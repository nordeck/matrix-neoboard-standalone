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
