import { Comment, Node } from '@babel/types';

type NodeOrComment = Node | Comment;
type BoundedNodeOrComment = NodeOrComment & { start: number; end: number };

interface InjectedCode {
    type: 'InjectedCode';
    start: number;
    end: number;
}

/**
 * Assembles the updated file, removing imports from the original file and
 * injecting the sorted imports at the appropriate location.
 *
 * @param code the whole file as text
 * @param nodes to be removed
 * @param injectedCode the generated import source to be injected
 * @param injectIdx the index at which to inject the generated source
 */
export const assembleUpdatedCode = (
    code: string,
    nodes: (Node | Comment)[],
    injectedCode?: string,
    injectIdx: number = 0,
): string => {
    const ranges: (BoundedNodeOrComment | InjectedCode)[] = nodes.filter(
        (node): node is BoundedNodeOrComment => {
            const start = Number(node.start);
            const end = Number(node.end);
            return Number.isSafeInteger(start) && Number.isSafeInteger(end);
        },
    );
    if (injectedCode !== undefined) {
        ranges.push({
            type: 'InjectedCode',
            start: injectIdx,
            end: injectIdx,
        });
    }
    ranges.sort((a, b) => a.start - b.start);

    let result: string = '';
    let idx = 0;

    for (const { type, start, end } of ranges) {
        if (start > idx) {
            result += code.slice(idx, start);
            idx = start;
        }

        if (injectedCode !== undefined && type === 'InjectedCode') {
            result += injectedCode;
        }

        if (end > idx) {
            idx = end;
        }
    }

    if (idx < code.length) {
        result += code.slice(idx);
    }

    return result;
};
