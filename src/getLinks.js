import * as cheerio from 'cheerio';
import _ from 'lodash';
export default (html, url) => {
    const $ = cheerio.load(html);
    const links = [];
    $('img, link, script').each((index, element) => {
        if ($(element).attr('src') !== undefined) {
            links[index] = $(element).attr('src');
        } else if ($(element).attr('href') !== undefined) {
            links[index] = $(element).attr('href');
        }
    });
    return links.filter((link) => {
        if( _.startsWith(link, 'http')) {
            const currentLink = new URL(link);
            return currentLink.origin === url;
        } else {
            return true;
        }
    });
}