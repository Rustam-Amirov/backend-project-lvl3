import * as cheerio from 'cheerio';
import getFileName from './getFileName';
import getDirName from './getDirName';
import fsp from 'fs/promises';

export default (fileName, links, url) => {

    return fsp.readFile(fileName, 'utf-8')
        .then((html) => {
            const $ = cheerio.load(html); 
            links.map((link) => {
                let i = $(html).find(`[src='${link}']`);
            });
        })
}
