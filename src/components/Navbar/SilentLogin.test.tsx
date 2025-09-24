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

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SilentLogin } from './SilentLogin';
import { renderWithTheme } from './test-utils';

describe('SilentLogin', () => {
  const url = 'https://example.com/silent';

  it('triggers onLoggedIn-callback', () => {
    const callback = vi.fn();
    const src = new URL(url);
    renderWithTheme(<SilentLogin onLoggedIn={callback} url={url} />);
    fireEvent(
      window,
      new MessageEvent('message', {
        data: {
          loggedIn: true,
        },
        origin: src.origin,
      }),
    );
    expect(callback).toHaveBeenCalledWith(true);
  });

  it(`renders with src "${url.toString()}"`, () => {
    renderWithTheme(<SilentLogin onLoggedIn={() => {}} url={url} />);
    expect(screen.getByTitle('Silent Login')).toHaveAttribute(
      'src',
      url.toString(),
    );
  });
});
