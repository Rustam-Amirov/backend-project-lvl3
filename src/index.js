import getFileName from './getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';
import getLinks from './getLinks.js';
import downloadFiles from './downloadFiles.js';
import changeFile from './changeFile.js';
import debug from 'debug';

export default (url, arg) => {
    const log = debug('page-loader');
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url);
    const finalUrl = filePath + '/' + fileName;
    let fileLinks;

    log(`doing request: ${url}`);
    return axios.get(url)
        .then((response) => {
            log(`creating and write file ${finalUrl}`);
            fsp.writeFile(finalUrl, response.data);
            return response.data;
        })
        .then((data) => getLinks(data, url))
        .then((links) => {
            fileLinks = links;
            downloadFiles(links, url, filePath)
            log(`download other files...`);
        })
        .then(() => changeFile(finalUrl, fileLinks, url))
        .then (() => finalUrl);
};