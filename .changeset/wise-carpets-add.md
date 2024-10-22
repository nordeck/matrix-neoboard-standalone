---
'@nordeck/matrix-neoboard-standalone': patch
---

Query params are no longer included in the OIDC redirect URI.
This makes the callback URI static and prevents OIDC provider errors.
