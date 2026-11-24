import Headroom from 'headroom.js';

export default function initHeaderHideShow() {
	const header = document.querySelector('#header');
	const noAnimateClass = 'no-animate';
	const navActiveClass = 'nav-active';

	if (!header) return;

	const headroom = new Headroom(header, {
		offset: 200,
		onNotTop: () => {
			header.classList.add(noAnimateClass);

			setTimeout(() => {
				header.classList.remove(noAnimateClass);
			}, 100);
		}
	});

	headroom.init();

	// iOS scrolls the window on input focus even with overflow hidden; keep header state while mobile nav is open
	new MutationObserver(() => {
		if (document.body.classList.contains(navActiveClass)) {
			headroom.freeze();
		} else {
			headroom.unfreeze();
		}
	}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
