import * as cheerio from 'cheerio';
import _ from 'lodash';
export default (html, url) => {
    const $ = cheerio.load(html);
    const searchElements = {
        img: 'src',
        link: 'href',
        script: 'src'
    };
    const links = [];
    $('img, link, script').each((index, element) => {
        const currentTag = $(element).prop("tagName").toLowerCase();
        if ($(element).attr(searchElements[currentTag]) !== undefined) {
            links[index] = $(element).attr(searchElements[currentTag]);
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