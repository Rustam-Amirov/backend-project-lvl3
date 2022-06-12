import * as cheerio from 'cheerio';

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
        const currentLink = new URL(link, url);
        return currentLink.origin === url;
    });
}