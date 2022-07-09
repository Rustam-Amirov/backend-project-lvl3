import getLink from "../src/getLink";
import { test, expect } from '@jest/globals';


test('test 2', () => {
    const url = 'https://myproject.com/dir/file';
    const link = 'asdf.css'
    const result = getLink(link, url);
    const expected = 'https://myproject.com/dir/asdf.css';
    expect(result).toEqual(expected);
});

test('test 3', () => {
    const url = 'https://myproject.com/dir';
    const link = '/asdf.jpg'
    const result = getLink(link, url);
    const expected = 'https://myproject.com/asdf.jpg';
    expect(result).toEqual(expected);
});

test('test 4', () => {
    const url = 'https://myproject.com/dir';
    const link = 'https://myproject.com/asdf.jpg'
    const result = getLink(link, url);
    expect(result).toEqual('https://myproject.com/asdf.jpg');
});
