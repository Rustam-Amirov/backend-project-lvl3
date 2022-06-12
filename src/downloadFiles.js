

import axios from "axios";

export default (links, url) => {

    const promises = links.map((link) => {
        const urlForDownload = new URL(link, url);
        return axios({
            method: 'get',
            url: urlForDownload.href,
            responseType: 'stream'
        });
    });

    return Promise.all(promises);
}