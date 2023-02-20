#!/usr/bin/env node

import {Command} from 'commander';
import {translate} from './main';

const program = new Command();

program
  .name('translator-node-cli')
  .description('utils to translate words')
  .version('0.0.1')
  .usage('<word>')
  .argument('<word>')
  .action((word) => {
    translate(word);
  });

program.parse(process.argv);
