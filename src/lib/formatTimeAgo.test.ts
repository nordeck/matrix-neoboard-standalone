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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    vi.useFakeTimers().setSystemTime(new Date('2024-07-24 9:00'));
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    vi.useRealTimers();
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
