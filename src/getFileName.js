export default (url, end = '.html') => {
    const newUrl =  new URL(url.trim());
    const path = (newUrl.pathname.trim().length > 1) ? newUrl.pathname.trim() : '';
    const host = newUrl.host.trim();
    return (host+path).replace(/[^a-z0-9\s]/gi, '-')+end;
}