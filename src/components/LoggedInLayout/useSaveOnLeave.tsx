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

import { WhiteboardInstance } from '@nordeck/matrix-neoboard-react-sdk';
import loglevel from 'loglevel';
import { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../ConfirmDialog';
import { ProgressDialog } from '../ProgressDialog';

type SaveOnLeaveArgs = {
  /**
   * Callback, invoked when an error is confirmed.
   * This can be "leave anyway" for example.
   */
  onConfirmError: () => void;
};

type SaveOnLeaveResult = {
  /**
   * Elements rendered by the hook, such as dialogs.
   * Must be rendered by the using component.
   */
  elements: ReactNode;
  /**
   * @throws if persistence failed
   */
  persist: (whiteboard: WhiteboardInstance) => Promise<void>;
};

export const useSaveOnLeave = function ({
  onConfirmError,
}: SaveOnLeaveArgs): SaveOnLeaveResult {
  const [hasError, setHasError] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const { t } = useTranslation();

  const resetError = useCallback(() => {
    setHasError(false);
  }, []);

  const handleConfirmError = useCallback(() => {
    setHasError(false);
    onConfirmError();
  }, [onConfirmError]);

  const persist = useCallback(
    async (whiteboard: WhiteboardInstance) => {
      if (persisting) {
        // Already persisting, do nothing
        return;
      }

      setHasError(false);
      setPersisting(true);

      try {
        await whiteboard.persist();
      } catch (error) {
        setHasError(true);
        loglevel.error('Error while persisting the whiteboard on leave', error);
        throw error;
      } finally {
        setPersisting(false);
      }
    },
    [persisting, setHasError, setPersisting],
  );

  const elements = (
    <>
      {persisting && !hasError && (
        <ProgressDialog
          text={t('persistingDialog.text', 'Saving your changes')}
        />
      )}

      {!persisting && hasError && (
        <ConfirmDialog
          confirmActionLabel={t(
            'persistingDialog.error.confirmAction',
            'Leave anyway',
          )}
          onClose={resetError}
          onConfirm={handleConfirmError}
          open={hasError}
          text={t(
            'persistingDialog.error.text',
            'An error has occurred while saving your data. If you leave the board anyway, the last changes may be lost.',
          )}
          title={t('persistingDialog.error.title', 'Save failed')}
        />
      )}
    </>
  );

  return {
    elements,
    persist,
  };
};
