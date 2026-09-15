---
'@nordeck/matrix-neoboard-standalone': minor
---

Enable infinite canvas and the MatrixRTC implementation by default

`REACT_APP_INFINITE_CANVAS` now defaults to `true` and `REACT_APP_RTC` to
`matrixrtc`, for the container image as well as for local development and builds
from source. Both variables can still be set explicitly to opt out.
