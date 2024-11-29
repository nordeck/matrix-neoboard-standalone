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
import { Component } from 'react';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * This is an error boundary for the suspense and specific to the search results UI.
 *
 * Due to react limitations this MUST be a class component at this time.
 * See https://react.dev/reference/react/Component#static-getderivedstatefromerror
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    // Handle JSON.stringify errors from swr devtools. We ignore them as they are due to cyclic references in the WidgetApi object.
    if (error.message.includes('cyclic object value')) {
      return { hasError: false, error: null };
    }

    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      console.error(this.state.error);
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}
