import * as cheerio from 'cheerio';
import getFileName from './getFileName';
import getDirName from './getDirName';
import fsp from 'fs/promises';
import path from 'path';

export default (fileName, links, url) => {

    const newDirName = getDirName(url);
    return fsp.readFile(fileName, 'utf-8')
        .then((html) => {
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
            return $;
        })
        .then(($) => {
            fsp.writeFile(fileName, $.html());
        })
}
