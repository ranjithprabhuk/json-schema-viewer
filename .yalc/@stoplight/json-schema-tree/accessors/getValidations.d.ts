import type { Dictionary } from '@stoplight/types';
import type { JSONSchema4 } from 'json-schema';
import type { SchemaNodeKind } from '../nodes/types';
import type { SchemaFragment } from '../types';
export declare const COMMON_VALIDATION_TYPES: (keyof JSONSchema4)[];
export declare function getValidations(fragment: SchemaFragment, types: SchemaNodeKind[] | null): Dictionary<unknown>;
