import getLink from "../src/getLink";
import { test, expect } from '@jest/globals';

test('test 1', () => {
    const url = 'https://myproject.com';
    const link = '/asdf.jpg'
    const result = getLink(link, url);
    expect(result).toEqual('https://myproject.com/asdf.jpg');
});

test('test 2', () => {
    const url = 'https://myproject.com/dir';
    const link = 'asdf.jpg'
    const result = getLink(link, url);
    expect(result).toEqual('https://myproject.com/dir/asdf.jpg');
});

test('test 3', () => {
    const url = 'https://myproject.com/dir';
    const link = '/asdf.jpg'
    const result = getLink(link, url);
    expect(result).toEqual('https://myproject.com/asdf.jpg');
});

test('test 4', () => {
    const url = 'https://myproject.com/dir';
    const link = 'https://myproject.com/asdf.jpg'
    const result = getLink(link, url);
    expect(result).toEqual('https://myproject.com/asdf.jpg');
});
