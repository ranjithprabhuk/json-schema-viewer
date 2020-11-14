import type { MirrorNode } from './MirrorNode';
import type { ReferenceNode } from './ReferenceNode';
import type { RegularNode } from './RegularNode';
export declare type SchemaNode = RegularNode | ReferenceNode | MirrorNode;
export declare enum SchemaNodeKind {
    Any = "any",
    String = "string",
    Number = "number",
    Integer = "integer",
    Boolean = "boolean",
    Null = "null",
    Array = "array",
    Object = "object"
}
export declare enum SchemaCombinerName {
    AllOf = "allOf",
    AnyOf = "anyOf",
    OneOf = "oneOf"
}
export declare type SchemaAnnotations = 'description' | 'default' | 'examples';
export declare type SchemaMeta = 'id' | '$schema';
