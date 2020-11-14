import * as React from 'react';
import { SchemaNode } from '@stoplight/json-schema-tree';

export const SchemaNodeProviderContext = React.createContext<SchemaNode>({} as any);
