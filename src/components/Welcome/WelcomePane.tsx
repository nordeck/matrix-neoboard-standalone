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

import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
