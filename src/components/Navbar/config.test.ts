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
import { assertValidOpenDeskModuleConfig } from './config';

describe('assertValidOpenDeskModuleConfig', () => {
  it('should not accept a missing configuration', () => {
    expect(() => assertValidOpenDeskModuleConfig(undefined)).toThrow();
  });

  it('should not accept the empty configuration', () => {
    expect(() => assertValidOpenDeskModuleConfig({})).toThrow();
  });

  it('should accept additional properties', () => {
    expect(() =>
      assertValidOpenDeskModuleConfig({
        banner: {
          ics_navigation_json_url: 'https://example.com/navigation.json',
          ics_silent_url: 'https://example.com/silent',
          portal_logo_svg_url: 'https://example.com/logo.svg',
          portal_url: 'https://example.com',
          additional: 'foo',
        },
        additional: 'foo',
      }),
    ).not.toThrow();
  });

  it.each<object>([{ banner: null }, { banner: 123 }])(
    'should reject wrong configuration %j',
    (patch) => {
      expect(() =>
        assertValidOpenDeskModuleConfig({
          banner: {
            ics_navigation_json_url: 'https://example.com/navigation.json',
            ics_silent_url: 'https://example.com/silent',
            portal_logo_svg_url: 'https://example.com/logo.svg',
            portal_url: 'https://example.com',
          },
          ...patch,
        }),
      ).toThrow();
    },
  );

  it.each<object>([
    { ics_navigation_json_url: undefined },
    { ics_navigation_json_url: null },
    { ics_navigation_json_url: 123 },
    { ics_navigation_json_url: 'no-uri' },
    { ics_silent_url: undefined },
    { ics_silent_url: null },
    { ics_silent_url: 123 },
    { ics_silent_url: 'no-uri' },
    { portal_logo_svg_url: undefined },
    { portal_logo_svg_url: null },
    { portal_logo_svg_url: 123 },
    { portal_logo_svg_url: 'no-uri' },
    { portal_url: undefined },
    { portal_url: null },
    { portal_url: 123 },
    { portal_url: 'no-uri' },
  ])('should reject wrong banner configuration %j', (patch) => {
    expect(() =>
      assertValidOpenDeskModuleConfig({
        banner: {
          ics_navigation_json_url: 'https://example.com/navigation.json',
          ics_silent_url: 'https://example.com/silent',
          portal_logo_svg_url: 'https://example.com/logo.svg',
          portal_url: 'https://example.com',
          ...patch,
        },
      }),
    ).toThrow();
  });
});
