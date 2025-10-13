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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next, { i18n as _i18n } from 'i18next';
import React, { act } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageDialog } from './LanguageDialog';

function setupI18n(instance: _i18n) {
  instance.use(initReactI18next).init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          languageDialog: {},
        },
      },
      de: {
        translation: {
          languageDialog: {},
        },
      },
    },
  });
  return instance;
}

let i18n: _i18n;

const TestWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

function renderDialog(props: { open: boolean; onClose: () => void }) {
  return render(<LanguageDialog {...props} />, { wrapper: TestWrapper });
}

describe('LanguageDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n = i18next.createInstance();
    setupI18n(i18n);
  });

  it('renders with current language pre-selected', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      renderDialog({ open: true, onClose: vi.fn() });
    });

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs.length).toBe(2);

    const englishRadio = radioInputs.find(
      (input) => input.getAttribute('value') === 'en',
    );
    const germanRadio = radioInputs.find(
      (input) => input.getAttribute('value') === 'de',
    );

    expect(englishRadio).toBeChecked();
    expect(germanRadio).not.toBeChecked();
  });

  it('changes language immediately on radio change', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      renderDialog({ open: true, onClose: vi.fn() });
    });

    const radioInputs = screen.getAllByRole('radio');
    const germanRadio = radioInputs.find(
      (input) => input.getAttribute('value') === 'de',
    );

    expect(germanRadio).not.toBeNull();

    await userEvent.click(germanRadio!);

    expect(i18n.resolvedLanguage).toBe('de');
    expect(germanRadio).toBeChecked();
  });

  it('saves language to localStorage on confirm', async () => {
    const onClose = vi.fn();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      renderDialog({ open: true, onClose });
    });

    // Find and click the German radio button
    const radioInputs = screen.getAllByRole('radio');
    const germanRadio = radioInputs.find(
      (input) => input.getAttribute('value') === 'de',
    );

    expect(germanRadio).not.toBeNull();

    await userEvent.click(germanRadio!);

    const confirmButton = screen.getByRole('button', {
      name: /Confirm|Bestätigen/i,
    });
    expect(confirmButton).not.toBeNull();

    await userEvent.click(confirmButton);

    expect(localStorage.getItem('preferredLanguage')).toBe('de');
    expect(onClose).toHaveBeenCalled();
  });

  it('reverts language on cancel', async () => {
    const onClose = vi.fn();

    await act(async () => {
      i18n.changeLanguage('en');
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      renderDialog({ open: true, onClose });
    });

    const radioInputs = screen.getAllByRole('radio');
    const germanRadio = radioInputs.find(
      (input) => input.getAttribute('value') === 'de',
    );

    expect(germanRadio).not.toBeNull();

    await userEvent.click(germanRadio!);

    expect(i18n.resolvedLanguage).toBe('de');

    const cancelButton = screen.getByRole('button', {
      name: /Cancel|Abbrechen/i,
    });
    expect(cancelButton).not.toBeNull();

    await userEvent.click(cancelButton);

    expect(i18n.resolvedLanguage).toBe('en');
    expect(onClose).toHaveBeenCalled();
  });
});
