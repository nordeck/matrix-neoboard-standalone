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

import { MatrixEvent, Room } from 'matrix-js-sdk';
import {
  ReceiptType,
  WrappedReceipt,
} from 'matrix-js-sdk/lib/@types/read_receipts';

/**
 * Create a minimal timeline event, that only provides an id and a timestamp.
 */
export function createMatrixEvent(eventId: string, ts = 0): MatrixEvent {
  return {
    getId: () => eventId,
    getTs: () => ts,
  } as unknown as MatrixEvent;
}

/**
 * Create a minimal room, that only provides its latest event and the private
 * read receipt of a single user.
 */
export function createMatrixRoom({
  roomId = '!room:example.com',
  lastLiveEvent,
  privateReceipt,
}: {
  roomId?: string;
  lastLiveEvent?: MatrixEvent;
  privateReceipt?: WrappedReceipt;
} = {}): Room {
  return {
    roomId,
    getLastLiveEvent: () => lastLiveEvent,
    getReadReceiptForUserId: (
      _userId: string,
      _ignoreSynthesized?: boolean,
      receiptType?: ReceiptType,
    ) =>
      receiptType === ReceiptType.ReadPrivate ? (privateReceipt ?? null) : null,
  } as unknown as Room;
}

/**
 * Create an `m.receipt` event carrying a private read receipt of a user.
 */
export function createPrivateReceiptEvent({
  eventId = '$event',
  userId = '@user:example.com',
  ts = 0,
  receiptType = ReceiptType.ReadPrivate,
}: {
  eventId?: string;
  userId?: string;
  ts?: number;
  receiptType?: ReceiptType;
} = {}): MatrixEvent {
  return {
    getContent: () => ({
      [eventId]: {
        [receiptType]: {
          [userId]: { ts },
        },
      },
    }),
  } as unknown as MatrixEvent;
}
