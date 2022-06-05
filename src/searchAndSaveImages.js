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
    const promiseCreateDir = new Promise(() => {
        const dir =  getFileName(url, '_files')
        fsp.mkdir(filePath + '/' + dir)
    });

    //download image
    Promise.all([promiseLink, promiseCreateDir])
        .then(() => {
            return axios({
                method: 'get',
                url: url.host + imageLink,
                responseType: 'stream'
            })
        })
        .then((response) => console.log(response));
}