import path from 'node:path'

import { globby } from 'globby'

const createNode = (path) => ({
  path,
  children: {},
})

const createTree = async (rootPath, options, forEachNode) => {
  const files = await globby('**/*', {
    cwd: rootPath,
    onlyFiles: false,
    gitignore: options.gitignore,
    ignore: options.exclude,
  });

  const rootNode = createNode(rootPath, true);

  for (const file of files) {
    const pathArray = file.split(path.sep);

    let currentNode = rootNode;

    for (const pathPart of pathArray) {
      if (!currentNode.children[pathPart]) {
        currentNode.children[pathPart] = createNode(path.join(currentNode.path, pathPart));
      }

      currentNode = currentNode.children[pathPart];
    }
  }

  return rootNode;
}

export default createTree;