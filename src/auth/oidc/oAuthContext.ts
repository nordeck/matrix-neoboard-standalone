/*
 * Copyright 2026 Nordeck IT + Consulting GmbH
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

const OAUTH_CONTEXT_KEY = 'nd_oauth_context';

export type OAuthContext = {
  homeserverUrl: string;
  issuer: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
  deviceId: string;
  state: string;
};

const oAuthContextSchema = Joi.object<OAuthContext>({
  homeserverUrl: Joi.string().uri().required(),
  issuer: Joi.string().uri().required(),
  clientId: Joi.string().required(),
  redirectUri: Joi.string().uri().required(),
  codeVerifier: Joi.string().required(),
  deviceId: Joi.string().required(),
  state: Joi.string().required(),
});

/**
 * Set stored OAuth context to sessionStorage.
 */
export function setOAuthContext(context: OAuthContext): void {
  // Store context needed to complete the login after redirect
  sessionStorage.setItem(OAUTH_CONTEXT_KEY, JSON.stringify(context));
}

/**
 * Load, validate, and return the stored OAuth context from sessionStorage.
 * Returns undefined if no context is stored or if validation fails.
 */
export function getOAuthContext(): OAuthContext | undefined {
  const rawData = sessionStorage.getItem(OAUTH_CONTEXT_KEY);

  if (rawData === null) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawData);
    const result = oAuthContextSchema.validate(parsed);

    if (result.error !== undefined) {
      console.warn('Invalid stored OAuth context', result.error);
      return undefined;
    }

    return result.value;
  } catch (error) {
    console.warn('Error reading stored OAuth context', error);
    return undefined;
  }
}

/**
 * Clear stored OAuth context from sessionStorage.
 */
export function clearOAuthContext(): void {
  sessionStorage.removeItem(OAUTH_CONTEXT_KEY);
}
