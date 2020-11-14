import type { Dictionary } from '@stoplight/types';
import type { SchemaFragment } from '../types';
import { BaseNode } from './BaseNode';
import { SchemaAnnotations, SchemaCombinerName, SchemaMeta, SchemaNode, SchemaNodeKind } from './types';
export declare class RegularNode extends BaseNode {
    readonly fragment: SchemaFragment;
    readonly types: SchemaNodeKind[] | null;
    readonly primaryType: SchemaNodeKind | null;
    readonly combiners: SchemaCombinerName[] | null;
    readonly required: string[] | null;
    readonly enum: unknown[] | null;
    readonly format: string | null;
    readonly title: string | null;
    readonly deprecated: boolean;
    children: SchemaNode[] | null;
    readonly meta: Readonly<Partial<Dictionary<unknown, SchemaMeta>>>;
    readonly annotations: Readonly<Partial<Dictionary<unknown, SchemaAnnotations>>>;
    readonly validations: Readonly<Dictionary<unknown>>;
    constructor(fragment: SchemaFragment);
    get simple(): boolean;
}
