import Cookies from 'js-cookie';

export default function initPopup () {
    const body = document.querySelector('body');
    const openedClass = 'modal-opened';
    const key = 'is-cashed';

    document.querySelectorAll('.cookie-popup').forEach((popup) => {
        const closeBtns = popup.querySelectorAll('[data-close]');
        const simpleBtns = popup.querySelectorAll('.btn');

        const delay = popup.dataset.delay !== undefined ? Number(popup.dataset.delay) * 1000 : 1000;
        const isShow = popup.dataset.show === 'true';
        const cookieDays = popup.dataset.days !== undefined ? Number(popup.dataset.days) : 30;

        // Check if popup should be shown
        const now = Date.now();
        const expiresMs = popup.dataset.expiresDate ? Date.parse(popup.dataset.expiresDate) : null;
        const isValidDate = Number.isFinite(expiresMs);
        const isAfterExpiration = isValidDate && now > expiresMs;
        const isEnabledBySettings = isShow && !isAfterExpiration;

        if (!Cookies.get(key) && isEnabledBySettings) {
            showPopup();
        }

        closeBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
            });
        });

        simpleBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                closePopup();
            });
        });

        function showPopup () {
            setTimeout(() => {
                body.classList.add(openedClass);
            }, delay);
        }

        function closePopup () {
            body.classList.remove(openedClass);
            setCookie();
        }

        function setCookie () {
            Cookies.set(key, 'true', {
                expires: cookieDays,
                path: '/'
            });
        }
    });
}