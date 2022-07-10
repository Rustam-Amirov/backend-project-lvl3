import * as cheerio from 'cheerio';
import getFileName from './getFileName.js';
import getDirName from './getDirName.js';
import fsp from 'fs/promises';
import path from 'path';
import debug from 'debug';

export default (fileName, links, url) => {

    const log = debug('page-loader');
    const newDirName = getDirName(url);
    log('read file before change links...');
    log(fileName);
    return fsp.readFile(fileName, 'utf-8')
        .then((html) => {
            log('change file...');
            const $ = cheerio.load(html); 
            $('img, link, script').each((index, element) => {
                if (links.includes($(element).attr('src'))) {
                    const newLink = getFileName($(element).attr('src'), url);
                    $(element).attr('src', path.join(newDirName, newLink));
                } else if (links.includes($(element).attr('href'))) {
                    const newLink = getFileName($(element).attr('href'), url);
                    $(element).attr('href', path.join(newDirName, newLink));
                }
            });
            log('success');
            return $;
        })
        .then(($) => {
            log('write file...');
            fsp.writeFile(fileName, $.html())
                .catch(() => {
                    throw new Error(`Error writing file: ${fileName}`);
                });
            log('success');
        })
        .catch(() => {
            throw new Error(`Error reading file: ${fileName}`);
        });
}
