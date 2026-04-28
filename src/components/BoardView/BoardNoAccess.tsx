/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { NoMeetingRoom } from '@mui/icons-material';
import { Button, Container, styled, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

const BoardNoAccessContainer = styled(Container)({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '15vh',
});

export const BoardNoAccess: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <BoardNoAccessContainer>
      <NoMeetingRoom
        style={{ color: theme.palette.text.secondary, fontSize: 128 }}
      />

      <Typography
        variant="h1"
        color="textSecondary"
        sx={{ marginBottom: '64px', marginTop: '16px' }}
      >
        {t('boardNoAccess.message', "Can't access board")}
      </Typography>

      <Link to="/dashboard">
        <Button variant="contained">
          {t('boardNotFound.link', 'Go to dashboard')}
        </Button>
      </Link>
    </BoardNoAccessContainer>
  );
};
