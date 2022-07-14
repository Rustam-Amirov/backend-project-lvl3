import getFileName from './src/getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import constants from 'fs/promises';
import process from 'process';
import getLinks from './src/getLinks.js';
import downloadFiles from './src/downloadFiles.js';
import changeFile from './src/changeFile.js';
import debug from 'debug';
import path from 'path';
import getDirName from "./src/getDirName.js";
import 'axios-debug-log';

export default (url, arg) => {
    const log = debug('page-loader');
    const baseUrl = new URL(url);
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url, url, false);
    const finalUrl = filePath + '/' + fileName;
    let fileLinks;

    const dir = getDirName(baseUrl.href);
    const dirFiles = path.join(filePath, dir);

    const permissions = fsp.access(arg, constants.W_OK | constants.R_OK).catch((e) => {
        return Promise.reject(new Error(e.message));
    });
    
    log(`doing request: ${baseUrl.href}`);
    return permissions.then(() => {
        return axios.get(baseUrl.href)
        })
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
        .then((data) => {
            fileLinks = getLinks(data, baseUrl.href);
            return fsp.access(dirFiles, constants.W_OK).catch(() =>  {
                return fsp.mkdir(dirFiles);
            });
        })
        .then(() => {
            log(`download other files...`);
            return downloadFiles(fileLinks, baseUrl.href, dirFiles)
        })
        .then(() => changeFile(finalUrl, fileLinks, baseUrl.href))
        .then (() => finalUrl)
        .catch((error) => {
            log(`${error.message}`);
            if (error.config) {
                if (error.response) {
                    throw new Error(`'${error.config.url}' request failed with status code ${error.response.status}`);
                }
                throw new Error(`The request was made at ${error.config.url} but no response was received`);
            }
            throw error;
        });
};