export default (url) => {
    const newUrl =  new URL(url);
    const host = newUrl.host.trim();
    return host.replace(/\W/gi, '-')+'_files';
}