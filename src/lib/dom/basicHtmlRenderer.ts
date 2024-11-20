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
  'font',
  'del',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'sup',
  'sub',
  'li',
  'b',
  'i',
  'u',
  'strong',
  'em',
  'strike',
  'code',
  'hr',
  'br',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'caption',
  'pre',
  'span',
  'img',
  'details',
  'summary',
  'br',
]);

// React expects attributes in JS-style camelCase while the DOM parser returns
// them in SGML-style kebab-case. This map combines a whitelist and mapping
// between these two styles.
const ALLOWED_ATTRIBUTES = new Map([
  ['color', 'color'],
  ['name', 'name'],
  ['target', 'target'],
  ['href', 'href'],
  ['width', 'width'],
  ['height', 'height'],
  ['alt', 'alt'],
  ['title', 'title'],
  ['src', 'src'],
  ['start', 'start'],
  ['class', 'className'],
  // react expects style to be given as an object
  // we're doing a little sneaky here as react is case sensitive
  ['style', 'STYLE'],
]);

export interface NodeProcessor {
  (node: Node | null): ReactNode | null;
}

export const basicHtmlRenderer: NodeProcessor = (node) => {
  if (node === null) {
    return null;
  }
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return node.textContent;
    case Node.DOCUMENT_NODE:
    case Node.ELEMENT_NODE: {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
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
          ...Array.from(element.childNodes).map((it) => basicHtmlRenderer(it)),
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
