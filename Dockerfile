# SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
#
# SPDX-License-Identifier: AGPL-3.0-or-later

FROM ghcr.io/nordeck/matrix-widget-toolkit/widget-server:1@sha256:e20146b7f11dfb663874fed7a289e412ce6e8e623c6eb2261e35a220029ba042

ARG REACT_APP_VERSION
ARG REACT_APP_REVISION
ARG REACT_APP_REACT_SDK_VERSION
ARG REACT_APP_REACT_SDK_REVISION
ARG REACT_APP_EMBEDDED

ENV REACT_APP_VERSION=${REACT_APP_VERSION}
ENV REACT_APP_REVISION=${REACT_APP_REVISION}
ENV REACT_APP_REACT_SDK_VERSION=${REACT_APP_REACT_SDK_VERSION}
ENV REACT_APP_REACT_SDK_REVISION=${REACT_APP_REACT_SDK_REVISION}
ENV REACT_APP_EMBEDDED=${REACT_APP_EMBEDDED}

ADD build /usr/share/nginx/html/
ADD LICENSE /usr/share/nginx/html/LICENSE.txt

# Allow loading images from all HTTP(s) URLs and blobs
ENV CSP_IMG_SRC="http: https: blob:"

# Allow to send requests to all HTTP(s) URLs
# Required for sending requests to homeservers
ENV CSP_CONNECT_SRC="http: https: wss:"
