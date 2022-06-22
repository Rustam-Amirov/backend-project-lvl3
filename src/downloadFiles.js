import axios from "axios";
import fs from 'fs';
import fsp from 'fs/promises'
import getFileName from "./getFileName.js";
import path from 'path';
import getDirName from "./getDirName.js";
import 'axios-debug-log';
import  debug  from "debug";
import {PageLoaderException} from "./pageLoaderException.js";

export default (links, url, filePath) => {

    const log = debug('page-loader');
    const dir = getDirName(url);
    const dirFiles = path.join(filePath, dir);
    const promiseCreateDir = fsp.mkdir(dirFiles)
        .catch((error) => {
            throw new PageLoaderException('Error creating dir', error.code);
        });

    log('download files...');
    const promises = links.map((link) => {
        const urlForDownload = new URL(link, url);
        log(`make request ${urlForDownload}`);
        return axios({
            method: 'get',
            url: urlForDownload.href,
            responseType: 'stream'
        }).then((response) => {
            const newFileName = getFileName(link, url); 
            const savedPathToFile =  path.join(dirFiles, newFileName);
            const file = fs.createWriteStream(savedPathToFile);
            response.data.pipe(file);
            return link;
        }).catch((error) => {
            throw new PageLoaderException('Error creating file', error.code);
        });
    });

    return Promise.all(promises, promiseCreateDir);
}