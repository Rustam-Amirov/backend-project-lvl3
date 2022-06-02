#!/usr/bin/env node

import { Command } from 'commander';

const pageLoader = () => {
  const program = new Command();
  program
    .version('1.0.0')
    .description('Page loader utility')
    .arguments('<url>')
    .option('-o, --output [dir]', 'output dir', "/home/user/current-dir")
    .action((url, arg) => {
    });
  program.parse();
};

pageLoader();