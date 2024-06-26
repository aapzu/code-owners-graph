#!/usr/bin/env tsx

import yargs from 'yargs'
import { createCodeOwnerGraph } from './codeownersGraph.mts'

yargs(process.argv.slice(2))
  .command(
    '$0', 
    'default', 
    yargs => yargs
      .option('cwd', {
        alias: 'c',
        describe: 'The directory to run the command in',
        default: process.cwd(),
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
        default: [],
        describe: 'Files to exclude',
        type: 'string',
        array: true,
      })
      .option('gitignore', {
        alias: 'g',
        default: true,
        describe: 'Whether to exclude files in .gitignore',
        type: 'boolean',
      })
      .option('maxWidth', {
        default: 80,
        describe: 'Maximum width of the printed tree',
        type: 'number',
      })
      ,
    async (argv) => {
      const exclude = argv.exclude.flatMap((item) => item.split(/, ?/g))
      
      const tree = await createCodeOwnerGraph({
        ...argv,
        exclude,
      })

      console.log(tree)
    }
  )
  .parse()

