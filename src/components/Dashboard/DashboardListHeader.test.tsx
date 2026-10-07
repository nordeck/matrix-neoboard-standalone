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
import { DashboardListHeader } from './DashboardListHeader';

describe('DashboardListHeader', () => {
  let store: StoreType;

  beforeEach(() => {
    store = createStore({
      standaloneApi: new Promise(() => {}),
      widgetApi: new Promise(() => {}),
    });
  });

  function renderHeader() {
    render(
      <Provider store={store}>
        <table>
          <thead>
            <DashboardListHeader />
          </thead>
        </table>
      </Provider>,
    );
  }

  it('should only show the sorting of the active column', () => {
    renderHeader();
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    const modifiedHeader = screen.getByRole('columnheader', {
      name: /Modified/,
    });
    const createdHeader = screen.getByRole('columnheader', {
      name: /Created/,
    });

    expect(nameHeader).not.toHaveAttribute('aria-sort');
    expect(within(nameHeader).queryByRole('img')).not.toBeInTheDocument();
    expect(modifiedHeader).toHaveAttribute('aria-sort', 'descending');
    expect(
      within(modifiedHeader).getByRole('img', { name: 'Descending' }),
    ).toBeInTheDocument();
    expect(createdHeader).not.toHaveAttribute('aria-sort');
    expect(within(createdHeader).queryByRole('img')).not.toBeInTheDocument();
  });

  it('should toggle the sorting of the active column', async () => {
    renderHeader();
    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by Modified' }),
    );

    expect(store.getState().dashboardReducer).toMatchObject({
      sortBy: 'modified',
      sortDirection: 'asc',
    });
    expect(
      screen.getByRole('columnheader', { name: /Modified/ }),
    ).toHaveAttribute('aria-sort', 'ascending');
  });

  it('should sort by another column and toggle it', async () => {
    renderHeader();
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    const sortByNameButton = screen.getByRole('button', {
      name: 'Sort by Name',
    });

    await userEvent.click(sortByNameButton);

    expect(store.getState().dashboardReducer).toMatchObject({
      sortBy: 'name',
      sortDirection: 'asc',
    });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(
      within(
        screen.getByRole('columnheader', { name: /Modified/ }),
      ).queryByRole('img'),
    ).not.toBeInTheDocument();
    expect(
      within(nameHeader).getByRole('img', { name: 'Ascending' }),
    ).toBeInTheDocument();

    await userEvent.click(sortByNameButton);

    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    expect(
      within(nameHeader).getByRole('img', { name: 'Descending' }),
    ).toBeInTheDocument();
  });
});
