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

import React, { useEffect } from 'react';
import { NoBoardPreview } from './NoBoardPreview';

interface BoardPreviewProps {
  preview: string | undefined;
}

export const BoardPreview: React.FC<BoardPreviewProps> = ({ preview }) => {
  const hasPreview = preview && preview.length > 0;

  useEffect(() => {
    if (hasPreview) {
      throw new Error('Not implemented yet');
    }
  }, [preview, hasPreview]);

  if (hasPreview) {
    return <></>;
  }

  return <NoBoardPreview />;
};
