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
