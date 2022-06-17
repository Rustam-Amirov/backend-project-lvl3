import getFileName from './getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';
import getLinks from './getLinks.js';
import downloadFiles from './downloadFiles.js';
import changeFile from './changeFile.js';

export default (url, arg) => {
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url);
    const finalUrl = filePath + '/' + fileName;
    let fileLinks;

    return axios.get(url)
        .then((response) => {
            fsp.writeFile(finalUrl, response.data);
            return response.data;
        })
        .then((data) => getLinks(data, url))
        .then((links) => {
            fileLinks = links;
            downloadFiles(links, url, filePath)
        })
        .then(() => changeFile(finalUrl, fileLinks, url))
        .then (() => finalUrl);
};