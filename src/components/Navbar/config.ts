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

export type BannerConfig = {
  /**
   * The URL of the navigation.json file that contains the navigation structure for the user.
   * @example `https://example.com/navigation.json`
   */
  ics_navigation_json_url: string;

  /**
   * The URL of the silent endpoint that is used via inline frame to log in the user.
   * @example `https://example.com/silent`
   */
  ics_silent_url: string;

  /**
   * The URL of the portal logo.svg file.
   * @example `https://example.com/logo.svg`
   */
  portal_logo_svg_url: string;

  /**
   * The URL of the portal.
   * @example `https://example.com`
   */
  portal_url: string;
};

export interface OpenDeskModuleConfig {
  /**
   * A custom banner to be displayed.
   */
  banner: BannerConfig;
}

const openDeskModuleConfigSchema = Joi.object<OpenDeskModuleConfig, true>({
  banner: Joi.object<BannerConfig>({
    ics_navigation_json_url: Joi.string().uri().required(),
    ics_silent_url: Joi.string().uri().required(),
    portal_logo_svg_url: Joi.string().uri().required(),
    portal_url: Joi.string().uri().required(),
  })
    .unknown()
    .required(),
})
  .unknown()
  .required();

export function assertValidOpenDeskModuleConfig(
  config: unknown,
): asserts config is OpenDeskModuleConfig {
  const result = openDeskModuleConfigSchema.validate(config);

  if (result.error) {
    throw new Error(
      `Errors in opendesk module configuration: ${result.error.message}`,
    );
  }
}
