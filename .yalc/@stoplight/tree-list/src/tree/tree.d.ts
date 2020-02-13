import { Optional } from '@stoplight/types';
import { DeprecatedTreeListNode, TreeListNode, TreeListParentNode } from '../types';
import { IndexLookup } from './cache';
declare type Arrayish = Pick<typeof Array['prototype'], 'indexOf' | 'every'>;
declare type Range = {
    offset: number;
    length: number;
};
export interface ITreeIterationOptions {
    readonly order: ((nodeA: TreeListNode, nodeB: TreeListNode) => number) | null;
    readonly filter: ((node: TreeListNode, i: number, nodes: TreeListNode[]) => boolean) | null;
    readonly expanded: ((node: TreeListParentNode) => boolean) | null;
}
export declare class Tree implements Arrayish {
    protected readonly tree: TreeListParentNode;
    protected readonly iterationOptions: ITreeIterationOptions | null;
    root: TreeListParentNode;
    protected readonly indexLookup: IndexLookup<TreeListNode>;
    private readonly wrapped;
    private readonly sorted;
    private readonly filtered;
    private _count;
    get count(): number;
    set count(val: number);
    constructor(tree: TreeListParentNode, iterationOptions?: ITreeIterationOptions | null, cacheSize?: number);
    static getLevel(node: TreeListNode): any;
    static getDropZoneId(node: TreeListNode): any;
    clearCache(): void;
    protected getFilteredChildren(node: TreeListParentNode): TreeListNode[] | ReadonlyArray<never>;
    protected getChildren(node: TreeListParentNode): TreeListNode[] | ReadonlyArray<never>;
    protected static level: PropertyDescriptor;
    protected static dropZoneId: PropertyDescriptor;
    private static _toTree;
    static createArtificialRoot(): TreeListParentNode;
    static toTree(nodes: DeprecatedTreeListNode[]): TreeListParentNode;
    [Symbol.iterator](): Generator<TreeListNode, void, unknown>;
    getIteratorForNode(node: TreeListParentNode): Generator<TreeListNode>;
    static getOffsetForNode(node: TreeListNode): number;
    protected _itemAt(node: TreeListParentNode, pos: number, boundaries: Range): Optional<TreeListNode>;
    protected static readonly boundaries: Range;
    private static nextItem;
    nextItem(node: TreeListNode): Optional<TreeListNode>;
    prevItem(node: TreeListNode): Optional<TreeListNode>;
    itemAt(pos: number): import("../types").ITreeListNode | undefined;
    indexOf(target: TreeListNode): number;
    every(callbackfn: (value: TreeListNode, index: number, array: []) => unknown, thisArg?: any): boolean;
    findById(id: string): Optional<TreeListNode>;
    invalidate(): void;
    protected invalidateCounter(node: TreeListParentNode, deep: boolean): void;
    protected invalidateLevel(node: TreeListNode): void;
    protected invalidateChildren(node: TreeListParentNode): void;
    wrap(node: TreeListParentNode): void;
    unwrap(node: TreeListParentNode): void;
    moveNode(node: TreeListNode, parentId: string | null): void;
    insertNode(node: TreeListNode, parentId: string | null): void;
    insertTreeFragment(fragment: TreeListNode[], parentId: string | null): void;
    removeNode(node: TreeListNode): void;
    protected getCount(node: TreeListParentNode): any;
    protected resetCounter(node: TreeListParentNode): void;
    protected processTreeFragment(node: TreeListParentNode): number;
    protected static resetLevel(node: TreeListNode): void;
    protected static resetDropZoneId(node: TreeListNode): void;
    protected decorateNode(node: TreeListNode): void;
    protected static isDecoratedNode(node: unknown): node is TreeListNode;
    protected static isParentNode(node: TreeListNode): node is TreeListParentNode;
    static transformDeprecatedNode(node: DeprecatedTreeListNode, parentNode: TreeListParentNode | null): TreeListNode;
}
export {};
