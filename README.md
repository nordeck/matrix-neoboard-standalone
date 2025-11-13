# NeoBoard Standalone

[![CI](https://github.com/nordeck/matrix-neoboard-standalone/actions/workflows/ci.yml/badge.svg)](https://github.com/nordeck/matrix-neoboard-standalone/actions/workflows/ci.yml)

Standalone version of [NeoBoard](https://github.com/nordeck/matrix-neoboard) - A collaborative whiteboard widget for Element, based on Matrix.

## Configuration

NeoBoard standalone is built using the [NeoBoard React SDK](https://github.com/nordeck/matrix-neoboard/tree/main/packages/react-sdk).
Therefore, all of NeoBoard's configuration options apply also when using it in standalone: see [the configuration section of the NeoBoard README](https://github.com/nordeck/matrix-neoboard?tab=readme-ov-file#configuration).

On top, NeoBoard standalone offer some addition configuration options.
They can either be set via an environment variable or the `.env`-file.

| Name                                   | Description                                                                                                                                                                                    | Example                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `REACT_APP_WIDGET_BASE`                | This sets the widget url for when the room is viewed using element-web or other widget-supporting clients. The schema (i.e.: `https://`) is required. If not set, a widget won't be available. | `https://neoboard.example.com` |
| `REACT_APP_HOMESERVER`                 | If set, it uses this homeserver instead of showing an input field on the login screen. Do not use `https://`.                                                                                  | `example.com`                  |
| `REACT_APP_APPEARANCE`                 | An appearance to be shown. Either `neoboard` or `opendesk`.                                                                                                                                    | `neoboard`                     |
| `REACT_APP_LIGHT_PRIMARY_COLOR`        | This overrides a primary palette color for the light theme.                                                                                                                                    | `#e85e10`                      |
| `REACT_APP_LIGHT_PRIMARY_COLOR_LIGHT`  | This overrides a primary palette light color for the light theme.                                                                                                                              | `#ff8a42`                      |
| `REACT_APP_LIGHT_PRIMARY_COLOR_DARK`   | This overrides a primary palette light color for the dark theme.                                                                                                                               | `#b52e00`                      |
| `REACT_APP_LIGHT_BACKGROUND_LOGGED_IN` | A background when user is logged in.                                                                                                                                                           | `#fcf9f3`                      |
| `REACT_APP_LIGHT_BACKGROUND_CARD`      | A card background when a board is created.                                                                                                                                                     | `#fce2cf`                      |

`opendesk` banner configurations:

| Name                                                | Description                                                                                        | Example                               |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `REACT_APP_OPENDESK_BANNER_ICS_NAVIGATION_JSON_URL` | Required. The URL of the navigation.json file that contains the navigation structure for the user. | `https://example.com/navigation.json` |
| `REACT_APP_OPENDESK_BANNER_ICS_SILENT_URL`          | Required. The URL of the silent endpoint that is used via inline frame to log in the user.         | `https://example.com/silent`          |
| `REACT_APP_OPENDESK_BANNER_PORTAL_LOGO_SVG_URL`     | Required. The URL of the portal logo.svg file.                                                     | `https://example.com/logo.svg`        |
| `REACT_APP_OPENDESK_BANNER_PORTAL_URL`              | Required. The URL of the portal.                                                                   | `https://example.com`                 |
| `REACT_APP_OPENDESK_BANNER_TEXT_ACTION_ACCENT`      | Optional. Background of the launcher icon when expanded and the top border of the menu.            | `#5e27dd`                             |
| `REACT_APP_OPENDESK_BANNER_COLOR_TEXT_PRIMARY`      | Optional. Primary text color.                                                                      | `#1b1d22`                             |

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

Clone NeoBoard and install the dependencies:

```sh
git clone git@github.com:nordeck/matrix-neoboard.git
cd matrix-neoboard/packages/react-sdk
yarn install
cd ../../..
```

Clone NeoBoard standalone and install the dependencies:

```sh
git clone git@github.com:nordeck/matrix-neoboard-standalone.git
cd matrix-neoboard-standalone
yarn install
```

#### Set up Synapse with MAS

Synapse with MAS is required to run NeoBoard standalone locally.

It is possible to use the Compose file from [opendesk-widgets-docker-compose](https://github.com/nordeck/opendesk-widgets-docker-compose) to create the environment:

- Add the following to your hosts-file:  
  `127.0.0.1 matrix.internal mas.matrix.internal synapse.matrix.internal`
- Clone opendesk-widgets-docker-compose:  
  `git clone --recurse-submodules git@github.com:nordeck/opendesk-widgets-docker-compose.git`
- `cd opendesk-widgets-docker-compose`
- Start the required containers:
  - Podman `podman compose --podman-run-args="--no-hosts" -f compose.mas.yaml --env-file nordeck.env up web synapse-db synapse mas-db mas`
  - Docker `docker compose -f compose.mas.yaml --env-file nordeck.env up web synapse-db synapse mas-db mas`
- Visit the following URLs and accept the certificate
  - <https://matrix.internal>
  - <https://mas.matrix.internal>
  - <https://synapse.matrix.internal/_matrix/client/versions>

#### Start the development environment

You can now start NeoBoard standalone:

```sh
yarn run dev:https
```

Then open the printed URL. Your Homeserver is `matrix.internal`.

#### Running

Then run `yarn dev` from the project root to start a development environment.
When asked for a server name enter `matrix.internal`.

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

### Processing Renovate PRs

Renovate PRs which update packages that are direct dependencies of our packages (and not `devDependencies`) need a changeset as described above.
Specify the impact as `patch`.

### Architecture Decision Records

We use [Architecture Decision Records (ADR)s](https://github.com/nordeck/matrix-widget-toolkit/blob/main/docs/adrs/adr001-use-adrs-to-document-decisions.md) to document decisions for our software.
You can find them at [`/docs/adrs`](./docs/adrs/).

## License

This project is licensed under [GNU Affero General Public License (AGPL), v3.0 or later](./LICENSE).

The disclaimer for other OSS components can be accessed via the `/NOTICE.txt` endpoint.
The list of dependencies and their licenses are also available in a machine readable format at `/usr/share/nginx/html/licenses.json` in the container image.

[@nordeck/matrix-neoboard-react-sdk]: https://github.com/nordeck/matrix-neoboard/tree/main/packages/react-sdk
