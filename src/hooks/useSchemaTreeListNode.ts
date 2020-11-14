import { useContext } from 'react';
import { SchemaTreeListNodeProviderContext } from '../providers/SchemaTreeNodeProvider';

export function useSchemaTreeListNode() {
  return useContext(SchemaTreeListNodeProviderContext);
}

