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

import React, { ReactNode } from 'react';

const ALLOWED_ELEMENTS = new Set([
  'a',
  'animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'style',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'title',
  'tspan',
  'use',
  'view',
]);

// React expects attributes in JS-style camelCase while the DOM parser returns
// them in SGML-style kebab-case. This map combines a whitelist and mapping
// between these two styles.
const ALLOWED_ATTRIBUTES = new Map([
  ['accumulate', 'accumulate'],
  ['additive', 'additive'],
  ['alignment-baseline', 'alignmentBaseline'],
  ['amplitude', 'amplitude'],
  ['attributeName', 'attributeName'],
  ['azimuth', 'azimuth'],
  ['baseline-shift', 'baselineShift'],
  ['begin', 'begin'],
  ['bias', 'bias'],
  ['by', 'by'],
  ['calcMode', 'calcMode'],
  ['class', 'className'],
  ['clip-path', 'clipPath'],
  ['clip-rule', 'clipRule'],
  ['clipPathUnits', 'clipPathUnits'],
  ['color', 'color'],
  ['color-interpolation', 'colorInterpolation'],
  ['color-interpolation-filters', 'colorInterpolationFilters'],
  ['cursor', 'cursor'],
  ['cx', 'cx'],
  ['cy', 'cy'],
  ['d', 'd'],
  ['decoding', 'decoding'],
  ['diffuseConstant', 'diffuseConstant'],
  ['direction', 'direction'],
  ['display', 'display'],
  ['divisor', 'divisor'],
  ['dominant-baseline', 'dominantBaseline'],
  ['dur', 'dur'],
  ['dx', 'dx'],
  ['dy', 'dy'],
  ['edgeMode', 'edgeMode'],
  ['elevation', 'elevation'],
  ['end', 'end'],
  ['exponent', 'exponent'],
  ['fill', 'fill'],
  ['fill-opacity', 'fillOpacity'],
  ['fill-rule', 'fillRule'],
  ['filter', 'filter'],
  ['filterUnits', 'filterUnits'],
  ['flood-color', 'floodColor'],
  ['flood-opacity', 'floodOpacity'],
  ['font-family', 'fontFamily'],
  ['font-size', 'fontSize'],
  ['font-size-adjust', 'fontSizeAdjust'],
  ['font-stretch', 'fontStretch'],
  ['font-style', 'fontStyle'],
  ['font-variant', 'fontVariant'],
  ['font-weight', 'fontWeight'],
  ['fr', 'fr'],
  ['from', 'from'],
  ['fx', 'fx'],
  ['fy', 'fy'],
  ['gradientTransform', 'gradientTransform'],
  ['gradientUnits', 'gradientUnits'],
  ['height', 'height'],
  ['href', 'href'],
  ['id', 'id'],
  ['image-rendering', 'imageRendering'],
  ['in', 'in'],
  ['in2', 'in2'],
  ['intercept', 'intercept'],
  ['k1', 'k1'],
  ['k2', 'k2'],
  ['k3', 'k3'],
  ['k4', 'k4'],
  ['kernelMatrix', 'kernelMatrix'],
  ['kernelUnitLength', 'kernelUnitLength'],
  ['keyPoints', 'keyPoints'],
  ['keySplines', 'keySplines'],
  ['keyTimes', 'keyTimes'],
  ['lang', 'lang'],
  ['letterAdjust', 'letterAdjust'],
  ['letter-spacing', 'letterSpacing'],
  ['lighting-color', 'lightingColor'],
  ['limitingConeAngle', 'limitingConeAngle'],
  ['marker-end', 'markerEnd'],
  ['marker-mid', 'markerMid'],
  ['marker-start', 'markerStart'],
  ['markerHeight', 'markerHeight'],
  ['markerUnits', 'markerUnits'],
  ['markerWidth', 'markerWidth'],
  ['mask', 'mask'],
  ['maskContentUnits', 'maskContentUnits'],
  ['maskUnits', 'maskUnits'],
  ['max', 'max'],
  ['media', 'media'],
  ['method', 'method'],
  ['min', 'min'],
  ['mode', 'mode'],
  ['numOctaves', 'numOctaves'],
  ['opacity', 'opacity'],
  ['operator', 'operator'],
  ['order', 'order'],
  ['orient', 'orient'],
  ['origin', 'origin'],
  ['overflow', 'overflow'],
  ['overline-position', 'overlinePosition'],
  ['overline-thickness', 'overlineThickness'],
  ['paint-order', 'paintOrder'],
  ['path', 'path'],
  ['pathLength', 'pathLength'],
  ['patternContentUnits', 'patternContentUnits'],
  ['patternTransform', 'patternTransform'],
  ['patternUnits', 'patternUnits'],
  ['pointer-events', 'pointerEvents'],
  ['points', 'points'],
  ['pointsAtX', 'pointsAtX'],
  ['pointsAtY', 'pointsAtY'],
  ['pointsAtZ', 'pointsAtZ'],
  ['preserveAlpha', 'preserveAlpha'],
  ['preserveAspectRatio', 'preserveAspectRatio'],
  ['primitiveUnits', 'primitiveUnits'],
  ['r', 'r'],
  ['radius', 'radius'],
  ['refX', 'refX'],
  ['refY', 'refY'],
  ['repeatCount', 'repeatCount'],
  ['repeatDur', 'repeatDur'],
  ['restart', 'restart'],
  ['result', 'result'],
  ['rotate', 'rotate'],
  ['rx', 'rx'],
  ['ry', 'ry'],
  ['scale', 'scale'],
  ['seed', 'seed'],
  ['shape-rendering', 'shapeRendering'],
  ['side', 'side'],
  ['slope', 'slope'],
  ['spacing', 'spacing'],
  ['specularConstant', 'specularConstant'],
  ['specularExponent', 'specularExponent'],
  ['spreadMethod', 'spreadMethod'],
  ['startOffset', 'startOffset'],
  ['stdDeviation', 'stdDeviation'],
  ['stitchTiles', 'stitchTiles'],
  ['stop-color', 'stopColor'],
  ['stop-opacity', 'stopOpacity'],
  ['strikethrough-position', 'strikethroughPosition'],
  ['strikethrough-thickness', 'strikethroughThickness'],
  ['stroke', 'stroke'],
  ['stroke-dasharray', 'strokeDasharray'],
  ['stroke-dashoffset', 'strokeDashoffset'],
  ['stroke-linecap', 'strokeLinecap'],
  ['stroke-linejoin', 'strokeLinejoin'],
  ['stroke-miterlimit', 'strokeMiterlimit'],
  ['stroke-opacity', 'strokeOpacity'],
  ['stroke-width', 'strokeWidth'],
  ['style', 'STYLE'],
  ['surfaceScale', 'surfaceScale'],
  ['systemLanguage', 'systemLanguage'],
  ['tabindex', 'tabindex'],
  ['tableValues', 'tableValues'],
  ['target', 'target'],
  ['targetX', 'targetX'],
  ['targetY', 'targetY'],
  ['text-anchor', 'textAnchor'],
  ['text-decoration', 'textDecoration'],
  ['text-rendering', 'textRendering'],
  ['to', 'to'],
  ['transform', 'transform'],
  ['transform-origin', 'transformOrigin'],
  ['type', 'type'],
  ['underline-position', 'underlinePosition'],
  ['underline-thickness', 'underlineThickness'],
  ['unicode-bidi', 'unicodeBidi'],
  ['values', 'values'],
  ['vector-effect', 'vectorEffect'],
  ['viewBox', 'viewBox'],
  ['visibility', 'visibility'],
  ['width', 'width'],
  ['word-spacing', 'wordSpacing'],
  ['writing-mode', 'writingMode'],
  ['x', 'x'],
  ['x1', 'x1'],
  ['x2', 'x2'],
  ['xChannelSelector', 'xChannelSelector'],
  ['xlink:href', 'href'],
  ['y', 'y'],
  ['y1', 'y1'],
  ['y2', 'y2'],
  ['yChannelSelector', 'yChannelSelector'],
  ['z', 'z'],
]);

