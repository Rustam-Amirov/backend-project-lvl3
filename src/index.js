import getFileName from './getFileName.js';
import axios from 'axios';
import fsp from 'fs/promises';
import process from 'process';

export default async (url, arg) => {
    const filePath = arg === '/home/user/current-dir' ? process.cwd() : arg;
    const fileName = getFileName(url);
    return await axios.get(url)
        .then((response) => fsp.writeFile(filePath + '/' + fileName, response.data))
        .then(() => filePath+ '/' + fileName);
};