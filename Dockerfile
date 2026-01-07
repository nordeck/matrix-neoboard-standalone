FROM aquasec/trivy:latest AS scanner

# Copy yarn.lock to run SBOM scan
COPY yarn.lock /tmp
RUN trivy fs --format spdx-json --scanners "license" /tmp/yarn.lock > /tmp/sbom.spdx.json

FROM ghcr.io/nordeck/matrix-widget-toolkit/widget-server:1@sha256:fd7bef03389b7506112cd5f89e98da51f4ce720ee1cd027026e2f1cfbcd30007

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
