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

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BannerConfig } from './config';
import { Navbar } from './Navbar';
import { renderWithTheme } from './test-utils';

describe('Navbar', () => {
  const config: BannerConfig = {
    ics_navigation_json_url: 'https://example.com/navigation.json',
    ics_silent_url: 'https://example.com/silent',
    portal_logo_svg_url: 'https://example.com/logo.svg',
    portal_url: 'https://example.com',
  };
  const messageEvent = new MessageEvent('message', {
    data: {
      loggedIn: true,
    },
    origin: config.portal_url,
  });

  it('renders portal link', () => {
    renderWithTheme(<Navbar config={config} />);
    const navigation = screen.getByRole('navigation');
    const link = within(navigation).getByRole('link');
    expect(link).toHaveAttribute('href', config.portal_url);
  });

  it('logs in silently', () => {
    renderWithTheme(<Navbar config={config} />);
    const navigation = screen.getByRole('navigation');
    const iframe = within(navigation).getByTitle('Silent Login');
    expect(iframe).toBeInTheDocument();
    fireEvent(window, messageEvent);
    expect(iframe).not.toBeInTheDocument();
  });

  it('fetches navigation JSON', async () => {
    renderWithTheme(<Navbar config={config} />);
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => ({ categories: [{ entries: [] }] }),
    });
    fireEvent(window, messageEvent);
    await waitFor(() =>
      expect(window.fetch).toHaveBeenCalledWith(
        'https://example.com/navigation.json?language=undefined',
        { credentials: 'include' },
      ),
    );
  });

  it('catches navigation JSON fetch error', async () => {
    renderWithTheme(<Navbar config={config} />);
    const error = new Error('Test');
    console.error = vi.fn();
    window.fetch = vi.fn().mockRejectedValue(error);
    fireEvent(window, messageEvent);
    await waitFor(() => expect(window.fetch).toHaveBeenCalled());
    expect(console.error).toHaveBeenCalledWith(error);
  });

  describe('menu', () => {
    beforeEach(() => {
      window.fetch = vi
        .fn()
        .mockResolvedValue({ ok: true, json: () => ({ categories: [] }) });
    });

    it('allows to toggle menu', async () => {
      renderWithTheme(<Navbar config={config} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      expect(screen.getByRole('list')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { expanded: true }));
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('allows to close menu via click on menu-backdrop', async () => {
      renderWithTheme(<Navbar config={config} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByTestId('menu-backdrop'));
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('allows to close menu via escape-key on menu-list', async () => {
      renderWithTheme(<Navbar config={config} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.keyDown(screen.getByRole('list'), { key: 'Escape' });
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('disallows to close menu via any other key on menu-list', async () => {
      renderWithTheme(<Navbar config={config} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.keyDown(screen.getByRole('list'));
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
