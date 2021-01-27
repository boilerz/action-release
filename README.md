# @boilerz/action-release

[![GitHub package.json version](https://img.shields.io/github/package-json/v/boilerz/action-release)](https://www.npmjs.com/package/@boilerz/action-release)
[![GH CI Action](https://github.com/boilerz/action-release/workflows/CI/badge.svg)](https://github.com/boilerz/action-release/actions?query=workflow:CI)
[![codecov](https://codecov.io/gh/boilerz/action-release/branch/master/graph/badge.svg)](https://codecov.io/gh/boilerz/action-release)

> Github action for version, release and publish packages

### Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
  - uses: actions/checkout@v2

  - uses: actions/setup-node@v2
    with:
      node-version: '12.x'

  - uses: boilerz/action-release@master
    if: github.ref == 'refs/heads/master' 
    with:
      publishDirectory: 'dist'
      buildStep: 'true'
    env:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GITHUB_EMAIL: ${{ secrets.GITHUB_EMAIL }}
      GITHUB_USER: ${{ secrets.GITHUB_USER }}
```
