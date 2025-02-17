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

import { styled, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardList } from '../Dashboard/useDashboardList';
import { RenameDialog } from '../RenameDialog';

const StyledTitle = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  flexGrow: 1,
  fontSize: '25px',
  fontWeight: '600',
  overflow: 'hidden',
  position: 'relative',
  textOverflow: 'ellipsis',
  top: '-4px',
  whiteSpace: 'nowrap',
}));

const EditableTitle = styled('button')(({ theme }) => ({
  display: 'inherit',
  background: 'inherit',
  borderRadius: '8px',
  border: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  whiteSpace: 'inherit',
  padding: '8px',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

type TitleProps = {
  title: string;
  selectedRoomId?: string;
};

export function Title({ title, selectedRoomId }: TitleProps) {
  const { t } = useTranslation();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const dashboardList = useDashboardList();
  const roomItem = useMemo(
    () => dashboardList.find((item) => item.roomId === selectedRoomId),
    [dashboardList, selectedRoomId],
  );
  const canEditName = !!roomItem?.permissions.canChangeName;

  useEffect(() => {
    setRenameDialogOpen(false);
  }, [selectedRoomId]);

  const handleOpenRenameDialog = useCallback(
    () => setRenameDialogOpen(true),
    [],
  );
  const handleCloseRenameDialog = useCallback(
    () => setRenameDialogOpen(false),
    [],
  );

  return (
    <>
      <StyledTitle>
        {selectedRoomId && canEditName ? (
          <Tooltip title={t('header.renameBoard', 'Click to rename')}>
            <EditableTitle onClick={handleOpenRenameDialog}>
              {title}
            </EditableTitle>
          </Tooltip>
        ) : (
          title
        )}
      </StyledTitle>
      {selectedRoomId && (
        <RenameDialog
          item={{
            name: title,
            roomId: selectedRoomId,
          }}
          onClose={handleCloseRenameDialog}
          open={renameDialogOpen}
        />
      )}
    </>
  );
}
