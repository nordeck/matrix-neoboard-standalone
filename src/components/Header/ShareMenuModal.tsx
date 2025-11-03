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

import { ElementAvatar } from '@matrix-widget-toolkit/mui';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { isEqual } from 'lodash';
import {
  FocusEvent,
  MouseEvent,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useLoggedIn } from '../../state/useLoggedIn';
import {
  makeSelectInvitedOrJoinedRoomMembers,
  useAppSelector,
} from '../../store';
import { IUser } from '../../toolkit/standalone/client/types';
import ErrorBoundary from '../ErrorBoundary';

type ShareMenuModalProps = {
  open: boolean;
  onClose: () => void;
  selectedRoomId: string;
};

const SearchWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  width: '100%',
  // Prevent the title from getting off screen due to the space available
  marginTop: '5px',
}));

/**
 * The share menu modal is a dialog that allows the user to invite other users to a room.
 */
export function ShareMenuModal({
  open,
  onClose: onCloseExternal,
  selectedRoomId,
}: ShareMenuModalProps) {
  const { t } = useTranslation();
  const client = useLoggedIn();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(false);

  const onClose = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    setInviting(false);
    setInviteError(false);
    onCloseExternal();
  }, [
    onCloseExternal,
    setSelectedUsers,
    setSearchTerm,
    setInviting,
    setInviteError,
  ]);

  const stopPropagation = useCallback((e: FocusEvent | MouseEvent) => {
    // Stop propagating events from the dialog
    e.stopPropagation();
  }, []);

  const onTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.trim());
  }, []);

  const onUserClick = useCallback(
    (user: IUser) => {
      // Select the user.
      setSelectedUsers((prev) => {
        // If the user is already selected, deselect them.
        if (prev.some((u) => u.user_id === user.user_id)) {
          return prev.filter((u) => u.user_id !== user.user_id);
        }

        // Otherwise, add the user to the selected users.
        return [...prev, user];
      });
    },
    [setSelectedUsers],
  );

  const onInvite = useCallback(() => {
    setInviting(true);
    // Reset the error state when inviting again.
    setInviteError(false);
    // Invite each user and wait for all of them to complete before closing the dialog.
    Promise.all(
      selectedUsers.map((user) =>
        client.standaloneClient.invite(selectedRoomId, user.user_id),
      ),
    )
      .then(() => {
        onClose();
        setInviting(false);
        return;
      })
      .catch((e) => {
        setInviting(false);
        setInviteError(true);
        console.error('Failed to invite users:', e);
      });
  }, [
    onClose,
    client.standaloneClient,
    selectedRoomId,
    selectedUsers,
    setInviting,
    setInviteError,
  ]);

  return (
    <Dialog
      aria-labelledby="share-menu-modal"
      open={open}
      onClick={stopPropagation}
      onClose={onClose}
      onFocus={stopPropagation}
      disableRestoreFocus
      maxWidth="sm"
      fullWidth
      // For overflow to work nicely
      sx={{
        maxHeight: '80vh',
        // Set top so the dialog is centered vertically in the absolute container
        // Note that it is maxHeight 80vh from the top of this number
        top: '10vh',
      }}
    >
      <DialogTitle id="share-menu-modal" sx={{ pt: 4, pl: 4, pr: 4, pb: 1 }}>
        <Typography variant="h2">
          <Trans t={t} i18nKey="shareMenuModal.invite">
            Invite
          </Trans>
        </Typography>
        <Typography variant="subtitle1">
          <Trans t={t} i18nKey="shareMenuModal.inviteText">
            Invite people to collaborate on this whiteboard
          </Trans>
        </Typography>
      </DialogTitle>

      <DialogContent>
        <SearchWrapper>
          <TextField
            variant="outlined"
            label="Search"
            fullWidth
            onChange={onTyping}
            autoFocus={true}
          />
        </SearchWrapper>

        {inviteError && (
          <Typography variant="caption" color="error">
            <Trans t={t} i18nKey="shareMenuModal.inviteError">
              Error inviting users. Please try again.
            </Trans>
          </Typography>
        )}

        {selectedUsers.length > 0 && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Typography variant="h5">
              <Trans t={t} i18nKey="shareMenuModal.selectedUsers">
                Selected users:
              </Trans>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                mt: 1,
                flexWrap: 'wrap',
              }}
            >
              {selectedUsers.map((user) => (
                <>
                  {/* Small user pill of selected users which can be deselected using an iconbutton of a close icon */}
                  <Chip
                    onDelete={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.user_id !== user.user_id),
                      )
                    }
                    key={user.user_id}
                    avatar={
                      <ElementAvatar
                        userId={user.user_id}
                        displayName={user.display_name}
                        src={user.avatar_url ?? ''}
                      >
                        {user.display_name?.substring(0, 1)}
                      </ElementAvatar>
                    }
                    label={user.display_name}
                  />
                </>
              ))}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            mt: 2,
          }}
        >
          <ErrorBoundary
            fallback={
              <Typography variant="caption">
                <Trans t={t} i18nKey="searchResults.error">
                  Error loading search results
                </Trans>
              </Typography>
            }
          >
            <Suspense fallback={<CircularProgress />}>
              <SearchResults
                searchTerm={searchTerm ?? ''}
                onUserClick={onUserClick}
                selectedUsers={selectedUsers}
                selectedRoomId={selectedRoomId}
              />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('app.cancel', 'Cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={onInvite}
          loading={inviting}
          disabled={selectedUsers.length === 0}
        >
          <Trans t={t} i18nKey="shareMenuModal.invite">
            Invite
          </Trans>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

const NamesVerticalWrapper = styled('div')(() => ({
  gridRowStart: 1,
  gridRowEnd: 2,
  alignSelf: 'center',
  alignItems: 'baseline',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  overflow: 'hidden',
}));

interface InvitePersonProps {
  user: IUser;
  onClick: (user: IUser) => void;
  selected?: boolean;
}

/**
 * This component represents a person that can be invited to a room.
 */
function InvitePerson({ user, onClick, selected }: InvitePersonProps) {
  return (
    <Button
      sx={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'start',
        gap: '8px',
        gridTemplateColumns: 'min-content auto',
      }}
      onClick={() => onClick(user)}
    >
      <ElementAvatar
        sx={{ width: 36, height: 36, gridRowStart: 1, gridColumnStart: 1 }}
        userId={user.user_id}
        src={user.avatar_url ?? ''}
        displayName={selected ? '✓' : user.display_name}
      />
      <NamesVerticalWrapper>
        <Typography variant="h5">{user.display_name}</Typography>
        <Typography variant="caption" color="#91a1c0">
          {user.user_id}
        </Typography>
      </NamesVerticalWrapper>
    </Button>
  );
}

