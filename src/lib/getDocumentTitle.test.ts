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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { describe, expect, it, vi } from 'vitest';
import { getDocumentTitle } from './getDocumentTitle';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

function mockEnvironment(environment: Record<string, string>) {
  vi.mocked(getEnvironment).mockImplementation(
    (name, defaultValue) => environment[name] ?? defaultValue,
  );
}

describe('getDocumentTitle', () => {
  it('should suffix the product name for the opendesk appearance', () => {
    mockEnvironment({
      REACT_APP_APPEARANCE: 'opendesk',
      REACT_APP_PRODUCT_NAME: 'Whiteboard',
    });

    expect(getDocumentTitle()).toBe('Whiteboard - openDesk');
  });

  it('should suffix the default product name for the opendesk appearance', () => {
    mockEnvironment({ REACT_APP_APPEARANCE: 'opendesk' });

    expect(getDocumentTitle()).toBe('NeoBoard - openDesk');
  });

  it('should use the plain product name for the neoboard appearance', () => {
    mockEnvironment({
      REACT_APP_APPEARANCE: 'neoboard',
      REACT_APP_PRODUCT_NAME: 'NeoBoard',
    });

    expect(getDocumentTitle()).toBe('NeoBoard');
  });

  it('should only use the product name if no appearance is configured', () => {
    mockEnvironment({ REACT_APP_PRODUCT_NAME: 'NeoBoard' });

    expect(getDocumentTitle()).toBe('NeoBoard');
  });
});
