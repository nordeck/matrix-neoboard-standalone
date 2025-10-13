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

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { IconButton, SxProps, TextField, Theme, Tooltip } from '@mui/material';
import { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';

export function CopyableText({
  text,
  label,
  sx,
}: {
  text: string;
  label: string;
  sx?: SxProps<Theme> | undefined;
}): ReactElement {
  const { t } = useTranslation();
  const [hasCopied, setHasCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleOnClick = useCallback(() => {
    copyToClipboard(text);
    setHasCopied(true);
  }, [text, copyToClipboard]);

  const handleOnBlur = useCallback(() => setHasCopied(false), []);

  return (
    <TextField
      InputProps={{
        readOnly: true,
        endAdornment: (
          <Tooltip
            title={t(
              'copyableTextButton.copy-to-clipboard',
              'Copy to clipboard',
            )}
          >
            <IconButton onBlur={handleOnBlur} onClick={handleOnClick}>
              {hasCopied ? (
                <CheckOutlinedIcon fontSize="inherit" />
              ) : (
                <ContentCopyOutlinedIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
        ),
      }}
      sx={sx}
      fullWidth
      label={label}
      multiline
      margin="dense"
      size="medium"
      value={text}
    />
  );
}
