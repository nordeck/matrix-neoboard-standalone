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
