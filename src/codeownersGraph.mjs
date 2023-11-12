import CodeOwners from 'codeowners';
import { relative } from 'node:path'
import { createTree, printTree } from './directoryTree/index.mjs';

export const createCodeOwnerGraph = async (argv) => {
  const codeowners = new CodeOwners(argv.cwd);

  const getCodeOwnerInfo = (node) => {
    const relativePath = relative(argv.cwd, node.path) || '.';
    const codeownerList = codeowners.getOwner(relativePath);

    return codeownerList?.length ? codeownerList.join(',') : ''
  }

  const tree = await createTree(argv.fileTreeRoot, {
    exclude: argv.exclude,
    cwd: argv.cwd,
  });

  return printTree(tree, {
    maxWidth: Math.min(argv.maxWidth, process.stdout.columns),
    printRight: getCodeOwnerInfo
  });
}

