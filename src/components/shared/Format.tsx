import { RegularNode } from '@stoplight/json-schema-tree';
import cn from 'classnames';
import * as React from 'react';
import { useSchemaNode } from '../../hooks/useSchemaNode';
import { PropertyTypeColors } from '../consts';

function matchPropertyColor(node: RegularNode): string | null {
  if (node.types === null || node.types.length !== 1) return null;

  return PropertyTypeColors[node.types[0]];
}

export const Format: React.FunctionComponent = () => {
  const schemaNode = useSchemaNode();

  if (!(schemaNode instanceof RegularNode) || schemaNode.format === null) {
    return null;
  }

  return <span className={cn('ml-2', matchPropertyColor(schemaNode))}>{`<${schemaNode.format}>`}</span>;
};
