import pageLoader from '../index.js';
import { test, expect, beforeEach} from '@jest/globals';
import nock from 'nock';
import fsp from 'fs/promises';
import os from 'os';
import path from 'path';

let tempdir;
const expected = '<html><head></head><body>Hello</body></html>';
const url = 'https://www.test.com';

beforeEach(async () => {
    tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
})

test('page loader ok', async () => {
    nock(url).get('/test').reply(
        200,
        expected
    );
    const resultDir = await pageLoader(url +'/test', tempdir);
    const dir = await fsp.readdir(tempdir);
    const resultFile = await fsp.readFile(tempdir + '/' + dir[0], 'utf-8');
    expect(resultDir).toEqual(tempdir + '/' + dir[0]);
    expect(resultFile).toEqual(expected);
});


test('page loader fail', async () => {
    nock(url).get('/test').reply(500);
    expect.assertions(1);
    await expect(pageLoader(url +'/test', tempdir)).rejects.toThrow("'https://www.test.com/test' request failed with status code 500");
});


test('page loader fail3', async () => {
    nock(url).get('/test').replyWithError('Wrong url!');
    expect.assertions(1);
    await expect(pageLoader(url+'/test', tempdir)).rejects.toThrow('The request was made at https://www.test.com/test but no response was received');
});