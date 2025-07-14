## Migration Guide

---

### Migrating from v2.x.x to v3.x.x

#### TL;DR

- Replace `experimentalBabelParserPluginsList` with the new `importOrderParserPlugins` in your prettier config.
- Use the `importOrderSortSpecifiers` to sort import specifiers.
- Use `<THIRD_PARTY_MODULES>` special word in `importOrder` to place your third party imports at any location.
- Disable case sensitivity in the sorting via `importOrderCaseInsensitive` option.
- Use `importOrderSeparation` to separate the import groups.

#### New changes

- **Sort the import specifiers**:
  The plugin is now able to sort the import specifiers in an import declaration.
  This can be achieved by setting up the `importOrderSortSpecifiers` boolean flag.
  [See usage](../README.md#importordersortspecifiers)

Input:

```ts
import { a, d, c, b } from 'some-package'
```

Output:

```ts
import { a, b, c, d } from 'some-package'
```

- **Place third party modules anywhere in the imports**:
  You can place the third party import at the desired place in import order. [See usage](../README.md#importorderseparation)

Prettier config:

```ts
module.exports = {
    importOrder: [
        '^@core/(.*)$',
        '<THIRD_PARTY_MODULES>',
        '^@ui/(.*)$',
        '^[./]',
    ],
};
```

Input:

```ts
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
import thirdPartyTwo from 'third-party-2';
import otherthing from '@core/otherthing';
import thirdPartyOne from 'third-party-1';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import component from '@ui/hello';
import thirdPartyThree from 'third-party-3';
```

Output:

```ts
import otherthing from '@core/otherthing';
import thirdPartyOne from 'third-party-1';
import thirdPartyTwo from 'third-party-2';
import thirdPartyThree from 'third-party-3';
import component from '@ui/hello';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
```

- **Disable case sensitivity for sorting**:
  By default, the case sensitivity for the sorting is enabled. Now you can disable
  the case sensitivity with the `importOrderCaseInsensitive` option. [See usage](../README.md#importordercaseinsensitive)

- **Pass options to the Babel parser plugins**:
  You can pass the options to the babel parser plugins via the `importOrderParserPlugins` option. [See usage](../README.md#importorderparserplugins)

#### Breaking changes

- **Renaming of `experimentalBabelParserPluginsList`**:
  In version 3, the `experimentalBabelParserPluginsList` has been removed. You can
  use the same API with a new name and better option handling for babel parser. [See usage](../README.md#importorderparserplugins)
