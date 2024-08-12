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
