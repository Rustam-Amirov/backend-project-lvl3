import getFileName from '../src/getFileName.js';
import { test, expect } from '@jest/globals';

const url = "https://ru.test.com";
test('url html', () => {
    const fileName = getFileName('https://ru.test.com/courses', url);
    expect(fileName).toEqual('ru-test-com-courses.html');
});

test('url js', () => {
    const fileName = getFileName('https://ru.test.com/packs/js/runtime.js', url);
    expect(fileName).toEqual('ru-test-com-packs-js-runtime.js');
});

test('path', () => {
    const fileName = getFileName('/courses', url);
    expect(fileName).toEqual('ru-test-com-courses.html');
});

test('path2', () => {
    const fileName = getFileName('/assets/application.css', url);
    expect(fileName).toEqual('ru-test-com-assets-application.css');
});

test('local file', () => {
    const url = "https://ru.test.com/test";
    const fileName = getFileName('assets/application.css', url);
    expect(fileName).toEqual('ru-test-com-test-assets-application.css');
});