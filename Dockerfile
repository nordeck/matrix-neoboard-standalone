FROM aquasec/trivy:latest@sha256:1c78ed1ef824ab8bb05b04359d186e4c1229d0b3e67005faacb54a7d71974f73 AS scanner

# Copy yarn.lock to run SBOM scan
COPY yarn.lock /tmp
RUN trivy fs --format spdx-json --scanners "license" /tmp/yarn.lock > /tmp/sbom.spdx.json

FROM ghcr.io/nordeck/matrix-widget-toolkit/widget-server:1.2.1@sha256:4484168c740ecce8f6639d9d2c37b89077eae1a86555d59de4cfeef8a0a34b12

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

ADD --chown=nginx:nginx build /usr/share/nginx/html/
ADD --chown=nginx:nginx LICENSE /usr/share/nginx/html/LICENSE.txt

# Add SBOM to the public folder
COPY --from=scanner --chown=nginx:nginx /tmp/sbom.spdx.json /usr/share/nginx/html/sbom.spdx.json

# Allow loading images from all HTTP(s) URLs and blobs
ENV CSP_IMG_SRC="http: https: blob:"

# Allow to send requests to all HTTP(s) URLs
# Required for sending requests to homeservers
ENV CSP_CONNECT_SRC="http: https: wss:"
