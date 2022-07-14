import axios from "axios";
import fsp from 'fs/promises'
import getFileName from "./getFileName.js";
import path from 'path';
import 'axios-debug-log';
import  debug  from "debug";
import Listr from 'listr';
import getLink from "./getLink.js";

export default (links, url, dirFiles) => {
    const log = debug('page-loader');
    log('download files...');
    const promises = links.map((link) => {
        let urlForDownload = getLink(link, url);
        log(`make request ${urlForDownload}`);
        return {
            title: urlForDownload,
            task: () => {
                return axios({
                    method: 'get',
                    url: urlForDownload,
                    responseType: 'stream',
                }).then((response) => {
                    if (response.status !== 200) {
                        log(`error in downloadFiles.js with ${response.config.url} returned ${response.status}`);
                        throw new Error(`url: ${response.config.url} returned ${response.status}`);
                    }
                    log(`save file... ${link}`);
                    const newFileName = getFileName(link, url); 
                    const savedPathToFile =  path.join(dirFiles, newFileName);
                    fsp.writeFile(savedPathToFile, response.data);
                    return link;
                }).catch((error) => {
                    log(`${error.message}`);
                    throw error;
                });
            } 
        }
    });
    const listr = new Listr(promises, {concurrent:true, exitOnError: false});

    return listr.run().catch((e) => {
        throw e;
    });
}