/**
 * This component is a search result list for users.
 * It uses SWR to cache the results based on the search term.
 * It also uses suspense to handle the loading state of the search results.
 */
function SearchResults({
  searchTerm,
  onUserClick,
  selectedUsers,
  selectedRoomId,
}: {
  searchTerm: string;
  onUserClick: (mxid: IUser) => void;
  selectedUsers: IUser[];
  selectedRoomId: string;
}) {
  const client = useLoggedIn();
  const { t } = useTranslation();

  const selectInvitedOrJoinedRoomMembers = useMemo(
    () => makeSelectInvitedOrJoinedRoomMembers(selectedRoomId),
    [selectedRoomId],
  );
  const invitedOrJoinedRoomMembers = useAppSelector(
    (state) => selectInvitedOrJoinedRoomMembers(state),
    isEqual,
  );
  const invitedOrJoinedRoomMemberIds = invitedOrJoinedRoomMembers.map(
    (u) => u.user_id,
  );

  // This not only allows us to use suspense for a smooth experience in terms of code and UI but also allows us to cache results based on the search term.
  // Without the bind the client cannot find `this` in the function for unknown reasons. Possibly due to cache indirection.
  const { data } = useSWR<IUser[]>(
    searchTerm,
    client.standaloneClient.searchUsers.bind(client.standaloneClient),
    { suspense: true, keepPreviousData: true },
  );
  const searchResults = data ?? [];

  if (!searchTerm) {
    return (
      <Typography variant="caption">
        {t('searchResults.noSearchTerm', 'Start typing to search')}
      </Typography>
    );
  }

  // Filter out users who have already joined or been invited
  const filteredSearchResults = searchResults.filter(
    (u) => !invitedOrJoinedRoomMemberIds.includes(u.user_id),
  );

  if (filteredSearchResults.length === 0) {
    return (
      <Typography variant="caption">
        {t('searchResults.noResults', 'No users found to invite')}
      </Typography>
    );
  }

  return (
    <>
      {filteredSearchResults.map((user) => (
        <InvitePerson
          key={user.user_id}
          user={user}
          onClick={onUserClick}
          selected={selectedUsers.some((u) => u.user_id === user.user_id)}
        />
      ))}
    </>
  );
}
