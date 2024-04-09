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

import Joi from 'joi';
import {
  loadValidatedFromLocalStorage,
  tryLoadValidatedFromLocalStorage,
} from './loadValidatedFromLocalStorage';

afterEach(() => {
  window.localStorage.clear();
});

describe('loadValidatedFromLocalStorage', () => {
  it('should raise an error if the value fails the validation', () => {
    window.localStorage.setItem('test_key', '"test_value"');

    expect(() => {
      loadValidatedFromLocalStorage('test_key', Joi.number());
    }).toThrow(new Joi.ValidationError('"value" must be a number', [], null));
  });

  it('should raise an error if the value is not valid JSON', () => {
    window.localStorage.setItem('test_key', '{');

    expect(() => {
      loadValidatedFromLocalStorage('test_key', Joi.number());
    }).toThrow(
      new Error("Expected property name or '}' in JSON at position 1"),
    );
  });

  it('should return null if the item is not set', () => {
    expect(loadValidatedFromLocalStorage('test_key', Joi.number())).toBeNull();
  });

  it('should return a parsed and validated value', () => {
    window.localStorage.setItem('test_key', '23');

    expect(loadValidatedFromLocalStorage('test_key', Joi.number())).toBe(23);
  });
});

describe('tryLoadValidatedFromLocalStorage', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should return null and log a warning if the value fails the validation', () => {
    // mute logging for tests
    jest.mocked(console.warn).mockImplementation(() => {});

    window.localStorage.setItem('test_key', '"test_value"');

    expect(
      tryLoadValidatedFromLocalStorage('test_key', Joi.number()),
    ).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      'Error reading "test_key" from localStorage',
      new Joi.ValidationError('"value" must be a number', [], null),
    );
  });

  it('should return null and log a warning if the value is not valid JSON', () => {
    // mute logging for tests
    jest.mocked(console.warn).mockImplementation(() => {});

    window.localStorage.setItem('test_key', '{');

    expect(
      tryLoadValidatedFromLocalStorage('test_key', Joi.number()),
    ).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      'Error reading "test_key" from localStorage',
      new SyntaxError("Expected property name or '}' in JSON at position 1"),
    );
  });

  it('should return null if the item is not set', () => {
    expect(loadValidatedFromLocalStorage('test_key', Joi.number())).toBeNull();
  });

  it('should return a parsed and validated value', () => {
    window.localStorage.setItem('test_key', '23');

    expect(loadValidatedFromLocalStorage('test_key', Joi.number())).toBe(23);
  });
});
