/*
 * Copyright 2024-2026 Nordeck IT + Consulting GmbH
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
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getEnvironmentAppearance } from '../../lib';
import { useDashboardList } from '../Dashboard/useDashboardList';
import { RenameDialog } from '../RenameDialog';

const appearance = getEnvironmentAppearance();

const StyledTitle = styled('div')(({ theme }) => ({
  ...(appearance === 'opendesk'
    ? {
        color: theme.navbar.color.textPrimary,
      }
    : {
        color: theme.palette.primary.main,
      }),
  display: 'flex',
  flex: '0 1 auto',
  justifyContent: 'center',
  minWidth: 0,
  fontSize: '22px',
  fontWeight: '400',
  position: 'relative',
}));

const truncated = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

const EditableTitle = styled('button')(({ theme }) => ({
  display: 'block',
  background: 'inherit',
  borderRadius: '8px',
  border: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  padding: '8px',
  ...truncated,
  ...(appearance === 'opendesk'
    ? {
        '&:hover': {
          color: theme.navbar.color.textPrimaryHover,
          backgroundColor: theme.palette.background.hover,
        },
        '&:active': {
          color: theme.navbar.color.textPrimaryActive,
          backgroundColor: theme.palette.background.active,
        },
      }
    : {
        '&:hover': {
          backgroundColor: theme.palette.grey[200],
        },
      }),
}));

const StaticTitle = styled('div')({
  padding: '8px',
  ...truncated,
});

type TitleProps = {
  title: string;
  roomId?: string;
};

export function Title({ title, roomId }: TitleProps) {
  const { t } = useTranslation();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [prevRoomId, setPrevRoomId] = useState(roomId);
  if (prevRoomId !== roomId) {
    setPrevRoomId(roomId);
    setRenameDialogOpen(false);
  }

  const dashboardList = useDashboardList();
  const roomItem = useMemo(
    () => dashboardList.find((item) => item.roomId === roomId),
    [dashboardList, roomId],
  );
  const canEditName = !!roomItem?.permissions.canChangeName;

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
        {roomId && canEditName ? (
          <Tooltip title={t('header.renameBoard', 'Click to rename')}>
            <EditableTitle onClick={handleOpenRenameDialog}>
              {title}
            </EditableTitle>
          </Tooltip>
        ) : (
          <StaticTitle>{title}</StaticTitle>
        )}
      </StyledTitle>
      {roomId && (
        <RenameDialog
          item={{
            name: title,
            roomId,
          }}
          onClose={handleCloseRenameDialog}
          open={renameDialogOpen}
        />
      )}
    </>
  );
}
