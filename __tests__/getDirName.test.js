import getDirName from '../src/getDirName.js';
import { test, expect } from '@jest/globals';

const url = "https://ru.test.com";
test('url files', () => {
    const fileName = getDirName(url);
    expect(fileName).toEqual('ru-test-com_files');
});