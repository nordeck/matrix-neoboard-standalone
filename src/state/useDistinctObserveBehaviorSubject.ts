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

import { useEffect, useState } from 'react';
import { distinctUntilChanged } from 'rxjs';
import { ObservableBehaviorSubject } from './types';

/**
 * Use the latest distinct (strict equal) value of a BehaviorSubject.
 *
 * @param subject - BehaviorSubject to observe
 * @return The latest value of the BehaviorSubject
 */
export function useDistinctObserveBehaviorSubject<T>(
  subject: ObservableBehaviorSubject<T>,
): T {
  const [value, setValue] = useState(subject.getValue());

  useEffect(() => {
    const subscription = subject
      .pipe(distinctUntilChanged())
      .subscribe(setValue);

    return () => subscription.unsubscribe();
  }, [subject]);

  return value;
}
