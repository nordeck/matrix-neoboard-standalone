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
