import type { Dictionary } from '@stoplight/types';
import type { JSONSchema4 } from 'json-schema';
export declare type ViewMode = 'read' | 'write' | 'standalone';
export declare type SchemaFragment = Dictionary<unknown, keyof JSONSchema4>;
