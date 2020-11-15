import { IRowRendererOptions, isParentNode, Tree } from '@stoplight/tree-list';
import cn from 'classnames';
import * as React from 'react';

import { ReferenceNode, RegularNode, SchemaNode } from '@stoplight/json-schema-tree';
import { isCombiner } from '../guards/isCombiner';
import { useSchemaNode, useSchemaTreeListNode } from '../hooks';
import { SchemaNodeProviderContext } from '../providers/SchemaNodeProvider';
import { SchemaTreeListNodeProviderContext } from '../providers/SchemaTreeNodeProvider';
import { getLinkedSchemaNode } from '../tree';
import { GoToRefHandler, SchemaTreeListNode } from '../types';
import { Caret, Description, Divider, Property, Validations } from './shared';
import { Format } from './shared/Format';

export interface ISchemaRow {
  className?: string;
  treeNode: SchemaTreeListNode;
  rowOptions: IRowRendererOptions;
  onGoToRef?: GoToRefHandler;
}

const ICON_SIZE = 12;
const ICON_DIMENSION = 20;
const ROW_OFFSET = 7;

function isRequired(schemaNode: SchemaNode): boolean {
  const { parent } = schemaNode;
  if (parent === null || !(parent instanceof RegularNode) || schemaNode.subpath.length === 0) {
    return false;
  }

  return !!parent.required?.includes(schemaNode.subpath[schemaNode.subpath.length - 1]);
}

export const SchemaPropertyRow: React.FunctionComponent<Pick<ISchemaRow, 'rowOptions' | 'onGoToRef'>> = ({
  onGoToRef,
  rowOptions,
}) => {
  const schemaNode = useSchemaNode();
  const treeNode = useSchemaTreeListNode();
  const description = schemaNode instanceof RegularNode ? schemaNode.annotations.description : null;

  const has$Ref = React.useMemo<boolean>(() => {
    return (
      schemaNode instanceof ReferenceNode ||
      (schemaNode instanceof RegularNode && !!schemaNode.children?.some(node => node instanceof ReferenceNode))
    );
  }, [schemaNode]);

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
        <Format />
        {typeof description === 'string' && description.length > 0 && <Description value={description} />}
      </div>

      <Validations
        required={isRequired(schemaNode)}
        validations={
          schemaNode instanceof RegularNode
            ? {
                ...('annotations' in schemaNode &&
                  schemaNode.annotations.default && { default: schemaNode.annotations.default }),
                ...schemaNode.validations,
              }
            : {}
        }
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
      <SchemaTreeListNodeProviderContext.Provider value={treeNode}>
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
              <SchemaPropertyRow onGoToRef={onGoToRef} rowOptions={rowOptions} />
            )}
          </div>
        </div>
      </SchemaTreeListNodeProviderContext.Provider>
    </SchemaNodeProviderContext.Provider>
  );
};
SchemaRow.displayName = 'JsonSchemaViewer.SchemaRow';
