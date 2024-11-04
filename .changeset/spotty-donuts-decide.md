---
'@nordeck/matrix-neoboard-standalone': patch
---

The Helm Chart has now the unused configmap removed, the ingress now uses the correct hosts data from the values, a networkpolicy option was added and the service port and type has been hardcoded.

Important changes:

- Removed unused configmap
- The ingress hosts and tls sections from the values.yaml are now used. Make sure you update your values.yaml file!
- Added networkpolicy option
- Hardcoded service port and type
- The default set annotations on the ingress have been removed. Make sure you update your values.yaml file!
