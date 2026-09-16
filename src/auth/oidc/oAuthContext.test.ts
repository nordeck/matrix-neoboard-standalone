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
import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearOAuthContext,
  getOAuthContext,
  OAuthContext,
  setOAuthContext,
} from './oAuthContext';

beforeEach(() => {
  sessionStorage.clear();
});

function mockOAuthContext(): OAuthContext {
  return {
    homeserverUrl: 'https://matrix.example.com/',
    issuer: 'https://example.com',
    clientId: 'test_client_id',
    redirectUri: 'https://example.com/',
    codeVerifier: 'test_code_verifier',
    deviceId: 'test_device_id',
    state: 'test_state',
  };
}

describe('setOAuthContext', () => {
  it('should store oauth context to sessionStorage', () => {
    setOAuthContext(mockOAuthContext());
    expect(JSON.parse(sessionStorage.getItem('nd_oauth_context')!)).toEqual({
      homeserverUrl: 'https://matrix.example.com/',
      issuer: 'https://example.com',
      clientId: 'test_client_id',
      redirectUri: 'https://example.com/',
      codeVerifier: 'test_code_verifier',
      deviceId: 'test_device_id',
      state: 'test_state',
    });
  });
});

describe('getOAuthContext', () => {
  it('should return undefined when no context is stored', () => {
    expect(getOAuthContext()).toBeUndefined();
  });

  it('should return undefined when stored context is invalid JSON', () => {
    sessionStorage.setItem('nd_oauth_context', 'unexpected');
    expect(getOAuthContext()).toBeUndefined();
  });

  it('should return undefined when stored context is missing required fields', () => {
    sessionStorage.setItem(
      'nd_oauth_context',
      JSON.stringify({ clientId: 'test' }),
    );
    expect(getOAuthContext()).toBeUndefined();
  });

  it('should return oauth context from sessionStorage', () => {
    sessionStorage.setItem(
      'nd_oauth_context',
      JSON.stringify(mockOAuthContext()),
    );
    expect(getOAuthContext()).toEqual({
      homeserverUrl: 'https://matrix.example.com/',
      issuer: 'https://example.com',
      clientId: 'test_client_id',
      redirectUri: 'https://example.com/',
      codeVerifier: 'test_code_verifier',
      deviceId: 'test_device_id',
      state: 'test_state',
    });
  });
});

describe('clearOAuthContext', () => {
  it('should clear stored oauth context from sessionStorage', () => {
    setOAuthContext(mockOAuthContext());
    clearOAuthContext();
    expect(sessionStorage.getItem('nd_oauth_context')).toBeNull();
  });
});
