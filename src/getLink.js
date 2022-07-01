import _ from 'lodash';
export default (link, url) => {
    if (link[0] === '/') {
        const uri = new URL(link, url);
        return uri.href;
    } else if( _.startsWith(link, 'http')) {
        return link;
    } else {
        return url + '/' + link;
    }
}