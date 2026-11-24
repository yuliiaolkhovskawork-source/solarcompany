// mega menu masonry: items of .item-drop-list > ul (1px grid rows) span their own height, so lower rows pack up
const GAP = 16; // px, vertical space between items

export default function initMegaMenuMasonry()
{
    const items = [...document.querySelectorAll('.item-drop-list > ul > li')];

    if (!items.length) { return;
    }

    const desktop = window.matchMedia('(min-width: 1366px)');

    const layout = (item) => {
        item.style.gridRowEnd = desktop.matches ? `span ${item.offsetHeight + GAP}` : '';
    };

    // item height depends on column width, fonts and content
    const observer = new ResizeObserver((entries) => entries.forEach((entry) => layout(entry.target)));

    items.forEach((item) => observer.observe(item));
    desktop.addEventListener('change', () => items.forEach(layout));
}
