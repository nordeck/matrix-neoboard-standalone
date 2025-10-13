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

import Joi from 'joi';

interface CategoryEntry {
  display_name?: string;
  icon_url?: string | null;
  identifier?: string;
  link?: string;
  target?: string;
}

interface Category {
  display_name?: string;
  entries: Array<CategoryEntry>;
  identifier?: string;
}

export interface NavigationJson {
  categories: Array<Category>;
}

const navigationJsonSchema = Joi.object<NavigationJson, true>({
  categories: Joi.array()
    .items(
      Joi.object<Category, true>({
        display_name: Joi.string().allow(''),
        entries: Joi.array()
          .items(
            Joi.object<CategoryEntry, true>({
              display_name: Joi.string().allow(''),
              icon_url: Joi.string().allow('').allow(null),
              identifier: Joi.string().allow(''),
              link: Joi.string().allow(''),
              target: Joi.string().allow(''),
            }).unknown(),
          )
          .required(),
        identifier: Joi.string().allow(''),
      }).unknown(),
    )
    .required(),
})
  .unknown()
  .required();

export function assertValidNavigationJson(
  json: unknown,
): asserts json is NavigationJson {
  const { error } = navigationJsonSchema.validate(json);

  if (error) {
    throw error;
  }
}
