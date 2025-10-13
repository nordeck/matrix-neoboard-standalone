// SPDX-License-Identifier: AGPL-3.0-or-later

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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Login } from './Login';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

describe('<Login />', () => {
  it('should show the servername field, if there is no homeserver configured', () => {
    render(<Login />);

    expect(
      screen.getByRole('textbox', { name: 'Homeserver' }),
    ).toBeInTheDocument();
  });

  it('should not show the servername field, if there is a homeserver configured', () => {
    vi.mocked(getEnvironment).mockImplementation((name) => {
      return name === 'REACT_APP_HOMESERVER' ? 'example.com' : '';
    });

    render(<Login />);

    expect(
      screen.queryByRole('textbox', { name: 'Homeserver' }),
    ).not.toBeInTheDocument();
  });
});
