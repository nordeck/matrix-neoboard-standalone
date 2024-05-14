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

import { t } from 'i18next';
import { Login } from '../Login/Login';
import { WelcomeLogo } from './WelcomeLogo';
import WelcomeSymbols from './WelcomeSymbols';
import {
  WelcomeGrid,
  WelcomeGridLeftPane,
  WelcomeGridRightPane,
  WelcomeGridSymbols,
  WelcomeLogoGridWrapper,
  WelcomeText,
  WelcomeWrapper,
} from './styles';

export const WelcomePane = () => {
  return (
    <WelcomeWrapper>
      <WelcomeGrid container>
        <WelcomeGridLeftPane item xs={12} sm={7}>
          <WelcomeGrid>
            <WelcomeLogoGridWrapper item>
              <WelcomeLogo />
            </WelcomeLogoGridWrapper>
            <WelcomeGridSymbols>
              <WelcomeSymbols />
            </WelcomeGridSymbols>
            <WelcomeGridSymbols>
              <WelcomeText>{t('welcome.title', 'Welcome')}</WelcomeText>
            </WelcomeGridSymbols>
          </WelcomeGrid>
        </WelcomeGridLeftPane>
        <WelcomeGridRightPane xs={12} sm={5}>
          <Login />
        </WelcomeGridRightPane>
      </WelcomeGrid>
    </WelcomeWrapper>
  );
};

export default WelcomePane;
