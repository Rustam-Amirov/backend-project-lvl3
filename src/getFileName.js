import path from 'path';
import _ from 'lodash';
export default (link, mainUrl) => {
    const dir = path.parse(link);
    let ext;
    if (dir.ext.length < 1) {
        ext = '.html';
    } else {
        ext = dir.ext;
    }

    let newUrl;
    if (dir.root === '/' ||  _.startsWith(link, 'http')) {
        newUrl = new URL(link, mainUrl);
    } else {
        const mainPath = mainUrl + '/' + link;
        newUrl = new URL(mainPath);
    }

    const pathNameWithouExt = newUrl.pathname.substring(0, newUrl.pathname.indexOf('.'));
    const pathUrl =  pathNameWithouExt.length > 0 ? pathNameWithouExt : newUrl.pathname;
    return (newUrl.host + pathUrl).replace(/\W/gi, '-')+ext;
}