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

import { Button, styled } from '@mui/material';

export const LoginWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2rem',
  padding: '4rem',
});

export const StyledLoginForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '2rem',
});

export const StyledFormLabel = styled('label')({
  marginBottom: '0.5rem',
  fontSize: '14px',
});

export const FullWidthButton = styled(Button)({
  width: '100%',
  marginTop: '1rem',
  fontWeight: '700',
  fontSize: '18px',
  textTransform: 'none',
  borderRadius: '8px',
});

export const StyledFormInput = styled('input')({
  width: '100%',
  padding: '0.75rem',
  fontSize: '14px',
  fontWeight: '400',
  borderRadius: '8px',
  border: '1px solid #dadada',
});
