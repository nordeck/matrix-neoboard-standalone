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

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Launcher } from './Launcher';
import { renderWithTheme } from './test-utils';

describe('Launcher', () => {
  const label = 'Show menu';

  it('renders with aria-expanded "false"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('renders with aria-expanded "true"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={true} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });

  it('renders with aria-label', () => {
    renderWithTheme(
      <Launcher ariaExpanded={true} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('triggers onClick-callback', () => {
    const callback = vi.fn();
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={callback} />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(callback).toHaveBeenCalled();
  });

  it('renders with aria-haspopup "true"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'true');
  });
});
