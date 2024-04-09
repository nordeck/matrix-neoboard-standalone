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

import { act, renderHook } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';
import { useDistinctObserveBehaviorSubject } from './useDistinctObserveBehaviorSubject';

describe('useDistinctObserveBehaviorSubject', () => {
  let testSubject: BehaviorSubject<number>;

  beforeEach(() => {
    testSubject = new BehaviorSubject(23);
  });

  afterEach(() => {
    testSubject.complete();
  });

  it('should provide the initial value', () => {
    const { result } = renderHook(() =>
      useDistinctObserveBehaviorSubject(testSubject),
    );
    expect(result.current).toBe(23);
  });

  it('should update on value change', () => {
    const { result } = renderHook(() =>
      useDistinctObserveBehaviorSubject(testSubject),
    );
    act(() => {
      testSubject.next(42);
    });

    expect(result.current).toBe(42);
  });

  it('should unsubscribe on umount', () => {
    const { unmount } = renderHook(() =>
      useDistinctObserveBehaviorSubject(testSubject),
    );
    unmount();

    expect(testSubject.observed).toBe(false);
  });
});
