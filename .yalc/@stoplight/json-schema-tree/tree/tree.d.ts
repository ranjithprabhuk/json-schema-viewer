import { RootNode } from '../nodes/RootNode';
import type { SchemaTreeRefDereferenceFn } from '../resolver/types';
import type { SchemaFragment } from '../types';
import type { WalkerRefResolver } from '../walker/types';
import { Walker } from '../walker/walk';
export declare type SchemaTreeOptions = {
    mergeAllOf: boolean;
    refResolver: SchemaTreeRefDereferenceFn | null;
};
export declare class SchemaTree {
    schema: SchemaFragment;
    protected readonly opts?: Partial<SchemaTreeOptions> | undefined;
    walker: Walker;
    root: RootNode;
    constructor(schema: SchemaFragment, opts?: Partial<SchemaTreeOptions> | undefined);
    populate(): void;
    invokeWalker(walker: Walker): void;
    protected resolveRef: WalkerRefResolver;
    private _resolveRef;
}
