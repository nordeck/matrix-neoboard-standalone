#!/usr/bin/env sh

# SPDX-FileCopyrightText: 2025 Nordeck IT + Consulting GmbH
#
# SPDX-License-Identifier: AGPL-3.0-or-later

cd ../matrix-neoboard || exit 1
echo "$(git rev-parse HEAD)" > ../matrix-neoboard-standalone/build/sdk_revision
grep '"version"' packages/react-sdk/package.json | cut -d '"' -f 4 > ../matrix-neoboard-standalone/build/sdk_version
