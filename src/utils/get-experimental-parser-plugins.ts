import { ParserPlugin } from '@babel/parser';

/**
 * Returns a list of babel parser plugin names
 * @param experimentalBabelParserPluginsList array of experimental babel parser plugins
 * @returns list of parser plugins to be passed to babel parser
 */
export const getExperimentalParserPlugins = (experimentalBabelParserPluginsList: string[]): ParserPlugin[] => {
    // Some experimental plugins have configurations so they are passed as JSON
    // in the form of ["plugin-name", { configuration: true }]
    return experimentalBabelParserPluginsList.map(
        pluginName => pluginName.startsWith("[") ? JSON.parse(pluginName) : pluginName
    );
};
