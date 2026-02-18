# @nordeck/matrix-neoboard-standalone

## 0.1.1

### Patch Changes

- 8613421: Upload helm chart to OCI Registry, release helm chart

## 0.1.0

### Minor Changes

- 0df71a4: Add the DeviceID widget parameter and implement the requestOpenIDConnectToken Widget API method
- dcbc435: Add possibility to customize theme colors via environment variables.
- f7d8d17: Add `REACT_APP_SKIP_LOGIN` environment variable to skip login if `REACT_APP_HOMESERVER` is configured
- 28be814: Skip WelcomePane if homeserver and skipLogin query parameter are set on /login
- 7a995ed: Swap the order of the "Invite" button and the "Cancel" button to be consistent with other dialogs.
- cb9fcaa: Delete user button in tile view and increase preview area
- 7e47cbe: Add SSO authentication via Legacy API
- 15f8f74: Add support for the delayed events
- 2f00322: add wss to CSP to enable matrixRTC
- 8ffda50: Remove 'users' column from dashboard list view
- 5593a14: Users now have simple and understandable URLs for login, dashboard, and boards.
- a990a2c: Add `REACT_APP_LOGOUT_REDIRECT_URL` environment variable with URL to redirect after logout
- d05e845: Add new menu item -about- for standalone and widget infos
- 8bd59aa: The Margins around the board have been removed to improve efficiency when working on a board.
- dcbc435: Configure appearance to be `neoboard` or `opendesk`.
- 51632c7: Adds UI to change the preferred language

### Patch Changes

- 9993f86: Update matrix widget toolkit to latest
- 5e49554: Update height expression to fix finite canvas view
- 05dbab1: Update Helm chart config env var comments
- bd57a31: Update matrix-widget-toolkit dependencies: @matrix-widget-toolkit/mui to 2.1.3, @matrix-widget-toolkit/react to 2.0.6, @mui/lab to 6.0.1-beta.35
- 54f7f54: Remove `skipLogin` query parameter from the login page
- fc24573: Wait for the created board to sync to the store before navigate
- 3506b89: Update `widget-server` to 1.2.1
- 3727cfd: Show neoboard user actions for opendesk banner if silent login fails
- 7d4e63a: Replace UserMenu avatar with ElementAvatar component
- 563bab0: Update OIDC authentication to use /auth_metadata endpoint
- b14aa6f: Update i18next-cli to 1.33.5
- 2dd8794: Fix the color of the home icon for the openDesk appearance.
- 7a84712: Use different session state event based on RTC backend selection
- 6aadb95: Fix long selected users list to wrap
- c5d0417: Update vite to 7, vitest to 3.2.4
- 9532af6: Add device id to fix widget url
- 96c2260: Adds a notification icon with a badge to better show pending invites
- 6488d51: Fix room create event initial loading
- f724593: create tile button on empty dashboard has preview tile height
- 0cd2607: Improved rename dialog behavior
- eae09bb: Fix whiteboard state event race condition and minimum events loaded when board is created/opened.
- 2b76370: Adds SBOM report to neoboard standalone, build and release assets
- a21895e: The Helm Chart has now the unused configmap removed, the ingress now uses the correct hosts data from the values, a networkpolicy option was added and the service port and type has been hardcoded.

  Important changes:
  - Removed unused configmap
  - The ingress hosts and tls sections from the values.yaml are now used. Make sure you update your values.yaml file!
  - Added networkpolicy option
  - Hardcoded service port and type
  - The default set annotations on the ingress have been removed. Make sure you update your values.yaml file!

- 7472e5e: Use i18next-cli instead of i18next-parser
- f724593: Fix dashboard tile meatball menu button to align right for short board names.
- 7e47cbe: Improve `REACT_APP_HOMESERVER` usage to derive a homeserver URL from a domain name if auto discovery fails
- 9db7af0: Query params are no longer included in the OIDC redirect URI.
  This makes the callback URI static and prevents OIDC provider errors.
