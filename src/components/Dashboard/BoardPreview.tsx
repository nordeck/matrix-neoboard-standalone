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

import { StateEvent } from '@matrix-widget-toolkit/api';
import {
  createWhiteboardManager,
  SlidePreview,
  SlideProvider,
  SlideSkeleton,
  useActiveWhiteboardInstanceSlideIds,
  Whiteboard,
  WhiteboardHotkeysProvider,
  WhiteboardManager,
  WhiteboardManagerProvider,
} from '@nordeck/matrix-neoboard-react-sdk';
import { first } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { useLoggedIn } from '../../state';
import { StoreType } from '../../store';
import { NoBoardPreview } from './NoBoardPreview.tsx';

interface BoardPreviewProps {
  whiteboard: StateEvent<Whiteboard>;
}

export const BoardPreview: React.FC<BoardPreviewProps> = ({ whiteboard }) => {
  const store = useStore();
  const { userId, widgetApiPromise } = useLoggedIn();

  const [whiteboardManager, setWhiteboardManager] =
    useState<WhiteboardManager>();

  useEffect(() => {
    const manager = createWhiteboardManager(
      store as StoreType,
      widgetApiPromise,
      true,
    );
    manager.selectActiveWhiteboardInstance(whiteboard, userId);
    setWhiteboardManager(manager);
    return () => {
      manager.clear();
    };
  }, [store, userId, widgetApiPromise, whiteboard]);

  return (
    <>
      {whiteboardManager ? (
        <WhiteboardManagerProvider whiteboardManager={whiteboardManager}>
          <BoardSlidePreview />
        </WhiteboardManagerProvider>
      ) : (
        <SlideSkeleton />
      )}
    </>
  );
};

export function BoardSlidePreview() {
  const slideIds = useActiveWhiteboardInstanceSlideIds();
  const slideId = first(slideIds);

  if (!slideId) {
    return <NoBoardPreview />;
  }

  return (
    <WhiteboardHotkeysProvider>
      <SlideProvider slideId={slideId}>
        <SlidePreview />
      </SlideProvider>
    </WhiteboardHotkeysProvider>
  );
}
