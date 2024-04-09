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

import { randomString } from './randomString';

describe('randomString', () => {
  it('should create random strings of the given lengths', () => {
    const string1 = randomString(23);

    expect(string1).toHaveLength(23);

    const string2 = randomString(23);
    expect(string1).toHaveLength(23);
    expect(string2).not.toEqual(string1);

    const string3 = randomString(42);
    expect(string3).toHaveLength(42);
  });
});
