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
