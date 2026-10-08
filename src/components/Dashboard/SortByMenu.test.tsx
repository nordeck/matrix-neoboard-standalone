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

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it } from 'vitest';
import { StoreType, createStore } from '../../store';
import { SortByMenu } from './SortByMenu';

describe('SortByMenu', () => {
  let store: StoreType;

  beforeEach(() => {
    store = createStore({
      standaloneApi: new Promise(() => {}),
      widgetApi: new Promise(() => {}),
    });
  });

  async function openMenu() {
    render(
      <Provider store={store}>
        <SortByMenu />
      </Provider>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Sort by:/ }));
    return screen.getByRole('menu');
  }

  it('should show a single option per sort field', async () => {
    const menu = await openMenu();

    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Name');
    expect(within(items[0]).queryByRole('img')).not.toBeInTheDocument();
    expect(items[1]).toHaveTextContent('Date modified');
    expect(
      within(items[1]).getByRole('img', { name: 'Descending' }),
    ).toBeInTheDocument();
    expect(items[2]).toHaveTextContent('Date created');
    expect(within(items[2]).queryByRole('img')).not.toBeInTheDocument();
  });

  it('should toggle the direction of the selected sort field', async () => {
    const menu = await openMenu();
    const modifiedItem = within(menu).getByRole('menuitem', {
      name: /Date modified/,
    });

    await userEvent.click(modifiedItem);

    expect(store.getState().dashboardReducer).toMatchObject({
      sortBy: 'modified',
      sortDirection: 'asc',
    });
    expect(
      within(modifiedItem).getByRole('img', { name: 'Ascending' }),
    ).toBeInTheDocument();
  });

  it('should switch to another sort field and toggle it', async () => {
    const menu = await openMenu();
    const nameItem = within(menu).getByRole('menuitem', {
      name: /Name/,
    });

    await userEvent.click(nameItem);

    expect(store.getState().dashboardReducer).toMatchObject({
      sortBy: 'name',
      sortDirection: 'asc',
    });
    expect(
      within(nameItem).getByRole('img', { name: 'Ascending' }),
    ).toBeInTheDocument();
    expect(
      within(
        within(menu).getByRole('menuitem', { name: /Date modified/ }),
      ).queryByRole('img'),
    ).not.toBeInTheDocument();

    await userEvent.click(nameItem);

    expect(store.getState().dashboardReducer).toMatchObject({
      sortBy: 'name',
      sortDirection: 'desc',
    });
    expect(
      within(nameItem).getByRole('img', { name: 'Descending' }),
    ).toBeInTheDocument();
  });
});
