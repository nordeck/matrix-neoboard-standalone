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
import { OAuth2, ValidatedAuthMetadata } from 'matrix-js-sdk';

const OAUTH_STORAGE_KEY = 'neoboard_oauth_context';

export type StoredOAuthContext = {
  homeserverUrl: string;
  issuer: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
  deviceId: string;
  state: string;
};

const storedOAuthContextSchema = Joi.object<StoredOAuthContext>({
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
export function setStoredOAuthContext(
  homeserverUrl: string,
  authMetadata: ValidatedAuthMetadata,
  oauth2: OAuth2,
  state: string,
) {
  // Store context needed to complete the login after redirect
  const storedContext: StoredOAuthContext = {
    homeserverUrl,
    issuer: authMetadata.issuer,
    clientId: oauth2.context.clientId,
    redirectUri: oauth2.context.redirectUri,
    codeVerifier: oauth2.context.codeVerifier,
    deviceId: oauth2.context.deviceId,
    state,
  };
  sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(storedContext));
}

/**
 * Load, validate, and return the stored OAuth context from sessionStorage.
 * Returns undefined if no context is stored or if validation fails.
 */
export function getStoredOAuthContext(): StoredOAuthContext | undefined {
  const rawData = sessionStorage.getItem(OAUTH_STORAGE_KEY);

  if (rawData === null) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawData);
    const result = storedOAuthContextSchema.validate(parsed);

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
export function clearStoredOAuthContext(): void {
  sessionStorage.removeItem(OAUTH_STORAGE_KEY);
}
