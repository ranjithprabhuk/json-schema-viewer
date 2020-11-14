import type { Dictionary } from '@stoplight/types';
import type { SchemaMeta } from '../nodes/types';
import type { SchemaFragment } from '../types';
export declare function getMeta(fragment: SchemaFragment): Partial<Dictionary<unknown, SchemaMeta>>;
