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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { startLoginFlow } from '../../auth';
import { isValidServerName } from '../../lib';
import { Login } from '../Login';
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
  const [searchParams] = useSearchParams();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const staticServerName = getEnvironment('REACT_APP_HOMESERVER');
  const hasValidServerName = isValidServerName(staticServerName);
  const shouldSkipWelcomePane =
    hasValidServerName && searchParams.get('skipLogin') !== null;

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
    setLoginError(null);
  };

  useEffect(() => {
    if (shouldSkipWelcomePane) {
      startLoginFlow(staticServerName).catch(() => {
        setLoginError(
          t(
            'login.error.generic',
            'Please check your homeserver configuration and try again.',
          ),
        );
        setShowErrorDialog(true);
      });
    }
  }, [shouldSkipWelcomePane, staticServerName, t]);

  return (
    <>
      <Dialog
        open={showErrorDialog}
        onClose={handleCloseErrorDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('login.error.title', 'Login Failed')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{loginError}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} variant="contained">
            {t('app.ok', 'OK')}
          </Button>
        </DialogActions>
      </Dialog>

      {!shouldSkipWelcomePane && (
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
      )}
    </>
  );
};

export default WelcomePane;
