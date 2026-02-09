# Explanation of Helm CI step

This is a short explanation of what the Helm CI is doing.

## Tools used

- [Helm](https://helm.sh/)
- [Kind](https://kind.sigs.k8s.io/)
- [Chart-Testing tools](https://github.com/helm/chart-testing)

## Steps

1. We wait for the docker image to build. We _require_ a sha tag to exist for the image.

2. The chart-testing CLI checks if there have been changes in the chart. (See more at <https://github.com/helm/chart-testing/blob/main/doc/ct_list-changed.md>)

3. Decide the next step
   - **A)** If there are no changes, we skip the rest of the steps.

   - **B)** If there are changes, we move on.

4. We lint the chart using [`ct lint`](https://github.com/helm/chart-testing/blob/main/doc/ct_lint.md). We do _not_ check the maintainer data as this checks against the git history, when instead we want Nordeck to be the maintainer. This essentially runs the helm lint command. The benefit over the helm lint command is that we do not have to handle building the chart first.

5. We now set up a kind cluster on the CI. This is required since the CI is doing e2e tests for the chart. Since the repo is private, we also set up a pull secret to allow pulling the image.

6. After the setup is done, we run the e2e tests using [`ct install`](https://github.com/helm/chart-testing/blob/main/doc/ct_install.md). This installs the chart and checks if it is working as expected. It relies on the Helm chart tests to check if the pod becomes healthy. It does no further tests than trying to reach it.
