import { ParserPlugin } from '@babel/parser';
import { Config } from 'prettier';

export type ImportOrderParserPlugin =
    | Extract<ParserPlugin, string>
    | `[${string},${string}]`;

export interface PluginConfig {
    /**
     * A collection of Regular expressions in string format.
     *
     * ```
     * "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
     * ```
     *
     * _Default behavior:_ The plugin moves the third party imports to the top which are not part of the `importOrder` list.
     * To move the third party imports at desired place, you can use `<THIRD_PARTY_MODULES>` to assign third party imports to the appropriate position:
     *
     * ```
     * "importOrder": ["^@core/(.*)$", "<THIRD_PARTY_MODULES>", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
     * ```
     */
    importOrder: string[];

    /**
     * A boolean value to enable or disable the new line separation
     * between sorted import declarations group. The separation takes place according to the `importOrder`.
     *
     * @default false
     */
    importOrderSeparation?: boolean;

    /**
     * A boolean value to enable or disable sorting of the specifiers in an import declarations.
     *
     * @default false
     */
    importOrderSortSpecifiers?: boolean;

    /**
     * A boolean value to enable or disable sorting the namespace specifiers to the top of the import group.
     *
     * @default false
     */
    importOrderGroupNamespaceSpecifiers?: boolean;

    /**
     * A boolean value to enable case-insensitivity in the sorting algorithm
used to order imports within each match group.
     *
     * For example, when false (or not specified):
     *
     * ```js
     * import ExampleView from './ExampleView';
     * import ExamplesList from './ExamplesList';
     * ```
     *
     * compared with `"importOrderCaseInsensitive": true`:
     *
     * ```js
     * import ExamplesList from './ExamplesList';
     * import ExampleView from './ExampleView';
     * ```
     *
     * @default false
     */
    importOrderCaseInsensitive?: boolean;

    /**
     * Previously known as `experimentalBabelParserPluginsList`.
     *
     * A collection of plugins for babel parser. The plugin passes this list to babel parser, so it can understand the syntaxes
     * used in the file being formatted. The plugin uses prettier itself to figure out the parser it needs to use but if that fails,
     * you can use this field to enforce the usage of the plugins' babel parser needs.
     *
     * **To pass the plugins to babel parser**:
     *
     * ```
     * "importOrderParserPlugins" : ["classProperties", "decorators-legacy"]
     * ```
     *
     * **To pass the options to the babel parser plugins**: Since prettier options are limited to string, you can pass plugins
     * with options as a JSON string of the plugin array:
     * `"[\"plugin-name\", { \"pluginOption\": true }]"`.
     *
     * ```
     * "importOrderParserPlugins" : ["classProperties", "[\"decorators\", { \"decoratorsBeforeExport\": true }]"]
     * ```
     *
     * **To disable default plugins for babel parser, pass an empty array**:
     *
     * @default ["typescript", "jsx"]
     */
    importOrderParserPlugins?: ImportOrderParserPlugin[];

    /**
     * A choice value to enable sorting imports within their groups based on their string lengths, the two options being ascending and descending.
     * Leaving the value blank or setting it to null will result in length being ignored
     *
     * @default null
     */
    importOrderSortByLength?: 'asc' | 'desc' | null;

    /**
     * By default, the plugin sorts side effect imports like any other imports in the file.
     * If you need to keep side effect imports in the same place but sort all other imports around them,
     * set this option to false.
     *
     * @default true
     */
    importOrderSideEffects?: boolean;

    /**
     * The import attributes/assertions syntax to use. "with" for import "..." with { type: "json" },
     * "assert" for import "..." assert { type: "json" }, and "with-legacy" for import "..." with type: "json".
     *
     * ```
     * "importOrderImportAttributesKeyword": 'with',
     * ```
     *
     * _Default behavior:_ When not specified, @babel/generator will try to match the style in the input code based on the AST shape.
     */
    importOrderImportAttributesKeyword?: 'assert' | 'with' | 'with-legacy';

    /**
     * An array of glob patterns for files that should be skipped by the import sorting.
     * Files matching these patterns will not have their imports sorted.
     *
     * ```
     * "importOrderExclude": ["*.test.ts", "src/generated/**"]
     * ```
     *
     * @default []
     */
    importOrderExclude?: string[];
}

export type PrettierConfig = PluginConfig & Config;
