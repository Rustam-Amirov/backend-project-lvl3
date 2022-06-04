import getFileName from '../src/getFileName.js';
import { test, expect } from '@jest/globals';

test('right_url', () => {
    const fileName = getFileName('https://ru.hexlet.io/courses');
    expect(fileName).toEqual('ru-hexlet-io-courses.html');
});