#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../index.js';
import process from 'process';

const comandInterface = () => {
    const program = new Command();
    program
        .version('1.0.0')
        .description('Page loader utility')
        .arguments('<url>')
        .option('-o, --output [dir]', 'output dir', "/home/user/current-dir")
        .action(async (url, arg) => {
            try {
                const result = await pageLoader(url, arg.output);
                console.log('open '+ result);
            } catch (e) {
                console.error(e.message);
                process.exit(1);
            }
        });
    program.parse();
};

comandInterface();