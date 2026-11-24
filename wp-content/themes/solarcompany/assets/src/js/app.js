import ready, { HTML } from 'Utils';

import initAos from './components/aos';
import initAccordion from './components/accordion';
import initCookiePopup from './components/cookiePopup';
import initCountUp from './components/countUp';
import initFancybox from './components/fancybox';
import initHeadroom from './components/headroom';
import initMegaMenuBloom from './components/megaMenuBloom';
import initMegaMenuMasonry from './components/megaMenuMasonry';
import initMobileNav from './components/mobileNav';
import initOpenClose from './components/openClose';
import initSimpleBar from './components/simpleBar';
import initSwiperCarousel from './components/swiper';
import initVideo from './components/video';

ready(() => {
	HTML.classList.add('is-loaded');

	initMobileNav();
	initMegaMenuBloom();
	initMegaMenuMasonry();
	initHeadroom();
	initAccordion();
	initFancybox();
	initSwiperCarousel();
	initCookiePopup();
	initSimpleBar();
	initOpenClose();
	initAos();

	document.body.classList.add('loaded');
});

jQuery(window).on('load', () => {
	initVideo();
	initCountUp();
});

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
	document.body.classList.add('is-touch-device');
}
