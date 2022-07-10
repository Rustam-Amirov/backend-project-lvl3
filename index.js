import getFileName from './src/getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';
import getLinks from './src/getLinks.js';
import downloadFiles from './src/downloadFiles.js';
import changeFile from './src/changeFile.js';
import debug from 'debug';
import 'axios-debug-log';

export default (url, arg) => {
    const log = debug('page-loader');
    const baseUrl = new URL(url);
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(baseUrl.href);
    const finalUrl = filePath + '/' + fileName;
    let fileLinks;

    log(`doing request: ${baseUrl.href}`);
    return axios.get(baseUrl.href)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`url: ${response.config.url} returned ${response.status}`);
            }
            return response.data;
        })
        .then((data) => {
            log(`creating and write file ${finalUrl}`);
            fsp.writeFile(finalUrl, data)
                .catch((error) => {
                    log(`Error writing file ${finalUrl}`);
                    throw error;
                });
            return data;
        })
        .then((data) => getLinks(data, baseUrl.href))
        .then((links) => {
            fileLinks = links;
            log(`download other files...`);
            return downloadFiles(links, baseUrl.href, filePath)
        })
        .then(() => changeFile(finalUrl, fileLinks, baseUrl.href))
        .then (() => finalUrl)
        .catch((error) => {
            log(`${error.message} url: ${error.config.url}`);
            if (error.isAxiosError) {
                if (error.response) {
                    throw new Error(`'${error.config.url}' request failed with status code ${error.response.status}`);
                }
                throw new Error(`The request was made at ${error.config.url} but no response was received`);
            }
            throw error;
        });
};