export interface NodeProcessor {
  (node: Node | null): ReactNode | null;
}

export function svgRenderer(
  foreignObjectProcessor?: NodeProcessor,
): NodeProcessor {
  const process: NodeProcessor = (node) => {
    if (node === null) {
      return null;
    }
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return node.textContent;
      case Node.DOCUMENT_NODE:
      case Node.ELEMENT_NODE: {
        const element = node as Element;
        const tagName = element.tagName;
        if (ALLOWED_ELEMENTS.has(tagName)) {
          return React.createElement(
            tagName,
            {
              className: element.getAttribute('class'),
              ...Object.fromEntries(
                element
                  .getAttributeNames()
                  .filter((key) => ALLOWED_ATTRIBUTES.has(key))
                  .map((key) => [
                    ALLOWED_ATTRIBUTES.get(key),
                    element.getAttribute(key),
                  ]),
              ),
            },
            ...Array.from(element.childNodes).map((it) => process(it)),
          );
        } else if (tagName === 'foreignObject') {
          // we need to handle foreign objects with additional care, as they
          // are yet another separate DOM embedded within of the SVG DOM
          return React.createElement(
            'foreignObject',
            {
              className: element.getAttribute('class'),
              ...Object.fromEntries(
                element
                  .getAttributeNames()
                  .filter((key) => ALLOWED_ATTRIBUTES.has(key))
                  .map((key) => [
                    ALLOWED_ATTRIBUTES.get(key),
                    element.getAttribute(key),
                  ]),
              ),
            },
            ...Array.from(element.childNodes).map((it) =>
              foreignObjectProcessor?.(it),
            ),
          );
        } else {
          console.log('filtered element of type', tagName);
          return null;
        }
      }
      default:
        return null;
    }
  };

  return process;
}
