import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import fs from 'fs';
import getFileName from './getFileName.js';

let imageLink;
let $;
let newFileName;

export default (filePath, fileName, url) => {

    const link = new URL(url);
    
    //search links
    const promiseLink = fsp.readFile(filePath + '/' + fileName, 'utf-8')
        .then((data) => $ = cheerio.load(data))
        .then(() => {
            let imageLinks = [];
            $('img').each((index, element) => {
                imageLinks[index] = $(element).attr('src');
            });
            link.pathname = imageLink;
            const newFile = getFileName(link.origin + imageLink, '');
            newFileName = newFile.replace('-png', '.png');
            link.pathname = imageLink;
        });

    //create dir
    const dir =  getFileName(url, '_files');
    const promiseCreateDir = fsp.mkdir(filePath + '/' + dir);

    //download image
    const promise = Promise.all([promiseLink, promiseCreateDir]);

    promise.then(() => {
            return axios({
                method: 'get',
                url: link.href,
                responseType: 'stream'
            });
        })
        .then((response) => {
            const path = filePath + '/' + dir +'/' + newFileName;
            const file = fs.createWriteStream(path);
            return response.data.pipe(file);
        })
        .then(() => {
            
        })
        .catch((err) => (err));
        
    
}