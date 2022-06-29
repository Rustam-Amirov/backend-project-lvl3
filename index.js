import getFileName from './src/getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';
import getLinks from './src/getLinks.js';
import downloadFiles from './src/downloadFiles.js';
import changeFile from './src/changeFile.js';
import debug from 'debug';
import 'axios-debug-log';
import PageLoaderException from './src/pageLoaderException.js';

export default (url, arg) => {
    const log = debug('page-loader');
    try {
        new URL(url);
    } catch (e) {
        throw new PageLoaderException(`INVALID URL ${url}`, 'ERR_INVALID_URL');
    }
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url);
    const finalUrl = filePath + '/' + fileName;
    let fileLinks;

    log(`doing request: ${url}`);
    return axios.get(url)
        .then((response) => {
            if (response.status !== 200) {
                throw new PageLoaderException(`url: ${response.config.url} returned ${response.status}`, 'ERR_BAD_RESPONSE');
            }
            log(`creating and write file ${finalUrl}`);
            fsp.writeFile(finalUrl, response.data)
                .catch((error) => {
                    throw new PageLoaderException(`Error writing file ${finalUrl}`, error.code);
                });
            return response.data;
        })
        .then((data) => getLinks(data, url))
        .then((links) => {
            fileLinks = links;
            log(`download other files...`);
            return downloadFiles(links, url, filePath)
        })
        .then(() => changeFile(finalUrl, fileLinks, url))
        .then (() => finalUrl)
        .catch((error) => {
            if (error.config !== undefined) {
                throw new PageLoaderException(`${error.message} url: ${error.config.url}`, error.code);
            }
            throw new PageLoaderException(error.message, error.code);
        });
};