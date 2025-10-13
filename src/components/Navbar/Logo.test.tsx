// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from './Logo';
import { renderWithTheme } from './test-utils';

describe('Logo', () => {
  const alt = 'Logo';
  const href = 'https://exmaple.com';
  const label = 'Show portal';
  const src = 'https://example.com/logo.svg';

  it(`renders with alt "${alt}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', alt);
  });

  it(`renders with href "${href}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', href);
  });

  it(`renders with aria-label "${label}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('link')).toHaveAccessibleName(label);
  });

  it(`renders with src "${src}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', src);
  });
});
