import { Dictionary, Optional } from '@stoplight/types';
import cn from 'classnames';
import { JSONSchema4TypeName } from 'json-schema';
import * as React from 'react';

import { JSONSchema4CombinerName, SchemaKind } from '../../types';
import { useSchemaNode } from '../../hooks/useSchemaNode';
import { PropertyTypeColors } from '../consts';
import { RegularNode } from '@stoplight/json-schema-tree';

/**
 * TYPE
 */
export interface IType {
  type: JSONSchema4TypeName | JSONSchema4CombinerName | 'binary' | '$ref';
  subtype: Optional<JSONSchema4TypeName | JSONSchema4TypeName[]> | '$ref';
  className?: string;
  title: Optional<string>;
}

function shouldRenderTitle(type: string): boolean {
  return type === SchemaKind.Array || type === SchemaKind.Object || type === '$ref';
}

function getPrintableArrayType(subtype: IType['subtype'], title: IType['title']): string {
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

function getPrintableType(type: IType['type'], subtype: IType['subtype'], title: IType['title']): string {
  if (type === SchemaKind.Array) {
    return getPrintableArrayType(subtype, title);
  } else if (title && shouldRenderTitle(type)) {
    return title;
  } else {
    return type;
  }
}

export const Type: React.FunctionComponent<IType> = ({ className, title, type, subtype }) => {
  return (
    <span className={cn(className, PropertyTypeColors[type], 'truncate')}>
      {type}
    </span>
  );
};
Type.displayName = 'JsonSchemaViewer.Type';

/**
 * TYPES
 */
interface ITypes {
  className?: string;
}

export const Types: React.FunctionComponent<ITypes> = ({ className }) => {
  const schemaNode = useSchemaNode();

  if (!(schemaNode instanceof RegularNode) || schemaNode.types === null) {
    return null;
  }

  return (
    <div className={cn(className, 'truncate')}>
      <>
        {schemaNode.types.map((type, i, { length }) => (
          <React.Fragment key={type}>
            <Type type={type} />

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

