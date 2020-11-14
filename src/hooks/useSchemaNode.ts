import { useContext } from 'react';
import { MirrorNode } from '@stoplight/json-schema-tree';
import { SchemaNodeProviderContext } from '../providers/SchemaNodeProvider';

export function useSchemaNode() {
  const node = useContext(SchemaNodeProviderContext);
  if (node instanceof MirrorNode) {
    return node.mirrors;
  }

  return node;
}

