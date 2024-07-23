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

import { renderHook } from '@testing-library/react';
import { act } from 'react';
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
