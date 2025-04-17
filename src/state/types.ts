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

import { WidgetApi } from '@matrix-widget-toolkit/api';
import { BehaviorSubject } from 'rxjs';
import { StandaloneClient } from '../toolkit/standalone';

/**
 * BehaviorSubject type that only exposes functions for subscribers.
 */
export type ObservableBehaviorSubject<T> = Pick<
  BehaviorSubject<T>,
  'subscribe' | 'getValue' | 'pipe'
>;

/**
 * Represents a state that is available when user is logged in into the app.
 */
export type LoggedInState = {
  userId: string;
  deviceId: string;
  homeserverUrl: string;
  standaloneClient: StandaloneClient;
  /**
   * Handler to resolve widgetApi, should be invoked when room with whiteboard is selected.
   * @param widgetApi
   */
  resolveWidgetApi: (widgetApi: WidgetApi) => void;
  /**
   * Widget API promise that will be resolved when handler to resolve widget api is called.
   */
  widgetApiPromise: Promise<WidgetApi>;
};
