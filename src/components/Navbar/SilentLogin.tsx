// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Copyright 2025 Nordeck IT + Consulting GmbH
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

import { styled } from '@mui/material';
import { useEffect } from 'react';

type Props = {
  onLoggedIn: (loggedIn: boolean) => void;
  url: string;
};

const HiddenIFrame = styled('iframe')({
  display: 'none',
});

export function SilentLogin({ onLoggedIn, url }: Props) {
  useEffect(() => {
    function listener(event: MessageEvent) {
      const src = new URL(url);

      if (
        event.origin === src.origin &&
        typeof event.data === 'object' &&
        event.data['loggedIn'] === true
      ) {
        onLoggedIn(true);
      }
    }

    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  }, [onLoggedIn, url]);

  return <HiddenIFrame src={url} title="Silent Login" />;
}
