import { Fancybox } from '@fancyapps/ui';

export default function initFancybox() {
	Fancybox.bind('[data-fancybox]', {
		trapFocus: false,
		on: {
			done: (fancybox) => {
				const focusableElements = fancybox.container.querySelectorAll(
					"button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex='-1'])"
				);

				const firstMenuItem = focusableElements[0];
				const lastMenuItem = focusableElements[focusableElements.length - 1];

				document.addEventListener('keydown', (e) => {
					const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
					const isShiftPressed = e.shiftKey;

					if (isTabPressed) {
						if (isShiftPressed) {
							if (e.target === firstMenuItem) {
								e.preventDefault();
								lastMenuItem.focus();
							}
						} else {
							if (e.target === lastMenuItem) {
								e.preventDefault();
								firstMenuItem.focus();
							}
						}
					}
				});
			}
		}
	});
}