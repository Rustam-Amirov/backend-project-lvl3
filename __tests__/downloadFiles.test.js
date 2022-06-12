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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename = '') => path.join(__dirname, '..', '__fixtures__', filename);

const url = 'https://ru.test.com';
let tempdir;
const links = {
    '/assets/application.css':                  "style.css",
    '/courses':                                 "index.html",
    '/assets/professions/nodejs.png':           "image.png",
    'https://ru.test.com/packs/js/runtime.js':  "script.js"
};

beforeAll(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
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

    const resultLinks = await downloadFiles(Object.keys(links), url, tempdir);

    _.mapKeys(resultLinks, async (newPath, oldPath) => {
        const actual = await fsp.readFile(path.join(tempdir, newPath));
        const expected  = await fsp.readFile(getFixturePath(links[oldPath]));
        expect(actual).toBe(expected);
    });
});
