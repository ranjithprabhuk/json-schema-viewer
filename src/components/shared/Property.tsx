import { ReferenceNode, SchemaNode } from '@stoplight/json-schema-tree';
import { isParentNode } from '@stoplight/tree-list';
import * as React from 'react';
import { useSchemaTreeListNode } from '../../hooks';
import { useSchemaNode } from '../../hooks/useSchemaNode';
import { GoToRefHandler } from '../../types';
import { Types } from './Types';

export interface IProperty {
  onGoToRef?: GoToRefHandler;
}

function shouldShowPropertyName(schemaNode: SchemaNode) {
  return (
    schemaNode.subpath.length === 2 &&
    (schemaNode.subpath[0] === 'properties' ||
      schemaNode.subpath[0] === 'patternProperties' ||
      schemaNode.subpath[0] === 'items')
  );
}

export const Property: React.FunctionComponent<IProperty> = ({ onGoToRef }) => {
  const schemaNode = useSchemaNode();
  const treeNode = useSchemaTreeListNode();
  const { subpath } = schemaNode;

  const handleGoToRef = React.useCallback<React.MouseEventHandler>(() => {
    if (onGoToRef && schemaNode instanceof ReferenceNode) {
      onGoToRef(schemaNode);
    }
  }, [onGoToRef, schemaNode]);

  return (
    <>
      {schemaNode.subpath.length > 0 && shouldShowPropertyName(schemaNode) && (
        <div className="mr-2">{subpath[subpath.length - 1]}</div>
      )}

      <Types />

      {onGoToRef && schemaNode instanceof ReferenceNode && schemaNode.external ? (
        <a role="button" className="text-blue-4 ml-2" onClick={handleGoToRef}>
          (go to ref)
        </a>
      ) : null}

      {isParentNode(treeNode) && (
        <div className="ml-2 text-darken-7 dark:text-lighten-7">{`{${treeNode.children.length}}`}</div>
      )}

      {subpath.length > 1 && subpath[0] === 'patternProperties' ? (
        <div className="ml-2 text-darken-7 dark:text-lighten-7 truncate">(pattern property)</div>
      ) : null}
    </>
  );
};
