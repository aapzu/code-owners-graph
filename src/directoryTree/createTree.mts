import path from 'node:path'

import { globby } from 'globby'
import { TNode } from './printTree.mts';

const createNode = (path: string): TNode => ({
  path,
  children: {},
})

type TCreateTreeOptions = {
  gitignore: boolean
  exclude: string[]
}

const createTree = async (rootPath: string, options: TCreateTreeOptions) => {
  const files = await globby('**/*', {
    cwd: rootPath,
    onlyFiles: false,
    gitignore: options.gitignore,
    ignore: options.exclude,
  });

  const rootNode = createNode(path.basename(path.resolve(rootPath)));

  for (const file of files) {
    const pathArray = file.split(path.sep);

    let currentNode: TNode = rootNode;

    for (const pathPart of pathArray) {
      const child = currentNode.children[pathPart] || createNode(path.join(currentNode.path, pathPart));

      currentNode.children[pathPart] = child;

      currentNode = child;
    }
  }

  return rootNode;
}

export default createTree;