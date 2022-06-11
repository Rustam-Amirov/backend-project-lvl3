import * as cheerio from 'cheerio';
import path from 'path';

export default (html, url) => {
    const $ = cheerio.load(html);
    const links = [];
    $('img, link, script').each((index, element) => {
        let link;
        if ($(element).attr('src') !== undefined) {
            link = $(element).attr('src');
        } else if ($(element).attr('href') !== undefined) {
            link = $(element).attr('href');
        } else {
            link = false;
        }
        if (!link) {
            return;
        }
        const localPath = path.parse(link);
        links[index] =  localPath.ext ? link : link + '.html';
    });
    return links.filter((link) => {
        const currentLink = new URL(link, url);
        return currentLink.origin === url;
    });
}