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

import { SVGProps } from 'react';

export function NeoBoardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 0C7.83503 0 0 7.83503 0 17.5C0 27.165 7.83503 35.0001 17.5 35.0001"
        fill="#E95D12"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35 17.5003C35 7.8353 27.165 0.000272751 17.5 0.000272751V17.5003"
        fill="#B7251E"
      />
      <circle
        cx="2.35577"
        cy="2.35577"
        r="2.35577"
        transform="matrix(-1 0 0 1 32.3076 27.5964)"
        fill="#E95D12"
      />
      <circle
        cx="2.35577"
        cy="2.35577"
        r="2.35577"
        transform="matrix(-1 0 0 1 32.3076 20.1924)"
        fill="#E95D12"
      />
      <circle
        cx="2.35577"
        cy="2.35577"
        r="2.35577"
        transform="matrix(-1 0 0 1 24.9038 27.5964)"
        fill="#E95D12"
      />
      <circle
        cx="2.35577"
        cy="2.35577"
        r="2.35577"
        transform="matrix(-1 0 0 1 24.9038 20.1924)"
        fill="#E95D12"
      />
    </svg>
  );
}
