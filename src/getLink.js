import _ from 'lodash';
export default (link, url) => {
    const baseUrl = new URL(url);
    const currentLink = new URL(link, baseUrl);
    return currentLink.href;
}