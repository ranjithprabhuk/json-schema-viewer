import {
  MirrorNode,
  RegularNode,
  RootNode,
  SchemaNode,
  SchemaNodeKind,
  SchemaTree as JsonSchemaTree,
} from '@stoplight/json-schema-tree';
import { SchemaTreeRefDereferenceFn } from '@stoplight/json-schema-tree/resolver/types';
import { isParentNode, Tree, TreeListParentNode, TreeState } from '@stoplight/tree-list';
import { Optional } from '@stoplight/types';
import { JSONSchema4 } from 'json-schema';
import { SchemaTreeListNode, ViewMode } from '../types';
import { metadataStore } from './metadata';

export type SchemaTreeRefInfo = {
  source: string | null;
  pointer: string | null;
};

export type SchemaTreeOptions = {
  expandedDepth: number;
  mergeAllOf: boolean;
  resolveRef: Optional<SchemaTreeRefDereferenceFn>;
  shouldResolveEagerly: boolean;
  viewMode?: ViewMode;
};

export { TreeState as SchemaTreeState };

export class SchemaTree extends Tree {
  public treeOptions: SchemaTreeOptions;

  private _schemaTree: JsonSchemaTree;
  private _map = new WeakMap<RegularNode | RootNode | MirrorNode, SchemaTreeListNode>();
  private _reversedMap = new WeakMap<SchemaTreeListNode, SchemaNode>();

  constructor(public schema: JSONSchema4, public state: TreeState, opts: SchemaTreeOptions) {
    super({
      expanded: node =>
        (!(node.id in state.expanded) && SchemaTree.getLevel(node) <= opts.expandedDepth) ||
        state.expanded[node.id] === true,
    });

    this._schemaTree = new JsonSchemaTree(schema, {
      mergeAllOf: opts.mergeAllOf,
      refResolver: opts.resolveRef,
    });

    this.treeOptions = opts;
  }

  protected readonly visited = new WeakSet();

  public populate() {
    const expanded = {};

    this._map.set(this._schemaTree.root, this.root);

    this._schemaTree.walker.hookInto('stepIn', () => {
      return this._schemaTree.walker.depth <= this.treeOptions.expandedDepth + 1;
    });

    this._schemaTree.walker.on('acceptNode', schemaNode => {
      const treeNode = {
        id: schemaNode.id,
        parent:
          schemaNode.parent === null ? null : SchemaTree.transitionTreeNodeIfNeeded(this._map.get(schemaNode.parent)!), // todo: error?
        name: '',
      };

      if (schemaNode instanceof RootNode || schemaNode instanceof RegularNode || schemaNode instanceof MirrorNode) {
        this._map.set(schemaNode, treeNode);
      }

      metadataStore.set(treeNode, schemaNode);
      this._reversedMap.set(treeNode, schemaNode);
      treeNode.parent?.children.push(treeNode);
    });

    this._schemaTree.walker.on('exitNode', schemaNode => {
      this.flattenTreeFragment(schemaNode);
    });

    this._schemaTree.populate();
    this.state.expanded = expanded;
    this.invalidate();
  }

  protected flattenTreeFragment(schemaNode: SchemaNode) {
    if (!(schemaNode instanceof RegularNode) || schemaNode.primaryType !== SchemaNodeKind.Array || schemaNode.children === null || schemaNode.children.length === 0) {
      return;
    }

    let canBeFlattened = false;

    if (schemaNode.children.length === 1) {
      canBeFlattened = schemaNode.children[0] instanceof RegularNode;
    } else {
      for (const child of schemaNode.children) {
        if (!(child instanceof RegularNode)) return;
        if (child.primaryType === SchemaNodeKind.Array || child.primaryType === SchemaNodeKind.Object) return;
      }

      canBeFlattened = true;
    }

    if (canBeFlattened) {
      const treeNode = this._map.get(schemaNode) as TreeListParentNode // todo: throw

      const { length } = treeNode.children;

      for (const child of treeNode.children) {
        if (!isParentNode(child)) continue;

        for (const child2 of child.children) {
          child2.parent = treeNode;
          treeNode.children.push(child2);
        }
      }

      treeNode.children.splice(0, length);
      if (treeNode.children.length === 0) {
        // @ts-ignore
        delete treeNode.children;
      }
    }
  }

  protected static transitionTreeNodeIfNeeded(node: SchemaTreeListNode): TreeListParentNode {
    if (isParentNode(node)) return node;

    (node as TreeListParentNode).children = [];
    return node as TreeListParentNode;
  }

  public populateTreeFragment(parent: TreeListParentNode) {
    const existingSchemaNode = this._reversedMap.get(parent)!;
    const artificialRoot = Tree.createArtificialRoot();

    try {
      this._map.set(existingSchemaNode, artificialRoot);
      this._schemaTree.walker.restoreWalkerAtNode(existingSchemaNode);
      this._schemaTree.populate();
      this.insertTreeFragment(artificialRoot.children, parent);
    } finally {
      this._map.set(existingSchemaNode, parent);
    }
  }

  public unwrap(node: TreeListParentNode) {
    if (node.children.length !== 0 || this.visited.has(node)) {
      return super.unwrap(node);
    }

    this.populateTreeFragment(node);
    this.visited.add(node);
    return super.unwrap(node);
  }
}
