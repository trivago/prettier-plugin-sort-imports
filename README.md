# Prettier plugin sort imports

A prettier plugin to sort import declarations by provided Regular Expression order.

**Note: If you are migrating from v2.x.x to v3.x.x, [Please Read Migration Guidelines](./docs/MIGRATION.md)**

### Input

```javascript
import React, {
    FC,
    useEffect,
    useRef,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
import { logger } from '@core/logger';
import { reduce, debounce } from 'lodash';
import { Message } from '../Message';
import { createServer } from '@server/node';
import { Alert } from '@ui/Alert';
import { repeat, filter, add } from '../utils';
import { initializeApp } from '@core/app';
import { Popup } from '@ui/Popup';
import { createConnection } from '@server/database';
```


### Output

```javascript
import { debounce, reduce } from 'lodash';
import React, {
    ChangeEvent,
    FC,
    KeyboardEvent,
    useEffect,
    useRef,
} from 'react';

import { createConnection } from '@server/database';
import { createServer } from '@server/node';

import { initializeApp } from '@core/app';
import { logger } from '@core/logger';

import { Alert } from '@ui/Alert';
import { Popup } from '@ui/Popup';

import { Message } from '../Message';
import { add, filter, repeat } from '../utils';
```

### Install

npm

```shell script
npm install --save-dev @trivago/prettier-plugin-sort-imports
```

or, using yarn

```shell script
yarn add --dev @trivago/prettier-plugin-sort-imports
```

**Note: If you are migrating from v2.x.x to v3.x.x, [Please Read Migration Guidelines](./docs/MIGRATION.md)**

**Note: If formatting `.vue` sfc files please install `@vue/compiler-sfc` if not in your dependency tree - this normally is within Vue projects.**

### Usage

Add an order in prettier config file.

