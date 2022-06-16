import axios from "axios";
import fs from 'fs';
import fsp from 'fs/promises'
import getFileName from "./getFileName";
import path from 'path';
import getDirName from "./getDirName";

export default (links, url, filePath) => {

    const dir = getDirName(url);
    const dirFiles = path.join(filePath, dir);
    const promiseCreateDir = fsp.mkdir(dirFiles);

    const promises = links.map((link) => {
        const urlForDownload = new URL(link, url);
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
            console.log(error);
        });
    });

    return Promise.all(promises, promiseCreateDir);
}