# Neoboard Standalone Architecture docs

## OIDC Login flow

The following sequence diagram shows the a fresh login flow.

```mermaid
sequenceDiagram
  title: Log in to a new session

  actor User

  box NeoBoardStandalone
    participant Login
    participant Application
    participant Credentials
  end

  box external services
    participant Webserver
    participant Homeserver
    participant MAS
  end

  User ->> Login: click sign in button
  Login ->> Login: discoverClientConfig()
  Login ->> Webserver: /.well-known/matrix/client
  Webserver -->> Login: baseUrl
  Login ->> Login: fetchAuthMetadata(baseUrl)
  Login ->> Homeserver: /_matrix/client/unstable/org.matrix.msc2965/auth_metadata
  Homeserver -->> Login: Auth metadata
  Login ->> Login: registerOidcClient(oidcClientConfig)
  Login ->> MAS: redirect
  MAS ->> User: prompt for credentials
  User ->> MAS: enter credentials
  MAS ->> Application: redirect
  Application ->> Application: start()
  Application ->> Application: attemptCompleteOidcLogin()
  Application ->> Homeserver: whoami
  Homeserver -->> Application: userId / deviceId
  Application ->> Credentials: set credentials
  Note over Application: Credentials have been saved to localStorage.<br />From now on, it is the same as<br />when restoring a session from localStorage.
  Application ->> Application: attemptStartFromStoredSession()
  Application ->> Credentials: get credentials
  Application ->> Application: createOidcTokenRefresher()
  Application ->> Application: createAndStartMatrixclient()
  Application ->> Application: set state to "loggedIn"
```

## Legacy API SSO Login Flow

Alternatively, `SSO` is available via `Legacy API` as described
in [the Matrix Specification](https://spec.matrix.org/v1.16/client-server-api/#client-login-via-sso).
