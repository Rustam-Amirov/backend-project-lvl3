import pageLoader from '../src/index.js';
import { test, expect, beforeEach} from '@jest/globals';
import nock from 'nock';
import fsp from 'fs/promises';
import os from 'os';
import path from 'path';

let tempdir;
const expected = '<html>Hello</html>';
const url = 'https://www.test.com';

beforeEach(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
})

test('page loader test', async () => {
    nock(url).get('/test').reply(
        200,
        expected
    )
    const resultDir = await pageLoader(url +'/test', tempdir);

    const dir = await fsp.readdir(tempdir);
    const resultFile = await fsp.readFile(tempdir + '/' + dir[0], 'utf-8');
    expect(resultDir).toEqual(tempdir + '/' + dir[0]);
    expect(resultFile).toEqual(expected);
});