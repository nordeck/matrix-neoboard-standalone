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
