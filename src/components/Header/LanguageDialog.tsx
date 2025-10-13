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

import TranslateIcon from '@mui/icons-material/Translate';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useCallback, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function LanguageDialog({ open, onClose }: LanguageDialogProps) {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();

  const [previousLanguage, setPreviousLanguage] = useState<string | null>(null);

  // Remember the preferred language and ensure the current language is pre-selected
  useEffect(() => {
    if (open) {
      const saved =
        localStorage.getItem('preferredLanguage') ||
        i18n.resolvedLanguage ||
        'en';
      setPreviousLanguage(saved);
      if (i18n.resolvedLanguage !== saved) {
        i18n.changeLanguage(saved);
      }
    }
  }, [i18n, open]);

  // Change language immediately on radio change
  const handleLanguageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      i18n.changeLanguage(event.target.value);
    },
    [i18n],
  );

  // Save active language to localStorage
  const handleConfirm = useCallback(() => {
    localStorage.setItem('preferredLanguage', i18n.resolvedLanguage || 'en');
    onClose();
  }, [i18n.resolvedLanguage, onClose]);

  // Revert to previous preferred language
  const handleCancel = useCallback(() => {
    if (previousLanguage && previousLanguage !== i18n.resolvedLanguage) {
      i18n.changeLanguage(previousLanguage);
    }
    onClose();
  }, [i18n, previousLanguage, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId} sx={{ display: 'flex', alignItems: 'center' }}>
        <TranslateIcon sx={{ marginRight: 2 }} />
        {t('languageDialog.title', 'Language')}
      </DialogTitle>
      <DialogContent style={{ whiteSpace: 'pre-wrap' }} id={descriptionId}>
        <DialogContentText>
          {t(
            'languageDialog.description',
            'Please select your preferred language:',
          )}
        </DialogContentText>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            aria-label="language"
            name="language"
            value={i18n.resolvedLanguage || 'en'}
            onChange={handleLanguageChange}
            sx={{
              display: 'flex',
              paddingLeft: 2,
              paddingTop: 4,
            }}
          >
            <FormControlLabel
              value="en"
              control={<Radio />}
              label={t('languageDialog.english', 'English')}
            />
            <FormControlLabel
              value="de"
              control={<Radio />}
              label={t('languageDialog.german', 'German')}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined" autoFocus>
          {t('languageDialog.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          {t('languageDialog.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
