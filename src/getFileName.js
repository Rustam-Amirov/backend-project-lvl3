import path from 'path';

export default (url, mainUrl, end = '') => {
    const dir = path.parse(url);
    let ext;
    if (dir.ext.length < 1 && end.length < 1) {
       ext = '.html';
    } else if (end.length >= 1) {
        ext = end;
    } else {
        ext = dir.ext;
    }
    const mainPath = dir.dir === '/' ? dir.dir + dir.name : dir.dir + '/' + dir.name;

    const newUrl =  new URL(mainPath, mainUrl);
    const newpath = (newUrl.pathname.trim().length > 1) ? newUrl.pathname.trim() : '';
    const host = newUrl.host.trim();
    return (host+newpath).replace(/[^a-z0-9\s]/gi, '-')+ext;
}