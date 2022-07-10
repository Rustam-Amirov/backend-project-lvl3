export default (link, url) => {
    const currentLink = new URL(link, url);
    return currentLink.href;
}