export default (url) => {
    const newUrl =  new URL(url);
    const host = newUrl.host.trim();
    return host.replace(/[^a-z0-9\s]/gi, '-')+'_files';
}