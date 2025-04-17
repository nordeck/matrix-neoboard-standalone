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
