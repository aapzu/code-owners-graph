import CodeOwners from 'codeowners';
import dirTree from 'directory-tree';
import chalk from 'chalk'
import { relative } from 'node:path'

/**
 * Pretty print directory tree, e.g.
 * photos
 * ├── summer
 * │   └── june
 * │       └── windsurf.jpg
 * └── winter
 *     └── january
 *         ├── ski.png
 *         └── snowboard.jpg

 * @param DirectoryTree} tree 
 */
function printTree(
  node, 
  printNode = node => node.name,
  prefix = '', 
  lastChild = true, 
  isRoot = true, 
) {
  const end = isRoot ? '' : lastChild ? '└── ' : '├── ';
  console.log(chalk.white(prefix + end + printNode(node, isRoot)));

  if (node.children) {
    const childPrefix = prefix + (isRoot ? '' : lastChild ? '    ' : '│   ');
    node.children.forEach((child, i) => {
      printTree(child, printNode, childPrefix, i === node.children.length - 1, false);
    });
  }
}

export const createCodeOwnerGraph = async (argv) => {
  const codeowners = new CodeOwners(argv.cwd);

  const addCodeownerInfo = (item, filePath) => {
    const relativePath = relative(argv.cwd, filePath);
    const codeowner = codeowners.getOwner(relativePath);
    item.codeowner = codeowner;
  }

  const tree = dirTree(
    argv.fileTreeRoot, 
    {
      exclude: argv.exclude.map((item) => new RegExp(item)),
    },     
    addCodeownerInfo,
  );

  printTree(
    tree,
    (node, isRoot) => `${isRoot ? node.path : node.name} ${chalk.gray(node.codeowner.length ? `– ${node.codeowner.join(',')}` : '')}`,
  );
}

