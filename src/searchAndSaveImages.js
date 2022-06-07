import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import getFileName from './getFileName.js';

let imageLink;
let $;

export default (filePath, fileName, url) => {

    //search links
    const promiseLink = fsp.readFile(filePath + '/' + fileName, 'utf-8')
        .then((data) => $ = cheerio.load(data))
        .then(() => imageLink = $('img').attr('src'));

    //create dir
    const dir =  getFileName(url, '_files');
    const promiseCreateDir = fsp.mkdir(filePath + '/' + dir);

    //download image
    return Promise.all([promiseLink, promiseCreateDir])
        .then(() => {
            const link = new URL(url);
            link.pathname = imageLink;
            return axios({
                method: 'get',
                url: link.href,
                responseType: 'stream'
            });
        })
        .then((response) => {
            const path = filePath + '/image.png';
            response.data.pipe(fsp.createWriteStream(path));
        })
        .catch((err) =>(err));
}