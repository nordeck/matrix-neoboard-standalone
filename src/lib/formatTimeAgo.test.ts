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

import { formatTimeAgo } from './formatTimeAgo';

const testDate = new Date('2024-07-24 9:00');
const threeYearsAgo = subtract(testDate, 3);
const threeMonthsAgo = subtract(testDate, 0, 100);
const threeHoursAgo = subtract(testDate, 0, 0, 3);
const threeMinutesAgo = subtract(testDate, 0, 0, 0, 3);
const threeSecondsAgo = subtract(testDate, 0, 0, 0, 0, 3);

describe('formatTimeAgo', () => {
  const originalLang = document.documentElement.lang;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-07-24 9:00'));
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    jest.useRealTimers();
    document.documentElement.lang = originalLang;
  });

  it.each([
    [testDate, 'this minute'],
    [threeYearsAgo, '3 years ago'],
    [threeMonthsAgo, '3 months ago'],
    [threeHoursAgo, '3 hours ago'],
    [threeMinutesAgo, '3 minutes ago'],
    [threeSecondsAgo, 'this minute'],
  ])('for %s should return %s', (date, expected) => {
    expect(formatTimeAgo(date.getTime())).toBe(expected);
  });
});

function subtract(
  date: Date,
  years = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
): Date {
  let timestamp = date.valueOf();

  timestamp = timestamp - years * (365 * 24 * 60 * 60 * 1000);
  timestamp = timestamp - days * (24 * 60 * 60 * 1000);
  timestamp = timestamp - hours * (60 * 60 * 1000);
  timestamp = timestamp - minutes * (60 * 1000);
  timestamp = timestamp - seconds * 1000;

  return new Date(timestamp);
}
