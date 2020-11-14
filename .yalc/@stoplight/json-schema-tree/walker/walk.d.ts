import { EventEmitter } from '@stoplight/lifecycle';
import type { Dictionary } from '@stoplight/types';
import { RegularNode } from '../nodes';
import type { RootNode } from '../nodes/RootNode';
import { SchemaNode } from '../nodes/types';
import type { SchemaFragment } from '../types';
import type { WalkerEvent, WalkerEventHandler, WalkerHookAction, WalkerHookHandler, WalkerItem, WalkerSnapshot, WalkingOptions } from './types';
export declare class Walker extends EventEmitter<Dictionary<WalkerEventHandler, WalkerEvent>> {
    protected readonly root: RootNode;
    protected readonly walkingOptions: WalkingOptions;
    readonly path: string[];
    depth: number;
    protected fragment: SchemaFragment;
    protected schemaNode: RegularNode | RootNode;
    private readonly processedFragments;
    private readonly hooks;
    constructor(root: RootNode, walkingOptions: WalkingOptions);
    resume(snapshot: WalkerSnapshot): Generator<WalkerItem, void, undefined>;
    pause(): WalkerSnapshot;
    hookInto(action: WalkerHookAction, handler: WalkerHookHandler): void;
    restoreWalkerAtNode(node: RegularNode): void;
    walk(): IterableIterator<WalkerItem>;
    protected walkNodeChildren(): Generator<WalkerItem, void, undefined>;
    protected processFragment(): IterableIterator<SchemaNode>;
}
