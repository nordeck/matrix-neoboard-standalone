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

import { Button, styled } from '@mui/material';

export const LoginWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2rem',
  padding: '4rem',
}));

export const StyledLoginForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '2rem',
}));

export const StyledFormLabel = styled('label')(({ theme }) => ({
  marginBottom: '0.5rem',
  fontSize: '14px',
}));

export const FullWidthButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: '1rem',
  fontWeight: '700',
  fontSize: '18px',
  textTransform: 'none',
  borderRadius: '8px',
}));

export const StyledFormInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '0.75rem',
  fontSize: '14px',
  fontWeight: '400',
  borderRadius: '8px',
  border: '1px solid #dadada',
}));
