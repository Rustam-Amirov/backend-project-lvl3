import axios from "axios";
import fs from 'fs';
import fsp from 'fs/promises'
import getFileName from "./getFileName.js";
import path from 'path';
import getDirName from "./getDirName.js";
import 'axios-debug-log';
import  debug  from "debug";
import PageLoaderException from "./pageLoaderException.js";
import Listr from 'listr';

export default (links, url, filePath) => {
    const log = debug('page-loader');
    const dir = getDirName(url);
    const dirFiles = path.join(filePath, dir);
    const promiseCreateDir = fsp.mkdir(dirFiles)
        .catch((error) => {
            throw new PageLoaderException('Error creating dir: ' + dirFiles, error.code);
        });

    log('download files...');
    const promises = links.map((link) => {
        let urlForDownload;
        try {
            urlForDownload = new URL(link, url);
        } catch (e) {
            throw new PageLoaderException(`INVALID URL ${url}`, 'ERR_INVALID_URL');
        }
        log(`make request ${urlForDownload.href}`);
        return {
            title: urlForDownload.href,
            task: () => {
                return axios({
                    method: 'get',
                    url: urlForDownload.href,
                    responseType: 'stream'
                }).then((response) => {
                    if (response.status !== 200) {
                        throw new PageLoaderException(`url: ${response.config.url} returned ${response.status}`, 'ERR_BAD_RESPONSE');
                    }
                    log(`save file... ${link}`);
                    const newFileName = getFileName(link, url); 
                    const savedPathToFile =  path.join(dirFiles, newFileName);
                    const file = fs.createWriteStream(savedPathToFile);
                    response.data.pipe(file);
                    return link;
                }).catch((error) => {
                    log(`${error.message} url: ${error.config.url}`);
                    throw new PageLoaderException(`${error.message} url: ${error.config.url}`, error.code);
                });
            } 
        }
    });
    const listr = new Listr(promises, {concurrent:true});

    return promiseCreateDir.then(() => {
        return listr.run();
    }).catch((e) => {
        throw new PageLoaderException(e.message, e.code);
    });
}