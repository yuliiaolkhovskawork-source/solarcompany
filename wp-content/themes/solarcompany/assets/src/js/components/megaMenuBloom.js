// mega menu bloom: blue rounded rect (.header-panel::before) grows from .menu-main-container to fill header and drop
const OPEN_CLASS = 'mega-open';
const RESET_CLASS = 'mega-reset';
const CLOSE_DELAY = 60; // ms, lets the pointer move between items without closing
const CLOSE_DURATION = 400; // ms, matches the closing clip-path transition

export default function initMegaMenuBloom()
{
    const panel = document.querySelector('.header-panel');
    const menu = panel?.querySelector('.main-menu');

    if (!menu) { return;
    }

    const desktop = window.matchMedia('(min-width: 1366px)');
    const items = [...menu.querySelectorAll(':scope > li.menu-item-has-children')];
    const menuBox = menu.closest('.menu-main-container') || menu;
    let closeTimer;
    let closedAt = 0;

    const isOpen = () => panel.classList.contains(OPEN_CLASS);
    const isFullyClosed = () => !isOpen() && Date.now() - closedAt > CLOSE_DURATION;

    const setGeometry = (item) => {
        const drop = item.querySelector(':scope > .item-drop');

        if (!drop) { return;
        }

        const panelRect = panel.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const dropRect = drop.getBoundingClientRect();
        const menuRect = menuBox.getBoundingClientRect();
        const height = dropRect.bottom - panelRect.top;
        const style = panel.style;

        style.setProperty('--bloom-h', `${height}px`);
        // closed shape = the menu pill, measured inside the bloom layer
        style.setProperty('--bloom-top', `${menuRect.top - panelRect.top}px`);
        style.setProperty('--bloom-left', `${menuRect.left - panelRect.left}px`);
        style.setProperty('--bloom-right', `${panelRect.right - menuRect.right}px`);
        style.setProperty('--bloom-bottom', `${height - (menuRect.bottom - panelRect.top)}px`);

        // snap to the start shape without transition while nothing is visible
        if (isFullyClosed()) {
            panel.classList.add(RESET_CLASS);
            getComputedStyle(panel, '::before').clipPath; // flush without transition
            panel.classList.remove(RESET_CLASS);
        }

        // hover bridge over the gap between the menu and the drop
        drop.style.setProperty('--bridge-left', `${menuRect.left - dropRect.left}px`);
        drop.style.setProperty('--bridge-width', `${menuRect.width}px`);
        drop.style.setProperty('--bridge-height', `${Math.max(0, dropRect.top - itemRect.bottom)}px`);
    };

    const open = (item) => {
        clearTimeout(closeTimer);
        setGeometry(item);
        panel.classList.add(OPEN_CLASS);
    };

    const sync = () => {
        const active = items.find((item) => item.matches(':hover') || item.classList.contains('item-focused'));

        if (active) {
            open(active);
        } else if (isOpen()) {
            panel.classList.remove(OPEN_CLASS);
            closedAt = Date.now();
        }
    };

    items.forEach(
        (item) => {
            item.addEventListener(
                'mouseenter', () => {
                    if (desktop.matches) { open(item);
                    }
                }
            );
            item.addEventListener(
                'mouseleave', () => {
                    clearTimeout(closeTimer);
                    closeTimer = setTimeout(sync, CLOSE_DELAY);
                }
            );

            // keyboard: mobileNav toggles .item-focused on the arrow button
            new MutationObserver(
                () => {
                    if (desktop.matches) { sync();
                    }
                }
            ).observe(item, { attributes: true, attributeFilter: ['class'] });
        }
    );

    desktop.addEventListener(
        'change', () => {
            panel.classList.remove(OPEN_CLASS);
        }
    );
}
