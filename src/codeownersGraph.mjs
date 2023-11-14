import CodeOwners from 'codeowners';
import { relative } from 'node:path'
import { createTree, printTree } from './directoryTree/index.mjs';

export const createCodeOwnerGraph = async ({ fileTreeRoot, ...args }) => {
  const codeowners = new CodeOwners(args.cwd);

  const getCodeOwnerInfo = (node) => {
    const relativePath = relative(args.cwd, node.path) || '.';
    const codeownerList = codeowners.getOwner(relativePath);

    return codeownerList?.length ? codeownerList.join(',') : ''
  }

  const tree = await createTree(fileTreeRoot, args);

  return printTree(tree, {
    maxWidth: Math.min(args.maxWidth, process.stdout.columns),
    printRight: getCodeOwnerInfo
  });
}

