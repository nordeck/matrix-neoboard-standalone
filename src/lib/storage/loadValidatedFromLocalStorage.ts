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

/**
 * Load, parse, validate and return a JSON serialised value from localStorage.
 *
 * @param key - The localStorage key of the value
 * @param schema - the Joi schema for validation
 * @returns The parsed value
 * @throws Error if anything went wrong
 */
export function loadValidatedFromLocalStorage<T>(
  key: string,
  schema: Joi.Schema<T>,
): T | null {
  const rawData = localStorage.getItem(key);

  if (rawData === null) {
    // null is a valid value (does not exist)
    return null;
  }

  const parsedData = JSON.parse(rawData);
  const validationResult = schema.validate(parsedData);

  if (validationResult.error !== undefined) {
    throw validationResult.error;
  }

  return validationResult.value;
}

/**
 * Same as {@link loadValidatedFromLocalStorage},
 * except that it logs in case of an error and returns null.
 */
export function tryLoadValidatedFromLocalStorage<T>(
  key: string,
  schema: Joi.Schema<T>,
): T | null {
  try {
    return loadValidatedFromLocalStorage(key, schema);
  } catch (error) {
    console.warn(`Error reading "${key}" from localStorage`, error);
    return null;
  }
}
