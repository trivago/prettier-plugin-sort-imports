// @ts-ignore
import findBabelConfig from 'find-babel-config';
import * as p from 'process';

export function getBabelConfing() {
    const { config } = findBabelConfig.sync(p.cwd());

    return config || {};
}
