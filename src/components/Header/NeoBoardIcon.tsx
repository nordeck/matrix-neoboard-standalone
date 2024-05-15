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
