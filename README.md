# BugShot-Web

## Project setup

```
pnpm install
```

### Compiles and hot-reloads for development

```
pnpm dev
```

### Compiles and minifies for production

```
pnpm build
```

### Push new releases with CHANGELOG update

```
pnpm release:*
```

The versioning of this project follows the structure `major.minor.patch` to create a commit that increments a part of the version and also creates a changelog based on the commits made (the commit message structure needs to follow the "conventional commit format").
For incrementing the major the \* needs to be `major` ex. the full command looks like `pnpm release:major`; the same applies to `minor` and `patch`.
The command configuration can be found in the `package.json` under `scripts`.
