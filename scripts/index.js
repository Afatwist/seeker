"use strict";
localStorage.clear();
document.getElementById('in-game').addEventListener('click', () => {
    openLink('file-choose', 'game');
});
document.getElementById('constructor').addEventListener('click', () => {
    openLink('constructor/constructor', 'constructor');
});
document.getElementById('how-play').addEventListener('click', () => {
    openLink('how-play');
});
function openLink(link, itemSet = false) {
    if (itemSet)
        localStorage.setItem('page', itemSet);
    window.open(`pages/${link}.html`, '_self');
}
//# sourceMappingURL=index.js.map