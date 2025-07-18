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
     * ```
     * "importOrderImportAttributesKeyword": 'with',
     * ```
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
     * How many comments at the start of the code to ignore while attaching comments to imports for sorting.
     *
     * This option is useful for projects that use a license header or similar comments at the start of the code, to
     * ensure that whitespace around header comments is maintained, and header comments are not accidentally associated
     * with the first import and sorted away from the start of the code.
     *
     * Negative values, including the default value of -1, preserve how this plugin has historically handled comments
     * immediately before the first import statement. When negative, all comments immediately before the first import
     * will be placed at the top of the import list. However, this has limitations:
     *
     *  * Whitespace IS NOT maintained between these comments. If one of the comments is maintained by a linter /
     *    formatter, and that tool expects whitespace to be preserved, it may result in conflicts where the code fails
     *    to converge.
     *  * If the first import is sorted further down the list, comments intended to be attached to the first import
     *    will not be sorted along with the import.
     *
     * ```
     * "importOrderIgnoreHeaderComments": 1,
     * ```
     *
     * @default -1
     */
    importOrderIgnoreHeaderComments?: number;

    /**
     * The type of comments ignored when using importOrderIgnoreHeaderComments option.
     *
     * If an unspecified comment type is encountered while evaluating importOrderIgnoreHeaderComments, it and all
     * following comments will be sorted with the first import.
     *
     * ```
     * "importOrderIgnoreHeaderCommentTypes": "CommentBlock",
     * ```
     *
     * @default "All"
     */
    importOrderIgnoreHeaderCommentTypes?:
        | 'All'
        | 'CommentBlock'
        | 'CommentLine';
}

export type PrettierConfig = PluginConfig & Config;
