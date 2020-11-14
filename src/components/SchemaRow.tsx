import { IRowRendererOptions, isParentNode, Tree } from '@stoplight/tree-list';
import cn from 'classnames';
import * as React from 'react';

import { ReferenceNode, RegularNode, SchemaCombinerName } from '@stoplight/json-schema-tree';
import { useSchemaNode } from '../hooks/useSchemaNode';
import { getLinkedSchemaNode } from '../tree';
import { GoToRefHandler, SchemaTreeListNode } from '../types';
import { SchemaNodeProviderContext } from './SchemaNodeProvider';
import { Caret, Description, Divider, Property, Validations } from './shared';

export interface ISchemaRow {
  className?: string;
  treeNode: SchemaTreeListNode;
  rowOptions: IRowRendererOptions;
  onGoToRef?: GoToRefHandler;
}

const ICON_SIZE = 12;
const ICON_DIMENSION = 20;
const ROW_OFFSET = 7;

const isCombiner = (value: string): value is SchemaCombinerName => {
  return value === SchemaCombinerName.OneOf || value === SchemaCombinerName.AnyOf || value === SchemaCombinerName.AllOf;
};

export const SchemaPropertyRow: typeof SchemaRow = ({ treeNode, onGoToRef, rowOptions }) => {
  const schemaNode = useSchemaNode();
  const description = schemaNode instanceof RegularNode ? schemaNode.annotations.description : null;

  const has$Ref = false;

  return (
    <>
      {has$Ref || (isParentNode(treeNode) && Tree.getLevel(treeNode) > 0) ? (
        <Caret
          isExpanded={!!rowOptions.isExpanded}
          style={{
            width: ICON_DIMENSION,
            height: ICON_DIMENSION,
            ...(has$Ref && Tree.getLevel(treeNode) === 0
              ? {
                  position: 'relative',
                }
              : {
                  left: ICON_DIMENSION * -1 + ROW_OFFSET / -2,
                }),
          }}
          size={ICON_SIZE}
        />
      ) : null}

      {schemaNode.subpath.length > 0 && isCombiner(schemaNode.subpath[0]) && <Divider kind={schemaNode.subpath[0]} />}

      <div className="flex-1 flex truncate">
        <Property onGoToRef={onGoToRef} />
        {typeof description === 'string' && description.length > 0 && <Description value={description} />}
      </div>

      <Validations
        required={schemaNode.parent?.required?.includes(schemaNode.subpath[0])}
        validations={{
          ...('annotations' in schemaNode &&
            schemaNode.annotations.default && { default: schemaNode.annotations.default }),
          ...schemaNode.validations,
        }}
      />
    </>
  );
};
SchemaPropertyRow.displayName = 'JsonSchemaViewer.SchemaPropertyRow';

export const SchemaErrorRow: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <span className="text-red-5 dark:text-red-4">{message}</span>
);
SchemaErrorRow.displayName = 'JsonSchemaViewer.SchemaErrorRow';

export const SchemaRow: React.FunctionComponent<ISchemaRow> = ({ className, treeNode, rowOptions, onGoToRef }) => {
  const schemaNode = getLinkedSchemaNode(treeNode);

  return (
    <SchemaNodeProviderContext.Provider value={schemaNode}>
      <div className={cn('px-2 flex-1 w-full max-w-full', className)}>
        <div
          className="flex items-center text-sm relative"
          style={{
            marginLeft: ICON_DIMENSION * Tree.getLevel(treeNode), // offset for spacing
          }}
        >
          {schemaNode instanceof ReferenceNode && schemaNode.error !== null ? (
            <SchemaErrorRow message={schemaNode.error} />
          ) : (
            <SchemaPropertyRow treeNode={treeNode} onGoToRef={onGoToRef} rowOptions={rowOptions} />
          )}
        </div>
      </div>
    </SchemaNodeProviderContext.Provider>
  );
};
SchemaRow.displayName = 'JsonSchemaViewer.SchemaRow';
