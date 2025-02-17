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
