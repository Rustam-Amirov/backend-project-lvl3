import axios from "axios";
import fs from 'fs';
import fsp from 'fs/promises'
import getFileName from "./getFileName";

export default (links, url, filePath) => {

    const dir = getFileName(url, '_files');
    const dirFiles = filePath + '/' + dir;
    const promiseCreateDir = fsp.mkdir(dirFiles);

    const promises = links.map((link) => {
        const urlForDownload = new URL(link, url);
        return axios({
            method: 'get',
            url: urlForDownload.href,
            responseType: 'stream'
        });
    });

    promiseCreateDir.resolve('success').then(() => {
        Promise.all(promises)
            .then((data) => {
            })
    });
}