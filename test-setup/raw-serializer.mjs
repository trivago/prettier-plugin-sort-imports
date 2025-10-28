'use strict';

const RAW = Symbol.for('raw');

export default {
    print(val) {
        return val[RAW];
    },
    test(val) {
        return (
            val &&
            Object.prototype.hasOwnProperty.call(val, RAW) &&
            typeof val[RAW] === 'string'
        );
    },
};
