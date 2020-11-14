import { useContext } from 'react';
import { SchemaNodeProviderContext } from '../components/SchemaNodeProvider';
import { MirrorNode } from '@stoplight/json-schema-tree';

export function useSchemaNode() {
  const node = useContext(SchemaNodeProviderContext);
  if (node instanceof MirrorNode) {
    return node.mirrors;
  }

  return node;
}

