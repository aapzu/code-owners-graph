import path from 'node:path'

import chalk from 'chalk'

const concat = (...items) => items.join('')

const printLine = (node, whitespacePrefix, isRoot, lastChild) => {
  const treeBranchLine = isRoot ? '' : lastChild ? '└── ' : '├── ';

  const nodeNamePart = path.basename(node.path)

  return concat(whitespacePrefix, treeBranchLine, nodeNamePart)
}

const formatLine = ({ left, right }, maxRowLength) => {
  const whitespaceCount = maxRowLength - left.length

  const MARGINAL = 4

  const line = concat(chalk.white(left), chalk.gray(right.padStart(whitespaceCount + right.length + MARGINAL)));

  return line
}

const getTreeRows = (
  node, 
  options,
  whitespacePrefix = '', 
  lastChild = true, 
  isRoot = true, 
) => {
  const treeRows = [{
    left: printLine(node, whitespacePrefix, isRoot, lastChild),
    right: options.printRight?.(node) || '',
  }]
  const children = Object.values(node.children)

  if (children.length) {
    const childPrefix = whitespacePrefix + (isRoot ? '' : lastChild ? '    ' : '│   ');
    children.forEach((child, i) => {
      treeRows.push(...getTreeRows(child, options, childPrefix, i === children.length - 1, false));
    });
  }

  return treeRows
}

/**
 * Pretty print directory tree with CODEOWNER info, e.g.
 * photos                                     @johndoe
 * ├── summer
 * │   └── june                               @janedoe
 * │       └── windsurf.jpg
 * └── winter                                 @developers
 *     └── january
 *         ├── ski.png
 *         └── snowboard.jpg

 * @param DirectoryTree} tree 
 */
const printTree = (
  node, 
  options,
  whitespacePrefix = '', 
  lastChild = true, 
  isRoot = true, 
) => {
  const treeRows = getTreeRows(node, options, whitespacePrefix, lastChild, isRoot)

  const maxRowLength = Math.max(...treeRows.map(item => item.left.length))

  return treeRows.map(item => formatLine(item, maxRowLength)).join('\n')
}

export default printTree