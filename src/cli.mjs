#!/usr/bin/env node

import yargs from 'yargs'
import {createCodeOwnerGraph} from './codeownersGraph.mjs'

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
      return createCodeOwnerGraph({
        ...argv,
        exclude,
      })
    }
  )
  .parse()

