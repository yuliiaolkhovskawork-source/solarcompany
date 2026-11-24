import '../plugins/openClosePlugin';

// open-close init
export default function initOpenClose() {
	jQuery('.search-block').openClose({
		activeClass: 'active',
		opener: '.search-opener',
		slider: '.search-slider',
		animSpeed: 400,
		effect: 'fade',
		hideOnClickOutside: true
	});
}
