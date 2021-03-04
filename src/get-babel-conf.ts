// @ts-ignore
import findBabelConfig from 'find-babel-config';
import * as p from 'process';

export function getBabelConf() {
    const { config } = findBabelConfig.sync(p.cwd());

    return config || {};
}