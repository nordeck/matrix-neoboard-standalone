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

import React, { useEffect, useState } from 'react';
import { useRenderSvg } from '../../lib/dom/useRenderSVG.ts';
import boardPreview1 from './board1.png';
import boardPreview2 from './board2.png';
import boardPreview3 from './board3.png';
import boardPreview4 from './board4.png';
import boardPreview5 from './board5.png';
import { NoBoardPreview } from './NoBoardPreview';
import { preview2svg } from './utils';

interface BoardPreviewProps {
  roomId: string;
  preview: string | undefined;
}

const previewDummies = [
  boardPreview1,
  boardPreview2,
  boardPreview3,
  boardPreview4,
  boardPreview5,
];

export const BoardPreview: React.FC<BoardPreviewProps> = ({
  roomId,
  preview,
}) => {
  // disable previews for now
  const hasPreview = preview && preview.length > 0 && false;
  const [svgData, setSvgData] = useState<string>('');
  const svgPreview = useRenderSvg(svgData);

  useEffect(() => {
    if (hasPreview) {
      preview2svg(preview)
        .then((svg) => {
          return setSvgData(svg);
        })
        .catch((error) => {
          console.error('Error while decompressing preview: ', error);
        });
    }
  }, [preview, hasPreview]);
  if (hasPreview && svgPreview) {
    return svgPreview;
  } else if (roomId !== undefined) {
    // get a hash for the room id and find the nearest dummy index
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return hash;
    };
    const index = Math.abs(hashString(roomId)) % previewDummies.length;
    const randomPreview = previewDummies[index];
    return (
      <img
        src={randomPreview}
        alt="Board preview"
        style={{ maxWidth: '100%' }}
      />
    );
  }

  return <NoBoardPreview />;
};
