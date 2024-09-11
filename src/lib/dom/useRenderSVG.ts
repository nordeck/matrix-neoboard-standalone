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

import { ReactNode, useMemo } from 'react';
import { basicHtmlRenderer } from './basicHtmlRenderer.ts';
import { svgRenderer } from './svgRenderer.ts';

const renderSVG = svgRenderer(basicHtmlRenderer);

export const useRenderSvg: (data: string) => ReactNode | null = (data) =>
  useMemo(() => {
    const parser = new DOMParser();
    // We're parsing the SVG as if it was embedded in an HTML document
    // this allows us to use HTML foreignObjects, which are needed for text
    const document = parser.parseFromString(data, 'text/html');
    const svgElement = document?.body?.firstChild ?? null;
    return renderSVG(svgElement);
  }, [data]);