```ecmascript 6
module.exports = {
  "printWidth": 80,
  "tabWidth": 4,
  "trailingComma": "all",
  "singleQuote": true,
  "semi": true,
  "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

**Note: There may be an issue with some package managers, such as `pnpm` or when using `prettier` v3.x. You can solve it by providing additional configuration option in prettier config file.

```js
module.exports = {
    ...
    "plugins": ["@trivago/prettier-plugin-sort-imports"]
}
```

### APIs

#### **`importOrder`**

**type**: `Array<string>`

A collection of Regular expressions in string format.

```
"importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
```

_Default behavior:_ The plugin moves the third party imports to the top which are not part of the `importOrder` list.
To move the third party imports at desired place, you can use `<THIRD_PARTY_MODULES>` to assign third party imports to the appropriate position:

```
"importOrder": ["^@core/(.*)$", "<THIRD_PARTY_MODULES>", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
```

#### `importOrderSeparation`

**type**: `boolean`

**default value**: `false`

A boolean value to enable or disable the new line separation
between sorted import declarations group. The separation takes place according to the `importOrder`.

```
"importOrderSeparation": true,
```

#### `importOrderSortSpecifiers`

**type**: `boolean`

**default value:** `false`

A boolean value to enable or disable sorting of the specifiers in an import declarations.

#### `importOrderGroupNamespaceSpecifiers`

**type**: `boolean`

**default value:** `false`

A boolean value to enable or disable sorting the namespace specifiers to the top of the import group.

#### `importOrderCaseInsensitive`

**type**: `boolean`

**default value**: `false`

A boolean value to enable case-insensitivity in the sorting algorithm
used to order imports within each match group.

For example, when false (or not specified):

```ecmascript 6
import ExampleView from './ExampleView';
import ExamplesList from './ExamplesList';
```

compared with `"importOrderCaseInsensitive": true`:

```ecmascript 6
import ExamplesList from './ExamplesList';
import ExampleView from './ExampleView';
```

#### `importOrderParserPlugins`

**type**: `Array<string>`

**default value**: `["typescript", "jsx"]`

Previously known as `experimentalBabelParserPluginsList`.

A collection of plugins for babel parser. The plugin passes this list to babel parser, so it can understand the syntaxes
used in the file being formatted. The plugin uses prettier itself to figure out the parser it needs to use but if that fails,
you can use this field to enforce the usage of the plugins' babel parser needs.

**To pass the plugins to babel parser**:

```
  "importOrderParserPlugins" : ["classProperties", "decorators-legacy"]
```

**To pass the options to the babel parser plugins**: Since prettier options are limited to string, you can pass plugins
with options as a JSON string of the plugin array:
`"[\"plugin-name\", { \"pluginOption\": true }]"`.

```
  "importOrderParserPlugins" : ["classProperties", "[\"decorators\", { \"decoratorsBeforeExport\": true }]"]
```

**To disable default plugins for babel parser, pass an empty array**:

```
importOrderParserPlugins: []
```

### `importOrderSideEffects`
**type**: `boolean`
**default value**: `true`

By default, the plugin sorts [side effect imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only) like any other imports in the file. If you need to keep side effect imports in the same place but sort all other imports around them, set this option to false.

Example:

Initial file:

```js
import z from 'z'
import a from 'a'

import 'side-effect-lib'

import c from 'c'
import b from 'b'
```
When sorted:

```js
import a from 'a'
import z from 'z'

import 'side-effect-lib'

import b from 'b'
import c from 'c'
```

### Ignoring import ordering

In some cases it's desired to ignore import ordering, specifically if you require to instantiate a common service or polyfill in your application logic before all the other imports. The plugin supports the `// sort-imports-ignore` comment, which will exclude the file from ordering the imports.

```javascript
// sort-imports-ignore
import './polyfills';

import foo from 'foo'
```

#### `importOrderImportAttributesKeyword`

**type**: `'assert' | 'with' | 'with-legacy'`

The import attributes/assertions syntax: 
- `with`: `import "..." with { type: "json" }`
- `assert`: `import "..." assert { type: "json" }`
- `with-legacy`: `import "..." with type: "json"`.

```json
  "importOrderImportAttributesKeyword": 'with'
```

_Default behavior:_ When not specified, @babel/generator will try to match the style in the input code based on the AST shape.


### How does import sort work ?

The plugin extracts the imports which are defined in `importOrder`. These imports are considered as _local imports_.
The imports which are not part of the `importOrder` is considered as _third party imports_.

After, the plugin sorts the _local imports_ and _third party imports_ using [natural sort algorithm](https://en.wikipedia.org/wiki/Natural_sort_order).

In the end, the plugin returns final imports with _third party imports_ on top and _local imports_ at the end.

The _third party imports_ position (it's top by default) can be overridden using the `<THIRD_PARTY_MODULES>` special word in the `importOrder`.

### FAQ / Troubleshooting

Having some trouble or an issue ? You can check [FAQ / Troubleshooting section](./docs/TROUBLESHOOTING.md).

### Compatibility

| Framework              | Supported                | Note                                             |
| ---------------------- | ------------------------ | ------------------------------------------------ |
| JS with ES Modules     | ✅ Everything            | -                                                |
| NodeJS with ES Modules | ✅ Everything            | -                                                |
| React                  | ✅ Everything            | -                                                |
| Solid                  | ✅ Everything            | -                                                |
| Angular                | ✅ Everything            | Supported through `importOrderParserPlugins` API |
| Vue                    | ✅ Everything            | `@vue/compiler-sfc` is required                  |
| Svelte                 | ✅ Everything            | `prettier-plugin-svelte` is required             |

### Used by

Want to highlight your project or company ? Adding your project / company name will help plugin to gain attraction and contribution.
Feel free to make a Pull Request to add your project / company name.

-   [trivago](https://company.trivago.com)
-   [AuresKonnect](https://aures.com)
-   [FactorialHR](https://factorialhr.com)

### Contribution

For more information regarding contribution, please check the [Contributing Guidelines](./CONTRIBUTING.md). If you are trying to
debug some code in the plugin, check [Debugging Guidelines](./docs/DEBUG.md)

### Maintainers

| [Ayush Sharma](https://github.com/ayusharma)                             | [Behrang Yarahmadi](https://github.com/byara)                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| ![ayusharma](https://avatars2.githubusercontent.com/u/6918450?s=120&v=4) | ![@byara](https://avatars2.githubusercontent.com/u/6979966?s=120&v=4) |
| [@ayusharma\_](https://twitter.com/ayusharma_)                           | [@behrang_y](https://twitter.com/behrang_y)                           |

### Disclaimer

This plugin modifies the AST which is against the rules of prettier.
