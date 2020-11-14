import { TreeListNode } from '@stoplight/tree-list';
import { SchemaNode } from '@stoplight/json-schema-tree';
import { SchemaTreeListNode } from '../types';

export const metadataStore = new WeakMap<SchemaTreeListNode, SchemaNode>();

export const getLinkedSchemaNode = (node: TreeListNode): SchemaNode => {
  const metadata = metadataStore.get(node);
  if (metadata === void 0) {
    throw new Error('Missing metadata');
  }

  return metadata;
};
