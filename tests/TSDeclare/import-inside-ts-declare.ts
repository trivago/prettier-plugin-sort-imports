declare module '*.scss' {
    const content: { [className: string]: string };
    export = content;
}

declare const env: {
    [key: string]: string;
};

declare module 'path-browserify' {
    import * as path from 'path';
    export = path;
}
