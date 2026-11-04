# NeoBoard Standalone

[![CI](https://github.com/nordeck/matrix-neoboard-standalone/actions/workflows/ci.yml/badge.svg)](https://github.com/nordeck/matrix-neoboard-standalone/actions/workflows/ci.yml)

NeoBoard is a private, secure, real-time collaborative whiteboard built on the
Matrix protocol, focused on content creation, brainstorming and team collaboration.

It is based on the [NeoBoard Widget](https://github.com/nordeck/matrix-neoboard),
a Matrix Widget that you can use on Matrix clients that support Widget integrations,
such as [Element Web](https://github.com/element-hq/element-web).

## Configuration

NeoBoard standalone is built using the [NeoBoard React SDK](https://github.com/nordeck/matrix-neoboard/tree/main/packages/react-sdk).
Therefore, all of NeoBoard's configuration options also apply when using it in standalone: see [the configuration section of the NeoBoard README](https://github.com/nordeck/matrix-neoboard?tab=readme-ov-file#configuration).

NeoBoard standalone itself exposes some aditional configuration options, which
can either be set via an environment variable or the `.env`-file.

| Name                                    | Description                                                                                                                                                                                    | Example                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `REACT_APP_WIDGET_BASE`                 | This sets the widget url for when the room is viewed using element-web or other widget-supporting clients. The schema (i.e.: `https://`) is required. If not set, a widget won't be available. | `https://neoboard.example.com`             |
| `REACT_APP_HOMESERVER`                  | If set, it uses this homeserver instead of showing an input field on the login screen. Either a domain name or homeserver URL.                                                                 | `example.com` or `https://example.com`     |
| `REACT_APP_SKIP_LOGIN`                  | If set to `true` and `REACT_APP_HOMESERVER` is set, then the application skips welcome/login screens and starts SSO immediately. It is not set by default.                                     | `true`                                     |
| `REACT_APP_SKIP_USER_LOGIN`             | If set to `true` and `REACT_APP_SKIP_LOGIN` is not set or `false`, then the application skips server name input to start user login. It is not set by default.                                 | `true`                                     |
| `REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN` | If set to `true` and `REACT_APP_SKIP_LOGIN` is not set or `false`, then the application skips restricted guests login. It is not set by default. Defaults to `true`,                           | `true`                                     |
| `REACT_APP_LOGOUT_REDIRECT_URL`         | If set, the application redirects the user to the specified URL after logout.                                                                                                                  | `https://id.example.com/logout`            |
| `REACT_APP_PRODUCT_NAME`                | The name of the product to be displayed.                                                                                                                                                       | `NeoBoard`                                 |
| `REACT_APP_APPEARANCE`                  | An appearance to be shown. Either `neoboard` or `opendesk`.                                                                                                                                    | `neoboard`                                 |
| `REACT_APP_FAVICON_16`                  | The URL of the 16x16 favicon. Defaults to the icon bundled for the configured appearance.                                                                                                      | `https://example.com/favicon-16.png`       |
| `REACT_APP_FAVICON_32`                  | The URL of the 32x32 favicon. Defaults to the icon bundled for the configured appearance.                                                                                                      | `https://example.com/favicon-32.png`       |
| `REACT_APP_APPLE_TOUCH_ICON`            | The URL of the 180x180 apple touch icon. Defaults to the icon bundled for the configured appearance.                                                                                           | `https://example.com/apple-touch-icon.png` |
| `REACT_APP_LIGHT_PRIMARY_COLOR`         | This overrides a primary palette color for the light theme.                                                                                                                                    | `#e85e10`                                  |
| `REACT_APP_LIGHT_PRIMARY_COLOR_LIGHT`   | This overrides a primary palette light color for the light theme.                                                                                                                              | `#ff8a42`                                  |
| `REACT_APP_LIGHT_PRIMARY_COLOR_DARK`    | This overrides a primary palette light color for the dark theme.                                                                                                                               | `#b52e00`                                  |
| `REACT_APP_LIGHT_BACKGROUND_LOGGED_IN`  | A background when user is logged in.                                                                                                                                                           | `#fcf9f3`                                  |
| `REACT_APP_LIGHT_BACKGROUND_CARD`       | A card background when a board is created.                                                                                                                                                     | `#fce2cf`                                  |

If the appearance is set to `opendesk`, the following options exist for configuring
the navigation bar:

| Name                                                  | Description                                                                                        | Example                               |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `REACT_APP_OPENDESK_BANNER_ICS_NAVIGATION_JSON_URL`   | Required. The URL of the navigation.json file that contains the navigation structure for the user. | `https://example.com/navigation.json` |
| `REACT_APP_OPENDESK_BANNER_ICS_SILENT_URL`            | Required. The URL of the silent endpoint that is used via inline frame to log in the user.         | `https://example.com/silent`          |
| `REACT_APP_OPENDESK_BANNER_PORTAL_URL`                | Required. The URL of the portal.                                                                   | `https://example.com`                 |
| `REACT_APP_OPENDESK_BANNER_PORTAL_LOGO_SVG_URL`       | Required. The URL of the portal logo.svg file.                                                     | `https://example.com/logo.svg`        |
| `REACT_APP_OPENDESK_BANNER_PORTAL_LOGO_WIDTH`         | Optional. The width of the portal logo, as a CSS length.                                           | `120px`                               |
| `REACT_APP_OPENDESK_BANNER_APP_HOME_ICON_SVG_URL`     | Optional. The URL of the app home icon.svg file.                                                   | `https://example.com/home.svg`        |
| `REACT_APP_OPENDESK_BANNER_TEXT_ACTION_ACCENT`        | Optional. Background of the launcher icon when not expanded.                                       | `#eeeff2`                             |
| `REACT_APP_OPENDESK_BANNER_COLOR_TEXT_PRIMARY`        | Optional. Primary text color.                                                                      | `#1b1d22`                             |
| `REACT_APP_OPENDESK_BANNER_COLOR_TEXT_PRIMARY_HOVER`  | Optional. Primary text color when hovered.                                                         | `#1b1d22`                             |
| `REACT_APP_OPENDESK_BANNER_COLOR_TEXT_PRIMARY_ACTIVE` | Optional. Primary text color when active.                                                          | `#ffffff`                             |
| `REACT_APP_OPENDESK_BANNER_BACKGROUND_COLOR`          | Optional. Background color of the navbar.                                                          | `#ffffff`                             |
| `REACT_APP_OPENDESK_BANNER_BACKGROUND_COLOR_HOVER`    | Optional. Background color of the title when hovered.                                              | `#eeeff2`                             |
| `REACT_APP_OPENDESK_BANNER_BACKGROUND_COLOR_ACTIVE`   | Optional. Background color of the title when active.                                               | `#571EFA`                             |
| `REACT_APP_OPENDESK_BANNER_HEIGHT`                    | Optional. Height of the navbar.                                                                    | `60px`                                |
| `REACT_APP_OPENDESK_BANNER_BORDER_BOTTOM`             | Optional. Border bottom of the navbar.                                                             | `1px solid #d3d7de`                   |

All options above are read at container start, so changing one only needs a
redeployment.

### Restricted Guest Access

NeoBoard Standalone has an experimental support for restricted guest access.
It allows unauthenticated users to join a specific board by opening a link to the board and entering the display name.
When enabled, the login screen shows a "Join as guest" form.

#### Prerequisites

- Synapse homeserver with Element [Restricted Guests Module](https://github.com/element-hq/element-modules/tree/main/modules/restricted-guests) installed.
- `REACT_APP_HOMESERVER` must be set, since guest login needs a known homeserver to register against.
- `REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN` must be set to `false` to activate restricted guest login.
- A board link: The guest login form only appears when the user navigates to a board URL (e.g. `https://neoboard.example.com/board/!roomId:example.com`).
  Without a board ID in the URL, only the regular user login is shown.
- A board must link to the ask to join room.

#### How it works

1. User opens a board link.
2. The guest enters a display name and clicks "Join as guest".
3. The application registers a guest account on the configured homeserver.
4. The guest knocks on the board's Matrix room.
5. A knock request is accepted. Currently no UI to accept knock requests. Assume to use a bot or Element Web UI to accept knocks.
6. The guest is logged in and can collaborate on the board.

#### Configuration examples

Show both user login and guest login:

```env
REACT_APP_HOMESERVER=matrix.example.com
REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN=false
```

Show only guest login (hide user login):

```env
REACT_APP_HOMESERVER=matrix.example.com
REACT_APP_SKIP_USER_LOGIN=true
REACT_APP_SKIP_RESTRICTED_GUEST_LOGIN=false
```

### Content Security Policy

For URLs pointing at assets hosted elsewhere, the origin has to be allowed by
the `img-src` directive of the CSP that the container serves:

```yaml
env:
  - name: REACT_APP_OPENDESK_BANNER_PORTAL_LOGO_SVG_URL
    value: 'https://portal.example.com/logo.svg'
  - name: CSP_IMG_SRC
    value: 'https://portal.example.com'
```

## Getting Started

Development happens at [GitHub](https://github.com/nordeck/matrix-neoboard-standalone).

### How to Contribute

Please take a look at our [Contribution Guidelines](https://github.com/nordeck/.github/blob/main/docs/CONTRIBUTING.md).
Check the following steps to develop for NeoBoard standalone:

### Requirements

You need to install Node.js (`^ 20.0.0`, prefer using an LTS version) and run `yarn` to work on this package.

### Installation

After checkout, run `yarn install` to download the required dependencies

> [!WARNING]
> Do not use `npm install` when working with this package.

### NeoBoard standalone local development environment

#### Clone the repos and install dependencies

NeoBoard standalone uses [`@nordeck/matrix-neoboard-react-sdk`][@nordeck/matrix-neoboard-react-sdk], that provides the board components.
It may often happen, that it is necessary to change both, standalone and the react SDK.
For a better development experience, NeoBoard standalone links [`@nordeck/matrix-neoboard-react-sdk`][@nordeck/matrix-neoboard-react-sdk]
in it's `package.json`. Because of that it is important to clone both repos next to each other.

The React SDK commit that NeoBoard standalone is built against is pinned in
[`neoboard-react-sdk.version`](./neoboard-react-sdk.version) (see [Pinning the NeoBoard React SDK](#pinning-the-neoboard-react-sdk)).
Clone NeoBoard, check out the pinned commit and install the dependencies:

```sh
git clone git@github.com:nordeck/matrix-neoboard.git
cd matrix-neoboard
git checkout "$(cat ../matrix-neoboard-standalone/neoboard-react-sdk.version)"
cd packages/react-sdk
yarn install
cd ../../..
```

Clone NeoBoard standalone and install the dependencies:

```sh
git clone git@github.com:nordeck/matrix-neoboard-standalone.git
cd matrix-neoboard-standalone
yarn install
```

#### Start the development environment

You can now start NeoBoard standalone:

```sh
yarn run dev:https
```

Then open the printed URL and connect to a Homeserver that supports authentication
with the [OAuth 2.0 API](https://spec.matrix.org/v1.19/client-server-api/#oauth-20-api).

### Available Scripts

In the project directory, you can run:

- `yarn dev`: Start NeoBoard standalone for development.
- `yarn dev:https`: Start NeoBoard standalone for development with a self-signed HTTPS certificate.
- `yarn preview`: Start NeoBoard standalone with production build.
- `yarn preview:https`: Start NeoBoard standalone with production build with a self-signed HTTPS certificate.
- `yarn build`: Build the production version of NeoBoard standalone.
- `yarn test`: Watch all files for changes and run tests.
- `yarn test:all`: Run all tests with coverage report.
- `yarn lint`: Run eslint on NeoBoard standalone.
- `yarn prettier:check`: Check if files are prettier compliant.
- `yarn prettier:write`: Run prettier on all files to format them.
- `yarn prepare`: Set up Husky.
- `yarn depcheck`: Check for missing or unused dependencies.
- `yarn deduplicate`: Deduplicate dependencies in the `yarn.lock` file.
- `yarn changeset`: Generate a changeset that provides a description of a change.
- `yarn translate`: Update translation files from code.
- `yarn generate-disclaimer`: Generates license disclaimer and include it in the build output.
- `yarn docker:build`: Builds a container image from the output of `yarn build` and `yarn generate-disclaimer`.
- `yarn clean`: Cleans builds and caches
- `yarn clean:build`: Cleans builds
- `yarn clean:cache`: Cleans caches

### Versioning

This package uses automated versioning.
Each change should be accompanied by a specification of the impact (`patch`, `minor`, or `major`) and a description of the change.
Use `yarn changeset` to generate a new changeset for a pull request.
Learn more in the [`.changeset` folder](./.changeset).

Once the change is merged to `main`, a “Version Packages” pull request will be created.
As soon as the project maintainers merged it, the package will be released and the container is published.

### Pinning the NeoBoard React SDK

CI builds NeoBoard standalone against the [`@nordeck/matrix-neoboard-react-sdk`][@nordeck/matrix-neoboard-react-sdk]
commit pinned in [`neoboard-react-sdk.version`](./neoboard-react-sdk.version) at the repository root.
The file contains a single line with the full commit hash of the
[`matrix-neoboard`](https://github.com/nordeck/matrix-neoboard) repository to build against.

The pin is managed by the developers:

- **Feature PRs** that require newer SDK changes bump the pin in the same pull request.
- **Releases** bump the pin to the SDK commit the release should ship with, see
  [Publishing a new version](#publishing-a-new-version).

### Publishing a new version

A release ships the code on `main` together with the NeoBoard React SDK commit pinned in
[`neoboard-react-sdk.version`](./neoboard-react-sdk.version).

1. Bump `neoboard-react-sdk.version` to the SDK commit the release should ship with and merge it to `main` via a
   pull request, including a changeset for the SDK update.
2. The changesets action creates or updates the “Version Packages” pull request from the current `main`, so it
   carries the new pin. Review the version bump, the changelog and the pin.
3. Merge the “Version Packages” pull request. CI builds the image against the pinned SDK and creates the `v<version>`
   tag, which triggers the “Release Package” workflow. It re-tags the image as `<version>` and `latest`, signs it
   and attaches the SBOM to the GitHub release.

Do not commit on the “Version Packages” branch: it is re-created on every push to `main`, so changes there are lost.
Fix things on `main` instead.

### Processing Renovate PRs

Renovate PRs which update packages that are direct dependencies of our packages (and not `devDependencies`) need a changeset as described above.
Specify the impact as `patch`.

### Architecture Decision Records

We use [Architecture Decision Records (ADR)s](https://github.com/nordeck/matrix-widget-toolkit/blob/main/docs/adrs/adr001-use-adrs-to-document-decisions.md) to document decisions for our software.
You can find them at [`/docs/adrs`](./docs/adrs/).

## Deployment

We provide a [HELM chart](./charts/).

Install via OCI Registry:

```sh
helm install matrix-neoboard-standalone oci://ghcr.io/nordeck/charts/matrix-neoboard-standalone
```

## Supply Chain Security

To ensure transparency and security in our software supply chain, we provide comprehensive Software Bill of Materials (SBOM) reports for this project and signed container images.

### SBOM Reports

We provide SBOM reports within the widget container and as a release artifact.

- The generated SBOM report is available alongside the hosted widget assets, and can be found at `<DEPLOYMENT-URL>/sbom.spdx.json`, or via the filesystem at `/usr/share/nginx/html/sbom.spdx.json`
- Each GitHub release has a corresponding image SBOM scan report file attached as a release asset

### Signed Container Images and Charts

Our container images and chart releases are signed by [cosign](https://github.com/sigstore/cosign) using identity-based ("keyless") signing and transparency.

Execute the following command to verify the signature of the container image,
replacing `<version>` with the release version:

```sh
cosign verify \
--certificate-identity-regexp https://github.com/nordeck/matrix-neoboard-standalone/.github/workflows/publish-release.yml@refs/tags/v \
--certificate-oidc-issuer https://token.actions.githubusercontent.com \
ghcr.io/nordeck/matrix-neoboard-standalone:<version> | jq
```

Execute the following command to verify the signature of a chart container image,
replacing `<version>` with the release version:

```sh
cosign verify \
--certificate-identity-regexp https://github.com/nordeck/matrix-neoboard-standalone/.github/workflows/helm-release.yml@refs/tags/@nordeck/helm-matrix-neoboard-standalone-<version> \
--certificate-oidc-issuer https://token.actions.githubusercontent.com \
ghcr.io/nordeck/charts/matrix-neoboard-standalone:<version> | jq
```

## License

This project is licensed under [GNU Affero General Public License (AGPL), v3.0 or later](./LICENSE).

The disclaimer for other OSS components can be accessed via the `/NOTICE.txt` endpoint.
The list of dependencies and their licenses are also available in a machine readable format at `/usr/share/nginx/html/licenses.json` in the container image.

[@nordeck/matrix-neoboard-react-sdk]: https://github.com/nordeck/matrix-neoboard/tree/main/packages/react-sdk
