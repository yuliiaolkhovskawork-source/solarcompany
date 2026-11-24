import Swiper from 'swiper/bundle';

// Scroll slides while the cursor rests on the left/right edge of the slider
function initHoverScroll(swiper, holder) {
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

	let direction = null;
	let frameId = null;
	let lastTime = null;

	const stop = () => {
		direction = null;
		lastTime = null;
		cancelAnimationFrame(frameId);
	};

	// Move the wrapper by a constant speed every frame, so leaving the zone just stops it in place
	const tick = (time) => {
		if (!direction || swiper.destroyed) return;

		// Same pace as the navigation buttons: one slide (plus gap) per `speed` ms
		const slideSize = swiper.slidesSizesGrid[swiper.activeIndex] + swiper.params.spaceBetween;
		const delta = lastTime === null ? 0 : ((time - lastTime) * slideSize) / swiper.params.speed;
		const shift = direction === 'next' ? -delta : delta;
		const next = swiper.getTranslate() + shift;
		// Without loop, stay within the first/last slide bounds
		const translate = swiper.params.loop ? next : Math.min(swiper.minTranslate(), Math.max(swiper.maxTranslate(), next));

		lastTime = time;
		swiper.setTranslate(translate);
		swiper.updateProgress(translate);
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
		swiper.navigation?.update();

		if (swiper.params.loop) {
			// Jump to the matching original slide before running out of loop duplicates
			if (swiper.activeIndex < swiper.loopedSlides || swiper.activeIndex >= swiper.slides.length - swiper.loopedSlides) {
				swiper.loopFix();
			}
		} else if (delta > 0 && translate !== next) {
			stop();
			return;
		}

		frameId = requestAnimationFrame(tick);
	};

	// Slides move away from the hovered edge: right edge -> next, left edge -> prev
	[
		['left', 'prev'],
		['right', 'next']
	].forEach(([side, dir]) => {
		const zone = document.createElement('span');

		zone.className = `slider-hover-zone slider-hover-zone--${side}`;
		zone.setAttribute('aria-hidden', 'true');
		holder.appendChild(zone);

		zone.addEventListener('mouseenter', () => {
			stop();
			direction = dir;
			// Interrupt a running navigation transition and continue from the current position
			swiper.setTransition(0);
			swiper.animating = false;
			frameId = requestAnimationFrame(tick);
		});

		zone.addEventListener('mouseleave', stop);
	});
}

// Initialize Swiper
export default function initSwiperCarousel() {
	document.querySelectorAll('.hero-slider').forEach((holder) => {
		new Swiper(holder, {
			a11y: true,
			speed: 2000,
			loop: true,
			navigation: {
				nextEl: holder.querySelector('.swiper-button-next'),
				prevEl: holder.querySelector('.swiper-button-prev')
			},
			autoplay: {
				delay: 8000,
				disableOnInteraction: false
			}
		});
	});

	document.querySelectorAll('.post-slider').forEach((holder) => {
		const section = holder.closest('.section-slider') || holder.parentElement;

		const swiper = new Swiper(holder, {
			a11y: true,
			loop: false,
			speed: 1500,
			spaceBetween: 20,
			freeMode: true,
			slidesPerView: 'auto',
			navigation: {
				nextEl: section.querySelector('.swiper-button-next'),
				prevEl: section.querySelector('.swiper-button-prev')
			}
		});

		initHoverScroll(swiper, holder);
	});
}
