import path from 'path';
import PageLoaderException from './pageLoaderException.js';
export default (url, mainUrl) => {
    const dir = path.parse(url);
    let ext;
    if (dir.ext.length < 1) {
        ext = '.html';
    } else {
        ext = dir.ext;
    }
    const mainPath = dir.dir === '/' ? dir.dir + dir.name : dir.dir + '/' + dir.name;

    let newUrl;
    try {
        newUrl =  new URL(mainPath, mainUrl);
    } catch (e) {
        throw new PageLoaderException(`INVALID URL ${url}`, 'ERR_INVALID_URL');
    }
    const newpath = (newUrl.pathname.trim().length > 1) ? newUrl.pathname.trim() : '';
    const host = newUrl.host.trim();
    return (host+newpath).replace(/[^a-z0-9\s]/gi, '-')+ext;
}