// SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
 *
 * NeoBoard is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * NeoBoard is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with NeoBoard. If not, see <https://www.gnu.org/licenses/>.
 */

import { styled } from '@mui/material';

type Props = {
  alt: string;
  ariaLabel: string;
  href: string;
  src: string;
};

const Root = styled('a')({
  display: 'flex',
  padding: '0 24px',
});

const Image = styled('img')({
  width: 82,
});

export function Logo({ alt, ariaLabel, href, src }: Props) {
  return (
    <Root aria-label={ariaLabel} href={href}>
      <Image alt={alt} src={src} />
    </Root>
  );
}
