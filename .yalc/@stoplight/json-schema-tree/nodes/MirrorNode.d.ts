import { BaseNode } from './BaseNode';
import type { SchemaNode } from './types';
export declare class MirrorNode extends BaseNode {
    readonly mirrors: SchemaNode;
    constructor(mirrors: SchemaNode);
    get children(): MirrorNode[] | null;
}
