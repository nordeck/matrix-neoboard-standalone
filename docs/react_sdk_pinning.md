# Neoboard React SDK pinning

This explains which commit of [`matrix-neoboard`](https://github.com/nordeck/matrix-neoboard)'s `react-sdk`
is used to build it in different scenarios.

The pinned commit lives in [`sdk.version`](../sdk.version) at the repo root.
Whether it gets refreshed before a build - and what ends up tagged - depends on the trigger.

## Scenarios

| Scenario                                                | Trigger                                                                                             | Docker image built using                                  | SDK commit used                                                                                                                                                                           | What (if anything) gets tagged                                                                                                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Push to a feature branch (no pull request open yet)** | _(none - `ci.yml` only reacts to `push` on `main`/`release/*`, `pull_request`, or manual dispatch)_ | -                                                         | -                                                                                                                                                                                         | -                                                                                                                                                                                           |
| **Feature PR open/updated**                             | `pull_request`                                                                                      | **`sdk.version` pin** (as committed on that branch)       | Not refreshed - whatever is already committed, so PR builds are reproducible across reruns.                                                                                               | When the image is pushed, `standalone-<PR head SHA>-sdk-<SDK SHA>`.                                                                                                                         |
| **Feature PR merged to `main`**                         | `push` to `main`, with pending changesets                                                           | **HEAD of `matrix-neoboard` `main`**                      | Resolved once before the build and passed to the custom Changesets version command, which writes the same SHA to `sdk.version` after preparing the "Version Packages" release branch.     | `standalone-<standalone SHA>-sdk-<SDK SHA>`.                                                                                                                                                |
| **Release PR merged to `main`**                         | `push` to `main`, no pending changesets left                                                        | **`sdk.version` pin** (as committed in that merge commit) | Deliberately **not** re-refreshed against HEAD, so the build always matches its own git history exactly - even if upstream has moved further since the release PR was opened and updated. | The CI build receives `standalone-<standalone SHA>-sdk-<SDK SHA>`. After `yarn changeset tag` creates `vX.Y.Z`, `publish-release.yml` also promotes it as `standalone-X.Y.Z-sdk-<SDK SHA>`. |

## Rule of thumb

The build tracks **HEAD** only when a change is actually going to be captured in
an upcoming release PR (so nothing is lost). The SHA is resolved once and used
both for the build and the `changeset:version` command. Because Changesets prepares
its release branch before running that command, the generated release commit records
the exact SDK revision that was built.

The workflow always falls back to the **pin** whenever a build's result could
otherwise be tagged/released without a corresponding commit - PR builds
(which are only pushed when package credentials are available) and release-PR-merge builds
(this is the exact commit about to be tagged) - so a release can never contain
an SDK commit that isn't also recorded in `sdk.version`'s own git history.

## Container tags

Every image pushed by `ci.yml` receives a composite revision tag:

```text
standalone-<standalone commit SHA>-sdk-<SDK commit SHA>
```

Release promotion keeps the existing semantic-version tag and also adds:

```text
standalone-<standalone version>-sdk-<SDK commit SHA>
```

The existing SHA, Argo CD, semantic-version, and `latest` tags remain available
for existing consumers. Both composite tags use the SDK commit selected for the
original CI build; released SDK package versions are not used.

## Other triggers

Two additional triggers exist but are out of scope of the scenarios above:

- Pushes to `release/*` branches always build from the pin - both the refresh step
  and the changesets/tagging logic are skipped entirely there.
- A manual `workflow_dispatch` run can override with an explicit `neoboard_ref`
  input, which always takes precedence over both the pin and HEAD.

## Renovate Bot PRs

Renovate's PRs (dependency bumps, Docker/action digest updates, etc.) merge to
`main` without adding a changeset file. As long as no other changeset happens to
be pending at the same time, that merge lands in the same "no pending changesets"
state as the **Release PR merged to `main`** row above - it's not specific to
release PRs, it's whatever the changeset state happens to be at merge time.

This has two consequences:

- **No new release is triggered.** `changesets/action` finds nothing to version,
  so it goes straight to the `publish` path and runs `yarn changeset tag`. That looks
  for a tag matching the current `package.json` version, finds it already exists from
  the last real release, and skips creating a duplicate - so the merge produces no
  new tag and `publish-release.yml` never fires.
- **The build uses the pinned `sdk.version`, not HEAD.** Since there are no
  pending changesets, the "Update SDK commit pin" step skips refreshing against
  upstream `matrix-neoboard` and builds from whatever commit is already committed
  in `sdk.version` - exactly the same reasoning as the release-PR-merge case:
  this commit could in principle end up being what a release points to, so the
  build must match its own git history rather than a freshly-resolved HEAD.
