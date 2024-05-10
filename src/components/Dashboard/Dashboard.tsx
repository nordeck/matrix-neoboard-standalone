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

import { isEqual } from 'lodash';
import { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { makeSelectWhiteboards } from '../../store/api/selectors/selectWhiteboards';
import { BoardTile } from './BoardTile';

import { TilesContainer } from './TilesContainer';
import boardPreview1 from './board1.png';
import boardPreview2 from './board2.png';
import boardPreview3 from './board3.png';
import boardPreview4 from './board4.png';
import boardPreview5 from './board5.png';

const boardPreviews = [
  boardPreview1,
  boardPreview2,
  boardPreview3,
  boardPreview4,
  boardPreview5,
];

type DashboardProps = {
  setSelectedRoomId: (roomId: string) => void;
};

export function Dashboard({ setSelectedRoomId }: DashboardProps) {
  const selectWhiteboards = useMemo(makeSelectWhiteboards, []);
  const whiteboards = useAppSelector(
    (state) => selectWhiteboards(state),
    isEqual,
  );

  return (
    <TilesContainer>
      {whiteboards.map((whiteboard, index) => (
        <BoardTile
          whiteboard={whiteboard}
          previewUrl={boardPreviews[index % 5]}
          onClick={() => {
            const roomId = whiteboard.whiteboard.room_id;
            setSelectedRoomId(roomId);
          }}
        />
      ))}
    </TilesContainer>
  );
}
