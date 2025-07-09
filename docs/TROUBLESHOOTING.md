## FAQ / Troubleshooting

--- 


#### Q. How can I add the RegEx imports in the `importOrder` list ?
You can define the RegEx in the `importOrder`. For
example if you want to sort the following imports:
```ecmascript 6
import React from 'react';
import classnames from 'classnames';
import z from '@server/z';
import a from '@server/a';
import s from './';
import p from '@ui/p';
import q from '@ui/q';
```
then the `importOrder` would be `["^@ui/(.*)$","^@server/(.*)$", '^[./]']`.
Now, the final output would be as follows:

```ecmascript 6
import classnames from 'classnames';
import React from 'react';
import p from '@ui/p';
import q from '@ui/q';
import a from '@server/a';
import z from '@server/z';
import s from './';
```

#### Q. How can I move `react` and `classnames` to place between my RegEx imports without hardcoding?
You can define the `<THIRD_PARTY_MODULES>` special word in the `importOrder`. For example above, the `importOrder` would be like `["^@ui/(.*)$", "^@server/(.*)$", "<THIRD_PARTY_MODULES>", '^[./]']`.
Now, the final output would be as follows:

```ecmascript 6
import p from '@ui/p';
import q from '@ui/q';
import a from '@server/a';
import z from '@server/z';
import classnames from 'classnames';
import React from 'react';
import s from './';
```

#### Q. How to use the plugin with `*.d.ts` files ?
The plugin automatically ignores the  `*.d.ts` files. We encourage you to declare the `*.d.ts` files in `.prettierignore`. [Read more here](https://prettier.io/docs/en/ignore.html#ignoring-files-prettierignore).

#### Q. How does the plugin handle the first comment in the file.
The plugin keeps the first comment as it is in the file. The plugin also removes the new lines in between first comment and the first import.

**input:**
```js
// comment

import a from 'a';
```
**output:**
```js
// comment
import a from 'a';
```

#### Q. I am getting error about experimental syntax.
If you are using some experimental syntax and the plugin has trouble parsing your files, you might get errors similar to this:
```shell script
SyntaxError: This experimental syntax requires enabling one of the following parser plugin(s): ...
```
To solve this issue, you can use the new option `importOrderParserPlugins` in your `.prettierrc` (prettier config) and pass
an array of plugin names to be used.

#### Q. Why does the plugin remove the inline comments of the import declaration ?
Due to the comment handling in Babel, the plugin removes the inline comment of the
import declaration.

**input:**
```js
import a from 'a'; // comment
```
**output:**
```js
import a from 'a';
```

#### Q. Why the plugin does not work with [pnpm](https://pnpm.io/) ? or Why do I see the `[warn] Ignored unknown option` ?

Due to the package handling of the pnpm, sometimes, the plugin is not automatically loaded. You can load the plugin
via prettier config.
```js
  module.exports = {
    plugins: ['@trivago/prettier-plugin-sort-imports'],
  }
```

#### Q. How can I prevent the plugin from reordering specific import statements?

Due to the complexity of maintaining the position of certain imports while reordering others, you can prevent the plugin from rearranging your file by adding the following comment at the top of your file: `// sort-imports-ignore`.
