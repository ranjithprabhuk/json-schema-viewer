import { ReferenceNode, SchemaNode } from '@stoplight/json-schema-tree';
import { Optional } from '@stoplight/types';
import * as React from 'react';
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

function retrieve$ref(node: SchemaNode): Optional<string> {
  if (isRefNode(node) && node.$ref !== null) {
    return node.$ref;
  }

  if (hasRefItems(node) && node.items.$ref !== null) {
    return `$ref(${node.items.$ref})`;
  }

  return;
}

function getTitle(node: SchemaNode): Optional<string> {
  if (isArrayNodeWithItems(node)) {
    if (Array.isArray(node.items) || !node.items.title) {
      return retrieve$ref(node);
    }

    return node.items.title;
  }

  return node.title || retrieve$ref(node);
}

export const Property: React.FunctionComponent<IProperty> = ({ onGoToRef }) => {
  const schemaNode = useSchemaNode();
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

      {'children' in schemaNode && schemaNode.children !== null && (
        <div className="ml-2 text-darken-7 dark:text-lighten-7">{`{${schemaNode.children.length}}`}</div>
      )}

      {subpath.length > 1 && subpath[0] === 'patternProperties' ? (
        <div className="ml-2 text-darken-7 dark:text-lighten-7 truncate">(pattern property)</div>
      ) : null}
    </>
  );
};
