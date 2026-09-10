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

import { getEnvironment } from '@matrix-widget-toolkit/mui';
import {
  isMatrixRtcMode,
  ROOM_EVENT_DOCUMENT_CREATE,
  STATE_EVENT_4143_RTC_SLOT,
  STATE_EVENT_WHITEBOARD,
} from '@nordeck/matrix-neoboard-react-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MockedStandaloneClient,
  mockStandaloneClient,
} from '../../toolkit/standalone/client/mockStandaloneClient';
import { createWhiteboard } from './createWhiteboard';

vi.mock('@matrix-widget-toolkit/mui', async () => ({
  ...(await vi.importActual('@matrix-widget-toolkit/mui')),
  getEnvironment: vi.fn(),
}));

vi.mock('@nordeck/matrix-neoboard-react-sdk', async () => ({
  ...(await vi.importActual('@nordeck/matrix-neoboard-react-sdk')),
  isMatrixRtcMode: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getEnvironment).mockImplementation(
    (_, defaultValue) => defaultValue,
  );
});

describe('createWhiteboard', () => {
  let standaloneClient: MockedStandaloneClient;

  beforeEach(() => {
    standaloneClient = mockStandaloneClient();
    vi.mocked(isMatrixRtcMode).mockReturnValue(false);
  });

  it('create a whiteboard', async () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_WIDGET_BASE':
          return 'https://widget.example.com';
        default:
          return defaultValue;
      }
    });
    vi.mocked(isMatrixRtcMode).mockReturnValue(false);

    standaloneClient.sendRoomEvent.mockResolvedValueOnce('document-id-1');

    await createWhiteboard(standaloneClient, '!room-1');

    expect(standaloneClient.sendRoomEvent).toHaveBeenCalledWith(
      ROOM_EVENT_DOCUMENT_CREATE,
      {},
      '!room-1',
      undefined,
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_WHITEBOARD,
      '!room-1_whiteboard',
      { documentId: 'document-id-1' },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      STATE_EVENT_4143_RTC_SLOT,
      expect.any(String),
      expect.anything(),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'im.vector.modular.widgets',
      'neoboard',
      expect.objectContaining({
        type: 'net.nordeck.whiteboard',
        url: expect.any(String),
        name: 'NeoBoard',
      }),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'io.element.widgets.layout',
      '',
      expect.anything(),
      '!room-1',
    );
  });

  it('create a whiteboard if widget base url is not set', async () => {
    vi.mocked(isMatrixRtcMode).mockReturnValue(false);

    standaloneClient.sendRoomEvent.mockResolvedValueOnce('document-id-1');

    await createWhiteboard(standaloneClient, '!room-1');

    expect(standaloneClient.sendRoomEvent).toHaveBeenCalledWith(
      ROOM_EVENT_DOCUMENT_CREATE,
      {},
      '!room-1',
      undefined,
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_WHITEBOARD,
      '!room-1_whiteboard',
      { documentId: 'document-id-1' },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      STATE_EVENT_4143_RTC_SLOT,
      expect.any(String),
      expect.anything(),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      'im.vector.modular.widgets',
      'neoboard',
      expect.objectContaining({
        type: 'net.nordeck.whiteboard',
        url: expect.any(String),
        name: 'NeoBoard',
      }),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      'io.element.widgets.layout',
      '',
      expect.anything(),
      '!room-1',
    );
  });

  it('create a whiteboard if MatrixRTC mode', async () => {
    vi.mocked(getEnvironment).mockImplementation((name, defaultValue) => {
      switch (name) {
        case 'REACT_APP_WIDGET_BASE':
          return 'https://widget.example.com';
        default:
          return defaultValue;
      }
    });
    vi.mocked(isMatrixRtcMode).mockReturnValue(true);

    standaloneClient.sendRoomEvent.mockResolvedValueOnce('document-id-1');

    await createWhiteboard(standaloneClient, '!room-1');

    expect(standaloneClient.sendRoomEvent).toHaveBeenCalledWith(
      ROOM_EVENT_DOCUMENT_CREATE,
      {},
      '!room-1',
      undefined,
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_WHITEBOARD,
      '!room-1_whiteboard',
      { documentId: 'document-id-1' },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_4143_RTC_SLOT,
      'net.nordeck.whiteboard#!room-1_whiteboard',
      {
        status: 'open',
        application: {
          type: 'net.nordeck.whiteboard',
        },
      },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'im.vector.modular.widgets',
      'neoboard',
      expect.objectContaining({
        type: 'net.nordeck.whiteboard',
        url: expect.any(String),
        name: 'NeoBoard',
      }),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      'io.element.widgets.layout',
      '',
      expect.anything(),
      '!room-1',
    );
  });

  it('create a whiteboard if MatrixRTC mode and widget base url is not set', async () => {
    vi.mocked(isMatrixRtcMode).mockReturnValue(true);

    standaloneClient.sendRoomEvent.mockResolvedValueOnce('document-id-1');

    await createWhiteboard(standaloneClient, '!room-1');

    expect(standaloneClient.sendRoomEvent).toHaveBeenCalledWith(
      ROOM_EVENT_DOCUMENT_CREATE,
      {},
      '!room-1',
      undefined,
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_WHITEBOARD,
      '!room-1_whiteboard',
      { documentId: 'document-id-1' },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).toHaveBeenCalledWith(
      STATE_EVENT_4143_RTC_SLOT,
      'net.nordeck.whiteboard#!room-1_whiteboard',
      {
        status: 'open',
        application: {
          type: 'net.nordeck.whiteboard',
        },
      },
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      'im.vector.modular.widgets',
      'neoboard',
      expect.objectContaining({
        type: 'net.nordeck.whiteboard',
        url: expect.any(String),
        name: 'NeoBoard',
      }),
      '!room-1',
    );
    expect(standaloneClient.sendStateEvent).not.toHaveBeenCalledWith(
      'io.element.widgets.layout',
      '',
      expect.anything(),
      '!room-1',
    );
  });
});
