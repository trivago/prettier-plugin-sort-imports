declare function f(a: string | number, b: string | number): number;

declare module 'javascript-natural-sort' {
    export default f;
}

declare module f {
    var insensitive: boolean;
}
