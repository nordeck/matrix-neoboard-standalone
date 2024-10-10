/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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
          label={t('aboutDialog.standalone.title', 'Standalone version')}
          text={t(
            'aboutDialog.standalone.info',
            'Version: {{standaloneVersion}} \nCommit hash: {{standaloneCommitHash}}',
            { standaloneVersion, standaloneCommitHash },
          )}
          sx={{ marginTop: 2 }}
        />
        <CopyableText
          label={t('aboutDialog.widget.title', 'Neoboard react sdk version')}
          text={t(
            'aboutDialog.widget.info',
            'Version: {{widgetVersion}} \nCommit hash: {{widgetCommitHash}}',
            { widgetVersion, widgetCommitHash },
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
