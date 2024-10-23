/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyableText } from './CopyableText';

type AboutDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  const { t } = useTranslation();
  const standaloneVersion = getEnvironment('REACT_APP_VERSION', 'unset');
  const standaloneCommitHash = getEnvironment('REACT_APP_REVISION', 'unset');
  const widgetVersion = getEnvironment('REACT_APP_REACT_SDK_VERSION', 'unset');
  const widgetCommitHash = getEnvironment(
    'REACT_APP_REACT_SDK_REVISION',
    'unset',
  );

  const titleId = useId();
  const descriptionId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{t('aboutDialog.about', 'About')}</DialogTitle>
      <DialogContent style={{ whiteSpace: 'pre-wrap' }} id={descriptionId}>
        <CopyableText
          label={t('aboutDialog.versions.title', 'Version')}
          text={t(
            'aboutDialog.versions.info',
            'Neoboard Standalone version: {{standaloneVersion}}\nCommit hash: {{standaloneCommitHash}}\n' +
              'Neoboard React SDK version: {{widgetVersion}}\nCommit hash: {{widgetCommitHash}}',
            {
              standaloneVersion,
              standaloneCommitHash,
              widgetVersion,
              widgetCommitHash,
            },
          )}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" autoFocus>
          {t('aboutDialog.cancel', 'Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
