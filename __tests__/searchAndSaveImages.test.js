import searchAndSaveImages from '../src/searchAndSaveImages.js';
import { test, expect, beforeEach, beforeAll} from '@jest/globals';
import fsp from 'fs/promises';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename = '') => path.join(__dirname, '..', '__fixtures__', filename);

const filename = 'before.html';
const src = getFixturePath(filename);
const url = 'https://www.test.com';
let expected;
let dest;
let tempdir;
beforeAll(async () => {
    expected = await fsp.readFile(getFixturePath('after.html'), 'utf-8');
});

beforeEach(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    dest = path.join(tempdir, filename );
    await fsp.cp(src, dest);
});

test('save_image', async () => {
    await searchAndSaveImages(tempdir, filename, url );
    const actual = await fsp.readFile(dest, 'utf-8');
    expect(actual).toBe(expected);
})
