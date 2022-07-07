import changeFile from '../src/changeFile.js';
import { test, expect, beforeEach, beforeAll} from '@jest/globals';
import fsp from 'fs/promises';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename = '') => path.join(__dirname, '..', '__fixtures__', filename);
const url = "https://ru.test.com/test";
let expected;
let dest;
let tempdir;
const fileName = 'before.html';

const links = [
    '/assets/application.css',
    '/courses',
    '/assets/professions/nodejs.png',
    'https://ru.test.com/packs/js/runtime.js'
];

beforeAll(async () => {
    expected = await fsp.readFile(getFixturePath('after.html'), 'utf-8');
});

beforeEach(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    dest = path.join(tempdir, fileName);
    await fsp.cp(getFixturePath(fileName), dest);
});

test('change file', async () => {
    await changeFile(dest, links, url);
    const actual = await fsp.readFile(dest, 'utf-8');
    expect(actual).toBe(expected);
});
