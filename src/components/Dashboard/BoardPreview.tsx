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
import { NoBoardPreview } from './NoBoardPreview';
import { preview2svg } from './utils';

interface BoardPreviewProps {
  preview: string | undefined;
}

export const BoardPreview: React.FC<BoardPreviewProps> = ({ preview }) => {
  const hasPreview = preview && preview.length > 0;
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
  }

  return <NoBoardPreview />;
};
