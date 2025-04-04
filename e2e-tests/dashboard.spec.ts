/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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
import { expect, Page, test } from '@playwright/test';

test('can display dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading')).toContainText('Create a new board');
});

async function deleteBoards(page: Page, ids: string[]) {
  console.log('Deleting boards:', ids);
  await page.goto('/dashboard');

  await expect(
    page.getByRole('heading', { name: 'Starting…' }),
  ).not.toBeVisible();

  // Wait a bit for the boards to load
  await page.waitForTimeout(2000);

  // Check if the board exists
  for (let i = 0; i < ids.length; i++) {
    const board = page.locator(`[href="/board/${ids[i]}"]`);

    await board.locator('[data-testid="MoreHorizIcon"]').click();
    await page.getByRole('menuitem', { name: 'Delete' }).click({ force: true });
    await expect(page.getByRole('heading')).toContainText('Delete NeoBoard');

    await page.getByRole('button', { name: 'Delete Board' }).click();
    await expect(page.getByText('Delete NeoBoard')).not.toBeVisible();

    // Wait a bit for the boards to update
    await page.waitForTimeout(2000);
  }
}

test.describe('dashboard', () => {
  test.describe.configure({ mode: 'serial' });
  test('can create a new board', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create a new board' }).click();

    // Wait for the url to change so we can check for the overlay
    await page.waitForURL('**/board/**');

    await page.waitForSelector('[data-test-id="overlay"]');
    const overlay = page.getByLabel('Welcome');
    if (await overlay.isVisible()) {
      await page.getByRole('button', { name: 'Close' }).click();
    }

    await expect(page.getByLabel('Click to rename')).toContainText('Untitled');

    // Get url and get the path element behind `/board/`
    const url = page.url();
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    const boardId = pathParts[pathParts.length - 1];

    await page.goto('/dashboard');

    await expect(
      page.getByRole('heading', { name: 'Starting…' }),
    ).not.toBeVisible();

    // Wait a bit for the boards to load
    await page.waitForTimeout(2000);

    expect(
      page.getByRole('button', {
        name: new RegExp('Untitled.*'),
      }),
    ).toHaveCount(1);

    await deleteBoards(page, [boardId]);
  });

  test('can create multiple new boards after another', async ({ page }) => {
    const boards: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.goto('/dashboard');

      await expect(
        page.getByRole('heading', { name: 'Starting…' }),
      ).not.toBeVisible();
      await page.getByRole('button', { name: 'Create a new board' }).click();

      await page.waitForURL('**/board/**');

      if (i == 0) {
        // Wait for the url to change so we can check for the overlay
        await page.waitForSelector('[data-test-id="overlay"]');
        const overlay = page.getByLabel('Welcome');
        if (await overlay.isVisible()) {
          await page.getByRole('button', { name: 'Close' }).click();
        }
      }

      await expect(page.getByLabel('Click to rename')).toContainText(
        'Untitled',
      );

      // Get url and get the path element behind `/board/`
      const url = page.url();
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      const boardId = pathParts[pathParts.length - 1];
      boards.push(boardId);
    }

    await page.goto('/dashboard');

    await expect(
      page.getByRole('heading', { name: 'Starting…' }),
    ).not.toBeVisible();

    // Wait a bit for the boards to load
    await page.waitForTimeout(2000);

    expect(
      page.getByRole('button', {
        name: new RegExp('Untitled.*'),
      }),
    ).toHaveCount(3);

    await deleteBoards(page, boards);
  });

  test('can show multiple created boards in the list view', async ({
    page,
  }) => {
    const boards: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.goto('/dashboard');

      await expect(
        page.getByRole('heading', { name: 'Starting…' }),
      ).not.toBeVisible();
      await page.getByRole('button', { name: 'Create a new board' }).click();

      await page.waitForURL('**/board/**');

      if (i == 0) {
        // Wait for the url to change so we can check for the overlay
        await page.waitForSelector('[data-test-id="overlay"]');
        const overlay = page.getByLabel('Welcome');
        if (await overlay.isVisible()) {
          await page.getByRole('button', { name: 'Close' }).click();
        }
      }

      await expect(page.getByLabel('Click to rename')).toContainText(
        'Untitled',
      );
      // Get url and get the path element behind `/board/`
      const url = page.url();
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      const boardId = pathParts[pathParts.length - 1];
      boards.push(boardId);
    }
    await page.goto('/dashboard');

    await expect(
      page.getByRole('heading', { name: 'Starting…' }),
    ).not.toBeVisible();

    // Wait a bit for the boards to load
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'List view' }).click();

    expect(
      page.getByRole('button', {
        name: new RegExp('Untitled.*'),
      }),
    ).toHaveCount(3);
    await deleteBoards(page, boards);
  });
});
