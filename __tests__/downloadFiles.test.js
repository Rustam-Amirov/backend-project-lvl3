import { test, expect, beforeAll} from '@jest/globals';
import fsp from 'fs/promises';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import nock from 'nock';
import downloadFiles from '../src/downloadFiles.js';
import _ from 'lodash';
import getDirName from '../src/getDirName.js';
import getFileName from '../src/getFileName.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename = '') => path.join(__dirname, '..', '__fixtures__', filename);

const url = 'https://ru.test.com';
let tempdir;
let dirFiles;

const links = {
    '/assets/application.css':                  "style.css",
    '/courses':                                 "index.html",
    '/assets/professions/nodejs.png':           "image.png",
    'https://ru.test.com/packs/js/runtime.js':  "script.js"
};

beforeAll(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    const dir = getDirName(url);
    dirFiles = path.join(tempdir, dir);
});

test('download', async () => {
    _.mapKeys(links, (file, link) => {
        const urlForDownload = new URL(link, url);
        nock(url).get(urlForDownload.pathname).reply(
            200, async () => {
                return await fs.createReadStream(getFixturePath(file));
            },
        );
    });

    await downloadFiles(Object.keys(links), url, tempdir);

    _.mapKeys(links, async (file, link) => {
        const newFileName = getFileName(link, url); 
        const savedPathToFile = path.join(dirFiles, newFileName); 
        const expected  = await fsp.readFile(getFixturePath(file), 'binary');
        const actual = await fsp.readFile(savedPathToFile, 'binary');
        expect(actual).toBe(expected);
    });
});