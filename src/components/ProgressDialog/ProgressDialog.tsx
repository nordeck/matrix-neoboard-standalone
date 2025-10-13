// SPDX-License-Identifier: AGPL-3.0-or-later

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

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { unstable_useId as useId } from '@mui/utils';
import React from 'react';

type ProgressDialogProps = {
  /**
   * Text to display next to the spinner.
   */
  text: string;
};

/**
 * Simple progress dialog.
 */
export const ProgressDialog: React.FC<ProgressDialogProps> = function ({
  text,
}) {
  const textId = useId();
  return (
    <Dialog aria-labelledby={textId} open={true}>
      <DialogContent sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <DialogContentText id={textId}>{text}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
