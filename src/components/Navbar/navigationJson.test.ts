// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { describe, expect, it } from 'vitest';
import { assertValidNavigationJson } from './navigationJson';

describe('assertValidNavigationJson', () => {
  const json = {
    categories: [{ entries: [] }],
  };

  it('should not accept a missing JSON', () => {
    expect(() => assertValidNavigationJson(undefined)).toThrow();
  });

  it('should accept a valid JSON', () => {
    expect(() => assertValidNavigationJson(json)).not.toThrow();
  });

  it('should accept a JSON with additional properties', () => {
    expect(() =>
      assertValidNavigationJson({ ...json, additional: 'foo' }),
    ).not.toThrow();
  });

  it('should not accept a JSON without categories', () => {
    expect(() => assertValidNavigationJson({})).toThrow();
  });

  it('should accept a JSON with additional properties in categories', () => {
    expect(() =>
      assertValidNavigationJson({
        categories: [{ entries: [], additional: 'foo' }],
      }),
    ).not.toThrow();
  });

  it('should not accept a JSON without category entries', () => {
    expect(() => assertValidNavigationJson({ categories: [{}] })).toThrow();
  });

  it('should accept a JSON with additional properties in category entries', () => {
    expect(() =>
      assertValidNavigationJson({
        categories: [{ entries: [{ additional: 'foo' }] }],
      }),
    ).not.toThrow();
  });

  it.each<object>([
    { categories: [{ entries: [], display_name: '' }] },
    { categories: [{ entries: [], display_name: 'foo' }] },
    { categories: [{ entries: [], display_name: undefined }] },
    { categories: [{ entries: [], identifier: '' }] },
    { categories: [{ entries: [], identifier: 'foo' }] },
    { categories: [{ entries: [], identifier: undefined }] },
    { categories: [{ entries: [{ display_name: '' }] }] },
    { categories: [{ entries: [{ display_name: 'foo' }] }] },
    { categories: [{ entries: [{ display_name: undefined }] }] },
    { categories: [{ entries: [{ icon_url: '' }] }] },
    { categories: [{ entries: [{ icon_url: 'foo' }] }] },
    { categories: [{ entries: [{ icon_url: undefined }] }] },
    { categories: [{ entries: [{ icon_url: null }] }] },
    { categories: [{ entries: [{ identifier: '' }] }] },
    { categories: [{ entries: [{ identifier: 'foo' }] }] },
    { categories: [{ entries: [{ identifier: undefined }] }] },
    { categories: [{ entries: [{ link: '' }] }] },
    { categories: [{ entries: [{ link: 'foo' }] }] },
    { categories: [{ entries: [{ link: undefined }] }] },
    { categories: [{ entries: [{ target: '' }] }] },
    { categories: [{ entries: [{ target: 'foo' }] }] },
    { categories: [{ entries: [{ target: undefined }] }] },
  ])('should not reject valid JSON %j', (json) => {
    expect(() => assertValidNavigationJson(json)).not.toThrow();
  });

  it.each<object>([
    { categories: [{ entries: [], display_name: 123 }] },
    { categories: [{ entries: [], display_name: [] }] },
    { categories: [{ entries: [], display_name: null }] },
    { categories: [{ entries: [], display_name: true }] },
    { categories: [{ entries: [], display_name: {} }] },
    { categories: [{ entries: [], identifier: 123 }] },
    { categories: [{ entries: [], identifier: [] }] },
    { categories: [{ entries: [], identifier: null }] },
    { categories: [{ entries: [], identifier: true }] },
    { categories: [{ entries: [], identifier: {} }] },
    { categories: [{ entries: [{ display_name: 123 }] }] },
    { categories: [{ entries: [{ display_name: [] }] }] },
    { categories: [{ entries: [{ display_name: null }] }] },
    { categories: [{ entries: [{ display_name: true }] }] },
    { categories: [{ entries: [{ display_name: {} }] }] },
    { categories: [{ entries: [{ icon_url: 123 }] }] },
    { categories: [{ entries: [{ icon_url: [] }] }] },
    { categories: [{ entries: [{ icon_url: true }] }] },
    { categories: [{ entries: [{ icon_url: {} }] }] },
    { categories: [{ entries: [{ identifier: 123 }] }] },
    { categories: [{ entries: [{ identifier: [] }] }] },
    { categories: [{ entries: [{ identifier: null }] }] },
    { categories: [{ entries: [{ identifier: true }] }] },
    { categories: [{ entries: [{ identifier: {} }] }] },
    { categories: [{ entries: [{ link: 123 }] }] },
    { categories: [{ entries: [{ link: [] }] }] },
    { categories: [{ entries: [{ link: null }] }] },
    { categories: [{ entries: [{ link: true }] }] },
    { categories: [{ entries: [{ link: {} }] }] },
    { categories: [{ entries: [{ target: 123 }] }] },
    { categories: [{ entries: [{ target: [] }] }] },
    { categories: [{ entries: [{ target: null }] }] },
    { categories: [{ entries: [{ target: true }] }] },
    { categories: [{ entries: [{ target: {} }] }] },
  ])('should reject wrong JSON %j', (json) => {
    expect(() => assertValidNavigationJson(json)).toThrow(/must be a string/);
  });
});
