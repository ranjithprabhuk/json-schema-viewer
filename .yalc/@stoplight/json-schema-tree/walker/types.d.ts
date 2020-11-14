import type { RegularNode, SchemaNode } from '../nodes';
import type { RootNode } from '../nodes/RootNode';
import type { SchemaFragment } from '../types';
export declare type WalkerRefResolver = (path: string[] | null, $ref: string) => SchemaFragment;
export declare type WalkingOptions = {
    mergeAllOf: boolean;
    resolveRef: WalkerRefResolver | null;
};
export declare type WalkerItem = {
    node: SchemaNode;
    parentNode: SchemaNode | null;
};
export declare type WalkerSnapshot = {
    readonly fragment: SchemaFragment;
    readonly depth: number;
    readonly schemaNode: RegularNode | RootNode;
    readonly path: string[];
};
export declare type WalkerHookAction = 'filter' | 'stepIn';
export declare type WalkerHookHandler = (node: SchemaNode) => boolean;
export declare type WalkerEvent = 'newNode' | 'acceptNode' | 'enterNode' | 'exitNode';
export declare type WalkerEventHandler = (node: SchemaNode) => void;
