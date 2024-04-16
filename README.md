# NeoBoard Standalone

![Build](https://github.com/nordeck/matrix-neoboard-standalone/workflows/CI/badge.svg)

Standalone version of [NeoBoard](https://github.com/nordeck/matrix-neoboard) - A collaborative whiteboard widget for Element, based on Matrix.

## Getting Started

Development happens at [GitHub](https://github.com/nordeck/matrix-neoboard-standalone).

### How to Contribute

Please take a look at our [Contribution Guidelines](https://github.com/nordeck/.github/blob/main/docs/CONTRIBUTING.md).
Check the following steps to develop for NeoBoard standalone:

### Requirements

You need to install Node.js (`^ 20.0.0`, prefer using an LTS version) and run `yarn` to work on this package.

### Installation

After checkout, run `yarn install` to download the required dependencies

> **Warning** Do not use `npm install` when working with this package.

### NeoBoard standalone local development environment

#### Synapse and MAS configuration

Synapse with MAS is required to run NeoBoard standalone locally.

It is possible to use the Compose file in `./dev` to create the environment:

- Add the following to the host's hosts-file:
  `127.0.0.1 matrix.local mas.matrix.local synapse.matrix.local`
- cd `dev`
- Depending on the runtime:
  - `podman compose --podman-run-args="--no-hosts" up`
  - `docker compose up`
- Visit the following URLs and accept the certificate
  - https://matrix.local
  - https://mas.matrix.local
  - https://synapse.matrix.local/_matrix/client/versions

#### Link to matrix-neoboard-widget

Project currently depends on the branch from the neoboard project: `nordeck/matrix-neoboard#nic/feat/temp_export`.
This branch exports components and couple of other changes.

Currently after checkout of this project you have to change the directory to `node_modules/@nordeck/matrix-neoboard-widget/`
and run `yarn install` there.

It is possible to link `matrix-neoboard-widget` to this standalone project with `yarn link` for the development.

Sometimes `yarn` caches the `matrix-neoboard-widget` repository and not downloads a branch for the commit mentioned
in yarn.lock, then `yarn cache clean` and `yarn install --force` should be executed.

#### Running

Then run `yarn dev` from the project root to start a development environment.
When asked for a server name enter `matrix.local`.

Currently, the user have to have a room with whiteboard in order to see a widget loaded.
Otherwise, widget will be in loading state waiting for for such room to appear.

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

### Versioning

This package uses automated versioning.
Each change should be accompanied by a specification of the impact (`patch`, `minor`, or `major`) and a description of the change.
Use `yarn changeset` to generate a new changeset for a pull request.
Learn more in the [`.changeset` folder](./.changeset).

Once the change is merged to `main`, a “Version Packages” pull request will be created.
As soon as the project maintainers merged it, the package will be released and the container is published.

### Architecture Decision Records

We use [Architecture Decision Records (ADR)s](https://github.com/nordeck/matrix-widget-toolkit/blob/main/docs/adrs/adr001-use-adrs-to-document-decisions.md) to document decisions for our software.
You can find them at [`/docs/adrs`](./docs/adrs/).

## License

This project is licensed under [APACHE 2.0](./LICENSE).

The disclaimer for other OSS components can be accessed via the `/NOTICE.txt` endpoint.
The list of dependencies and their licenses are also available in a machine readable format at `/usr/share/nginx/html/licenses.json` in the container image.
