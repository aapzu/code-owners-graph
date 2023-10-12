import CodeOwners from 'codeowners';
import yargs from 'yargs'
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

const run = async (argv) => {
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

const DEFAULT_EXCLUDE = ['node_modules'];

yargs(process.argv.slice(2))
  .command(
    '$0', 
    'default', 
    yargs => yargs
      .option('cwd', {
        alias: 'c',
        describe: 'The directory to run the command in',
        type: 'string',
      })
      .option('file-tree-root', {
        alias: 'f',
        default: '.',
        describe: 'The root directory of the file tree',
        type: 'string',
      })
      .option('exclude', {
        alias: 'i',
        default: DEFAULT_EXCLUDE,
        describe: 'Files to exclude',
        type: 'array',
      }),
    (argv) => {
      const exclude = argv.exclude.flatMap((item) => item.split(/, ?/g))
      void run({
        ...argv,
        exclude,
      })
    }
  )
  .parse()

