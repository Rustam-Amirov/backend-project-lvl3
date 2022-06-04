#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../src/index.js';

const comandInterface = () => {
  const program = new Command();
  program
    .version('1.0.0')
    .description('Page loader utility')
    .arguments('<url>')
    .option('-o, --output [dir]', 'output dir', "/home/user/current-dir")
    .action(async (url, arg) => {
        console.log('open '+ await pageLoader(url, arg.output));
    });
  program.parse();
};

comandInterface();