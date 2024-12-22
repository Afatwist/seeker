import { baseUrl } from "./Classes/Helpers.js";
document.getElementById('to-back-menu').addEventListener('click', () => {
    window.history.back();
});
document.getElementById('to-main-page').addEventListener('click', () => {
    window.open(baseUrl, '_self');
});
//# sourceMappingURL=btn-menu.js.map