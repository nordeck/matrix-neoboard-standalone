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

import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';
import { renderWithTheme } from './test-utils';
import {BannerConfig} from "./config.ts";
import {Navbar} from "./Navbar.tsx";

describe('Menu', () => {
  const navigationJson = {
    categories: [
      {
        display_name: 'Foo',
        entries: [
          {
            display_name: 'Bar',
            icon_url: 'https://example.com/bar-icon.svg',
            identifier: 'foo-bar',
            link: 'https://example.com/bar',
            target: 'bar',
          },
        ],
        identifier: 'foo',
      },
    ],
  };
  const config: BannerConfig = {
    ics_navigation_json_url: 'https://example.com/navigation.json',
    ics_silent_url: 'https://example.com/silent',
    portal_logo_svg_url: 'https://example.com/logo.svg',
    portal_logo_width: '82px',
    portal_url: 'https://example.com',
  };

  it('renders a given navigation JSON', () => {
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={() => {}}
        onKeyDown={() => {}}
        config={config}
        open
      />,
    );
    const link = screen.getByRole('link', { name: 'Bar' });
    expect(link).toHaveAttribute('href', 'https://example.com/bar');
    expect(link).toHaveAttribute('target', 'bar');
    const img = within(link).getByRole('presentation');
    expect(img).toHaveAttribute('src', 'https://example.com/bar-icon.svg');
  });

  it('renders portal link', () => {
    renderWithTheme(<Navbar config={config} />);
    const navigation = screen.getByRole('navigation');
    const link = within(navigation).getByRole('link');
    expect(link).toHaveAttribute('href', config.portal_url);
  });


  it('triggers onClick-callback', () => {
    const callback = vi.fn();
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={callback}
        onKeyDown={() => {}}
        config={config}
        open
      />,
    );
    fireEvent.click(screen.getByTestId('menu-backdrop'));
    expect(callback).toHaveBeenCalled();
  });

  it('triggers onClick-callback when the close button is clicked', () => {
    const callback = vi.fn();
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={callback}
        onKeyDown={() => {}}
        config={config}
        open
      />,
    );
    fireEvent.click(screen.getByTestId('menu-close-button'));
    expect(callback).toHaveBeenCalled();
  });

  it('triggers onKeyDown-callback', () => {
    const callback = vi.fn();
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={() => {}}
        onKeyDown={callback}
        config={config}
        open
      />,
    );
    fireEvent.keyDown(screen.getByTestId('menu-list'));
    expect(callback).toHaveBeenCalled();
  });
});
