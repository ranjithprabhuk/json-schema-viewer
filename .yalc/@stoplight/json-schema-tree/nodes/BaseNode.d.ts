import type { SchemaFragment } from '../types';
import type { MirrorNode } from './MirrorNode';
import type { RegularNode } from './RegularNode';
import type { RootNode } from './RootNode';
export declare abstract class BaseNode {
    readonly fragment: SchemaFragment;
    readonly id: string;
    parent: RegularNode | RootNode | MirrorNode | null;
    subpath: string[];
    get path(): ReadonlyArray<string>;
    get depth(): number;
    protected constructor(fragment: SchemaFragment);
}
