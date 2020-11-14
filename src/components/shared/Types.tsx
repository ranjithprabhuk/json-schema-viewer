import { Dictionary, Optional } from '@stoplight/types';
import cn from 'classnames';
import * as React from 'react';

import {
  ReferenceNode,
  RegularNode,
  SchemaCombinerName,
  SchemaNode,
  SchemaNodeKind,
} from '@stoplight/json-schema-tree';
import { useSchemaNode } from '../../hooks/useSchemaNode';
import { SchemaTreeListNode } from '../../types';

export interface IType {
  type: keyof typeof PropertyTypeColors;
  title: string;
}

function shouldRenderTitle(type: keyof typeof PropertyTypeColors): boolean {
  return type === SchemaNodeKind.Array || type === SchemaNodeKind.Object || type === '$ref';
}

function printArrayType(treeNode: SchemaTreeListNode, node: RegularNode): string {
  // if it was flattend, we can safely do our sheniangs
  if (!subtype) return SchemaKind.Array;

  if (Array.isArray(subtype)) {
    return `${SchemaKind.Array}[${subtype.join(',')}]`;
  }

  if (title && shouldRenderTitle(subtype)) {
    return `${title}[]`;
  }

  if (subtype !== SchemaKind.Array && subtype !== '$ref') {
    return `${SchemaKind.Array}[${subtype}]`;
  }

  return SchemaKind.Array;
}

function retrieve$ref(node: SchemaNode): Optional<string> {
  if (isRefNode(node) && node.$ref !== null) {
    return node.$ref;
  }

  if (hasRefItems(node) && node.items.$ref !== null) {
    return `$ref(${node.items.$ref})`;
  }

  return;
}

function printTitle(node: SchemaNode, type: keyof typeof PropertyTypeColors): string {
  if (!(node instanceof RegularNode) || !shouldRenderTitle(type)) {
    return type;
  }

  if (node.primaryType !== SchemaNodeKind.Array) {
    return node.title ?? type;
  }

  if (node.children === null || node.children.length === 0) {
    return type;
  }

  return type; // printArrayType(node);
}

export const Types: React.FunctionComponent<{}> = () => {
  const schemaNode = useSchemaNode();

  if (schemaNode instanceof ReferenceNode) {
    return (
      <div className="truncate">
        <span className={cn(PropertyTypeColors.$ref, 'truncate')}>{schemaNode.value}</span>;
      </div>
    );
  }

  if (!(schemaNode instanceof RegularNode) || schemaNode.types === null) {
    return null;
  }

  return (
    <div className="truncate">
      <>
        {schemaNode.types.map((type, i, { length }) => (
          <React.Fragment key={type}>
            <span className={cn(PropertyTypeColors[type], 'truncate')}>{printTitle(schemaNode, type)}</span>
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

export const PropertyTypeColors: Dictionary<string, SchemaNodeKind | SchemaCombinerName | '$ref'> = {
  [SchemaNodeKind.Object]: 'text-blue-6 dark:text-blue-4',
  [SchemaNodeKind.Any]: 'text-blue-5',
  [SchemaNodeKind.Array]: 'text-green-6 dark:text-green-4',
  [SchemaCombinerName.AllOf]: 'text-orange-5',
  [SchemaCombinerName.AnyOf]: 'text-orange-5',
  [SchemaCombinerName.OneOf]: 'text-orange-5',
  [SchemaNodeKind.Null]: 'text-orange-5',
  [SchemaNodeKind.Integer]: 'text-red-7 dark:text-red-6',
  [SchemaNodeKind.Number]: 'text-red-7 dark:text-red-6',
  [SchemaNodeKind.Boolean]: 'text-red-4',
  [SchemaNodeKind.String]: 'text-green-7 dark:text-green-5',
  $ref: 'text-purple-6 dark:text-purple-4',
};
