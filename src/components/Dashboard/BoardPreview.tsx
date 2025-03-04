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
    const manager = createWhiteboardManager(store, widgetApiPromise, true);
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
