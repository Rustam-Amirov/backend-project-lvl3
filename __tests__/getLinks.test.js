import getLinks from '../src/getLinks';
import { test, expect, beforeAll} from '@jest/globals';
import fsp from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename = '') => path.join(__dirname, '..', '__fixtures__', filename);

let paramsHTML;
const url = 'https://ru.test.com';
const expected = [
    '/assets/application.css',
    '/courses',
    '/assets/professions/nodejs.png',
    'https://ru.test.com/packs/js/runtime.js'
];

beforeAll(async () => {
    paramsHTML = await fsp.readFile(getFixturePath('before.html'), 'utf-8');
});

test('test', () => {
    const links = getLinks(paramsHTML, url);
    expect(links).toEqual(expect.arrayContaining(expected));
});