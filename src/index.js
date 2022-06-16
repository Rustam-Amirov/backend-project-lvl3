import getFileName from './getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';
import getLinks from './getLinks.js';
import downloadFiles from './downloadFiles.js';

export default (url, arg) => {
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url);
    const finalUrl = filePath + '/' + fileName;
    return axios.get(url)
        .then((response) => {
            fsp.writeFile(finalUrl, response.data);
            return response.data;
        })
        .then((data) => getLinks(data, url))
        .then((links) => downloadFiles(links, url, filePath))
        .then (() => finalUrl);
};