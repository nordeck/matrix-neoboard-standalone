#!/usr/bin/env sh
cd ../matrix-neoboard || exit 1
echo "$(git rev-parse HEAD)" > ../matrix-neoboard-standalone/build/sdk_revision
grep '"version"' packages/react-sdk/package.json | cut -d '"' -f 4 > ../matrix-neoboard-standalone/build/sdk_version
