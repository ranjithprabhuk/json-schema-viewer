import cn from 'classnames';
import * as React from 'react';

import {
  ReferenceNode,
  RegularNode,
  SchemaCombinerName,
  SchemaNode,
  SchemaNodeKind,
} from '@stoplight/json-schema-tree';
import { isParentNode } from '@stoplight/tree-list';
import { useSchemaTreeListNode } from '../../hooks';
import { useSchemaNode } from '../../hooks/useSchemaNode';
import { SchemaTreeListNode } from '../../types';
import { PropertyTypeColors } from '../consts';

function shouldRenderTitle(type: keyof typeof PropertyTypeColors): boolean {
  return type === SchemaNodeKind.Array || type === SchemaNodeKind.Object || type === '$ref';
}

function printArrayType(treeNode: SchemaTreeListNode, node: RegularNode): string | null {
  if (node.children === null || node.children.length === 0) {
    return node.title;
  }

  if (node.children.length === 1) {
    const firstChild = node.children[0];
    if (firstChild instanceof ReferenceNode) {
      return `$ref(${firstChild.value})[]`;
    }

    if (!(firstChild instanceof RegularNode)) return null;

    if (firstChild.title !== null) {
      return `${firstChild.title}[]`;
    }

    const val = firstChild.types?.join(',') ?? null;
    return val === null ? val : `${SchemaNodeKind.Array}[${val}]`;
  }

  if (!isParentNode(treeNode)) {
    const val =
      node.children
        ?.reduce<SchemaNodeKind[] | null>((mergedTypes, child) => {
          if (mergedTypes === null) return null;

          if (!(child instanceof RegularNode)) return null;

          if (child.types !== null) {
            for (const type of child.types) {
              if (mergedTypes.includes(type)) continue;
              mergedTypes.push(type);
            }
          }

          return mergedTypes;
        }, [])
        ?.join(',') ?? null;
    return val === null ? val : `${SchemaNodeKind.Array}[${val}]`;
  }

  return null;
}

function printTitle(
  treeNode: SchemaTreeListNode,
  schemaNode: SchemaNode,
  type: keyof typeof PropertyTypeColors,
): string {
  if (!(schemaNode instanceof RegularNode) || !shouldRenderTitle(type)) {
    return type;
  }

  if (schemaNode.primaryType !== SchemaNodeKind.Array) {
    return schemaNode.title ?? type;
  }

  if (schemaNode.children === null || schemaNode.children.length === 0) {
    return type;
  }

  return printArrayType(treeNode, schemaNode) ?? type;
}

function getTypes(schemaNode: RegularNode): Array<SchemaNodeKind | SchemaCombinerName> {
  return [schemaNode.types, schemaNode.combiners].reduce<Array<SchemaNodeKind | SchemaCombinerName>>(
    (values, value) => {
      if (value === null) {
        return values;
      }

      values.push(...value);
      return values;
    },
    [],
  );
}

export const Types: React.FunctionComponent<{}> = () => {
  const schemaNode = useSchemaNode();
  const treeNode = useSchemaTreeListNode();

  if (schemaNode instanceof ReferenceNode) {
    return (
      <div className="truncate">
        <span className={cn(PropertyTypeColors.$ref, 'truncate')}>{schemaNode.value ?? '$ref'}</span>
      </div>
    );
  }

  if (!(schemaNode instanceof RegularNode)) {
    return null;
  }

  const types = getTypes(schemaNode);

  if (types.length === 0) return null;

  return (
    <div className="truncate">
      <>
        {types.map((type, i, { length }) => (
          <React.Fragment key={type}>
            <span className={cn(PropertyTypeColors[type], 'truncate')}>{printTitle(treeNode, schemaNode, type)}</span>
            {i < length - 1 && (
              <span key={`${i}-sep`} className="text-darken-7 dark:text-lighten-6">
                {' or '}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    </div>
  );
};
Types.displayName = 'JsonSchemaViewer.Types';
