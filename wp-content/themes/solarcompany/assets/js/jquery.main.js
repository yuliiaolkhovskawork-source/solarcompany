jQuery(function () {
	initMobileNav();
	initHeaderHideShow();
	initAccordion();
	initFancybox();
	initVideo();
	initSwiperCarousel();
	initOpenClose();

	document.body.classList.add('loaded');
});

// open-close init
function initOpenClose() {
	jQuery('.search-block').openClose({
		activeClass: 'active',
		opener: '.search-opener',
		slider: '.search-slider',
		animSpeed: 400,
		effect: 'slide',
		hideOnClickOutside: true
	});
}

// Initialize Swiper
function initSwiperCarousel() {
	const sliders = document.querySelectorAll('.hero-slider');

	if (!sliders.length) return;

	sliders.forEach((holder) => {
		const swiper = new Swiper(holder, {
			speed: 2000,
			loop: true,
			navigation: {
				nextEl: holder.querySelector('.swiper-button-next'),
				prevEl: holder.querySelector('.swiper-button-prev')
			},
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			}
		});
	});
}

function initFancybox() {
	Fancybox.bind('[data-fancybox]', {
		trapFocus: false,
		on: {
			done: (fancybox) => {
				const focusableElements = fancybox.container.querySelectorAll("button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex='-1'])");
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

// accordion menu init
function initAccordion() {
	jQuery('.accordion').slideAccordion({
		opener: '.opener',
		slider: '.slide',
		animSpeed: 300,
		scrollToActiveItem: {
			enable: true,
			extraOffset: 0
		}
	});
}

function initHeaderHideShow() {
	const header = document.querySelector('#header');
	const noAnimateClass = 'no-animate';

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
}

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}

// Video init
function initVideo() {
	const playingClass = 'playing';
	const pauseClass = 'pause';

	document.querySelectorAll('.video-block').forEach((holder) => {
		const video = holder.querySelector('video');
		const playButton = holder.querySelector('.btn-play');

		if (!video || !playButton) return;

		playButton.addEventListener('click', () => {
			video.play();
		});

		video.addEventListener('play', () => {
			holder.classList.add(playingClass);
			holder.classList.remove(pauseClass);
		});

		video.addEventListener('pause', () => {
			holder.classList.add(pauseClass);
		});

		video.addEventListener('ended', () => {
			holder.classList.remove(playingClass);
		});
	});
}

/*
 * Simple Mobile Navigation
 */
(function ($) {
	function MobileNav(options) {
		this.options = $.extend(
			{
				container: null,
				hideOnClickOutside: false,
				menuActiveClass: 'nav-active',
				menuOpener: '.nav-opener',
				menuDrop: '.nav-drop',
				toggleEvent: 'click',
				outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
			},
			options
		);
		this.initStructure();
		this.attachEvents();
		this.makeCallback('onInit');
	}
	MobileNav.prototype = {
		initStructure: function () {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener).attr('aria-expanded', this.isOpened());
			this.drop = this.container.find(this.options.menuDrop).attr('aria-hidden', !this.isOpened());
		},
		attachEvents: function () {
			var self = this;

			if (activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function (e) {
				if (self.isOpened()) {
					var target = $(e.target);
					if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function (e) {
				e.preventDefault();

				self.toggle();
			};

			this.onFocusIn = function (e) {
				clearTimeout(self.blurTimer);
				self.inFocus = true;
				self.drop.addClass('in-focus');
				self.makeCallback('onFocusIn');
			};

			this.onFocusOut = function (e) {
				clearTimeout(self.blurTimer);

				self.blurTimer = setTimeout(function () {
					const $focusedElem = $(document.activeElement);

					if (!$focusedElem.closest(self.drop).length && !$focusedElem.closest(self.opener).length) {
						self.inFocus = false;
						self.hide();
						self.makeCallback('onFocusOut');
					}
				}, 100);
			};

			this.onKeyup = function (e) {
				if (e.which == 27) {
					self.hide();
					self.opener.focus();
				}
			};

			this.drop.on('focusin', this.onFocusIn);
			this.drop.on('focusout', this.onFocusOut);

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function () {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function () {
			this.container.addClass(this.options.menuActiveClass);
			this.opener.attr('aria-expanded', 'true');
			this.drop.attr('aria-hidden', 'false');

			if (this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
			this.page.on('keyup', this.onKeyup);

			this.makeCallback('onShow');
		},
		hide: function () {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.attr('aria-expanded', 'false');
			this.drop.attr('aria-hidden', 'true').removeClass('in-focus');

			if (this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
			this.page.off('keyup', this.onKeyup);

			this.makeCallback('onHide');
		},
		toggle: function () {
			if (this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},

		makeCallback: function (name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function () {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler).removeAttr('aria-expanded');
			this.drop.off('focusin', this.onFocusIn).off('focusout', this.onFocusOut).removeAttr('aria-hidden');
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler).off('keyup', this.onKeyup);
		}
	};

	var activateResizeHandler = function () {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag,
			timer;
		var removeClassHandler = function () {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function () {
			if (!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function (opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function () {
			var $container = jQuery(this);
			var instance = $container.data('MobileNav');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$container.data(
					'MobileNav',
					new MobileNav(
						$.extend(
							{
								container: this
							},
							opt
						)
					)
				);
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
})(jQuery);

/*
 * jQuery Accordion plugin new
 */
(function (root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.SlideAccordion = factory(jQuery);
	}
})(window, function ($) {
	'use strict';
	var accHiddenClass = 'js-acc-hidden';

	function SlideAccordion(options) {
		this.options = $.extend(
			true,
			{
				allowClickWhenExpanded: false,
				activeClass: 'active',
				opener: '.opener',
				slider: '.slide',
				animSpeed: 300,
				collapsible: true,
				event: 'click',
				scrollToActiveItem: {
					enable: false,
					breakpoint: 767, // max-width
					animSpeed: 600,
					extraOffset: null
				}
			},
			options
		);
		this.init();
	}

	SlideAccordion.prototype = {
		init: function () {
			if (this.options.holder) {
				this.findElements();
				this.setStateOnInit();
				this.attachEvents();
				this.makeCallback('onInit');
			}
		},

		findElements: function () {
			this.$holder = $(this.options.holder).data('SlideAccordion', this);
			this.$items = this.$holder.find(':has(' + this.options.slider + ')');
		},

		setStateOnInit: function () {
			var self = this;

			this.$items.each(function () {
				if (!$(this).hasClass(self.options.activeClass)) {
					$(this).find(self.options.slider).addClass(accHiddenClass);
				}
			});
		},

		attachEvents: function () {
			var self = this;

			this.accordionToggle = function (e) {
				var $item = jQuery(this).closest(self.$items);
				var $actiItem = self.getActiveItem($item);

				if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
					e.preventDefault();
					self.toggle($item, $actiItem);
				}
			};

			this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
		},

		toggle: function ($item, $prevItem) {
			if (!$item.hasClass(this.options.activeClass)) {
				this.show($item);
			} else if (this.options.collapsible) {
				this.hide($item);
			}

			if (!$item.is($prevItem) && $prevItem.length) {
				this.hide($prevItem);
			}

			this.makeCallback('beforeToggle');
		},

		show: function ($item) {
			var $slider = $item.find(this.options.slider);

			$item.addClass(this.options.activeClass);
			$slider
				.stop()
				.hide()
				.removeClass(accHiddenClass)
				.slideDown({
					duration: this.options.animSpeed,
					complete: function () {
						$slider.removeAttr('style');
						if (this.options.scrollToActiveItem.enable && window.innerWidth <= this.options.scrollToActiveItem.breakpoint) {
							this.goToItem($item);
						}
						this.makeCallback('onShow', $item);
					}.bind(this)
				});

			this.makeCallback('beforeShow', $item);
		},

		hide: function ($item) {
			var $slider = $item.find(this.options.slider);

			$item.removeClass(this.options.activeClass);
			$slider
				.stop()
				.show()
				.slideUp({
					duration: this.options.animSpeed,
					complete: function () {
						$slider.addClass(accHiddenClass);
						$slider.removeAttr('style');
						this.makeCallback('onHide', $item);
					}.bind(this)
				});

			this.makeCallback('beforeHide', $item);
		},

		goToItem: function ($item) {
			var itemOffset = $item.offset().top;

			if (itemOffset < $(window).scrollTop()) {
				// handle extra offset
				if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset;
				} else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset();
				}

				$('body, html').animate(
					{
						scrollTop: itemOffset
					},
					this.options.scrollToActiveItem.animSpeed
				);
			}
		},

		getActiveItem: function ($item) {
			return $item.siblings().filter('.' + this.options.activeClass);
		},

		makeCallback: function (name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function () {
			this.$holder.removeData('SlideAccordion');
			this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
			this.$items.removeClass(this.options.activeClass).each(
				function (i, item) {
					$(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
				}.bind(this)
			);
			this.makeCallback('onDestroy');
		}
	};

	$.fn.slideAccordion = function (opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function () {
			var $holder = jQuery(this);
			var instance = $holder.data('SlideAccordion');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				new SlideAccordion(
					$.extend(
						true,
						{
							holder: this
						},
						opt
					)
				);
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};

	(function () {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + accHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	})();

	return SlideAccordion;
});

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function () {
	let handlers = [];
	let prevWinWidth;
	let nativeMatchMedia = false;
	let winWidth = window.innerWidth;

	// detect match media support
	if (window.matchMedia) {
		if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if (window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		winWidth = window.innerWidth;

		if (winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			for (let key in handlers) {
				const rangeObject = handlers[key];

				// disable current active area if needed
				for (let property in rangeObject.data) {
					let item = rangeObject.data[property];

					if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;

						if (typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				}

				// enable areas that match current width
				for (let property in rangeObject.data) {
					let item = rangeObject.data[property];

					if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;

						if (typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				}
			}
		}
	}

	window.addEventListener('load', resizeHandler);
	window.addEventListener('resize', resizeHandler);
	window.addEventListener('orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		let mediaQueryString = '';

		if (r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}

		if (r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
		}

		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if (window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if (window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if (window.media) {
			return window.media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		const rangeData = rangeStr.split('..');
		const x1 = parseInt(rangeData[0], 10) || -Infinity;
		const x2 = parseInt(rangeData[1], 10) || Infinity;

		return [x1, x2].sort(function (a, b) {
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function (ranges) {
			// parse data and add items to collection
			let result = {
				data: {}
			};

			for (let key in ranges) {
				result.data[key] = {
					range: parseRange(key),
					enableCallback: ranges[key].on,
					disableCallback: ranges[key].off
				};
			}

			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
})();

!(function (t, e) {
	'object' == typeof exports && 'undefined' != typeof module ? e(exports) : 'function' == typeof define && define.amd ? define(['exports'], e) : e(((t = 'undefined' != typeof globalThis ? globalThis : t || self).window = t.window || {}));
})(this, function (t) {
	'use strict';
	const e = (t, e = 1e4) => ((t = parseFloat(t + '') || 0), Math.round((t + Number.EPSILON) * e) / e),
		i = function (t) {
			if (!(t && t instanceof Element && t.offsetParent)) return !1;
			const e = t.scrollHeight > t.clientHeight,
				i = window.getComputedStyle(t).overflowY,
				n = -1 !== i.indexOf('hidden'),
				s = -1 !== i.indexOf('visible');
			return e && !n && !s;
		},
		n = function (t, e = void 0) {
			return !(!t || t === document.body || (e && t === e)) && (i(t) ? t : n(t.parentElement, e));
		},
		s = function (t) {
			var e = new DOMParser().parseFromString(t, 'text/html').body;
			if (e.childElementCount > 1) {
				for (var i = document.createElement('div'); e.firstChild; ) i.appendChild(e.firstChild);
				return i;
			}
			return e.firstChild;
		},
		o = (t) => `${t || ''}`.split(' ').filter((t) => !!t),
		a = (t, e, i) => {
			t &&
				o(e).forEach((e) => {
					t.classList.toggle(e, i || !1);
				});
		};
	class r {
		constructor(t) {
			Object.defineProperty(this, 'pageX', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'pageY', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'clientX', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'clientY', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'id', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'time', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'nativePointer', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				(this.nativePointer = t),
				(this.pageX = t.pageX),
				(this.pageY = t.pageY),
				(this.clientX = t.clientX),
				(this.clientY = t.clientY),
				(this.id = self.Touch && t instanceof Touch ? t.identifier : -1),
				(this.time = Date.now());
		}
	}
	const l = { passive: !1 };
	class c {
		constructor(t, { start: e = () => !0, move: i = () => {}, end: n = () => {} }) {
			Object.defineProperty(this, 'element', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'startCallback', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'moveCallback', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'endCallback', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'currentPointers', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				Object.defineProperty(this, 'startPointers', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				(this.element = t),
				(this.startCallback = e),
				(this.moveCallback = i),
				(this.endCallback = n);
			for (const t of ['onPointerStart', 'onTouchStart', 'onMove', 'onTouchEnd', 'onPointerEnd', 'onWindowBlur']) this[t] = this[t].bind(this);
			this.element.addEventListener('mousedown', this.onPointerStart, l), this.element.addEventListener('touchstart', this.onTouchStart, l), this.element.addEventListener('touchmove', this.onMove, l), this.element.addEventListener('touchend', this.onTouchEnd), this.element.addEventListener('touchcancel', this.onTouchEnd);
		}
		onPointerStart(t) {
			if (!t.buttons || 0 !== t.button) return;
			const e = new r(t);
			this.currentPointers.some((t) => t.id === e.id) || (this.triggerPointerStart(e, t) && (window.addEventListener('mousemove', this.onMove), window.addEventListener('mouseup', this.onPointerEnd), window.addEventListener('blur', this.onWindowBlur)));
		}
		onTouchStart(t) {
			for (const e of Array.from(t.changedTouches || [])) this.triggerPointerStart(new r(e), t);
			window.addEventListener('blur', this.onWindowBlur);
		}
		onMove(t) {
			const e = this.currentPointers.slice(),
				i = 'changedTouches' in t ? Array.from(t.changedTouches || []).map((t) => new r(t)) : [new r(t)],
				n = [];
			for (const t of i) {
				const e = this.currentPointers.findIndex((e) => e.id === t.id);
				e < 0 || (n.push(t), (this.currentPointers[e] = t));
			}
			n.length && this.moveCallback(t, this.currentPointers.slice(), e);
		}
		onPointerEnd(t) {
			(t.buttons > 0 && 0 !== t.button) || (this.triggerPointerEnd(t, new r(t)), window.removeEventListener('mousemove', this.onMove), window.removeEventListener('mouseup', this.onPointerEnd), window.removeEventListener('blur', this.onWindowBlur));
		}
		onTouchEnd(t) {
			for (const e of Array.from(t.changedTouches || [])) this.triggerPointerEnd(t, new r(e));
		}
		triggerPointerStart(t, e) {
			return !!this.startCallback(e, t, this.currentPointers.slice()) && (this.currentPointers.push(t), this.startPointers.push(t), !0);
		}
		triggerPointerEnd(t, e) {
			const i = this.currentPointers.findIndex((t) => t.id === e.id);
			i < 0 || (this.currentPointers.splice(i, 1), this.startPointers.splice(i, 1), this.endCallback(t, e, this.currentPointers.slice()));
		}
		onWindowBlur() {
			this.clear();
		}
		clear() {
			for (; this.currentPointers.length; ) {
				const t = this.currentPointers[this.currentPointers.length - 1];
				this.currentPointers.splice(this.currentPointers.length - 1, 1), this.startPointers.splice(this.currentPointers.length - 1, 1), this.endCallback(new Event('touchend', { bubbles: !0, cancelable: !0, clientX: t.clientX, clientY: t.clientY }), t, this.currentPointers.slice());
			}
		}
		stop() {
			this.element.removeEventListener('mousedown', this.onPointerStart, l),
				this.element.removeEventListener('touchstart', this.onTouchStart, l),
				this.element.removeEventListener('touchmove', this.onMove, l),
				this.element.removeEventListener('touchend', this.onTouchEnd),
				this.element.removeEventListener('touchcancel', this.onTouchEnd),
				window.removeEventListener('mousemove', this.onMove),
				window.removeEventListener('mouseup', this.onPointerEnd),
				window.removeEventListener('blur', this.onWindowBlur);
		}
	}
	function h(t, e) {
		return e ? Math.sqrt(Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2)) : 0;
	}
	function d(t, e) {
		return e ? { clientX: (t.clientX + e.clientX) / 2, clientY: (t.clientY + e.clientY) / 2 } : t;
	}
	const u = (t) => 'object' == typeof t && null !== t && t.constructor === Object && '[object Object]' === Object.prototype.toString.call(t),
		p = (t, ...e) => {
			const i = e.length;
			for (let n = 0; n < i; n++) {
				const i = e[n] || {};
				Object.entries(i).forEach(([e, i]) => {
					const n = Array.isArray(i) ? [] : {};
					t[e] || Object.assign(t, { [e]: n }), u(i) ? Object.assign(t[e], p(n, i)) : Array.isArray(i) ? Object.assign(t, { [e]: [...i] }) : Object.assign(t, { [e]: i });
				});
			}
			return t;
		},
		f = function (t, e) {
			return t.split('.').reduce((t, e) => ('object' == typeof t ? t[e] : void 0), e);
		};
	class g {
		constructor(t = {}) {
			Object.defineProperty(this, 'options', { enumerable: !0, configurable: !0, writable: !0, value: t }), Object.defineProperty(this, 'events', { enumerable: !0, configurable: !0, writable: !0, value: new Map() }), this.setOptions(t);
			for (const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) t.startsWith('on') && 'function' == typeof this[t] && (this[t] = this[t].bind(this));
		}
		setOptions(t) {
			this.options = t ? p({}, this.constructor.defaults, t) : {};
			for (const [t, e] of Object.entries(this.option('on') || {})) this.on(t, e);
		}
		option(t, ...e) {
			let i = f(t, this.options);
			return i && 'function' == typeof i && (i = i.call(this, this, ...e)), i;
		}
		optionFor(t, e, i, ...n) {
			let s = f(e, t);
			var o;
			'string' != typeof (o = s) || isNaN(o) || isNaN(parseFloat(o)) || (s = parseFloat(s)), 'true' === s && (s = !0), 'false' === s && (s = !1), s && 'function' == typeof s && (s = s.call(this, this, t, ...n));
			let a = f(e, this.options);
			return a && 'function' == typeof a ? (s = a.call(this, this, t, ...n, s)) : void 0 === s && (s = a), void 0 === s ? i : s;
		}
		cn(t) {
			const e = this.options.classes;
			return (e && e[t]) || '';
		}
		localize(t, e = []) {
			t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, (t, e, i) => {
				let n = '';
				return i ? (n = this.option(`${e[0] + e.toLowerCase().substring(1)}.l10n.${i}`)) : e && (n = this.option(`l10n.${e}`)), n || (n = t), n;
			});
			for (let i = 0; i < e.length; i++) t = t.split(e[i][0]).join(e[i][1]);
			return (t = t.replace(/\{\{(.*?)\}\}/g, (t, e) => e));
		}
		on(t, e) {
			let i = [];
			'string' == typeof t ? (i = t.split(' ')) : Array.isArray(t) && (i = t),
				this.events || (this.events = new Map()),
				i.forEach((t) => {
					let i = this.events.get(t);
					i || (this.events.set(t, []), (i = [])), i.includes(e) || i.push(e), this.events.set(t, i);
				});
		}
		off(t, e) {
			let i = [];
			'string' == typeof t ? (i = t.split(' ')) : Array.isArray(t) && (i = t),
				i.forEach((t) => {
					const i = this.events.get(t);
					if (Array.isArray(i)) {
						const t = i.indexOf(e);
						t > -1 && i.splice(t, 1);
					}
				});
		}
		emit(t, ...e) {
			[...(this.events.get(t) || [])].forEach((t) => t(this, ...e)), '*' !== t && this.emit('*', t, ...e);
		}
	}
	Object.defineProperty(g, 'version', { enumerable: !0, configurable: !0, writable: !0, value: '5.0.36' }), Object.defineProperty(g, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: {} });
	class m extends g {
		constructor(t = {}) {
			super(t), Object.defineProperty(this, 'plugins', { enumerable: !0, configurable: !0, writable: !0, value: {} });
		}
		attachPlugins(t = {}) {
			const e = new Map();
			for (const [i, n] of Object.entries(t)) {
				const t = this.option(i),
					s = this.plugins[i];
				s || !1 === t ? s && !1 === t && (s.detach(), delete this.plugins[i]) : e.set(i, new n(this, t || {}));
			}
			for (const [t, i] of e) (this.plugins[t] = i), i.attach();
		}
		detachPlugins(t) {
			t = t || Object.keys(this.plugins);
			for (const e of t) {
				const t = this.plugins[e];
				t && t.detach(), delete this.plugins[e];
			}
			return this.emit('detachPlugins'), this;
		}
	}
	var v;
	!(function (t) {
		(t[(t.Init = 0)] = 'Init'), (t[(t.Error = 1)] = 'Error'), (t[(t.Ready = 2)] = 'Ready'), (t[(t.Panning = 3)] = 'Panning'), (t[(t.Mousemove = 4)] = 'Mousemove'), (t[(t.Destroy = 5)] = 'Destroy');
	})(v || (v = {}));
	const b = ['a', 'b', 'c', 'd', 'e', 'f'],
		y = { PANUP: 'Move up', PANDOWN: 'Move down', PANLEFT: 'Move left', PANRIGHT: 'Move right', ZOOMIN: 'Zoom in', ZOOMOUT: 'Zoom out', TOGGLEZOOM: 'Toggle zoom level', TOGGLE1TO1: 'Toggle zoom level', ITERATEZOOM: 'Toggle zoom level', ROTATECCW: 'Rotate counterclockwise', ROTATECW: 'Rotate clockwise', FLIPX: 'Flip horizontally', FLIPY: 'Flip vertically', FITX: 'Fit horizontally', FITY: 'Fit vertically', RESET: 'Reset', TOGGLEFS: 'Toggle fullscreen' },
		w = {
			content: null,
			width: 'auto',
			height: 'auto',
			panMode: 'drag',
			touch: !0,
			dragMinThreshold: 3,
			lockAxis: !1,
			mouseMoveFactor: 1,
			mouseMoveFriction: 0.12,
			zoom: !0,
			pinchToZoom: !0,
			panOnlyZoomed: 'auto',
			minScale: 1,
			maxScale: 2,
			friction: 0.25,
			dragFriction: 0.35,
			decelFriction: 0.05,
			click: 'toggleZoom',
			dblClick: !1,
			wheel: 'zoom',
			wheelLimit: 7,
			spinner: !0,
			bounds: 'auto',
			infinite: !1,
			rubberband: !0,
			bounce: !0,
			maxVelocity: 75,
			transformParent: !1,
			classes: { content: 'f-panzoom__content', isLoading: 'is-loading', canZoomIn: 'can-zoom_in', canZoomOut: 'can-zoom_out', isDraggable: 'is-draggable', isDragging: 'is-dragging', inFullscreen: 'in-fullscreen', htmlHasFullscreen: 'with-panzoom-in-fullscreen' },
			l10n: y
		},
		x = '<circle cx="25" cy="25" r="20"></circle>',
		E = '<div class="f-spinner"><svg viewBox="0 0 50 50">' + x + x + '</svg></div>',
		S = (t) => t && null !== t && t instanceof Element && 'nodeType' in t,
		P = (t, e) => {
			t &&
				o(e).forEach((e) => {
					t.classList.remove(e);
				});
		},
		C = (t, e) => {
			t &&
				o(e).forEach((e) => {
					t.classList.add(e);
				});
		},
		T = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
		M = 1e5,
		O = 1e4,
		A = 'mousemove',
		L = 'drag',
		z = 'content',
		R = 'auto';
	let k = null,
		I = null;
	class D extends m {
		get fits() {
			return this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1;
		}
		get isTouchDevice() {
			return null === I && (I = window.matchMedia('(hover: none)').matches), I;
		}
		get isMobile() {
			return null === k && (k = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)), k;
		}
		get panMode() {
			return this.options.panMode !== A || this.isTouchDevice ? L : A;
		}
		get panOnlyZoomed() {
			const t = this.options.panOnlyZoomed;
			return t === R ? this.isTouchDevice : t;
		}
		get isInfinite() {
			return this.option('infinite');
		}
		get angle() {
			return (180 * Math.atan2(this.current.b, this.current.a)) / Math.PI || 0;
		}
		get targetAngle() {
			return (180 * Math.atan2(this.target.b, this.target.a)) / Math.PI || 0;
		}
		get scale() {
			const { a: t, b: e } = this.current;
			return Math.sqrt(t * t + e * e) || 1;
		}
		get targetScale() {
			const { a: t, b: e } = this.target;
			return Math.sqrt(t * t + e * e) || 1;
		}
		get minScale() {
			return this.option('minScale') || 1;
		}
		get fullScale() {
			const { contentRect: t } = this;
			return t.fullWidth / t.fitWidth || 1;
		}
		get maxScale() {
			return this.fullScale * (this.option('maxScale') || 1) || 1;
		}
		get coverScale() {
			const { containerRect: t, contentRect: e } = this,
				i = Math.max(t.height / e.fitHeight, t.width / e.fitWidth) || 1;
			return Math.min(this.fullScale, i);
		}
		get isScaling() {
			return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting;
		}
		get isContentLoading() {
			const t = this.content;
			return !!(t && t instanceof HTMLImageElement) && !t.complete;
		}
		get isResting() {
			if (this.isBouncingX || this.isBouncingY) return !1;
			for (const t of b) {
				const e = 'e' == t || 'f' === t ? 1e-4 : 1e-5;
				if (Math.abs(this.target[t] - this.current[t]) > e) return !1;
			}
			return !(!this.ignoreBounds && !this.checkBounds().inBounds);
		}
		constructor(t, e = {}, i = {}) {
			var n;
			if (
				(super(e),
				Object.defineProperty(this, 'pointerTracker', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'resizeObserver', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'updateTimer', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'clickTimer', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'rAF', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'isTicking', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'ignoreBounds', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'isBouncingX', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'isBouncingY', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'clicks', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'trackingPoints', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				Object.defineProperty(this, 'pwt', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'cwd', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'pmme', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'friction', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: v.Init }),
				Object.defineProperty(this, 'isDragging', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'content', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'spinner', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'containerRect', { enumerable: !0, configurable: !0, writable: !0, value: { width: 0, height: 0, innerWidth: 0, innerHeight: 0 } }),
				Object.defineProperty(this, 'contentRect', { enumerable: !0, configurable: !0, writable: !0, value: { top: 0, right: 0, bottom: 0, left: 0, fullWidth: 0, fullHeight: 0, fitWidth: 0, fitHeight: 0, width: 0, height: 0 } }),
				Object.defineProperty(this, 'dragStart', { enumerable: !0, configurable: !0, writable: !0, value: { x: 0, y: 0, top: 0, left: 0, time: 0 } }),
				Object.defineProperty(this, 'dragOffset', { enumerable: !0, configurable: !0, writable: !0, value: { x: 0, y: 0, time: 0 } }),
				Object.defineProperty(this, 'current', { enumerable: !0, configurable: !0, writable: !0, value: Object.assign({}, T) }),
				Object.defineProperty(this, 'target', { enumerable: !0, configurable: !0, writable: !0, value: Object.assign({}, T) }),
				Object.defineProperty(this, 'velocity', { enumerable: !0, configurable: !0, writable: !0, value: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 } }),
				Object.defineProperty(this, 'lockedAxis', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				!t)
			)
				throw new Error('Container Element Not Found');
			(this.container = t), this.initContent(), this.attachPlugins(Object.assign(Object.assign({}, D.Plugins), i)), this.emit('attachPlugins'), this.emit('init');
			const o = this.content;
			if ((o.addEventListener('load', this.onLoad), o.addEventListener('error', this.onError), this.isContentLoading)) {
				if (this.option('spinner')) {
					t.classList.add(this.cn('isLoading'));
					const e = s(E);
					!t.contains(o) || o.parentElement instanceof HTMLPictureElement ? (this.spinner = t.appendChild(e)) : (this.spinner = (null === (n = o.parentElement) || void 0 === n ? void 0 : n.insertBefore(e, o)) || null);
				}
				this.emit('beforeLoad');
			} else
				queueMicrotask(() => {
					this.enable();
				});
		}
		initContent() {
			const { container: t } = this,
				e = this.cn(z);
			let i = this.option(z) || t.querySelector(`.${e}`);
			if ((i || ((i = t.querySelector('img,picture') || t.firstElementChild), i && C(i, e)), i instanceof HTMLPictureElement && (i = i.querySelector('img')), !i)) throw new Error('No content found');
			this.content = i;
		}
		onLoad() {
			const { spinner: t, container: e, state: i } = this;
			t && (t.remove(), (this.spinner = null)), this.option('spinner') && e.classList.remove(this.cn('isLoading')), this.emit('afterLoad'), i === v.Init ? this.enable() : this.updateMetrics();
		}
		onError() {
			this.state !== v.Destroy && (this.spinner && (this.spinner.remove(), (this.spinner = null)), this.stop(), this.detachEvents(), (this.state = v.Error), this.emit('error'));
		}
		getNextScale(t) {
			const { fullScale: e, targetScale: i, coverScale: n, maxScale: s, minScale: o } = this;
			let a = o;
			switch (t) {
				case 'toggleMax':
					a = i - o < 0.5 * (s - o) ? s : o;
					break;
				case 'toggleCover':
					a = i - o < 0.5 * (n - o) ? n : o;
					break;
				case 'toggleZoom':
					a = i - o < 0.5 * (e - o) ? e : o;
					break;
				case 'iterateZoom':
					let t = [1, e, s].sort((t, e) => t - e),
						r = t.findIndex((t) => t > i + 1e-5);
					a = t[r] || 1;
			}
			return a;
		}
		attachObserver() {
			var t;
			const e = () => {
				const { container: t, containerRect: e } = this;
				return Math.abs(e.width - t.getBoundingClientRect().width) > 0.1 || Math.abs(e.height - t.getBoundingClientRect().height) > 0.1;
			};
			this.resizeObserver ||
				void 0 === window.ResizeObserver ||
				(this.resizeObserver = new ResizeObserver(() => {
					this.updateTimer ||
						(e()
							? (this.onResize(),
							  this.isMobile &&
									(this.updateTimer = setTimeout(() => {
										e() && this.onResize(), (this.updateTimer = null);
									}, 500)))
							: this.updateTimer && (clearTimeout(this.updateTimer), (this.updateTimer = null)));
				})),
				null === (t = this.resizeObserver) || void 0 === t || t.observe(this.container);
		}
		detachObserver() {
			var t;
			null === (t = this.resizeObserver) || void 0 === t || t.disconnect();
		}
		attachEvents() {
			const { container: t } = this;
			t.addEventListener('click', this.onClick, { passive: !1, capture: !1 }), t.addEventListener('wheel', this.onWheel, { passive: !1 }), (this.pointerTracker = new c(t, { start: this.onPointerDown, move: this.onPointerMove, end: this.onPointerUp })), document.addEventListener(A, this.onMouseMove);
		}
		detachEvents() {
			var t;
			const { container: e } = this;
			e.removeEventListener('click', this.onClick, { passive: !1, capture: !1 }),
				e.removeEventListener('wheel', this.onWheel, { passive: !1 }),
				null === (t = this.pointerTracker) || void 0 === t || t.stop(),
				(this.pointerTracker = null),
				document.removeEventListener(A, this.onMouseMove),
				document.removeEventListener('keydown', this.onKeydown, !0),
				this.clickTimer && (clearTimeout(this.clickTimer), (this.clickTimer = null)),
				this.updateTimer && (clearTimeout(this.updateTimer), (this.updateTimer = null));
		}
		animate() {
			this.setTargetForce();
			const t = this.friction,
				e = this.option('maxVelocity');
			for (const i of b) t ? ((this.velocity[i] *= 1 - t), e && !this.isScaling && (this.velocity[i] = Math.max(Math.min(this.velocity[i], e), -1 * e)), (this.current[i] += this.velocity[i])) : (this.current[i] = this.target[i]);
			this.setTransform(), this.setEdgeForce(), !this.isResting || this.isDragging ? (this.rAF = requestAnimationFrame(() => this.animate())) : this.stop('current');
		}
		setTargetForce() {
			for (const t of b) ('e' === t && this.isBouncingX) || ('f' === t && this.isBouncingY) || (this.velocity[t] = (1 / (1 - this.friction) - 1) * (this.target[t] - this.current[t]));
		}
		checkBounds(t = 0, e = 0) {
			const { current: i } = this,
				n = i.e + t,
				s = i.f + e,
				o = this.getBounds(),
				{ x: a, y: r } = o,
				l = a.min,
				c = a.max,
				h = r.min,
				d = r.max;
			let u = 0,
				p = 0;
			return l !== 1 / 0 && n < l ? (u = l - n) : c !== 1 / 0 && n > c && (u = c - n), h !== 1 / 0 && s < h ? (p = h - s) : d !== 1 / 0 && s > d && (p = d - s), Math.abs(u) < 1e-4 && (u = 0), Math.abs(p) < 1e-4 && (p = 0), Object.assign(Object.assign({}, o), { xDiff: u, yDiff: p, inBounds: !u && !p });
		}
		clampTargetBounds() {
			const { target: t } = this,
				{ x: e, y: i } = this.getBounds();
			e.min !== 1 / 0 && (t.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (t.e = Math.min(t.e, e.max)), i.min !== 1 / 0 && (t.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (t.f = Math.min(t.f, i.max));
		}
		calculateContentDim(t = this.current) {
			const { content: e, contentRect: i } = this,
				{ fitWidth: n, fitHeight: s, fullWidth: o, fullHeight: a } = i;
			let r = o,
				l = a;
			if (this.option('zoom') || 0 !== this.angle) {
				const i = !(e instanceof HTMLImageElement) && ('none' === window.getComputedStyle(e).maxWidth || 'none' === window.getComputedStyle(e).maxHeight),
					c = i ? o : n,
					h = i ? a : s,
					d = this.getMatrix(t),
					u = new DOMPoint(0, 0).matrixTransform(d),
					p = new DOMPoint(0 + c, 0).matrixTransform(d),
					f = new DOMPoint(0 + c, 0 + h).matrixTransform(d),
					g = new DOMPoint(0, 0 + h).matrixTransform(d),
					m = Math.abs(f.x - u.x),
					v = Math.abs(f.y - u.y),
					b = Math.abs(g.x - p.x),
					y = Math.abs(g.y - p.y);
				(r = Math.max(m, b)), (l = Math.max(v, y));
			}
			return { contentWidth: r, contentHeight: l };
		}
		setEdgeForce() {
			if (this.ignoreBounds || this.isDragging || this.panMode === A || this.targetScale < this.scale) return (this.isBouncingX = !1), void (this.isBouncingY = !1);
			const { target: t } = this,
				{ x: e, y: i, xDiff: n, yDiff: s } = this.checkBounds();
			const o = this.option('maxVelocity');
			let a = this.velocity.e,
				r = this.velocity.f;
			0 !== n ? ((this.isBouncingX = !0), n * a <= 0 ? (a += 0.14 * n) : ((a = 0.14 * n), e.min !== 1 / 0 && (this.target.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (this.target.e = Math.min(t.e, e.max))), o && (a = Math.max(Math.min(a, o), -1 * o))) : (this.isBouncingX = !1),
				0 !== s ? ((this.isBouncingY = !0), s * r <= 0 ? (r += 0.14 * s) : ((r = 0.14 * s), i.min !== 1 / 0 && (this.target.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (this.target.f = Math.min(t.f, i.max))), o && (r = Math.max(Math.min(r, o), -1 * o))) : (this.isBouncingY = !1),
				this.isBouncingX && (this.velocity.e = a),
				this.isBouncingY && (this.velocity.f = r);
		}
		enable() {
			const { content: t } = this,
				e = new DOMMatrixReadOnly(window.getComputedStyle(t).transform);
			for (const t of b) this.current[t] = this.target[t] = e[t];
			this.updateMetrics(), this.attachObserver(), this.attachEvents(), (this.state = v.Ready), this.emit('ready');
		}
		onClick(t) {
			var e;
			'click' === t.type && 0 === t.detail && ((this.dragOffset.x = 0), (this.dragOffset.y = 0)), this.isDragging && (null === (e = this.pointerTracker) || void 0 === e || e.clear(), (this.trackingPoints = []), this.startDecelAnim());
			const i = t.target;
			if (!i || t.defaultPrevented) return;
			if (i.hasAttribute('disabled')) return t.preventDefault(), void t.stopPropagation();
			if (
				(() => {
					const t = window.getSelection();
					return t && 'Range' === t.type;
				})() &&
				!i.closest('button')
			)
				return;
			const n = i.closest('[data-panzoom-action]'),
				s = i.closest('[data-panzoom-change]'),
				o = n || s,
				a = o && S(o) ? o.dataset : null;
			if (a) {
				const e = a.panzoomChange,
					i = a.panzoomAction;
				if (((e || i) && t.preventDefault(), e)) {
					let t = {};
					try {
						t = JSON.parse(e);
					} catch (t) {
						console && console.warn('The given data was not valid JSON');
					}
					return void this.applyChange(t);
				}
				if (i) return void (this[i] && this[i]());
			}
			if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3) return t.preventDefault(), void t.stopPropagation();
			if (i.closest('[data-fancybox]')) return;
			const r = this.content.getBoundingClientRect(),
				l = this.dragStart;
			if (l.time && !this.canZoomOut() && (Math.abs(r.x - l.x) > 2 || Math.abs(r.y - l.y) > 2)) return;
			this.dragStart.time = 0;
			const c = (e) => {
					this.option('zoom', t) && e && 'string' == typeof e && /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(e) && 'function' == typeof this[e] && (t.preventDefault(), this[e]({ event: t }));
				},
				h = this.option('click', t),
				d = this.option('dblClick', t);
			d
				? (this.clicks++,
				  1 == this.clicks &&
						(this.clickTimer = setTimeout(() => {
							1 === this.clicks ? (this.emit('click', t), !t.defaultPrevented && h && c(h)) : (this.emit('dblClick', t), t.defaultPrevented || c(d)), (this.clicks = 0), (this.clickTimer = null);
						}, 350)))
				: (this.emit('click', t), !t.defaultPrevented && h && c(h));
		}
		addTrackingPoint(t) {
			const e = this.trackingPoints.filter((t) => t.time > Date.now() - 100);
			e.push(t), (this.trackingPoints = e);
		}
		onPointerDown(t, e, i) {
			var n;
			if (!1 === this.option('touch', t)) return !1;
			(this.pwt = 0), (this.dragOffset = { x: 0, y: 0, time: 0 }), (this.trackingPoints = []);
			const s = this.content.getBoundingClientRect();
			if (((this.dragStart = { x: s.x, y: s.y, top: s.top, left: s.left, time: Date.now() }), this.clickTimer)) return !1;
			if (this.panMode === A && this.targetScale > 1) return t.preventDefault(), t.stopPropagation(), !1;
			const o = t.composedPath()[0];
			if (!i.length) {
				if (['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO', 'IFRAME'].includes(o.nodeName) || o.closest('[contenteditable],[data-selectable],[data-draggable],[data-clickable],[data-panzoom-change],[data-panzoom-action]')) return !1;
				null === (n = window.getSelection()) || void 0 === n || n.removeAllRanges();
			}
			if ('mousedown' === t.type) ['A', 'BUTTON'].includes(o.nodeName) || t.preventDefault();
			else if (Math.abs(this.velocity.a) > 0.3) return !1;
			return (this.target.e = this.current.e), (this.target.f = this.current.f), this.stop(), this.isDragging || ((this.isDragging = !0), this.addTrackingPoint(e), this.emit('touchStart', t)), !0;
		}
		onPointerMove(t, i, s) {
			if (!1 === this.option('touch', t)) return;
			if (!this.isDragging) return;
			if (i.length < 2 && this.panOnlyZoomed && e(this.targetScale) <= e(this.minScale)) return;
			if ((this.emit('touchMove', t), t.defaultPrevented)) return;
			this.addTrackingPoint(i[0]);
			const { content: o } = this,
				a = d(s[0], s[1]),
				r = d(i[0], i[1]);
			let l = 0,
				c = 0;
			if (i.length > 1) {
				const t = o.getBoundingClientRect();
				(l = a.clientX - t.left - 0.5 * t.width), (c = a.clientY - t.top - 0.5 * t.height);
			}
			const u = h(s[0], s[1]),
				p = h(i[0], i[1]);
			let f = u ? p / u : 1,
				g = r.clientX - a.clientX,
				m = r.clientY - a.clientY;
			(this.dragOffset.x += g), (this.dragOffset.y += m), (this.dragOffset.time = Date.now() - this.dragStart.time);
			let v = e(this.targetScale) === e(this.minScale) && this.option('lockAxis');
			if (v && !this.lockedAxis)
				if ('xy' === v || 'y' === v || 'touchmove' === t.type) {
					if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) return void t.preventDefault();
					const e = Math.abs((180 * Math.atan2(this.dragOffset.y, this.dragOffset.x)) / Math.PI);
					(this.lockedAxis = e > 45 && e < 135 ? 'y' : 'x'), (this.dragOffset.x = 0), (this.dragOffset.y = 0), (g = 0), (m = 0);
				} else this.lockedAxis = v;
			if ((n(t.target, this.content) && ((v = 'x'), (this.dragOffset.y = 0)), v && 'xy' !== v && this.lockedAxis !== v && e(this.targetScale) === e(this.minScale))) return;
			t.cancelable && t.preventDefault(), this.container.classList.add(this.cn('isDragging'));
			const b = this.checkBounds(g, m);
			this.option('rubberband') ? ('x' !== this.isInfinite && ((b.xDiff > 0 && g < 0) || (b.xDiff < 0 && g > 0)) && (g *= Math.max(0, 0.5 - Math.abs((0.75 / this.contentRect.fitWidth) * b.xDiff))), 'y' !== this.isInfinite && ((b.yDiff > 0 && m < 0) || (b.yDiff < 0 && m > 0)) && (m *= Math.max(0, 0.5 - Math.abs((0.75 / this.contentRect.fitHeight) * b.yDiff)))) : (b.xDiff && (g = 0), b.yDiff && (m = 0));
			const y = this.targetScale,
				w = this.minScale,
				x = this.maxScale;
			y < 0.5 * w && (f = Math.max(f, w)), y > 1.5 * x && (f = Math.min(f, x)), 'y' === this.lockedAxis && e(y) === e(w) && (g = 0), 'x' === this.lockedAxis && e(y) === e(w) && (m = 0), this.applyChange({ originX: l, originY: c, panX: g, panY: m, scale: f, friction: this.option('dragFriction'), ignoreBounds: !0 });
		}
		onPointerUp(t, e, i) {
			if (i.length) return (this.dragOffset.x = 0), (this.dragOffset.y = 0), void (this.trackingPoints = []);
			this.container.classList.remove(this.cn('isDragging')),
				this.isDragging && (this.addTrackingPoint(e), this.panOnlyZoomed && this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1 && (this.trackingPoints = []), n(t.target, this.content) && 'y' === this.lockedAxis && (this.trackingPoints = []), this.emit('touchEnd', t), (this.isDragging = !1), (this.lockedAxis = !1), this.state !== v.Destroy && (t.defaultPrevented || this.startDecelAnim()));
		}
		startDecelAnim() {
			var t;
			const i = this.isScaling;
			this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)), (this.isBouncingX = !1), (this.isBouncingY = !1);
			for (const t of b) this.velocity[t] = 0;
			(this.target.e = this.current.e), (this.target.f = this.current.f), P(this.container, 'is-scaling'), P(this.container, 'is-animating'), (this.isTicking = !1);
			const { trackingPoints: n } = this,
				s = n[0],
				o = n[n.length - 1];
			let a = 0,
				r = 0,
				l = 0;
			o && s && ((a = o.clientX - s.clientX), (r = o.clientY - s.clientY), (l = o.time - s.time));
			const c = (null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1;
			1 !== c && ((a *= c), (r *= c));
			let h = 0,
				d = 0,
				u = 0,
				p = 0,
				f = this.option('decelFriction');
			const g = this.targetScale;
			if (l > 0) {
				(u = Math.abs(a) > 3 ? a / (l / 30) : 0), (p = Math.abs(r) > 3 ? r / (l / 30) : 0);
				const t = this.option('maxVelocity');
				t && ((u = Math.max(Math.min(u, t), -1 * t)), (p = Math.max(Math.min(p, t), -1 * t)));
			}
			u && (h = u / (1 / (1 - f) - 1)), p && (d = p / (1 / (1 - f) - 1)), ('y' === this.option('lockAxis') || ('xy' === this.option('lockAxis') && 'y' === this.lockedAxis && e(g) === this.minScale)) && (h = u = 0), ('x' === this.option('lockAxis') || ('xy' === this.option('lockAxis') && 'x' === this.lockedAxis && e(g) === this.minScale)) && (d = p = 0);
			const m = this.dragOffset.x,
				v = this.dragOffset.y,
				y = this.option('dragMinThreshold') || 0;
			Math.abs(m) < y && Math.abs(v) < y && ((h = d = 0), (u = p = 0)), ((this.option('zoom') && (g < this.minScale - 1e-5 || g > this.maxScale + 1e-5)) || (i && !h && !d)) && (f = 0.35), this.applyChange({ panX: h, panY: d, friction: f }), this.emit('decel', u, p, m, v);
		}
		onWheel(t) {
			var e = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (t, e) {
				return Math.abs(e) > Math.abs(t) ? e : t;
			});
			const i = Math.max(-1, Math.min(1, e));
			if ((this.emit('wheel', t, i), this.panMode === A)) return;
			if (t.defaultPrevented) return;
			const n = this.option('wheel');
			'pan' === n ? (t.preventDefault(), (this.panOnlyZoomed && !this.canZoomOut()) || this.applyChange({ panX: 2 * -t.deltaX, panY: 2 * -t.deltaY, bounce: !1 })) : 'zoom' === n && !1 !== this.option('zoom') && this.zoomWithWheel(t);
		}
		onMouseMove(t) {
			this.panWithMouse(t);
		}
		onKeydown(t) {
			'Escape' === t.key && this.toggleFS();
		}
		onResize() {
			this.updateMetrics(), this.checkBounds().inBounds || this.requestTick();
		}
		setTransform() {
			this.emit('beforeTransform');
			const { current: t, target: i, content: n, contentRect: s } = this,
				o = Object.assign({}, T);
			for (const n of b) {
				const s = 'e' == n || 'f' === n ? O : M;
				(o[n] = e(t[n], s)), Math.abs(i[n] - t[n]) < ('e' == n || 'f' === n ? 0.51 : 0.001) && (t[n] = i[n]);
			}
			let { a: a, b: r, c: l, d: c, e: h, f: d } = o,
				u = `matrix(${a}, ${r}, ${l}, ${c}, ${h}, ${d})`,
				p = n.parentElement instanceof HTMLPictureElement ? n.parentElement : n;
			if ((this.option('transformParent') && (p = p.parentElement || p), p.style.transform === u)) return;
			p.style.transform = u;
			const { contentWidth: f, contentHeight: g } = this.calculateContentDim();
			(s.width = f), (s.height = g), this.emit('afterTransform');
		}
		updateMetrics(t = !1) {
			var i;
			if (!this || this.state === v.Destroy) return;
			if (this.isContentLoading) return;
			const n = Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1),
				{ container: s, content: o } = this,
				a = o instanceof HTMLImageElement,
				r = s.getBoundingClientRect(),
				l = getComputedStyle(this.container);
			let c = r.width * n,
				h = r.height * n;
			const d = parseFloat(l.paddingTop) + parseFloat(l.paddingBottom),
				u = c - (parseFloat(l.paddingLeft) + parseFloat(l.paddingRight)),
				p = h - d;
			this.containerRect = { width: c, height: h, innerWidth: u, innerHeight: p };
			const f =
					parseFloat(o.dataset.width || '') ||
					((t) => {
						let e = 0;
						return (e = t instanceof HTMLImageElement ? t.naturalWidth : t instanceof SVGElement ? t.width.baseVal.value : Math.max(t.offsetWidth, t.scrollWidth)), e || 0;
					})(o),
				g =
					parseFloat(o.dataset.height || '') ||
					((t) => {
						let e = 0;
						return (e = t instanceof HTMLImageElement ? t.naturalHeight : t instanceof SVGElement ? t.height.baseVal.value : Math.max(t.offsetHeight, t.scrollHeight)), e || 0;
					})(o);
			let m = this.option('width', f) || R,
				b = this.option('height', g) || R;
			const y = m === R,
				w = b === R;
			'number' != typeof m && (m = f), 'number' != typeof b && (b = g), y && (m = f * (b / g)), w && (b = g / (f / m));
			let x = o.parentElement instanceof HTMLPictureElement ? o.parentElement : o;
			this.option('transformParent') && (x = x.parentElement || x);
			const E = x.getAttribute('style') || '';
			x.style.setProperty('transform', 'none', 'important'), a && ((x.style.width = ''), (x.style.height = '')), x.offsetHeight;
			const S = o.getBoundingClientRect();
			let P = S.width * n,
				C = S.height * n,
				T = P,
				M = C;
			(P = Math.min(P, m)),
				(C = Math.min(C, b)),
				a
					? ({ width: P, height: C } = ((t, e, i, n) => {
							const s = i / t,
								o = n / e,
								a = Math.min(s, o);
							return { width: (t *= a), height: (e *= a) };
					  })(m, b, P, C))
					: ((P = Math.min(P, m)), (C = Math.min(C, b)));
			let O = 0.5 * (M - C),
				A = 0.5 * (T - P);
			(this.contentRect = Object.assign(Object.assign({}, this.contentRect), { top: S.top - r.top + O, bottom: r.bottom - S.bottom + O, left: S.left - r.left + A, right: r.right - S.right + A, fitWidth: P, fitHeight: C, width: P, height: C, fullWidth: m, fullHeight: b })),
				(x.style.cssText = E),
				a && ((x.style.width = `${P}px`), (x.style.height = `${C}px`)),
				this.setTransform(),
				!0 !== t && this.emit('refresh'),
				this.ignoreBounds || (e(this.targetScale) < e(this.minScale) ? this.zoomTo(this.minScale, { friction: 0 }) : this.targetScale > this.maxScale ? this.zoomTo(this.maxScale, { friction: 0 }) : this.state === v.Init || this.checkBounds().inBounds || this.requestTick()),
				this.updateControls();
		}
		calculateBounds() {
			const { contentWidth: t, contentHeight: i } = this.calculateContentDim(this.target),
				{ targetScale: n, lockedAxis: s } = this,
				{ fitWidth: o, fitHeight: a } = this.contentRect;
			let r = 0,
				l = 0,
				c = 0,
				h = 0;
			const d = this.option('infinite');
			if (!0 === d || (s && d === s)) (r = -1 / 0), (c = 1 / 0), (l = -1 / 0), (h = 1 / 0);
			else {
				let { containerRect: s, contentRect: d } = this,
					u = e(o * n, O),
					p = e(a * n, O),
					{ innerWidth: f, innerHeight: g } = s;
				if ((s.width === u && (f = s.width), s.width === p && (g = s.height), t > f)) {
					(c = 0.5 * (t - f)), (r = -1 * c);
					let e = 0.5 * (d.right - d.left);
					(r += e), (c += e);
				}
				if ((o > f && t < f && ((r -= 0.5 * (o - f)), (c -= 0.5 * (o - f))), i > g)) {
					(h = 0.5 * (i - g)), (l = -1 * h);
					let t = 0.5 * (d.bottom - d.top);
					(l += t), (h += t);
				}
				a > g && i < g && ((r -= 0.5 * (a - g)), (c -= 0.5 * (a - g)));
			}
			return { x: { min: r, max: c }, y: { min: l, max: h } };
		}
		getBounds() {
			const t = this.option('bounds');
			return t !== R ? t : this.calculateBounds();
		}
		updateControls() {
			const t = this,
				i = t.container,
				{ panMode: n, contentRect: s, targetScale: o, minScale: r } = t;
			let l = r,
				c = t.option('click') || !1;
			c && (l = t.getNextScale(c));
			let h = t.canZoomIn(),
				d = t.canZoomOut(),
				u = n === L && !!this.option('touch'),
				p = d && u;
			if ((u && (e(o) < e(r) && !this.panOnlyZoomed && (p = !0), (e(s.width, 1) > e(s.fitWidth, 1) || e(s.height, 1) > e(s.fitHeight, 1)) && (p = !0)), e(s.width * o, 1) < e(s.fitWidth, 1) && (p = !1), n === A && (p = !1), a(i, this.cn('isDraggable'), p), !this.option('zoom'))) return;
			let f = h && e(l) > e(o),
				g = !f && !p && d && e(l) < e(o);
			a(i, this.cn('canZoomIn'), f), a(i, this.cn('canZoomOut'), g);
			for (const t of i.querySelectorAll('[data-panzoom-action]')) {
				let e = !1,
					i = !1;
				switch (t.dataset.panzoomAction) {
					case 'zoomIn':
						h ? (e = !0) : (i = !0);
						break;
					case 'zoomOut':
						d ? (e = !0) : (i = !0);
						break;
					case 'toggleZoom':
					case 'iterateZoom':
						h || d ? (e = !0) : (i = !0);
						const n = t.querySelector('g');
						n && (n.style.display = h ? '' : 'none');
				}
				e ? (t.removeAttribute('disabled'), t.removeAttribute('tabindex')) : i && (t.setAttribute('disabled', ''), t.setAttribute('tabindex', '-1'));
			}
		}
		panTo({ x: t = this.target.e, y: e = this.target.f, scale: i = this.targetScale, friction: n = this.option('friction'), angle: s = 0, originX: o = 0, originY: a = 0, flipX: r = !1, flipY: l = !1, ignoreBounds: c = !1 }) {
			this.state !== v.Destroy && this.applyChange({ panX: t - this.target.e, panY: e - this.target.f, scale: i / this.targetScale, angle: s, originX: o, originY: a, friction: n, flipX: r, flipY: l, ignoreBounds: c });
		}
		applyChange({ panX: t = 0, panY: i = 0, scale: n = 1, angle: s = 0, originX: o = -this.current.e, originY: a = -this.current.f, friction: r = this.option('friction'), flipX: l = !1, flipY: c = !1, ignoreBounds: h = !1, bounce: d = this.option('bounce') }) {
			const u = this.state;
			if (u === v.Destroy) return;
			this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)), (this.friction = r || 0), (this.ignoreBounds = h);
			const { current: p } = this,
				f = p.e,
				g = p.f,
				m = this.getMatrix(this.target);
			let y = new DOMMatrix().translate(f, g).translate(o, a).translate(t, i);
			if (this.option('zoom')) {
				if (!h) {
					const t = this.targetScale,
						e = this.minScale,
						i = this.maxScale;
					t * n < e && (n = e / t), t * n > i && (n = i / t);
				}
				y = y.scale(n);
			}
			(y = y.translate(-o, -a).translate(-f, -g).multiply(m)), s && (y = y.rotate(s)), l && (y = y.scale(-1, 1)), c && (y = y.scale(1, -1));
			for (const t of b) 'e' !== t && 'f' !== t && (y[t] > this.minScale + 1e-5 || y[t] < this.minScale - 1e-5) ? (this.target[t] = y[t]) : (this.target[t] = e(y[t], O));
			(this.targetScale < this.scale || Math.abs(n - 1) > 0.1 || this.panMode === A || !1 === d) && !h && this.clampTargetBounds(), u === v.Init ? this.animate() : this.isResting || ((this.state = v.Panning), this.requestTick());
		}
		stop(t = !1) {
			if (this.state === v.Init || this.state === v.Destroy) return;
			const e = this.isTicking;
			this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)), (this.isBouncingX = !1), (this.isBouncingY = !1);
			for (const e of b) (this.velocity[e] = 0), 'current' === t ? (this.current[e] = this.target[e]) : 'target' === t && (this.target[e] = this.current[e]);
			this.setTransform(), P(this.container, 'is-scaling'), P(this.container, 'is-animating'), (this.isTicking = !1), (this.state = v.Ready), e && (this.emit('endAnimation'), this.updateControls());
		}
		requestTick() {
			this.isTicking || (this.emit('startAnimation'), this.updateControls(), C(this.container, 'is-animating'), this.isScaling && C(this.container, 'is-scaling')), (this.isTicking = !0), this.rAF || (this.rAF = requestAnimationFrame(() => this.animate()));
		}
		panWithMouse(t, i = this.option('mouseMoveFriction')) {
			if (((this.pmme = t), this.panMode !== A || !t)) return;
			if (e(this.targetScale) <= e(this.minScale)) return;
			this.emit('mouseMove', t);
			const { container: n, containerRect: s, contentRect: o } = this,
				a = s.width,
				r = s.height,
				l = n.getBoundingClientRect(),
				c = (t.clientX || 0) - l.left,
				h = (t.clientY || 0) - l.top;
			let { contentWidth: d, contentHeight: u } = this.calculateContentDim(this.target);
			const p = this.option('mouseMoveFactor');
			p > 1 && (d !== a && (d *= p), u !== r && (u *= p));
			let f = 0.5 * (d - a) - (((c / a) * 100) / 100) * (d - a);
			f += 0.5 * (o.right - o.left);
			let g = 0.5 * (u - r) - (((h / r) * 100) / 100) * (u - r);
			(g += 0.5 * (o.bottom - o.top)), this.applyChange({ panX: f - this.target.e, panY: g - this.target.f, friction: i });
		}
		zoomWithWheel(t) {
			if (this.state === v.Destroy || this.state === v.Init) return;
			const i = Date.now();
			if (i - this.pwt < 45) return void t.preventDefault();
			this.pwt = i;
			var n = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (t, e) {
				return Math.abs(e) > Math.abs(t) ? e : t;
			});
			const s = Math.max(-1, Math.min(1, n)),
				{ targetScale: o, maxScale: a, minScale: r } = this;
			let l = (o * (100 + 45 * s)) / 100;
			e(l) < e(r) && e(o) <= e(r) ? ((this.cwd += Math.abs(s)), (l = r)) : e(l) > e(a) && e(o) >= e(a) ? ((this.cwd += Math.abs(s)), (l = a)) : ((this.cwd = 0), (l = Math.max(Math.min(l, a), r))), this.cwd > this.option('wheelLimit') || (t.preventDefault(), e(l) !== e(o) && this.zoomTo(l, { event: t }));
		}
		canZoomIn() {
			return this.option('zoom') && (e(this.contentRect.width, 1) < e(this.contentRect.fitWidth, 1) || e(this.targetScale) < e(this.maxScale));
		}
		canZoomOut() {
			return this.option('zoom') && e(this.targetScale) > e(this.minScale);
		}
		zoomIn(t = 1.25, e) {
			this.zoomTo(this.targetScale * t, e);
		}
		zoomOut(t = 0.8, e) {
			this.zoomTo(this.targetScale * t, e);
		}
		zoomToFit(t) {
			this.zoomTo('fit', t);
		}
		zoomToCover(t) {
			this.zoomTo('cover', t);
		}
		zoomToFull(t) {
			this.zoomTo('full', t);
		}
		zoomToMax(t) {
			this.zoomTo('max', t);
		}
		toggleZoom(t) {
			this.zoomTo(this.getNextScale('toggleZoom'), t);
		}
		toggleMax(t) {
			this.zoomTo(this.getNextScale('toggleMax'), t);
		}
		toggleCover(t) {
			this.zoomTo(this.getNextScale('toggleCover'), t);
		}
		iterateZoom(t) {
			this.zoomTo('next', t);
		}
		zoomTo(t = 1, { friction: e = R, originX: i = R, originY: n = R, event: s } = {}) {
			if (this.isContentLoading || this.state === v.Destroy) return;
			const { targetScale: o, fullScale: a, maxScale: r, coverScale: l } = this;
			if ((this.stop(), this.panMode === A && (s = this.pmme || s), s || i === R || n === R)) {
				const t = this.content.getBoundingClientRect(),
					e = this.container.getBoundingClientRect(),
					o = s ? s.clientX : e.left + 0.5 * e.width,
					a = s ? s.clientY : e.top + 0.5 * e.height;
				(i = o - t.left - 0.5 * t.width), (n = a - t.top - 0.5 * t.height);
			}
			let c = 1;
			'number' == typeof t ? (c = t) : 'full' === t ? (c = a) : 'cover' === t ? (c = l) : 'max' === t ? (c = r) : 'fit' === t ? (c = 1) : 'next' === t && (c = this.getNextScale('iterateZoom')), (c = c / o || 1), (e = e === R ? (c > 1 ? 0.15 : 0.25) : e), this.applyChange({ scale: c, originX: i, originY: n, friction: e }), s && this.panMode === A && this.panWithMouse(s, e);
		}
		rotateCCW() {
			this.applyChange({ angle: -90 });
		}
		rotateCW() {
			this.applyChange({ angle: 90 });
		}
		flipX() {
			this.applyChange({ flipX: !0 });
		}
		flipY() {
			this.applyChange({ flipY: !0 });
		}
		fitX() {
			this.stop('target');
			const { containerRect: t, contentRect: e, target: i } = this;
			this.applyChange({ panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e, panY: 0.5 * t.height - (e.top + 0.5 * e.fitHeight) - i.f, scale: t.width / e.fitWidth / this.targetScale, originX: 0, originY: 0, ignoreBounds: !0 });
		}
		fitY() {
			this.stop('target');
			const { containerRect: t, contentRect: e, target: i } = this;
			this.applyChange({ panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e, panY: 0.5 * t.innerHeight - (e.top + 0.5 * e.fitHeight) - i.f, scale: t.height / e.fitHeight / this.targetScale, originX: 0, originY: 0, ignoreBounds: !0 });
		}
		toggleFS() {
			const { container: t } = this,
				e = this.cn('inFullscreen'),
				i = this.cn('htmlHasFullscreen');
			t.classList.toggle(e);
			const n = t.classList.contains(e);
			n ? (document.documentElement.classList.add(i), document.addEventListener('keydown', this.onKeydown, !0)) : (document.documentElement.classList.remove(i), document.removeEventListener('keydown', this.onKeydown, !0)), this.updateMetrics(), this.emit(n ? 'enterFS' : 'exitFS');
		}
		getMatrix(t = this.current) {
			const { a: e, b: i, c: n, d: s, e: o, f: a } = t;
			return new DOMMatrix([e, i, n, s, o, a]);
		}
		reset(t) {
			if (this.state !== v.Init && this.state !== v.Destroy) {
				this.stop('current');
				for (const t of b) this.target[t] = T[t];
				(this.target.a = this.minScale), (this.target.d = this.minScale), this.clampTargetBounds(), this.isResting || ((this.friction = void 0 === t ? this.option('friction') : t), (this.state = v.Panning), this.requestTick());
			}
		}
		destroy() {
			this.stop(), (this.state = v.Destroy), this.detachEvents(), this.detachObserver();
			const { container: t, content: e } = this,
				i = this.option('classes') || {};
			for (const e of Object.values(i)) t.classList.remove(e + '');
			e && (e.removeEventListener('load', this.onLoad), e.removeEventListener('error', this.onError)), this.detachPlugins();
		}
	}
	Object.defineProperty(D, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: w }), Object.defineProperty(D, 'Plugins', { enumerable: !0, configurable: !0, writable: !0, value: {} });
	const F = function (t, e) {
			let i = !0;
			return (...n) => {
				i &&
					((i = !1),
					t(...n),
					setTimeout(() => {
						i = !0;
					}, e));
			};
		},
		j = (t, e) => {
			let i = [];
			return (
				t.childNodes.forEach((t) => {
					t.nodeType !== Node.ELEMENT_NODE || (e && !t.matches(e)) || i.push(t);
				}),
				i
			);
		},
		B = {
			viewport: null,
			track: null,
			enabled: !0,
			slides: [],
			axis: 'x',
			transition: 'fade',
			preload: 1,
			slidesPerPage: 'auto',
			initialPage: 0,
			friction: 0.12,
			Panzoom: { decelFriction: 0.12 },
			center: !0,
			infinite: !0,
			fill: !0,
			dragFree: !1,
			adaptiveHeight: !1,
			direction: 'ltr',
			classes: { container: 'f-carousel', viewport: 'f-carousel__viewport', track: 'f-carousel__track', slide: 'f-carousel__slide', isLTR: 'is-ltr', isRTL: 'is-rtl', isHorizontal: 'is-horizontal', isVertical: 'is-vertical', inTransition: 'in-transition', isSelected: 'is-selected' },
			l10n: { NEXT: 'Next slide', PREV: 'Previous slide', GOTO: 'Go to slide #%d' }
		};
	var H;
	!(function (t) {
		(t[(t.Init = 0)] = 'Init'), (t[(t.Ready = 1)] = 'Ready'), (t[(t.Destroy = 2)] = 'Destroy');
	})(H || (H = {}));
	const N = (t) => {
			if ('string' == typeof t || t instanceof HTMLElement) t = { html: t };
			else {
				const e = t.thumb;
				void 0 !== e && ('string' == typeof e && (t.thumbSrc = e), e instanceof HTMLImageElement && ((t.thumbEl = e), (t.thumbElSrc = e.src), (t.thumbSrc = e.src)), delete t.thumb);
			}
			return Object.assign({ html: '', el: null, isDom: !1, class: '', customClass: '', index: -1, dim: 0, gap: 0, pos: 0, transition: !1 }, t);
		},
		_ = (t = {}) => Object.assign({ index: -1, slides: [], dim: 0, pos: -1 }, t);
	class $ extends g {
		constructor(t, e) {
			super(e), Object.defineProperty(this, 'instance', { enumerable: !0, configurable: !0, writable: !0, value: t });
		}
		attach() {}
		detach() {}
	}
	const W = { classes: { list: 'f-carousel__dots', isDynamic: 'is-dynamic', hasDots: 'has-dots', dot: 'f-carousel__dot', isBeforePrev: 'is-before-prev', isPrev: 'is-prev', isCurrent: 'is-current', isNext: 'is-next', isAfterNext: 'is-after-next' }, dotTpl: '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>', dynamicFrom: 11, maxCount: 1 / 0, minCount: 2 };
	class X extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'isDynamic', { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, 'list', { enumerable: !0, configurable: !0, writable: !0, value: null });
		}
		onRefresh() {
			this.refresh();
		}
		build() {
			let t = this.list;
			if (!t) {
				(t = document.createElement('ul')), C(t, this.cn('list')), t.setAttribute('role', 'tablist');
				const e = this.instance.container;
				e.appendChild(t), C(e, this.cn('hasDots')), (this.list = t);
			}
			return t;
		}
		refresh() {
			var t;
			const e = this.instance.pages.length,
				i = Math.min(2, this.option('minCount')),
				n = Math.max(2e3, this.option('maxCount')),
				s = this.option('dynamicFrom');
			if (e < i || e > n) return void this.cleanup();
			const o = 'number' == typeof s && e > 5 && e >= s,
				r = !this.list || this.isDynamic !== o || this.list.children.length !== e;
			r && this.cleanup();
			const l = this.build();
			if ((a(l, this.cn('isDynamic'), !!o), r)) for (let t = 0; t < e; t++) l.append(this.createItem(t));
			let c,
				h = 0;
			for (const e of [...l.children]) {
				const i = h === this.instance.page;
				i && (c = e), a(e, this.cn('isCurrent'), i), null === (t = e.children[0]) || void 0 === t || t.setAttribute('aria-selected', i ? 'true' : 'false');
				for (const t of ['isBeforePrev', 'isPrev', 'isNext', 'isAfterNext']) P(e, this.cn(t));
				h++;
			}
			if (((c = c || l.firstChild), o && c)) {
				const t = c.previousElementSibling,
					e = t && t.previousElementSibling;
				C(t, this.cn('isPrev')), C(e, this.cn('isBeforePrev'));
				const i = c.nextElementSibling,
					n = i && i.nextElementSibling;
				C(i, this.cn('isNext')), C(n, this.cn('isAfterNext'));
			}
			this.isDynamic = o;
		}
		createItem(t = 0) {
			var e;
			const i = document.createElement('li');
			i.setAttribute('role', 'presentation');
			const n = s(this.instance.localize(this.option('dotTpl'), [['%d', t + 1]]).replace(/\%i/g, t + ''));
			return i.appendChild(n), null === (e = i.children[0]) || void 0 === e || e.setAttribute('role', 'tab'), i;
		}
		cleanup() {
			this.list && (this.list.remove(), (this.list = null)), (this.isDynamic = !1), P(this.instance.container, this.cn('hasDots'));
		}
		attach() {
			this.instance.on(['refresh', 'change'], this.onRefresh);
		}
		detach() {
			this.instance.off(['refresh', 'change'], this.onRefresh), this.cleanup();
		}
	}
	Object.defineProperty(X, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: W });
	const q = 'disabled',
		Y = 'next',
		V = 'prev';
	class Z extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'prev', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'next', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'isDom', { enumerable: !0, configurable: !0, writable: !0, value: !1 });
		}
		onRefresh() {
			const t = this.instance,
				e = t.pages.length,
				i = t.page;
			if (e < 2) return void this.cleanup();
			this.build();
			let n = this.prev,
				s = this.next;
			n && s && (n.removeAttribute(q), s.removeAttribute(q), t.isInfinite || (i <= 0 && n.setAttribute(q, ''), i >= e - 1 && s.setAttribute(q, '')));
		}
		addBtn(t) {
			var e;
			const i = this.instance,
				n = document.createElement('button');
			n.setAttribute('tabindex', '0'), n.setAttribute('title', i.localize(`{{${t.toUpperCase()}}}`)), C(n, this.cn('button') + ' ' + this.cn(t === Y ? 'isNext' : 'isPrev'));
			const s = i.isRTL ? (t === Y ? V : Y) : t;
			var o;
			return (n.innerHTML = i.localize(this.option(`${s}Tpl`))), (n.dataset[`carousel${((o = t), o ? (o.match('^[a-z]') ? o.charAt(0).toUpperCase() + o.substring(1) : o) : '')}`] = 'true'), null === (e = this.container) || void 0 === e || e.appendChild(n), n;
		}
		build() {
			const t = this.instance.container,
				e = this.cn('container');
			let { container: i, prev: n, next: s } = this;
			i || ((i = t.querySelector('.' + e)), (this.isDom = !!i)), i || ((i = document.createElement('div')), C(i, e), t.appendChild(i)), (this.container = i), s || (s = i.querySelector('[data-carousel-next]')), s || (s = this.addBtn(Y)), (this.next = s), n || (n = i.querySelector('[data-carousel-prev]')), n || (n = this.addBtn(V)), (this.prev = n);
		}
		cleanup() {
			this.isDom || (this.prev && this.prev.remove(), this.next && this.next.remove(), this.container && this.container.remove()), (this.prev = null), (this.next = null), (this.container = null), (this.isDom = !1);
		}
		attach() {
			this.instance.on(['refresh', 'change'], this.onRefresh);
		}
		detach() {
			this.instance.off(['refresh', 'change'], this.onRefresh), this.cleanup();
		}
	}
	Object.defineProperty(Z, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: { classes: { container: 'f-carousel__nav', button: 'f-button', isNext: 'is-next', isPrev: 'is-prev' }, nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>', prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>' } });
	class U extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'selectedIndex', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'target', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'nav', { enumerable: !0, configurable: !0, writable: !0, value: null });
		}
		addAsTargetFor(t) {
			(this.target = this.instance), (this.nav = t), this.attachEvents();
		}
		addAsNavFor(t) {
			(this.nav = this.instance), (this.target = t), this.attachEvents();
		}
		attachEvents() {
			const { nav: t, target: e } = this;
			t && e && ((t.options.initialSlide = e.options.initialPage), t.state === H.Ready ? this.onNavReady(t) : t.on('ready', this.onNavReady), e.state === H.Ready ? this.onTargetReady(e) : e.on('ready', this.onTargetReady));
		}
		onNavReady(t) {
			t.on('createSlide', this.onNavCreateSlide), t.on('Panzoom.click', this.onNavClick), t.on('Panzoom.touchEnd', this.onNavTouch), this.onTargetChange();
		}
		onTargetReady(t) {
			t.on('change', this.onTargetChange), t.on('Panzoom.refresh', this.onTargetChange), this.onTargetChange();
		}
		onNavClick(t, e, i) {
			this.onNavTouch(t, t.panzoom, i);
		}
		onNavTouch(t, e, i) {
			var n, s;
			if (Math.abs(e.dragOffset.x) > 3 || Math.abs(e.dragOffset.y) > 3) return;
			const o = i.target,
				{ nav: a, target: r } = this;
			if (!a || !r || !o) return;
			const l = o.closest('[data-index]');
			if ((i.stopPropagation(), i.preventDefault(), !l)) return;
			const c = parseInt(l.dataset.index || '', 10) || 0,
				h = r.getPageForSlide(c),
				d = a.getPageForSlide(c);
			a.slideTo(d), r.slideTo(h, { friction: (null === (s = null === (n = this.nav) || void 0 === n ? void 0 : n.plugins) || void 0 === s ? void 0 : s.Sync.option('friction')) || 0 }), this.markSelectedSlide(c);
		}
		onNavCreateSlide(t, e) {
			e.index === this.selectedIndex && this.markSelectedSlide(e.index);
		}
		onTargetChange() {
			var t, e;
			const { target: i, nav: n } = this;
			if (!i || !n) return;
			if (n.state !== H.Ready || i.state !== H.Ready) return;
			const s = null === (e = null === (t = i.pages[i.page]) || void 0 === t ? void 0 : t.slides[0]) || void 0 === e ? void 0 : e.index,
				o = n.getPageForSlide(s);
			this.markSelectedSlide(s), n.slideTo(o, null === n.prevPage && null === i.prevPage ? { friction: 0 } : void 0);
		}
		markSelectedSlide(t) {
			const e = this.nav;
			e &&
				e.state === H.Ready &&
				((this.selectedIndex = t),
				[...e.slides].map((e) => {
					e.el && e.el.classList[e.index === t ? 'add' : 'remove']('is-nav-selected');
				}));
		}
		attach() {
			const t = this;
			let e = t.options.target,
				i = t.options.nav;
			e ? t.addAsNavFor(e) : i && t.addAsTargetFor(i);
		}
		detach() {
			const t = this,
				e = t.nav,
				i = t.target;
			e && (e.off('ready', t.onNavReady), e.off('createSlide', t.onNavCreateSlide), e.off('Panzoom.click', t.onNavClick), e.off('Panzoom.touchEnd', t.onNavTouch)), (t.nav = null), i && (i.off('ready', t.onTargetReady), i.off('refresh', t.onTargetChange), i.off('change', t.onTargetChange)), (t.target = null);
		}
	}
	Object.defineProperty(U, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: { friction: 0.35 } });
	const G = { Navigation: Z, Dots: X, Sync: U },
		K = 'animationend',
		J = 'isSelected',
		Q = 'slide';
	class tt extends m {
		get axis() {
			return this.isHorizontal ? 'e' : 'f';
		}
		get isEnabled() {
			return this.state === H.Ready;
		}
		get isInfinite() {
			let t = !1;
			const { contentDim: e, viewportDim: i, pages: n, slides: s } = this,
				o = s[0];
			return n.length >= 2 && o && e + o.dim >= i && (t = this.option('infinite')), t;
		}
		get isRTL() {
			return 'rtl' === this.option('direction');
		}
		get isHorizontal() {
			return 'x' === this.option('axis');
		}
		constructor(t, e = {}, i = {}) {
			if (
				(super(),
				Object.defineProperty(this, 'bp', { enumerable: !0, configurable: !0, writable: !0, value: '' }),
				Object.defineProperty(this, 'lp', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'userOptions', { enumerable: !0, configurable: !0, writable: !0, value: {} }),
				Object.defineProperty(this, 'userPlugins', { enumerable: !0, configurable: !0, writable: !0, value: {} }),
				Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: H.Init }),
				Object.defineProperty(this, 'page', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'prevPage', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				Object.defineProperty(this, 'viewport', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'track', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'slides', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				Object.defineProperty(this, 'pages', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				Object.defineProperty(this, 'panzoom', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'inTransition', { enumerable: !0, configurable: !0, writable: !0, value: new Set() }),
				Object.defineProperty(this, 'contentDim', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'viewportDim', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				'string' == typeof t && (t = document.querySelector(t)),
				!t || !S(t))
			)
				throw new Error('No Element found');
			(this.container = t),
				(this.slideNext = F(this.slideNext.bind(this), 150)),
				(this.slidePrev = F(this.slidePrev.bind(this), 150)),
				(this.userOptions = e),
				(this.userPlugins = i),
				queueMicrotask(() => {
					this.processOptions();
				});
		}
		processOptions() {
			var t, e;
			const i = p({}, tt.defaults, this.userOptions);
			let n = '';
			const s = i.breakpoints;
			if (s && u(s)) for (const [t, e] of Object.entries(s)) window.matchMedia(t).matches && u(e) && ((n += t), p(i, e));
			(n === this.bp && this.state !== H.Init) ||
				((this.bp = n),
				this.state === H.Ready && (i.initialSlide = (null === (e = null === (t = this.pages[this.page]) || void 0 === t ? void 0 : t.slides[0]) || void 0 === e ? void 0 : e.index) || 0),
				this.state !== H.Init && this.destroy(),
				super.setOptions(i),
				!1 === this.option('enabled')
					? this.attachEvents()
					: setTimeout(() => {
							this.init();
					  }, 0));
		}
		init() {
			(this.state = H.Init), this.emit('init'), this.attachPlugins(Object.assign(Object.assign({}, tt.Plugins), this.userPlugins)), this.emit('attachPlugins'), this.initLayout(), this.initSlides(), this.updateMetrics(), this.setInitialPosition(), this.initPanzoom(), this.attachEvents(), (this.state = H.Ready), this.emit('ready');
		}
		initLayout() {
			const { container: t } = this,
				e = this.option('classes');
			C(t, this.cn('container')), a(t, e.isLTR, !this.isRTL), a(t, e.isRTL, this.isRTL), a(t, e.isVertical, !this.isHorizontal), a(t, e.isHorizontal, this.isHorizontal);
			let i = this.option('viewport') || t.querySelector(`.${e.viewport}`);
			i || ((i = document.createElement('div')), C(i, e.viewport), i.append(...j(t, `.${e.slide}`)), t.prepend(i)), i.addEventListener('scroll', this.onScroll);
			let n = this.option('track') || t.querySelector(`.${e.track}`);
			n || ((n = document.createElement('div')), C(n, e.track), n.append(...Array.from(i.childNodes))), n.setAttribute('aria-live', 'polite'), i.contains(n) || i.prepend(n), (this.viewport = i), (this.track = n), this.emit('initLayout');
		}
		initSlides() {
			const { track: t } = this;
			if (!t) return;
			const e = [...this.slides],
				i = [];
			[...j(t, `.${this.cn(Q)}`)].forEach((t) => {
				if (S(t)) {
					const e = N({ el: t, isDom: !0, index: this.slides.length });
					i.push(e);
				}
			});
			for (let t of [...(this.option('slides', []) || []), ...e]) i.push(N(t));
			this.slides = i;
			for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
			for (const t of i) this.emit('beforeInitSlide', t, t.index), this.emit('initSlide', t, t.index);
			this.emit('initSlides');
		}
		setInitialPage() {
			const t = this.option('initialSlide');
			this.page = 'number' == typeof t ? this.getPageForSlide(t) : parseInt(this.option('initialPage', 0) + '', 10) || 0;
		}
		setInitialPosition() {
			const { track: t, pages: e, isHorizontal: i } = this;
			if (!t || !e.length) return;
			let n = this.page;
			e[n] || (this.page = n = 0);
			const s = (e[n].pos || 0) * (this.isRTL && i ? 1 : -1),
				o = i ? `${s}px` : '0',
				a = i ? '0' : `${s}px`;
			(t.style.transform = `translate3d(${o}, ${a}, 0) scale(1)`), this.option('adaptiveHeight') && this.setViewportHeight();
		}
		initPanzoom() {
			this.panzoom && (this.panzoom.destroy(), (this.panzoom = null));
			const t = this.option('Panzoom') || {};
			(this.panzoom = new D(this.viewport, p({}, { content: this.track, zoom: !1, panOnlyZoomed: !1, lockAxis: this.isHorizontal ? 'x' : 'y', infinite: this.isInfinite, click: !1, dblClick: !1, touch: (t) => !(this.pages.length < 2 && !t.options.infinite), bounds: () => this.getBounds(), maxVelocity: (t) => (Math.abs(t.target[this.axis] - t.current[this.axis]) < 2 * this.viewportDim ? 100 : 0) }, t))),
				this.panzoom.on('*', (t, e, ...i) => {
					this.emit(`Panzoom.${e}`, t, ...i);
				}),
				this.panzoom.on('decel', this.onDecel),
				this.panzoom.on('refresh', this.onRefresh),
				this.panzoom.on('beforeTransform', this.onBeforeTransform),
				this.panzoom.on('endAnimation', this.onEndAnimation);
		}
		attachEvents() {
			const t = this.container;
			t && (t.addEventListener('click', this.onClick, { passive: !1, capture: !1 }), t.addEventListener('slideTo', this.onSlideTo)), window.addEventListener('resize', this.onResize);
		}
		createPages() {
			let t = [];
			const { contentDim: e, viewportDim: i } = this;
			let n = this.option('slidesPerPage');
			n = ('auto' === n || e <= i) && !1 !== this.option('fill') ? 1 / 0 : parseFloat(n + '');
			let s = 0,
				o = 0,
				a = 0;
			for (const e of this.slides) (!t.length || o + e.dim - i > 0.05 || a >= n) && (t.push(_()), (s = t.length - 1), (o = 0), (a = 0)), t[s].slides.push(e), (o += e.dim + e.gap), a++;
			return t;
		}
		processPages() {
			const t = this.pages,
				{ contentDim: i, viewportDim: n, isInfinite: s } = this,
				o = this.option('center'),
				a = this.option('fill'),
				r = a && o && i > n && !s;
			if (
				(t.forEach((t, e) => {
					var s;
					(t.index = e), (t.pos = (null === (s = t.slides[0]) || void 0 === s ? void 0 : s.pos) || 0), (t.dim = 0);
					for (const [e, i] of t.slides.entries()) (t.dim += i.dim), e < t.slides.length - 1 && (t.dim += i.gap);
					r && t.pos + 0.5 * t.dim < 0.5 * n ? (t.pos = 0) : r && t.pos + 0.5 * t.dim >= i - 0.5 * n ? (t.pos = i - n) : o && (t.pos += -0.5 * (n - t.dim));
				}),
				t.forEach((t) => {
					a && !s && i > n && ((t.pos = Math.max(t.pos, 0)), (t.pos = Math.min(t.pos, i - n))), (t.pos = e(t.pos, 1e3)), (t.dim = e(t.dim, 1e3)), Math.abs(t.pos) <= 0.1 && (t.pos = 0);
				}),
				s)
			)
				return t;
			const l = [];
			let c;
			return (
				t.forEach((t) => {
					const e = Object.assign({}, t);
					c && e.pos === c.pos ? ((c.dim += e.dim), (c.slides = [...c.slides, ...e.slides])) : ((e.index = l.length), (c = e), l.push(e));
				}),
				l
			);
		}
		getPageFromIndex(t = 0) {
			const e = this.pages.length;
			let i;
			return (t = parseInt((t || 0).toString()) || 0), (i = this.isInfinite ? ((t % e) + e) % e : Math.max(Math.min(t, e - 1), 0)), i;
		}
		getSlideMetrics(t) {
			var i, n;
			const s = this.isHorizontal ? 'width' : 'height';
			let o = 0,
				a = 0,
				r = t.el;
			const l = !(!r || r.parentNode);
			if ((r ? (o = parseFloat(r.dataset[s] || '') || 0) : ((r = document.createElement('div')), (r.style.visibility = 'hidden'), (this.track || document.body).prepend(r)), C(r, this.cn(Q) + ' ' + t.class + ' ' + t.customClass), o)) (r.style[s] = `${o}px`), (r.style['width' === s ? 'height' : 'width'] = '');
			else {
				l && (this.track || document.body).prepend(r), (o = r.getBoundingClientRect()[s] * Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1));
				let t = r[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];
				t - 1 > o && (o = t);
			}
			const c = getComputedStyle(r);
			return 'content-box' === c.boxSizing && (this.isHorizontal ? ((o += parseFloat(c.paddingLeft) || 0), (o += parseFloat(c.paddingRight) || 0)) : ((o += parseFloat(c.paddingTop) || 0), (o += parseFloat(c.paddingBottom) || 0))), (a = parseFloat(c[this.isHorizontal ? 'marginRight' : 'marginBottom']) || 0), l ? null === (n = r.parentElement) || void 0 === n || n.removeChild(r) : t.el || r.remove(), { dim: e(o, 1e3), gap: e(a, 1e3) };
		}
		getBounds() {
			const { isInfinite: t, isRTL: e, isHorizontal: i, pages: n } = this;
			let s = { min: 0, max: 0 };
			if (t) s = { min: -1 / 0, max: 1 / 0 };
			else if (n.length) {
				const t = n[0].pos,
					o = n[n.length - 1].pos;
				s = e && i ? { min: t, max: o } : { min: -1 * o, max: -1 * t };
			}
			return { x: i ? s : { min: 0, max: 0 }, y: i ? { min: 0, max: 0 } : s };
		}
		repositionSlides() {
			let t,
				{ isHorizontal: i, isRTL: n, isInfinite: s, viewport: o, viewportDim: a, contentDim: r, page: l, pages: c, slides: h, panzoom: d } = this,
				u = 0,
				p = 0,
				f = 0,
				g = 0;
			d ? (g = -1 * d.current[this.axis]) : c[l] && (g = c[l].pos || 0), (t = i ? (n ? 'right' : 'left') : 'top'), n && i && (g *= -1);
			for (const i of h) {
				const n = i.el;
				n ? ('top' === t ? ((n.style.right = ''), (n.style.left = '')) : (n.style.top = ''), i.index !== u ? (n.style[t] = 0 === p ? '' : `${e(p, 1e3)}px`) : (n.style[t] = ''), (f += i.dim + i.gap), u++) : (p += i.dim + i.gap);
			}
			if (s && f && o) {
				let n = getComputedStyle(o),
					s = 'padding',
					l = i ? 'Right' : 'Bottom',
					c = parseFloat(n[s + (i ? 'Left' : 'Top')]);
				(g -= c), (a += c), (a += parseFloat(n[s + l]));
				for (const i of h) i.el && (e(i.pos) < e(a) && e(i.pos + i.dim + i.gap) < e(g) && e(g) > e(r - a) && (i.el.style[t] = `${e(p + f, 1e3)}px`), e(i.pos + i.gap) >= e(r - a) && e(i.pos) > e(g + a) && e(g) < e(a) && (i.el.style[t] = `-${e(f, 1e3)}px`));
			}
			let m,
				v,
				b = [...this.inTransition];
			if ((b.length > 1 && ((m = c[b[0]]), (v = c[b[1]])), m && v)) {
				let i = 0;
				for (const n of h) n.el ? this.inTransition.has(n.index) && m.slides.indexOf(n) < 0 && (n.el.style[t] = `${e(i + (m.pos - v.pos), 1e3)}px`) : (i += n.dim + n.gap);
			}
		}
		createSlideEl(t) {
			const { track: e, slides: i } = this;
			if (!e || !t) return;
			if (t.el && t.el.parentNode) return;
			const n = t.el || document.createElement('div');
			C(n, this.cn(Q)), C(n, t.class), C(n, t.customClass);
			const s = t.html;
			s && (s instanceof HTMLElement ? n.appendChild(s) : (n.innerHTML = t.html + ''));
			const o = [];
			i.forEach((t, e) => {
				t.el && o.push(e);
			});
			const a = t.index;
			let r = null;
			if (o.length) {
				r = i[o.reduce((t, e) => (Math.abs(e - a) < Math.abs(t - a) ? e : t))];
			}
			const l = r && r.el && r.el.parentNode ? (r.index < t.index ? r.el.nextSibling : r.el) : null;
			e.insertBefore(n, e.contains(l) ? l : null), (t.el = n), this.emit('createSlide', t);
		}
		removeSlideEl(t, e = !1) {
			const i = null == t ? void 0 : t.el;
			if (!i || !i.parentNode) return;
			const n = this.cn(J);
			if ((i.classList.contains(n) && (P(i, n), this.emit('unselectSlide', t)), t.isDom && !e)) return i.removeAttribute('aria-hidden'), i.removeAttribute('data-index'), void (i.style.left = '');
			this.emit('removeSlide', t);
			const s = new CustomEvent(K);
			i.dispatchEvent(s), t.el && (t.el.remove(), (t.el = null));
		}
		transitionTo(t = 0, e = this.option('transition')) {
			var i, n, s, o;
			if (!e) return !1;
			const a = this.page,
				{ pages: r, panzoom: l } = this;
			t = parseInt((t || 0).toString()) || 0;
			const c = this.getPageFromIndex(t);
			if (!l || !r[c] || r.length < 2 || Math.abs(((null === (n = null === (i = r[a]) || void 0 === i ? void 0 : i.slides[0]) || void 0 === n ? void 0 : n.dim) || 0) - this.viewportDim) > 1) return !1;
			let h = t > a ? 1 : -1;
			this.isInfinite && (0 === a && t === r.length - 1 && (h = -1), a === r.length - 1 && 0 === t && (h = 1));
			const d = r[c].pos * (this.isRTL ? 1 : -1);
			if (a === c && Math.abs(d - l.target[this.axis]) < 1) return !1;
			this.clearTransitions();
			const u = l.isResting;
			C(this.container, this.cn('inTransition'));
			const p = (null === (s = r[a]) || void 0 === s ? void 0 : s.slides[0]) || null,
				f = (null === (o = r[c]) || void 0 === o ? void 0 : o.slides[0]) || null;
			this.inTransition.add(f.index), this.createSlideEl(f);
			let g = p.el,
				m = f.el;
			u || e === Q || ((e = 'fadeFast'), (g = null));
			const v = this.isRTL ? 'next' : 'prev',
				b = this.isRTL ? 'prev' : 'next';
			return g && (this.inTransition.add(p.index), (p.transition = e), g.addEventListener(K, this.onAnimationEnd), g.classList.add(`f-${e}Out`, `to-${h > 0 ? b : v}`)), m && ((f.transition = e), m.addEventListener(K, this.onAnimationEnd), m.classList.add(`f-${e}In`, `from-${h > 0 ? v : b}`)), (l.current[this.axis] = d), (l.target[this.axis] = d), l.requestTick(), this.onChange(c), !0;
		}
		manageSlideVisiblity() {
			const t = new Set(),
				e = new Set(),
				i = this.getVisibleSlides(parseFloat(this.option('preload', 0) + '') || 0);
			for (const n of this.slides) i.has(n) ? t.add(n) : e.add(n);
			for (const e of this.inTransition) t.add(this.slides[e]);
			for (const e of t) this.createSlideEl(e), this.lazyLoadSlide(e);
			for (const i of e) t.has(i) || this.removeSlideEl(i);
			this.markSelectedSlides(), this.repositionSlides();
		}
		markSelectedSlides() {
			if (!this.pages[this.page] || !this.pages[this.page].slides) return;
			const t = 'aria-hidden';
			let e = this.cn(J);
			if (e)
				for (const i of this.slides) {
					const n = i.el;
					n && ((n.dataset.index = `${i.index}`), n.classList.contains('f-thumbs__slide') ? (this.getVisibleSlides(0).has(i) ? n.removeAttribute(t) : n.setAttribute(t, 'true')) : this.pages[this.page].slides.includes(i) ? (n.classList.contains(e) || (C(n, e), this.emit('selectSlide', i)), n.removeAttribute(t)) : (n.classList.contains(e) && (P(n, e), this.emit('unselectSlide', i)), n.setAttribute(t, 'true')));
				}
		}
		flipInfiniteTrack() {
			const { axis: t, isHorizontal: e, isInfinite: i, isRTL: n, viewportDim: s, contentDim: o } = this,
				a = this.panzoom;
			if (!a || !i) return;
			let r = a.current[t],
				l = a.target[t] - r,
				c = 0,
				h = 0.5 * s;
			n && e ? (r < -h && ((c = -1), (r += o)), r > o - h && ((c = 1), (r -= o))) : (r > h && ((c = 1), (r -= o)), r < -o + h && ((c = -1), (r += o))), c && ((a.current[t] = r), (a.target[t] = r + l));
		}
		lazyLoadImg(t, e) {
			const i = this,
				n = 'f-fadeIn',
				o = 'is-preloading';
			let a = !1,
				r = null;
			const l = () => {
				a ||
					((a = !0),
					r && (r.remove(), (r = null)),
					P(e, o),
					e.complete &&
						(C(e, n),
						setTimeout(() => {
							P(e, n);
						}, 350)),
					this.option('adaptiveHeight') && t.el && this.pages[this.page].slides.indexOf(t) > -1 && (i.updateMetrics(), i.setViewportHeight()),
					this.emit('load', t));
			};
			C(e, o),
				(e.src = e.dataset.lazySrcset || e.dataset.lazySrc || ''),
				delete e.dataset.lazySrc,
				delete e.dataset.lazySrcset,
				e.addEventListener('error', () => {
					l();
				}),
				e.addEventListener('load', () => {
					l();
				}),
				setTimeout(() => {
					const i = e.parentNode;
					i && t.el && (e.complete ? l() : a || ((r = s(E)), i.insertBefore(r, e)));
				}, 300);
		}
		lazyLoadSlide(t) {
			const e = t && t.el;
			if (!e) return;
			const i = new Set();
			let n = Array.from(e.querySelectorAll('[data-lazy-src],[data-lazy-srcset]'));
			e.dataset.lazySrc && n.push(e),
				n.map((t) => {
					t instanceof HTMLImageElement ? i.add(t) : t instanceof HTMLElement && t.dataset.lazySrc && ((t.style.backgroundImage = `url('${t.dataset.lazySrc}')`), delete t.dataset.lazySrc);
				});
			for (const e of i) this.lazyLoadImg(t, e);
		}
		onAnimationEnd(t) {
			var e;
			const i = t.target,
				n = i ? parseInt(i.dataset.index || '', 10) || 0 : -1,
				s = this.slides[n],
				o = t.animationName;
			if (!i || !s || !o) return;
			const a = !!this.inTransition.has(n) && s.transition;
			a && o.substring(0, a.length + 2) === `f-${a}` && this.inTransition.delete(n), this.inTransition.size || this.clearTransitions(), n === this.page && (null === (e = this.panzoom) || void 0 === e ? void 0 : e.isResting) && this.emit('settle');
		}
		onDecel(t, e = 0, i = 0, n = 0, s = 0) {
			if (this.option('dragFree')) return void this.setPageFromPosition();
			const { isRTL: o, isHorizontal: a, axis: r, pages: l } = this,
				c = l.length,
				h = Math.abs(Math.atan2(i, e) / (Math.PI / 180));
			let d = 0;
			if (((d = h > 45 && h < 135 ? (a ? 0 : i) : a ? e : 0), !c)) return;
			let u = this.page,
				p = o && a ? 1 : -1;
			const f = t.current[r] * p;
			let { pageIndex: g } = this.getPageFromPosition(f);
			Math.abs(d) > 5 ? (l[u].dim < document.documentElement['client' + (this.isHorizontal ? 'Width' : 'Height')] - 1 && (u = g), (u = o && a ? (d < 0 ? u - 1 : u + 1) : d < 0 ? u + 1 : u - 1)) : (u = 0 === n && 0 === s ? u : g), this.slideTo(u, { transition: !1, friction: t.option('decelFriction') });
		}
		onClick(t) {
			const e = t.target,
				i = e && S(e) ? e.dataset : null;
			let n, s;
			i && (void 0 !== i.carouselPage ? ((s = 'slideTo'), (n = i.carouselPage)) : void 0 !== i.carouselNext ? (s = 'slideNext') : void 0 !== i.carouselPrev && (s = 'slidePrev')), s ? (t.preventDefault(), t.stopPropagation(), e && !e.hasAttribute('disabled') && this[s](n)) : this.emit('click', t);
		}
		onSlideTo(t) {
			const e = t.detail || 0;
			this.slideTo(this.getPageForSlide(e), { friction: 0 });
		}
		onChange(t, e = 0) {
			const i = this.page;
			(this.prevPage = i), (this.page = t), this.option('adaptiveHeight') && this.setViewportHeight(), t !== i && (this.markSelectedSlides(), this.emit('change', t, i, e));
		}
		onRefresh() {
			let t = this.contentDim,
				e = this.viewportDim;
			this.updateMetrics(), (this.contentDim === t && this.viewportDim === e) || this.slideTo(this.page, { friction: 0, transition: !1 });
		}
		onScroll() {
			var t;
			null === (t = this.viewport) || void 0 === t || t.scroll(0, 0);
		}
		onResize() {
			this.option('breakpoints') && this.processOptions();
		}
		onBeforeTransform(t) {
			this.lp !== t.current[this.axis] && (this.flipInfiniteTrack(), this.manageSlideVisiblity()), (this.lp = t.current.e);
		}
		onEndAnimation() {
			this.inTransition.size || this.emit('settle');
		}
		reInit(t = null, e = null) {
			this.destroy(), (this.state = H.Init), (this.prevPage = null), (this.userOptions = t || this.userOptions), (this.userPlugins = e || this.userPlugins), this.processOptions();
		}
		slideTo(t = 0, { friction: e = this.option('friction'), transition: i = this.option('transition') } = {}) {
			if (this.state === H.Destroy) return;
			t = parseInt((t || 0).toString()) || 0;
			const n = this.getPageFromIndex(t),
				{ axis: s, isHorizontal: o, isRTL: a, pages: r, panzoom: l } = this,
				c = r.length,
				h = a && o ? 1 : -1;
			if (!l || !c) return;
			if (this.page !== n) {
				const e = new Event('beforeChange', { bubbles: !0, cancelable: !0 });
				if ((this.emit('beforeChange', e, t), e.defaultPrevented)) return;
			}
			if (this.transitionTo(t, i)) return;
			let d = r[n].pos;
			if (this.isInfinite) {
				const e = this.contentDim,
					i = l.target[s] * h;
				if (2 === c) d += e * Math.floor(parseFloat(t + '') / 2);
				else {
					d = [d, d - e, d + e].reduce(function (t, e) {
						return Math.abs(e - i) < Math.abs(t - i) ? e : t;
					});
				}
			}
			(d *= h), Math.abs(l.target[s] - d) < 1 || (l.panTo({ x: o ? d : 0, y: o ? 0 : d, friction: e }), this.onChange(n));
		}
		slideToClosest(t) {
			if (this.panzoom) {
				const { pageIndex: e } = this.getPageFromPosition();
				this.slideTo(e, t);
			}
		}
		slideNext() {
			this.slideTo(this.page + 1);
		}
		slidePrev() {
			this.slideTo(this.page - 1);
		}
		clearTransitions() {
			this.inTransition.clear(), P(this.container, this.cn('inTransition'));
			const t = ['to-prev', 'to-next', 'from-prev', 'from-next'];
			for (const e of this.slides) {
				const i = e.el;
				if (i) {
					i.removeEventListener(K, this.onAnimationEnd), i.classList.remove(...t);
					const n = e.transition;
					n && i.classList.remove(`f-${n}Out`, `f-${n}In`);
				}
			}
			this.manageSlideVisiblity();
		}
		addSlide(t, e) {
			var i, n, s, o;
			const a = this.panzoom,
				r = (null === (i = this.pages[this.page]) || void 0 === i ? void 0 : i.pos) || 0,
				l = (null === (n = this.pages[this.page]) || void 0 === n ? void 0 : n.dim) || 0,
				c = this.contentDim < this.viewportDim;
			let h = Array.isArray(e) ? e : [e];
			const d = [];
			for (const t of h) d.push(N(t));
			this.slides.splice(t, 0, ...d);
			for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
			for (const t of d) this.emit('beforeInitSlide', t, t.index);
			if ((this.page >= t && (this.page += d.length), this.updateMetrics(), a)) {
				const e = (null === (s = this.pages[this.page]) || void 0 === s ? void 0 : s.pos) || 0,
					i = (null === (o = this.pages[this.page]) || void 0 === o ? void 0 : o.dim) || 0,
					n = this.pages.length || 1,
					h = this.isRTL ? l - i : i - l,
					d = this.isRTL ? r - e : e - r;
				c && 1 === n ? (t <= this.page && ((a.current[this.axis] -= h), (a.target[this.axis] -= h)), a.panTo({ [this.isHorizontal ? 'x' : 'y']: -1 * e })) : d && t <= this.page && ((a.target[this.axis] -= d), (a.current[this.axis] -= d), a.requestTick());
			}
			for (const t of d) this.emit('initSlide', t, t.index);
		}
		prependSlide(t) {
			this.addSlide(0, t);
		}
		appendSlide(t) {
			this.addSlide(this.slides.length, t);
		}
		removeSlide(t) {
			const e = this.slides.length;
			t = ((t % e) + e) % e;
			const i = this.slides[t];
			if (i) {
				this.removeSlideEl(i, !0), this.slides.splice(t, 1);
				for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
				this.updateMetrics(), this.slideTo(this.page, { friction: 0, transition: !1 }), this.emit('destroySlide', i);
			}
		}
		updateMetrics() {
			const { panzoom: t, viewport: i, track: n, slides: s, isHorizontal: o, isInfinite: a } = this;
			if (!n) return;
			const r = o ? 'width' : 'height',
				l = o ? 'offsetWidth' : 'offsetHeight';
			if (i) {
				let t = Math.max(i[l], e(i.getBoundingClientRect()[r], 1e3)),
					n = getComputedStyle(i),
					s = 'padding',
					a = o ? 'Right' : 'Bottom';
				(t -= parseFloat(n[s + (o ? 'Left' : 'Top')]) + parseFloat(n[s + a])), (this.viewportDim = t);
			}
			let c,
				h = 0;
			for (const [t, i] of s.entries()) {
				let n = 0,
					o = 0;
				!i.el && c ? ((n = c.dim), (o = c.gap)) : (({ dim: n, gap: o } = this.getSlideMetrics(i)), (c = i)), (n = e(n, 1e3)), (o = e(o, 1e3)), (i.dim = n), (i.gap = o), (i.pos = h), (h += n), (a || t < s.length - 1) && (h += o);
			}
			(h = e(h, 1e3)), (this.contentDim = h), t && ((t.contentRect[r] = h), (t.contentRect[o ? 'fullWidth' : 'fullHeight'] = h)), (this.pages = this.createPages()), (this.pages = this.processPages()), this.state === H.Init && this.setInitialPage(), (this.page = Math.max(0, Math.min(this.page, this.pages.length - 1))), this.manageSlideVisiblity(), this.emit('refresh');
		}
		getProgress(t, i = !1, n = !1) {
			void 0 === t && (t = this.page);
			const s = this,
				o = s.panzoom,
				a = s.contentDim,
				r = s.pages[t] || 0;
			if (!r || !o) return t > this.page ? -1 : 1;
			let l = -1 * o.current.e,
				c = e((l - r.pos) / (1 * r.dim), 1e3),
				h = c,
				d = c;
			this.isInfinite && !0 !== n && ((h = e((l - r.pos + a) / (1 * r.dim), 1e3)), (d = e((l - r.pos - a) / (1 * r.dim), 1e3)));
			let u = [c, h, d].reduce(function (t, e) {
				return Math.abs(e) < Math.abs(t) ? e : t;
			});
			return i ? u : u > 1 ? 1 : u < -1 ? -1 : u;
		}
		setViewportHeight() {
			const { page: t, pages: e, viewport: i, isHorizontal: n } = this;
			if (!i || !e[t]) return;
			let s = 0;
			n &&
				this.track &&
				((this.track.style.height = 'auto'),
				e[t].slides.forEach((t) => {
					t.el && (s = Math.max(s, t.el.offsetHeight));
				})),
				(i.style.height = s ? `${s}px` : '');
		}
		getPageForSlide(t) {
			for (const e of this.pages) for (const i of e.slides) if (i.index === t) return e.index;
			return -1;
		}
		getVisibleSlides(t = 0) {
			var e;
			const i = new Set();
			let { panzoom: n, contentDim: s, viewportDim: o, pages: a, page: r } = this;
			if (o) {
				s = s + (null === (e = this.slides[this.slides.length - 1]) || void 0 === e ? void 0 : e.gap) || 0;
				let l = 0;
				(l = n && n.state !== v.Init && n.state !== v.Destroy ? -1 * n.current[this.axis] : (a[r] && a[r].pos) || 0), this.isInfinite && (l -= Math.floor(l / s) * s), this.isRTL && this.isHorizontal && (l *= -1);
				const c = l - o * t,
					h = l + o * (t + 1),
					d = this.isInfinite ? [-1, 0, 1] : [0];
				for (const t of this.slides)
					for (const e of d) {
						const n = t.pos + e * s,
							o = n + t.dim + t.gap;
						n < h && o > c && i.add(t);
					}
			}
			return i;
		}
		getPageFromPosition(t) {
			const { viewportDim: e, contentDim: i, slides: n, pages: s, panzoom: o } = this,
				a = s.length,
				r = n.length,
				l = n[0],
				c = n[r - 1],
				h = this.option('center');
			let d = 0,
				u = 0,
				p = 0,
				f = void 0 === t ? -1 * ((null == o ? void 0 : o.target[this.axis]) || 0) : t;
			h && (f += 0.5 * e), this.isInfinite ? (f < l.pos - 0.5 * c.gap && ((f -= i), (p = -1)), f > c.pos + c.dim + 0.5 * c.gap && ((f -= i), (p = 1))) : (f = Math.max(l.pos || 0, Math.min(f, c.pos)));
			let g = c,
				m = n.find((t) => {
					const e = t.pos - 0.5 * g.gap,
						i = t.pos + t.dim + 0.5 * t.gap;
					return (g = t), f >= e && f < i;
				});
			return m || (m = c), (u = this.getPageForSlide(m.index)), (d = u + p * a), { page: d, pageIndex: u };
		}
		setPageFromPosition() {
			const { pageIndex: t } = this.getPageFromPosition();
			this.onChange(t);
		}
		destroy() {
			if ([H.Destroy].includes(this.state)) return;
			this.state = H.Destroy;
			const { container: t, viewport: e, track: i, slides: n, panzoom: s } = this,
				o = this.option('classes');
			t.removeEventListener('click', this.onClick, { passive: !1, capture: !1 }),
				t.removeEventListener('slideTo', this.onSlideTo),
				window.removeEventListener('resize', this.onResize),
				s && (s.destroy(), (this.panzoom = null)),
				n &&
					n.forEach((t) => {
						this.removeSlideEl(t);
					}),
				this.detachPlugins(),
				e && (e.removeEventListener('scroll', this.onScroll), e.offsetParent && i && i.offsetParent && e.replaceWith(...i.childNodes));
			for (const [e, i] of Object.entries(o)) 'container' !== e && i && t.classList.remove(i);
			(this.track = null), (this.viewport = null), (this.page = 0), (this.slides = []);
			const a = this.events.get('ready');
			(this.events = new Map()), a && this.events.set('ready', a);
		}
	}
	Object.defineProperty(tt, 'Panzoom', { enumerable: !0, configurable: !0, writable: !0, value: D }), Object.defineProperty(tt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: B }), Object.defineProperty(tt, 'Plugins', { enumerable: !0, configurable: !0, writable: !0, value: G });
	const et = function (t) {
			if (!S(t)) return 0;
			const e = window.scrollY,
				i = window.innerHeight,
				n = e + i,
				s = t.getBoundingClientRect(),
				o = s.y + e,
				a = s.height,
				r = o + a;
			if (e > r || n < o) return 0;
			if (e < o && n > r) return 100;
			if (o < e && r > n) return 100;
			let l = a;
			o < e && (l -= e - o), r > n && (l -= r - n);
			const c = (l / i) * 100;
			return Math.round(c);
		},
		it = !('undefined' == typeof window || !window.document || !window.document.createElement);
	let nt;
	const st = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)', 'iframe', 'object', 'embed', 'video', 'audio', '[contenteditable]', '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])'].join(','),
		ot = (t) => {
			if (t && it) {
				void 0 === nt &&
					document.createElement('div').focus({
						get preventScroll() {
							return (nt = !0), !1;
						}
					});
				try {
					if (nt) t.focus({ preventScroll: !0 });
					else {
						const e = window.scrollY || document.body.scrollTop,
							i = window.scrollX || document.body.scrollLeft;
						t.focus(), document.body.scrollTo({ top: e, left: i, behavior: 'auto' });
					}
				} catch (t) {}
			}
		},
		at = () => {
			const t = document;
			let e,
				i = '',
				n = '',
				s = '';
			return (
				t.fullscreenEnabled ? ((i = 'requestFullscreen'), (n = 'exitFullscreen'), (s = 'fullscreenElement')) : t.webkitFullscreenEnabled && ((i = 'webkitRequestFullscreen'), (n = 'webkitExitFullscreen'), (s = 'webkitFullscreenElement')),
				i &&
					(e = {
						request: function (e = t.documentElement) {
							return 'webkitRequestFullscreen' === i ? e[i](Element.ALLOW_KEYBOARD_INPUT) : e[i]();
						},
						exit: function () {
							return t[s] && t[n]();
						},
						isFullscreen: function () {
							return t[s];
						}
					}),
				e
			);
		},
		rt = {
			animated: !0,
			autoFocus: !0,
			backdropClick: 'close',
			Carousel: { classes: { container: 'fancybox__carousel', viewport: 'fancybox__viewport', track: 'fancybox__track', slide: 'fancybox__slide' } },
			closeButton: 'auto',
			closeExisting: !1,
			commonCaption: !1,
			compact: () => window.matchMedia('(max-width: 578px), (max-height: 578px)').matches,
			contentClick: 'toggleZoom',
			contentDblClick: !1,
			defaultType: 'image',
			defaultDisplay: 'flex',
			dragToClose: !0,
			Fullscreen: { autoStart: !1 },
			groupAll: !1,
			groupAttr: 'data-fancybox',
			hideClass: 'f-fadeOut',
			hideScrollbar: !0,
			idle: 3500,
			keyboard: { Escape: 'close', Delete: 'close', Backspace: 'close', PageUp: 'next', PageDown: 'prev', ArrowUp: 'prev', ArrowDown: 'next', ArrowRight: 'next', ArrowLeft: 'prev' },
			l10n: Object.assign(Object.assign({}, y), {
				CLOSE: 'Close',
				NEXT: 'Next',
				PREV: 'Previous',
				MODAL: 'You can close this modal content with the ESC key',
				ERROR: 'Something Went Wrong, Please Try Again Later',
				IMAGE_ERROR: 'Image Not Found',
				ELEMENT_NOT_FOUND: 'HTML Element Not Found',
				AJAX_NOT_FOUND: 'Error Loading AJAX : Not Found',
				AJAX_FORBIDDEN: 'Error Loading AJAX : Forbidden',
				IFRAME_ERROR: 'Error Loading Page',
				TOGGLE_ZOOM: 'Toggle zoom level',
				TOGGLE_THUMBS: 'Toggle thumbnails',
				TOGGLE_SLIDESHOW: 'Toggle slideshow',
				TOGGLE_FULLSCREEN: 'Toggle full-screen mode',
				DOWNLOAD: 'Download'
			}),
			parentEl: null,
			placeFocusBack: !0,
			showClass: 'f-zoomInUp',
			startIndex: 0,
			tpl: { closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>', main: '<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">\n    <div class="fancybox__backdrop"></div>\n    <div class="fancybox__carousel"></div>\n    <div class="fancybox__footer"></div>\n  </div>' },
			trapFocus: !0,
			wheel: 'zoom'
		};
	var lt, ct;
	!(function (t) {
		(t[(t.Init = 0)] = 'Init'), (t[(t.Ready = 1)] = 'Ready'), (t[(t.Closing = 2)] = 'Closing'), (t[(t.CustomClosing = 3)] = 'CustomClosing'), (t[(t.Destroy = 4)] = 'Destroy');
	})(lt || (lt = {})),
		(function (t) {
			(t[(t.Loading = 0)] = 'Loading'), (t[(t.Opening = 1)] = 'Opening'), (t[(t.Ready = 2)] = 'Ready'), (t[(t.Closing = 3)] = 'Closing');
		})(ct || (ct = {}));
	let ht = '',
		dt = !1,
		ut = !1,
		pt = null;
	const ft = () => {
			let t = '',
				e = '';
			const i = Ae.getInstance();
			if (i) {
				const n = i.carousel,
					s = i.getSlide();
				if (n && s) {
					let o = s.slug || void 0,
						a = s.triggerEl || void 0;
					(e = o || i.option('slug') || ''), !e && a && a.dataset && (e = a.dataset.fancybox || ''), e && 'true' !== e && (t = '#' + e + (!o && n.slides.length > 1 ? '-' + (s.index + 1) : ''));
				}
			}
			return { hash: t, slug: e, index: 1 };
		},
		gt = () => {
			const t = new URL(document.URL).hash,
				e = t.slice(1).split('-'),
				i = e[e.length - 1],
				n = (i && /^\+?\d+$/.test(i) && parseInt(e.pop() || '1', 10)) || 1;
			return { hash: t, slug: e.join('-'), index: n };
		},
		mt = () => {
			const { slug: t, index: e } = gt();
			if (!t) return;
			let i = document.querySelector(`[data-slug="${t}"]`);
			if ((i && i.dispatchEvent(new CustomEvent('click', { bubbles: !0, cancelable: !0 })), Ae.getInstance())) return;
			const n = document.querySelectorAll(`[data-fancybox="${t}"]`);
			n.length && ((i = n[e - 1]), i && i.dispatchEvent(new CustomEvent('click', { bubbles: !0, cancelable: !0 })));
		},
		vt = () => {
			if (!1 === Ae.defaults.Hash) return;
			const t = Ae.getInstance();
			if (!1 === (null == t ? void 0 : t.options.Hash)) return;
			const { slug: e, index: i } = gt(),
				{ slug: n } = ft();
			t && (e === n ? t.jumpTo(i - 1) : ((dt = !0), t.close())), mt();
		},
		bt = () => {
			pt && clearTimeout(pt),
				queueMicrotask(() => {
					vt();
				});
		},
		yt = () => {
			window.addEventListener('hashchange', bt, !1),
				setTimeout(() => {
					vt();
				}, 500);
		};
	it && (/complete|interactive|loaded/.test(document.readyState) ? yt() : document.addEventListener('DOMContentLoaded', yt));
	const wt = 'is-zooming-in';
	class xt extends $ {
		onCreateSlide(t, e, i) {
			const n = this.instance.optionFor(i, 'src') || '';
			i.el && 'image' === i.type && 'string' == typeof n && this.setImage(i, n);
		}
		onRemoveSlide(t, e, i) {
			i.panzoom && i.panzoom.destroy(), (i.panzoom = void 0), (i.imageEl = void 0);
		}
		onChange(t, e, i, n) {
			P(this.instance.container, wt);
			for (const t of e.slides) {
				const e = t.panzoom;
				e && t.index !== i && e.reset(0.35);
			}
		}
		onClose() {
			var t;
			const e = this.instance,
				i = e.container,
				n = e.getSlide();
			if (!i || !i.parentElement || !n) return;
			const { el: s, contentEl: o, panzoom: a, thumbElSrc: r } = n;
			if (!s || !r || !o || !a || a.isContentLoading || a.state === v.Init || a.state === v.Destroy) return;
			a.updateMetrics();
			let l = this.getZoomInfo(n);
			if (!l) return;
			(this.instance.state = lt.CustomClosing), i.classList.remove(wt), i.classList.add('is-zooming-out'), (o.style.backgroundImage = `url('${r}')`);
			const c = i.getBoundingClientRect();
			1 === ((null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1) && Object.assign(i.style, { position: 'absolute', top: `${i.offsetTop + window.scrollY}px`, left: `${i.offsetLeft + window.scrollX}px`, bottom: 'auto', right: 'auto', width: `${c.width}px`, height: `${c.height}px`, overflow: 'hidden' });
			const { x: h, y: d, scale: u, opacity: p } = l;
			if (p) {
				const t = ((t, e, i, n) => {
					const s = e - t,
						o = n - i;
					return (e) => i + (((e - t) / s) * o || 0);
				})(a.scale, u, 1, 0);
				a.on('afterTransform', () => {
					o.style.opacity = t(a.scale) + '';
				});
			}
			a.on('endAnimation', () => {
				e.destroy();
			}),
				(a.target.a = u),
				(a.target.b = 0),
				(a.target.c = 0),
				(a.target.d = u),
				a.panTo({ x: h, y: d, scale: u, friction: p ? 0.2 : 0.33, ignoreBounds: !0 }),
				a.isResting && e.destroy();
		}
		setImage(t, e) {
			const i = this.instance;
			(t.src = e),
				this.process(t, e).then(
					(e) => {
						const { contentEl: n, imageEl: s, thumbElSrc: o, el: a } = t;
						if (i.isClosing() || !n || !s) return;
						n.offsetHeight;
						const r = !!i.isOpeningSlide(t) && this.getZoomInfo(t);
						if (this.option('protected') && a) {
							a.addEventListener('contextmenu', (t) => {
								t.preventDefault();
							});
							const t = document.createElement('div');
							C(t, 'fancybox-protected'), n.appendChild(t);
						}
						if (o && r) {
							const s = e.contentRect,
								a = Math.max(s.fullWidth, s.fullHeight);
							let c = null;
							!r.opacity && a > 1200 && ((c = document.createElement('img')), C(c, 'fancybox-ghost'), (c.src = o), n.appendChild(c));
							const h = () => {
								c &&
									(C(c, 'f-fadeFastOut'),
									setTimeout(() => {
										c && (c.remove(), (c = null));
									}, 200));
							};
							((l = o),
							new Promise((t, e) => {
								const i = new Image();
								(i.onload = t), (i.onerror = e), (i.src = l);
							})).then(
								() => {
									i.hideLoading(t),
										(t.state = ct.Opening),
										this.instance.emit('reveal', t),
										this.zoomIn(t).then(
											() => {
												h(), this.instance.done(t);
											},
											() => {}
										),
										c &&
											setTimeout(
												() => {
													h();
												},
												a > 2500 ? 800 : 200
											);
								},
								() => {
									i.hideLoading(t), i.revealContent(t);
								}
							);
						} else {
							const n = this.optionFor(t, 'initialSize'),
								s = this.optionFor(t, 'zoom'),
								o = { event: i.prevMouseMoveEvent || i.options.event, friction: s ? 0.12 : 0 };
							let a = i.optionFor(t, 'showClass') || void 0,
								r = !0;
							i.isOpeningSlide(t) && ('full' === n ? e.zoomToFull(o) : 'cover' === n ? e.zoomToCover(o) : 'max' === n ? e.zoomToMax(o) : (r = !1), e.stop('current')), r && a && (a = e.isDragging ? 'f-fadeIn' : ''), i.hideLoading(t), i.revealContent(t, a);
						}
						var l;
					},
					() => {
						i.setError(t, '{{IMAGE_ERROR}}');
					}
				);
		}
		process(t, e) {
			return new Promise((i, n) => {
				var o;
				const a = this.instance,
					r = t.el;
				a.clearContent(t), a.showLoading(t);
				let l = this.optionFor(t, 'content');
				if (('string' == typeof l && (l = s(l)), !l || !S(l))) {
					if (((l = document.createElement('img')), l instanceof HTMLImageElement)) {
						let i = '',
							n = t.caption;
						(i = 'string' == typeof n && n ? n.replace(/<[^>]+>/gi, '').substring(0, 1e3) : `Image ${t.index + 1} of ${(null === (o = a.carousel) || void 0 === o ? void 0 : o.pages.length) || 1}`), (l.src = e || ''), (l.alt = i), (l.draggable = !1), t.srcset && l.setAttribute('srcset', t.srcset), this.instance.isOpeningSlide(t) && (l.fetchPriority = 'high');
					}
					t.sizes && l.setAttribute('sizes', t.sizes);
				}
				C(l, 'fancybox-image'), (t.imageEl = l), a.setContent(t, l, !1);
				t.panzoom = new D(
					r,
					p({ transformParent: !0 }, this.option('Panzoom') || {}, {
						content: l,
						width: (e, i) => a.optionFor(t, 'width', 'auto', i) || 'auto',
						height: (e, i) => a.optionFor(t, 'height', 'auto', i) || 'auto',
						wheel: () => {
							const t = a.option('wheel');
							return ('zoom' === t || 'pan' == t) && t;
						},
						click: (e, i) => {
							var n, s;
							if (a.isCompact || a.isClosing()) return !1;
							if (t.index !== (null === (n = a.getSlide()) || void 0 === n ? void 0 : n.index)) return !1;
							if (i) {
								const t = i.composedPath()[0];
								if (['A', 'BUTTON', 'TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].includes(t.nodeName)) return !1;
							}
							let o = !i || (i.target && (null === (s = t.contentEl) || void 0 === s ? void 0 : s.contains(i.target)));
							return a.option(o ? 'contentClick' : 'backdropClick') || !1;
						},
						dblClick: () => (a.isCompact ? 'toggleZoom' : a.option('contentDblClick') || !1),
						spinner: !1,
						panOnlyZoomed: !0,
						wheelLimit: 1 / 0,
						on: {
							ready: (t) => {
								i(t);
							},
							error: () => {
								n();
							},
							destroy: () => {
								n();
							}
						}
					})
				);
			});
		}
		zoomIn(t) {
			return new Promise((e, i) => {
				const n = this.instance,
					s = n.container,
					{ panzoom: o, contentEl: a, el: r } = t;
				o && o.updateMetrics();
				const l = this.getZoomInfo(t);
				if (!(l && r && a && o && s)) return void i();
				const { x: c, y: h, scale: d, opacity: u } = l,
					p = () => {
						t.state !== ct.Closing && (u && (a.style.opacity = Math.max(Math.min(1, 1 - (1 - o.scale) / (1 - d)), 0) + ''), o.scale >= 1 && o.scale > o.targetScale - 0.1 && e(o));
					},
					f = (t) => {
						((t.scale < 0.99 || t.scale > 1.01) && !t.isDragging) || (P(s, wt), (a.style.opacity = ''), t.off('endAnimation', f), t.off('touchStart', f), t.off('afterTransform', p), e(t));
					};
				o.on('endAnimation', f),
					o.on('touchStart', f),
					o.on('afterTransform', p),
					o.on(['error', 'destroy'], () => {
						i();
					}),
					o.panTo({ x: c, y: h, scale: d, friction: 0, ignoreBounds: !0 }),
					o.stop('current');
				const g = { event: 'mousemove' === o.panMode ? n.prevMouseMoveEvent || n.options.event : void 0 },
					m = this.optionFor(t, 'initialSize');
				C(s, wt), n.hideLoading(t), 'full' === m ? o.zoomToFull(g) : 'cover' === m ? o.zoomToCover(g) : 'max' === m ? o.zoomToMax(g) : o.reset(0.172);
			});
		}
		getZoomInfo(t) {
			const { el: e, imageEl: i, thumbEl: n, panzoom: s } = t,
				o = this.instance,
				a = o.container;
			if (!e || !i || !n || !s || et(n) < 3 || !this.optionFor(t, 'zoom') || !a || o.state === lt.Destroy) return !1;
			if ('0' === getComputedStyle(a).getPropertyValue('--f-images-zoom')) return !1;
			const r = window.visualViewport || null;
			if (1 !== (r ? r.scale : 1)) return !1;
			let { top: l, left: c, width: h, height: d } = n.getBoundingClientRect(),
				{ top: u, left: p, fitWidth: f, fitHeight: g } = s.contentRect;
			if (!(h && d && f && g)) return !1;
			const m = s.container.getBoundingClientRect();
			(p += m.left), (u += m.top);
			const v = -1 * (p + 0.5 * f - (c + 0.5 * h)),
				b = -1 * (u + 0.5 * g - (l + 0.5 * d)),
				y = h / f;
			let w = this.option('zoomOpacity') || !1;
			return 'auto' === w && (w = Math.abs(h / d - f / g) > 0.1), { x: v, y: b, scale: y, opacity: w };
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('Carousel.change', t.onChange), e.on('Carousel.createSlide', t.onCreateSlide), e.on('Carousel.removeSlide', t.onRemoveSlide), e.on('close', t.onClose);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('Carousel.change', t.onChange), e.off('Carousel.createSlide', t.onCreateSlide), e.off('Carousel.removeSlide', t.onRemoveSlide), e.off('close', t.onClose);
		}
	}
	Object.defineProperty(xt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: { initialSize: 'fit', Panzoom: { maxScale: 1 }, protected: !1, zoom: !0, zoomOpacity: 'auto' } }), 'function' == typeof SuppressedError && SuppressedError;
	const Et = 'html',
		St = 'image',
		Pt = 'map',
		Ct = 'youtube',
		Tt = 'vimeo',
		Mt = 'html5video',
		Ot = (t, e = {}) => {
			const i = new URL(t),
				n = new URLSearchParams(i.search),
				s = new URLSearchParams();
			for (const [t, i] of [...n, ...Object.entries(e)]) {
				let e = i + '';
				if ('t' === t) {
					let t = e.match(/((\d*)m)?(\d*)s?/);
					t && s.set('start', 60 * parseInt(t[2] || '0') + parseInt(t[3] || '0') + '');
				} else s.set(t, e);
			}
			let o = s + '',
				a = t.match(/#t=((.*)?\d+s)/);
			return a && (o += `#t=${a[1]}`), o;
		},
		At = {
			ajax: null,
			autoSize: !0,
			iframeAttr: { allow: 'autoplay; fullscreen', scrolling: 'auto' },
			preload: !0,
			videoAutoplay: !0,
			videoRatio: 16 / 9,
			videoTpl: '<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">\n  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos.</video>',
			videoFormat: '',
			vimeo: { byline: 1, color: '00adef', controls: 1, dnt: 1, muted: 0 },
			youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 }
		},
		Lt = ['image', 'html', 'ajax', 'inline', 'clone', 'iframe', 'map', 'pdf', 'html5video', 'youtube', 'vimeo'];
	class zt extends $ {
		onBeforeInitSlide(t, e, i) {
			this.processType(i);
		}
		onCreateSlide(t, e, i) {
			this.setContent(i);
		}
		onClearContent(t, e) {
			e.xhr && (e.xhr.abort(), (e.xhr = null));
			const i = e.iframeEl;
			i && ((i.onload = i.onerror = null), (i.src = '//about:blank'), (e.iframeEl = null));
			const n = e.contentEl,
				s = e.placeholderEl;
			if ('inline' === e.type && n && s)
				n.classList.remove('fancybox__content'),
					'none' !== getComputedStyle(n).getPropertyValue('display') && (n.style.display = 'none'),
					setTimeout(() => {
						s && (n && s.parentNode && s.parentNode.insertBefore(n, s), s.remove());
					}, 0),
					(e.contentEl = void 0),
					(e.placeholderEl = void 0);
			else for (; e.el && e.el.firstChild; ) e.el.removeChild(e.el.firstChild);
		}
		onSelectSlide(t, e, i) {
			i.state === ct.Ready && this.playVideo();
		}
		onUnselectSlide(t, e, i) {
			var n, s;
			if (i.type === Mt) {
				try {
					null === (s = null === (n = i.el) || void 0 === n ? void 0 : n.querySelector('video')) || void 0 === s || s.pause();
				} catch (t) {}
				return;
			}
			let o;
			i.type === Tt ? (o = { method: 'pause', value: 'true' }) : i.type === Ct && (o = { event: 'command', func: 'pauseVideo' }), o && i.iframeEl && i.iframeEl.contentWindow && i.iframeEl.contentWindow.postMessage(JSON.stringify(o), '*'), i.poller && clearTimeout(i.poller);
		}
		onDone(t, e) {
			t.isCurrentSlide(e) && !t.isClosing() && this.playVideo();
		}
		onRefresh(t, e) {
			e.slides.forEach((t) => {
				t.el && (this.resizeIframe(t), this.setAspectRatio(t));
			});
		}
		onMessage(t) {
			try {
				let e = JSON.parse(t.data);
				if ('https://player.vimeo.com' === t.origin) {
					if ('ready' === e.event) for (let e of Array.from(document.getElementsByClassName('fancybox__iframe'))) e instanceof HTMLIFrameElement && e.contentWindow === t.source && (e.dataset.ready = 'true');
				} else if (t.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && 'onReady' === e.event) {
					const t = document.getElementById(e.id);
					t && (t.dataset.ready = 'true');
				}
			} catch (t) {}
		}
		loadAjaxContent(t) {
			const e = this.instance.optionFor(t, 'src') || '';
			this.instance.showLoading(t);
			const i = this.instance,
				n = new XMLHttpRequest();
			i.showLoading(t),
				(n.onreadystatechange = function () {
					n.readyState === XMLHttpRequest.DONE && i.state === lt.Ready && (i.hideLoading(t), 200 === n.status ? i.setContent(t, n.responseText) : i.setError(t, 404 === n.status ? '{{AJAX_NOT_FOUND}}' : '{{AJAX_FORBIDDEN}}'));
				});
			const s = t.ajax || null;
			n.open(s ? 'POST' : 'GET', e + ''), n.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'), n.setRequestHeader('X-Requested-With', 'XMLHttpRequest'), n.send(s), (t.xhr = n);
		}
		setInlineContent(t) {
			let e = null;
			if (S(t.src)) e = t.src;
			else if ('string' == typeof t.src) {
				const i = t.src.split('#', 2).pop();
				e = i ? document.getElementById(i) : null;
			}
			if (e) {
				if ('clone' === t.type || e.closest('.fancybox__slide')) {
					e = e.cloneNode(!0);
					const i = e.dataset.animationName;
					i && (e.classList.remove(i), delete e.dataset.animationName);
					let n = e.getAttribute('id');
					(n = n ? `${n}--clone` : `clone-${this.instance.id}-${t.index}`), e.setAttribute('id', n);
				} else if (e.parentNode) {
					const i = document.createElement('div');
					i.classList.add('fancybox-placeholder'), e.parentNode.insertBefore(i, e), (t.placeholderEl = i);
				}
				this.instance.setContent(t, e);
			} else this.instance.setError(t, '{{ELEMENT_NOT_FOUND}}');
		}
		setIframeContent(t) {
			const { src: e, el: i } = t;
			if (!e || 'string' != typeof e || !i) return;
			i.classList.add('is-loading');
			const n = this.instance,
				s = document.createElement('iframe');
			(s.className = 'fancybox__iframe'), s.setAttribute('id', `fancybox__iframe_${n.id}_${t.index}`);
			for (const [e, i] of Object.entries(this.optionFor(t, 'iframeAttr') || {})) s.setAttribute(e, i);
			(s.onerror = () => {
				n.setError(t, '{{IFRAME_ERROR}}');
			}),
				(t.iframeEl = s);
			const o = this.optionFor(t, 'preload');
			if ('iframe' !== t.type || !1 === o) return s.setAttribute('src', t.src + ''), n.setContent(t, s, !1), this.resizeIframe(t), void n.revealContent(t);
			n.showLoading(t),
				(s.onload = () => {
					if (!s.src.length) return;
					const e = 'true' !== s.dataset.ready;
					(s.dataset.ready = 'true'), this.resizeIframe(t), e ? n.revealContent(t) : n.hideLoading(t);
				}),
				s.setAttribute('src', e),
				n.setContent(t, s, !1);
		}
		resizeIframe(t) {
			const { type: e, iframeEl: i } = t;
			if (e === Ct || e === Tt) return;
			const n = null == i ? void 0 : i.parentElement;
			if (!i || !n) return;
			let s = t.autoSize;
			void 0 === s && (s = this.optionFor(t, 'autoSize'));
			let o = t.width || 0,
				a = t.height || 0;
			o && a && (s = !1);
			const r = n && n.style;
			if (!1 !== t.preload && !1 !== s && r)
				try {
					const t = window.getComputedStyle(n),
						e = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight),
						s = parseFloat(t.paddingTop) + parseFloat(t.paddingBottom),
						l = i.contentWindow;
					if (l) {
						const t = l.document,
							i = t.getElementsByTagName(Et)[0],
							n = t.body;
						(r.width = ''), (n.style.overflow = 'hidden'), (o = o || i.scrollWidth + e), (r.width = `${o}px`), (n.style.overflow = ''), (r.flex = '0 0 auto'), (r.height = `${n.scrollHeight}px`), (a = i.scrollHeight + s);
					}
				} catch (t) {}
			if (o || a) {
				const t = { flex: '0 1 auto', width: '', height: '' };
				o && 'auto' !== o && (t.width = `${o}px`), a && 'auto' !== a && (t.height = `${a}px`), Object.assign(r, t);
			}
		}
		playVideo() {
			const t = this.instance.getSlide();
			if (!t) return;
			const { el: e } = t;
			if (!e || !e.offsetParent) return;
			if (!this.optionFor(t, 'videoAutoplay')) return;
			if (t.type === Mt)
				try {
					const t = e.querySelector('video');
					if (t) {
						const e = t.play();
						void 0 !== e &&
							e
								.then(() => {})
								.catch((e) => {
									(t.muted = !0), t.play();
								});
					}
				} catch (t) {}
			if (t.type !== Ct && t.type !== Tt) return;
			const i = () => {
				if (t.iframeEl && t.iframeEl.contentWindow) {
					let e;
					if ('true' === t.iframeEl.dataset.ready) return (e = t.type === Ct ? { event: 'command', func: 'playVideo' } : { method: 'play', value: 'true' }), e && t.iframeEl.contentWindow.postMessage(JSON.stringify(e), '*'), void (t.poller = void 0);
					t.type === Ct && ((e = { event: 'listening', id: t.iframeEl.getAttribute('id') }), t.iframeEl.contentWindow.postMessage(JSON.stringify(e), '*'));
				}
				t.poller = setTimeout(i, 250);
			};
			i();
		}
		processType(t) {
			if (t.html) return (t.type = Et), (t.src = t.html), void (t.html = '');
			const e = this.instance.optionFor(t, 'src', '');
			if (!e || 'string' != typeof e) return;
			let i = t.type,
				n = null;
			if ((n = e.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i))) {
				const s = this.optionFor(t, Ct),
					{ nocookie: o } = s,
					a = (function (t, e) {
						var i = {};
						for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (i[n] = t[n]);
						if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
							var s = 0;
							for (n = Object.getOwnPropertySymbols(t); s < n.length; s++) e.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[s]) && (i[n[s]] = t[n[s]]);
						}
						return i;
					})(s, ['nocookie']),
					r = `www.youtube${o ? '-nocookie' : ''}.com`,
					l = Ot(e, a),
					c = encodeURIComponent(n[2]);
				(t.videoId = c), (t.src = `https://${r}/embed/${c}?${l}`), (t.thumbSrc = t.thumbSrc || `https://i.ytimg.com/vi/${c}/mqdefault.jpg`), (i = Ct);
			} else if ((n = e.match(/^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/))) {
				const s = Ot(e, this.optionFor(t, Tt)),
					o = encodeURIComponent(n[1]),
					a = n[4] || '';
				(t.videoId = o), (t.src = `https://player.vimeo.com/video/${o}?${a ? `h=${a}${s ? '&' : ''}` : ''}${s}`), (i = Tt);
			}
			if (!i && t.triggerEl) {
				const e = t.triggerEl.dataset.type;
				Lt.includes(e) && (i = e);
			}
			i || ('string' == typeof e && ('#' === e.charAt(0) ? (i = 'inline') : (n = e.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? ((i = Mt), (t.videoFormat = t.videoFormat || 'video/' + ('ogv' === n[1] ? 'ogg' : n[1]))) : e.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? (i = St) : e.match(/\.(pdf)((\?|#).*)?$/i) && (i = 'pdf'))),
				(n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i))
					? ((t.src = `https://maps.google.${n[1]}/?ll=${(n[2] ? n[2] + '&z=' + Math.floor(parseFloat(n[3])) + (n[4] ? n[4].replace(/^\//, '&') : '') : n[4] + '').replace(/\?/, '&')}&output=${n[4] && n[4].indexOf('layer=c') > 0 ? 'svembed' : 'embed'}`), (i = Pt))
					: (n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && ((t.src = `https://maps.google.${n[1]}/maps?q=${n[2].replace('query=', 'q=').replace('api=1', '')}&output=embed`), (i = Pt)),
				(i = i || this.instance.option('defaultType')),
				(t.type = i),
				i === St && (t.thumbSrc = t.thumbSrc || t.src);
		}
		setContent(t) {
			const e = this.instance.optionFor(t, 'src') || '';
			if (t && t.type && e) {
				switch (t.type) {
					case Et:
						this.instance.setContent(t, e);
						break;
					case Mt:
						const i = this.option('videoTpl');
						i &&
							this.instance.setContent(
								t,
								i
									.replace(/\{\{src\}\}/gi, e + '')
									.replace(/\{\{format\}\}/gi, this.optionFor(t, 'videoFormat') || '')
									.replace(/\{\{poster\}\}/gi, t.poster || t.thumbSrc || '')
							);
						break;
					case 'inline':
					case 'clone':
						this.setInlineContent(t);
						break;
					case 'ajax':
						this.loadAjaxContent(t);
						break;
					case 'pdf':
					case Pt:
					case Ct:
					case Tt:
						t.preload = !1;
					case 'iframe':
						this.setIframeContent(t);
				}
				this.setAspectRatio(t);
			}
		}
		setAspectRatio(t) {
			const e = t.contentEl;
			if (!(t.el && e && t.type && [Ct, Tt, Mt].includes(t.type))) return;
			let i,
				n = t.width || 'auto',
				s = t.height || 'auto';
			if ('auto' === n || 'auto' === s) {
				i = this.optionFor(t, 'videoRatio');
				const e = (i + '').match(/(\d+)\s*\/\s?(\d+)/);
				i = e && e.length > 2 ? parseFloat(e[1]) / parseFloat(e[2]) : parseFloat(i + '');
			} else n && s && (i = n / s);
			if (!i) return;
			(e.style.aspectRatio = ''), (e.style.width = ''), (e.style.height = ''), e.offsetHeight;
			const o = e.getBoundingClientRect(),
				a = o.width || 1,
				r = o.height || 1;
			(e.style.aspectRatio = i + ''), i < a / r ? ((s = 'auto' === s ? r : Math.min(r, s)), (e.style.width = 'auto'), (e.style.height = `${s}px`)) : ((n = 'auto' === n ? a : Math.min(a, n)), (e.style.width = `${n}px`), (e.style.height = 'auto'));
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('Carousel.beforeInitSlide', t.onBeforeInitSlide), e.on('Carousel.createSlide', t.onCreateSlide), e.on('Carousel.selectSlide', t.onSelectSlide), e.on('Carousel.unselectSlide', t.onUnselectSlide), e.on('Carousel.Panzoom.refresh', t.onRefresh), e.on('done', t.onDone), e.on('clearContent', t.onClearContent), window.addEventListener('message', t.onMessage);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('Carousel.beforeInitSlide', t.onBeforeInitSlide), e.off('Carousel.createSlide', t.onCreateSlide), e.off('Carousel.selectSlide', t.onSelectSlide), e.off('Carousel.unselectSlide', t.onUnselectSlide), e.off('Carousel.Panzoom.refresh', t.onRefresh), e.off('done', t.onDone), e.off('clearContent', t.onClearContent), window.removeEventListener('message', t.onMessage);
		}
	}
	Object.defineProperty(zt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: At });
	const Rt = 'play',
		kt = 'pause',
		It = 'ready';
	class Dt extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: It }), Object.defineProperty(this, 'inHover', { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, 'timer', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'progressBar', { enumerable: !0, configurable: !0, writable: !0, value: null });
		}
		get isActive() {
			return this.state !== It;
		}
		onReady(t) {
			this.option('autoStart') && (t.isInfinite || t.page < t.pages.length - 1) && this.start();
		}
		onChange() {
			this.removeProgressBar(), this.pause();
		}
		onSettle() {
			this.resume();
		}
		onVisibilityChange() {
			'visible' === document.visibilityState ? this.resume() : this.pause();
		}
		onMouseEnter() {
			(this.inHover = !0), this.pause();
		}
		onMouseLeave() {
			var t;
			(this.inHover = !1), (null === (t = this.instance.panzoom) || void 0 === t ? void 0 : t.isResting) && this.resume();
		}
		onTimerEnd() {
			const t = this.instance;
			'play' === this.state && (t.isInfinite || t.page !== t.pages.length - 1 ? t.slideNext() : t.slideTo(0));
		}
		removeProgressBar() {
			this.progressBar && (this.progressBar.remove(), (this.progressBar = null));
		}
		createProgressBar() {
			var t;
			if (!this.option('showProgress')) return null;
			this.removeProgressBar();
			const e = this.instance,
				i = (null === (t = e.pages[e.page]) || void 0 === t ? void 0 : t.slides) || [];
			let n = this.option('progressParentEl');
			if ((n || (n = (1 === i.length ? i[0].el : null) || e.viewport), !n)) return null;
			const s = document.createElement('div');
			return C(s, 'f-progress'), n.prepend(s), (this.progressBar = s), s.offsetHeight, s;
		}
		set() {
			const t = this,
				e = t.instance;
			if (e.pages.length < 2) return;
			if (t.timer) return;
			const i = t.option('timeout');
			(t.state = Rt), C(e.container, 'has-autoplay');
			let n = t.createProgressBar();
			n && ((n.style.transitionDuration = `${i}ms`), (n.style.transform = 'scaleX(1)')),
				(t.timer = setTimeout(() => {
					(t.timer = null), t.inHover || t.onTimerEnd();
				}, i)),
				t.emit('set');
		}
		clear() {
			const t = this;
			t.timer && (clearTimeout(t.timer), (t.timer = null)), t.removeProgressBar();
		}
		start() {
			const t = this;
			if ((t.set(), t.state !== It)) {
				if (t.option('pauseOnHover')) {
					const e = t.instance.container;
					e.addEventListener('mouseenter', t.onMouseEnter, !1), e.addEventListener('mouseleave', t.onMouseLeave, !1);
				}
				document.addEventListener('visibilitychange', t.onVisibilityChange, !1), t.emit('start');
			}
		}
		stop() {
			const t = this,
				e = t.state,
				i = t.instance.container;
			t.clear(), (t.state = It), i.removeEventListener('mouseenter', t.onMouseEnter, !1), i.removeEventListener('mouseleave', t.onMouseLeave, !1), document.removeEventListener('visibilitychange', t.onVisibilityChange, !1), P(i, 'has-autoplay'), e !== It && t.emit('stop');
		}
		pause() {
			const t = this;
			t.state === Rt && ((t.state = kt), t.clear(), t.emit(kt));
		}
		resume() {
			const t = this,
				e = t.instance;
			if (e.isInfinite || e.page !== e.pages.length - 1)
				if (t.state !== Rt) {
					if (t.state === kt && !t.inHover) {
						const e = new Event('resume', { bubbles: !0, cancelable: !0 });
						t.emit('resume', e), e.defaultPrevented || t.set();
					}
				} else t.set();
			else t.stop();
		}
		toggle() {
			this.state === Rt || this.state === kt ? this.stop() : this.start();
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('ready', t.onReady), e.on('Panzoom.startAnimation', t.onChange), e.on('Panzoom.endAnimation', t.onSettle), e.on('Panzoom.touchMove', t.onChange);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('ready', t.onReady), e.off('Panzoom.startAnimation', t.onChange), e.off('Panzoom.endAnimation', t.onSettle), e.off('Panzoom.touchMove', t.onChange), t.stop();
		}
	}
	Object.defineProperty(Dt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: { autoStart: !0, pauseOnHover: !0, progressParentEl: null, showProgress: !0, timeout: 3e3 } });
	class Ft extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'ref', { enumerable: !0, configurable: !0, writable: !0, value: null });
		}
		onPrepare(t) {
			const e = t.carousel;
			if (!e) return;
			const i = t.container;
			i &&
				((e.options.Autoplay = p({ autoStart: !1 }, this.option('Autoplay') || {}, {
					pauseOnHover: !1,
					timeout: this.option('timeout'),
					progressParentEl: () => this.option('progressParentEl') || null,
					on: {
						start: () => {
							t.emit('startSlideshow');
						},
						set: (e) => {
							var n;
							i.classList.add('has-slideshow'), (null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) !== ct.Ready && e.pause();
						},
						stop: () => {
							i.classList.remove('has-slideshow'), t.isCompact || t.endIdle(), t.emit('endSlideshow');
						},
						resume: (e, i) => {
							var n, s, o;
							!i || !i.cancelable || ((null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) === ct.Ready && (null === (o = null === (s = t.carousel) || void 0 === s ? void 0 : s.panzoom) || void 0 === o ? void 0 : o.isResting)) || i.preventDefault();
						}
					}
				})),
				e.attachPlugins({ Autoplay: Dt }),
				(this.ref = e.plugins.Autoplay));
		}
		onReady(t) {
			const e = t.carousel,
				i = this.ref;
			i && e && this.option('playOnStart') && (e.isInfinite || e.page < e.pages.length - 1) && i.start();
		}
		onDone(t, e) {
			const i = this.ref,
				n = t.carousel;
			if (!i || !n) return;
			const s = e.panzoom;
			s &&
				s.on('startAnimation', () => {
					t.isCurrentSlide(e) && i.stop();
				}),
				t.isCurrentSlide(e) && i.resume();
		}
		onKeydown(t, e) {
			var i;
			const n = this.ref;
			n && e === this.option('key') && 'BUTTON' !== (null === (i = document.activeElement) || void 0 === i ? void 0 : i.nodeName) && n.toggle();
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('Carousel.init', t.onPrepare), e.on('Carousel.ready', t.onReady), e.on('done', t.onDone), e.on('keydown', t.onKeydown);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('Carousel.init', t.onPrepare), e.off('Carousel.ready', t.onReady), e.off('done', t.onDone), e.off('keydown', t.onKeydown);
		}
	}
	Object.defineProperty(Ft, 'defaults', {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: {
			key: ' ',
			playOnStart: !1,
			progressParentEl: (t) => {
				var e;
				return (null === (e = t.instance.container) || void 0 === e ? void 0 : e.querySelector('.fancybox__toolbar [data-fancybox-toggle-slideshow]')) || t.instance.container;
			},
			timeout: 3e3
		}
	});
	const jt = {
		classes: { container: 'f-thumbs f-carousel__thumbs', viewport: 'f-thumbs__viewport', track: 'f-thumbs__track', slide: 'f-thumbs__slide', isResting: 'is-resting', isSelected: 'is-selected', isLoading: 'is-loading', hasThumbs: 'has-thumbs' },
		minCount: 2,
		parentEl: null,
		thumbTpl: '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',
		type: 'modern'
	};
	var Bt;
	!(function (t) {
		(t[(t.Init = 0)] = 'Init'), (t[(t.Ready = 1)] = 'Ready'), (t[(t.Hidden = 2)] = 'Hidden');
	})(Bt || (Bt = {}));
	const Ht = 'isResting',
		Nt = 'thumbWidth',
		_t = 'thumbHeight',
		$t = 'thumbClipWidth';
	let Wt = class extends $ {
		constructor() {
			super(...arguments),
				Object.defineProperty(this, 'type', { enumerable: !0, configurable: !0, writable: !0, value: 'modern' }),
				Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'track', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'carousel', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'thumbWidth', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'thumbClipWidth', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'thumbHeight', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'thumbGap', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'thumbExtraGap', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: Bt.Init });
		}
		get isModern() {
			return 'modern' === this.type;
		}
		onInitSlide(t, e) {
			const i = e.el ? e.el.dataset : void 0;
			i && ((e.thumbSrc = i.thumbSrc || e.thumbSrc || ''), (e[$t] = parseFloat(i[$t] || '') || e[$t] || 0), (e[_t] = parseFloat(i.thumbHeight || '') || e[_t] || 0)), this.addSlide(e);
		}
		onInitSlides() {
			this.build();
		}
		onChange() {
			var t;
			if (!this.isModern) return;
			const e = this.container,
				i = this.instance,
				n = i.panzoom,
				s = this.carousel,
				o = s ? s.panzoom : null,
				r = i.page;
			if (n && s && o) {
				if (n.isDragging) {
					P(e, this.cn(Ht));
					let n = (null === (t = s.pages[r]) || void 0 === t ? void 0 : t.pos) || 0;
					n += i.getProgress(r) * (this[$t] + this.thumbGap);
					let a = o.getBounds();
					-1 * n > a.x.min && -1 * n < a.x.max && o.panTo({ x: -1 * n, friction: 0.12 });
				} else a(e, this.cn(Ht), n.isResting);
				this.shiftModern();
			}
		}
		onRefresh() {
			this.updateProps();
			for (const t of this.instance.slides || []) this.resizeModernSlide(t);
			this.shiftModern();
		}
		isDisabled() {
			const t = this.option('minCount') || 0;
			if (t) {
				const e = this.instance;
				let i = 0;
				for (const t of e.slides || []) t.thumbSrc && i++;
				if (i < t) return !0;
			}
			const e = this.option('type');
			return ['modern', 'classic'].indexOf(e) < 0;
		}
		getThumb(t) {
			const e = this.option('thumbTpl') || '';
			return {
				html: this.instance.localize(e, [
					['%i', t.index],
					['%d', t.index + 1],
					['%s', t.thumbSrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']
				])
			};
		}
		addSlide(t) {
			const e = this.carousel;
			e && e.addSlide(t.index, this.getThumb(t));
		}
		getSlides() {
			const t = [];
			for (const e of this.instance.slides || []) t.push(this.getThumb(e));
			return t;
		}
		resizeModernSlide(t) {
			this.isModern && (t[Nt] = t[$t] && t[_t] ? Math.round(this[_t] * (t[$t] / t[_t])) : this[Nt]);
		}
		updateProps() {
			const t = this.container;
			if (!t) return;
			const e = (e) => parseFloat(getComputedStyle(t).getPropertyValue('--f-thumb-' + e)) || 0;
			(this.thumbGap = e('gap')), (this.thumbExtraGap = e('extra-gap')), (this[Nt] = e('width') || 40), (this[$t] = e('clip-width') || 40), (this[_t] = e('height') || 40);
		}
		build() {
			const t = this;
			if (t.state !== Bt.Init) return;
			if (t.isDisabled()) return void t.emit('disabled');
			const e = t.instance,
				i = e.container,
				n = t.getSlides(),
				s = t.option('type');
			t.type = s;
			const o = t.option('parentEl'),
				a = t.cn('container'),
				r = t.cn('track');
			let l = null == o ? void 0 : o.querySelector('.' + a);
			l || ((l = document.createElement('div')), C(l, a), o ? o.appendChild(l) : i.after(l)), C(l, `is-${s}`), C(i, t.cn('hasThumbs')), (t.container = l), t.updateProps();
			let c = l.querySelector('.' + r);
			c || ((c = document.createElement('div')), C(c, t.cn('track')), l.appendChild(c)), (t.track = c);
			const h = p({}, { track: c, infinite: !1, center: !0, fill: 'classic' === s, dragFree: !0, slidesPerPage: 1, transition: !1, preload: 0.25, friction: 0.12, Panzoom: { maxVelocity: 0 }, Dots: !1, Navigation: !1, classes: { container: 'f-thumbs', viewport: 'f-thumbs__viewport', track: 'f-thumbs__track', slide: 'f-thumbs__slide' } }, t.option('Carousel') || {}, { Sync: { target: e }, slides: n }),
				d = new e.constructor(l, h);
			d.on('createSlide', (e, i) => {
				t.setProps(i.index), t.emit('createSlide', i, i.el);
			}),
				d.on('ready', () => {
					t.shiftModern(), t.emit('ready');
				}),
				d.on('refresh', () => {
					t.shiftModern();
				}),
				d.on('Panzoom.click', (e, i, n) => {
					t.onClick(n);
				}),
				(t.carousel = d),
				(t.state = Bt.Ready);
		}
		onClick(t) {
			t.preventDefault(), t.stopPropagation();
			const e = this.instance,
				{ pages: i, page: n } = e,
				s = (t) => {
					if (t) {
						const e = t.closest('[data-carousel-index]');
						if (e) return [parseInt(e.dataset.carouselIndex || '', 10) || 0, e];
					}
					return [-1, void 0];
				},
				o = (t, e) => {
					const i = document.elementFromPoint(t, e);
					return i ? s(i) : [-1, void 0];
				};
			let [a, r] = s(t.target);
			if (a > -1) return;
			const l = this[$t],
				c = t.clientX,
				h = t.clientY;
			let [d, u] = o(c - l, h),
				[p, f] = o(c + l, h);
			u && f ? ((a = Math.abs(c - u.getBoundingClientRect().right) < Math.abs(c - f.getBoundingClientRect().left) ? d : p), a === n && (a = a === d ? p : d)) : u ? (a = d) : f && (a = p), a > -1 && i[a] && e.slideTo(a);
		}
		getShift(t) {
			var e;
			const i = this,
				{ instance: n } = i,
				s = i.carousel;
			if (!n || !s) return 0;
			const o = i[Nt],
				a = i[$t],
				r = i.thumbGap,
				l = i.thumbExtraGap;
			if (!(null === (e = s.slides[t]) || void 0 === e ? void 0 : e.el)) return 0;
			const c = 0.5 * (o - a),
				h = n.pages.length - 1;
			let d = n.getProgress(0),
				u = n.getProgress(h),
				p = n.getProgress(t, !1, !0),
				f = 0,
				g = c + l + r;
			const m = d < 0 && d > -1,
				v = u > 0 && u < 1;
			return 0 === t ? ((f = g * Math.abs(d)), v && 1 === d && (f -= g * Math.abs(u))) : t === h ? ((f = g * Math.abs(u) * -1), m && -1 === u && (f += g * Math.abs(d))) : m || v ? ((f = -1 * g), (f += g * Math.abs(d)), (f += g * (1 - Math.abs(u)))) : (f = g * p), f;
		}
		setProps(t) {
			var i;
			const n = this;
			if (!n.isModern) return;
			const { instance: s } = n,
				o = n.carousel;
			if (s && o) {
				const a = null === (i = o.slides[t]) || void 0 === i ? void 0 : i.el;
				if (a && a.childNodes.length) {
					let i = e(1 - Math.abs(s.getProgress(t))),
						o = e(n.getShift(t));
					a.style.setProperty('--progress', i ? i + '' : ''), a.style.setProperty('--shift', o + '');
				}
			}
		}
		shiftModern() {
			const t = this;
			if (!t.isModern) return;
			const { instance: e, track: i } = t,
				n = e.panzoom,
				s = t.carousel;
			if (!(e && i && n && s)) return;
			if (n.state === v.Init || n.state === v.Destroy) return;
			for (const i of e.slides) t.setProps(i.index);
			let o = (t[$t] + t.thumbGap) * (s.slides.length || 0);
			i.style.setProperty('--width', o + '');
		}
		cleanup() {
			const t = this;
			t.carousel && t.carousel.destroy(), (t.carousel = null), t.container && t.container.remove(), (t.container = null), t.track && t.track.remove(), (t.track = null), (t.state = Bt.Init), P(t.instance.container, t.cn('hasThumbs'));
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('initSlide', t.onInitSlide), e.state === H.Init ? e.on('initSlides', t.onInitSlides) : t.onInitSlides(), e.on(['change', 'Panzoom.afterTransform'], t.onChange), e.on('Panzoom.refresh', t.onRefresh);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('initSlide', t.onInitSlide), e.off('initSlides', t.onInitSlides), e.off(['change', 'Panzoom.afterTransform'], t.onChange), e.off('Panzoom.refresh', t.onRefresh), t.cleanup();
		}
	};
	Object.defineProperty(Wt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: jt });
	const Xt = Object.assign(Object.assign({}, jt), { key: 't', showOnStart: !0, parentEl: null }),
		qt = 'is-masked',
		Yt = 'aria-hidden';
	class Vt extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'ref', { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, 'hidden', { enumerable: !0, configurable: !0, writable: !0, value: !1 });
		}
		get isEnabled() {
			const t = this.ref;
			return t && !t.isDisabled();
		}
		get isHidden() {
			return this.hidden;
		}
		onClick(t, e) {
			e.stopPropagation();
		}
		onCreateSlide(t, e) {
			var i, n, s;
			const o = (null === (s = null === (n = null === (i = this.instance) || void 0 === i ? void 0 : i.carousel) || void 0 === n ? void 0 : n.slides[e.index]) || void 0 === s ? void 0 : s.type) || '',
				a = e.el;
			if (a && o) {
				let t = `for-${o}`;
				['video', 'youtube', 'vimeo', 'html5video'].includes(o) && (t += ' for-video'), C(a, t);
			}
		}
		onInit() {
			var t;
			const e = this,
				i = e.instance,
				n = i.carousel;
			if (e.ref || !n) return;
			const s = e.option('parentEl') || i.footer || i.container;
			if (!s) return;
			const o = p({}, e.options, {
				parentEl: s,
				classes: { container: 'f-thumbs fancybox__thumbs' },
				Carousel: { Sync: { friction: i.option('Carousel.friction') || 0 } },
				on: {
					ready: (t) => {
						const i = t.container;
						i &&
							this.hidden &&
							(e.refresh(),
							(i.style.transition = 'none'),
							e.hide(),
							i.offsetHeight,
							queueMicrotask(() => {
								(i.style.transition = ''), e.show();
							}));
					}
				}
			});
			(o.Carousel = o.Carousel || {}), (o.Carousel.on = p((null === (t = e.options.Carousel) || void 0 === t ? void 0 : t.on) || {}, { click: this.onClick, createSlide: this.onCreateSlide })), (n.options.Thumbs = o), n.attachPlugins({ Thumbs: Wt }), (e.ref = n.plugins.Thumbs), e.option('showOnStart') || ((e.ref.state = Bt.Hidden), (e.hidden = !0));
		}
		onResize() {
			var t;
			const e = null === (t = this.ref) || void 0 === t ? void 0 : t.container;
			e && (e.style.maxHeight = '');
		}
		onKeydown(t, e) {
			const i = this.option('key');
			i && i === e && this.toggle();
		}
		toggle() {
			const t = this.ref;
			if (t && !t.isDisabled()) return t.state === Bt.Hidden ? ((t.state = Bt.Init), void t.build()) : void (this.hidden ? this.show() : this.hide());
		}
		show() {
			const t = this.ref;
			if (!t || t.isDisabled()) return;
			const e = t.container;
			e && (this.refresh(), e.offsetHeight, e.removeAttribute(Yt), e.classList.remove(qt), (this.hidden = !1));
		}
		hide() {
			const t = this.ref,
				e = t && t.container;
			e && (this.refresh(), e.offsetHeight, e.classList.add(qt), e.setAttribute(Yt, 'true')), (this.hidden = !0);
		}
		refresh() {
			const t = this.ref;
			if (!t || !t.state) return;
			const e = t.container,
				i = (null == e ? void 0 : e.firstChild) || null;
			e && i && i.childNodes.length && (e.style.maxHeight = `${i.getBoundingClientRect().height}px`);
		}
		attach() {
			const t = this,
				e = t.instance;
			e.state === lt.Init ? e.on('Carousel.init', t.onInit) : t.onInit(), e.on('resize', t.onResize), e.on('keydown', t.onKeydown);
		}
		detach() {
			var t;
			const e = this,
				i = e.instance;
			i.off('Carousel.init', e.onInit), i.off('resize', e.onResize), i.off('keydown', e.onKeydown), null === (t = i.carousel) || void 0 === t || t.detachPlugins(['Thumbs']), (e.ref = null);
		}
	}
	Object.defineProperty(Vt, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: Xt });
	const Zt = {
		panLeft: { icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>', change: { panX: -100 } },
		panRight: { icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>', change: { panX: 100 } },
		panUp: { icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>', change: { panY: -100 } },
		panDown: { icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>', change: { panY: 100 } },
		zoomIn: { icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>', action: 'zoomIn' },
		zoomOut: { icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: 'zoomOut' },
		toggle1to1: { icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>', action: 'toggleZoom' },
		toggleZoom: { icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: 'toggleZoom' },
		iterateZoom: { icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: 'iterateZoom' },
		rotateCCW: { icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>', action: 'rotateCCW' },
		rotateCW: { icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>', action: 'rotateCW' },
		flipX: { icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>', action: 'flipX' },
		flipY: { icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>', action: 'flipY' },
		fitX: { icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>', action: 'fitX' },
		fitY: { icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>', action: 'fitY' },
		reset: { icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>', action: 'reset' },
		toggleFS: { icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>', action: 'toggleFS' }
	};
	var Ut;
	!(function (t) {
		(t[(t.Init = 0)] = 'Init'), (t[(t.Ready = 1)] = 'Ready'), (t[(t.Disabled = 2)] = 'Disabled');
	})(Ut || (Ut = {}));
	const Gt = {
			absolute: 'auto',
			display: { left: ['infobar'], middle: [], right: ['iterateZoom', 'slideshow', 'fullscreen', 'thumbs', 'close'] },
			enabled: 'auto',
			items: {
				infobar: { tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>' },
				download: { tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>' },
				prev: { tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>' },
				next: { tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>' },
				slideshow: { tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>' },
				fullscreen: { tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>' },
				thumbs: { tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>' },
				close: { tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>' }
			},
			parentEl: null
		},
		Kt = { tabindex: '-1', width: '24', height: '24', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
		Jt = 'has-toolbar',
		Qt = 'fancybox__toolbar';
	class te extends $ {
		constructor() {
			super(...arguments), Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: Ut.Init }), Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: null });
		}
		onReady(t) {
			var e;
			if (!t.carousel) return;
			let i = this.option('display'),
				n = this.option('absolute'),
				s = this.option('enabled');
			if ('auto' === s) {
				const t = this.instance.carousel;
				let e = 0;
				if (t) for (const i of t.slides) (i.panzoom || 'image' === i.type) && e++;
				e || (s = !1);
			}
			s || (i = void 0);
			let o = 0;
			const a = { left: [], middle: [], right: [] };
			if (i)
				for (const t of ['left', 'middle', 'right'])
					for (const n of i[t]) {
						const i = this.createEl(n);
						i && (null === (e = a[t]) || void 0 === e || e.push(i), o++);
					}
			let r = null;
			if ((o && (r = this.createContainer()), r)) {
				for (const [t, e] of Object.entries(a)) {
					const i = document.createElement('div');
					C(i, Qt + '__column is-' + t);
					for (const t of e) i.appendChild(t);
					'auto' !== n || 'middle' !== t || e.length || (n = !0), r.appendChild(i);
				}
				!0 === n && C(r, 'is-absolute'), (this.state = Ut.Ready), this.onRefresh();
			} else this.state = Ut.Disabled;
		}
		onClick(t) {
			var e, i;
			const n = this.instance,
				s = n.getSlide(),
				o = null == s ? void 0 : s.panzoom,
				a = t.target,
				r = a && S(a) ? a.dataset : null;
			if (!r) return;
			if (void 0 !== r.fancyboxToggleThumbs) return t.preventDefault(), t.stopPropagation(), void (null === (e = n.plugins.Thumbs) || void 0 === e || e.toggle());
			if (void 0 !== r.fancyboxToggleFullscreen) return t.preventDefault(), t.stopPropagation(), void this.instance.toggleFullscreen();
			if (void 0 !== r.fancyboxToggleSlideshow) {
				t.preventDefault(), t.stopPropagation();
				const e = null === (i = n.carousel) || void 0 === i ? void 0 : i.plugins.Autoplay;
				let s = e.isActive;
				return o && 'mousemove' === o.panMode && !s && o.reset(), void (s ? e.stop() : e.start());
			}
			const l = r.panzoomAction,
				c = r.panzoomChange;
			if (((c || l) && (t.preventDefault(), t.stopPropagation()), c)) {
				let t = {};
				try {
					t = JSON.parse(c);
				} catch (t) {}
				o && o.applyChange(t);
			} else l && o && o[l] && o[l]();
		}
		onChange() {
			this.onRefresh();
		}
		onRefresh() {
			if (this.instance.isClosing()) return;
			const t = this.container;
			if (!t) return;
			const e = this.instance.getSlide();
			if (!e || e.state !== ct.Ready) return;
			const i = e && !e.error && e.panzoom;
			for (const e of t.querySelectorAll('[data-panzoom-action]')) i ? (e.removeAttribute('disabled'), e.removeAttribute('tabindex')) : (e.setAttribute('disabled', ''), e.setAttribute('tabindex', '-1'));
			let n = i && i.canZoomIn(),
				s = i && i.canZoomOut();
			for (const e of t.querySelectorAll('[data-panzoom-action="zoomIn"]')) n ? (e.removeAttribute('disabled'), e.removeAttribute('tabindex')) : (e.setAttribute('disabled', ''), e.setAttribute('tabindex', '-1'));
			for (const e of t.querySelectorAll('[data-panzoom-action="zoomOut"]')) s ? (e.removeAttribute('disabled'), e.removeAttribute('tabindex')) : (e.setAttribute('disabled', ''), e.setAttribute('tabindex', '-1'));
			for (const e of t.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
				s || n ? (e.removeAttribute('disabled'), e.removeAttribute('tabindex')) : (e.setAttribute('disabled', ''), e.setAttribute('tabindex', '-1'));
				const t = e.querySelector('g');
				t && (t.style.display = n ? '' : 'none');
			}
		}
		onDone(t, e) {
			var i;
			null === (i = e.panzoom) ||
				void 0 === i ||
				i.on('afterTransform', () => {
					this.instance.isCurrentSlide(e) && this.onRefresh();
				}),
				this.instance.isCurrentSlide(e) && this.onRefresh();
		}
		createContainer() {
			const t = this.instance.container;
			if (!t) return null;
			const e = this.option('parentEl') || t;
			let i = e.querySelector('.' + Qt);
			return i || ((i = document.createElement('div')), C(i, Qt), e.prepend(i)), i.addEventListener('click', this.onClick, { passive: !1, capture: !0 }), t && C(t, Jt), (this.container = i), i;
		}
		createEl(t) {
			const e = this.instance,
				i = e.carousel;
			if (!i) return null;
			if ('toggleFS' === t) return null;
			if ('fullscreen' === t && !at()) return null;
			let n = null;
			const o = i.slides.length || 0;
			let a = 0,
				r = 0;
			for (const t of i.slides) (t.panzoom || 'image' === t.type) && a++, ('image' === t.type || t.downloadSrc) && r++;
			if (o < 2 && ['infobar', 'prev', 'next'].includes(t)) return n;
			if (void 0 !== Zt[t] && !a) return null;
			if ('download' === t && !r) return null;
			if ('thumbs' === t) {
				const t = e.plugins.Thumbs;
				if (!t || !t.isEnabled) return null;
			}
			if ('slideshow' === t) {
				if (!i.plugins.Autoplay || o < 2) return null;
			}
			if (void 0 !== Zt[t]) {
				const e = Zt[t];
				(n = document.createElement('button')), n.setAttribute('title', this.instance.localize(`{{${t.toUpperCase()}}}`)), C(n, 'f-button'), e.action && (n.dataset.panzoomAction = e.action), e.change && (n.dataset.panzoomChange = JSON.stringify(e.change)), n.appendChild(s(this.instance.localize(e.icon)));
			} else {
				const e = (this.option('items') || [])[t];
				e &&
					((n = s(this.instance.localize(e.tpl))),
					'function' == typeof e.click &&
						n.addEventListener('click', (t) => {
							t.preventDefault(), t.stopPropagation(), 'function' == typeof e.click && e.click.call(this, this, t);
						}));
			}
			const l = null == n ? void 0 : n.querySelector('svg');
			if (l) for (const [t, e] of Object.entries(Kt)) l.getAttribute(t) || l.setAttribute(t, String(e));
			return n;
		}
		removeContainer() {
			const t = this.container;
			t && t.remove(), (this.container = null), (this.state = Ut.Disabled);
			const e = this.instance.container;
			e && P(e, Jt);
		}
		attach() {
			const t = this,
				e = t.instance;
			e.on('Carousel.initSlides', t.onReady), e.on('done', t.onDone), e.on(['reveal', 'Carousel.change'], t.onChange), t.onReady(t.instance);
		}
		detach() {
			const t = this,
				e = t.instance;
			e.off('Carousel.initSlides', t.onReady), e.off('done', t.onDone), e.off(['reveal', 'Carousel.change'], t.onChange), t.removeContainer();
		}
	}
	Object.defineProperty(te, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: Gt });
	const ee = {
			Hash: class extends $ {
				onReady() {
					dt = !1;
				}
				onChange(t) {
					pt && clearTimeout(pt);
					const { hash: e } = ft(),
						{ hash: i } = gt(),
						n = t.isOpeningSlide(t.getSlide());
					n && (ht = i === e ? '' : i),
						e &&
							e !== i &&
							(pt = setTimeout(() => {
								try {
									if (t.state === lt.Ready) {
										let t = 'replaceState';
										n && !ut && ((t = 'pushState'), (ut = !0)), window.history[t]({}, document.title, window.location.pathname + window.location.search + e);
									}
								} catch (t) {}
							}, 300));
				}
				onClose(t) {
					if ((pt && clearTimeout(pt), !dt && ut)) return (ut = !1), (dt = !1), void window.history.back();
					if (!dt)
						try {
							window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (ht || ''));
						} catch (t) {}
				}
				attach() {
					const t = this.instance;
					t.on('ready', this.onReady), t.on(['Carousel.ready', 'Carousel.change'], this.onChange), t.on('close', this.onClose);
				}
				detach() {
					const t = this.instance;
					t.off('ready', this.onReady), t.off(['Carousel.ready', 'Carousel.change'], this.onChange), t.off('close', this.onClose);
				}
				static parseURL() {
					return gt();
				}
				static startFromUrl() {
					mt();
				}
				static destroy() {
					window.removeEventListener('hashchange', bt, !1);
				}
			},
			Html: zt,
			Images: xt,
			Slideshow: Ft,
			Thumbs: Vt,
			Toolbar: te
		},
		ie = 'with-fancybox',
		ne = 'hide-scrollbar',
		se = '--fancybox-scrollbar-compensate',
		oe = '--fancybox-body-margin',
		ae = 'aria-hidden',
		re = 'is-using-tab',
		le = 'is-animated',
		ce = 'is-compact',
		he = 'is-loading',
		de = 'is-opening',
		ue = 'has-caption',
		pe = 'disabled',
		fe = 'tabindex',
		ge = 'download',
		me = 'href',
		ve = 'src',
		be = (t) => 'string' == typeof t,
		ye = function () {
			var t = window.getSelection();
			return !!t && 'Range' === t.type;
		};
	let we,
		xe = null,
		Ee = null,
		Se = 0,
		Pe = 0,
		Ce = 0,
		Te = 0;
	const Me = new Map();
	let Oe = 0;
	class Ae extends m {
		get isIdle() {
			return this.idle;
		}
		get isCompact() {
			return this.option('compact');
		}
		constructor(t = [], e = {}, i = {}) {
			super(e),
				Object.defineProperty(this, 'userSlides', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
				Object.defineProperty(this, 'userPlugins', { enumerable: !0, configurable: !0, writable: !0, value: {} }),
				Object.defineProperty(this, 'idle', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'idleTimer', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'clickTimer', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'pwt', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'ignoreFocusChange', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'startedFs', { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
				Object.defineProperty(this, 'state', { enumerable: !0, configurable: !0, writable: !0, value: lt.Init }),
				Object.defineProperty(this, 'id', { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
				Object.defineProperty(this, 'container', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'caption', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'footer', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'carousel', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'lastFocus', { enumerable: !0, configurable: !0, writable: !0, value: null }),
				Object.defineProperty(this, 'prevMouseMoveEvent', { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
				we || (we = at()),
				(this.id = e.id || ++Oe),
				Me.set(this.id, this),
				(this.userSlides = t),
				(this.userPlugins = i),
				queueMicrotask(() => {
					this.init();
				});
		}
		init() {
			if (this.state === lt.Destroy) return;
			(this.state = lt.Init),
				this.attachPlugins(Object.assign(Object.assign({}, Ae.Plugins), this.userPlugins)),
				this.emit('init'),
				this.emit('attachPlugins'),
				!0 === this.option('hideScrollbar') &&
					(() => {
						if (!it) return;
						const t = document,
							e = t.body,
							i = t.documentElement;
						if (e.classList.contains(ne)) return;
						let n = window.innerWidth - i.getBoundingClientRect().width;
						const s = parseFloat(window.getComputedStyle(e).marginRight);
						n < 0 && (n = 0), i.style.setProperty(se, `${n}px`), s && e.style.setProperty(oe, `${s}px`), e.classList.add(ne);
					})(),
				this.initLayout(),
				this.scale();
			const t = () => {
				this.initCarousel(this.userSlides),
					(this.state = lt.Ready),
					this.attachEvents(),
					this.emit('ready'),
					setTimeout(() => {
						this.container && this.container.setAttribute(ae, 'false');
					}, 16);
			};
			this.option('Fullscreen.autoStart') && we && !we.isFullscreen()
				? we
						.request()
						.then(() => {
							(this.startedFs = !0), t();
						})
						.catch(() => t())
				: t();
		}
		initLayout() {
			var t, e;
			const i = this.option('parentEl') || document.body,
				n = s(this.localize(this.option('tpl.main') || ''));
			if (n) {
				if (
					(n.setAttribute('id', `fancybox-${this.id}`),
					n.setAttribute('aria-label', this.localize('{{MODAL}}')),
					n.classList.toggle(ce, this.isCompact),
					C(n, this.option('mainClass') || ''),
					C(n, de),
					(this.container = n),
					(this.footer = n.querySelector('.fancybox__footer')),
					i.appendChild(n),
					C(document.documentElement, ie),
					(xe && Ee) || ((xe = document.createElement('span')), C(xe, 'fancybox-focus-guard'), xe.setAttribute(fe, '0'), xe.setAttribute(ae, 'true'), xe.setAttribute('aria-label', 'Focus guard'), (Ee = xe.cloneNode()), null === (t = n.parentElement) || void 0 === t || t.insertBefore(xe, n), null === (e = n.parentElement) || void 0 === e || e.append(Ee)),
					n.addEventListener('mousedown', (t) => {
						(Se = t.pageX), (Pe = t.pageY), P(n, re);
					}),
					this.option('closeExisting'))
				)
					for (const t of Me.values()) t.id !== this.id && t.close();
				else
					this.option('animated') &&
						(C(n, le),
						setTimeout(() => {
							this.isClosing() || P(n, le);
						}, 350));
				this.emit('initLayout');
			}
		}
		initCarousel(t) {
			const e = this.container;
			if (!e) return;
			const n = e.querySelector('.fancybox__carousel');
			if (!n) return;
			const s = (this.carousel = new tt(n, p({}, { slides: t, transition: 'fade', Panzoom: { lockAxis: this.option('dragToClose') ? 'xy' : 'x', infinite: !!this.option('dragToClose') && 'y' }, Dots: !1, Navigation: { classes: { container: 'fancybox__nav', button: 'f-button', isNext: 'is-next', isPrev: 'is-prev' } }, initialPage: this.option('startIndex'), l10n: this.option('l10n') }, this.option('Carousel') || {})));
			s.on('*', (t, e, ...i) => {
				this.emit(`Carousel.${e}`, t, ...i);
			}),
				s.on(['ready', 'change'], () => {
					this.manageCaption();
				}),
				this.on('Carousel.removeSlide', (t, e, i) => {
					this.clearContent(i), (i.state = void 0);
				}),
				s.on('Panzoom.touchStart', () => {
					var t, e;
					this.isCompact || this.endIdle(), (null === (t = document.activeElement) || void 0 === t ? void 0 : t.closest('.f-thumbs')) && (null === (e = this.container) || void 0 === e || e.focus());
				}),
				s.on('settle', () => {
					this.idleTimer || this.isCompact || !this.option('idle') || this.setIdle(), this.option('autoFocus') && !this.isClosing && this.checkFocus();
				}),
				this.option('dragToClose') &&
					(s.on('Panzoom.afterTransform', (t, e) => {
						const n = this.getSlide();
						if (n && i(n.el)) return;
						const s = this.container;
						if (s) {
							const t = Math.abs(e.current.f),
								i = t < 1 ? '' : Math.max(0.5, Math.min(1, 1 - (t / e.contentRect.fitHeight) * 1.5));
							s.style.setProperty('--fancybox-ts', i ? '0s' : ''), s.style.setProperty('--fancybox-opacity', i + '');
						}
					}),
					s.on('Panzoom.touchEnd', (t, e, n) => {
						var s;
						const o = this.getSlide();
						if (o && i(o.el)) return;
						if (e.isMobile && document.activeElement && -1 !== ['TEXTAREA', 'INPUT'].indexOf(null === (s = document.activeElement) || void 0 === s ? void 0 : s.nodeName)) return;
						const a = Math.abs(e.dragOffset.y);
						'y' === e.lockedAxis && (a >= 200 || (a >= 50 && e.dragOffset.time < 300)) && (n && n.cancelable && n.preventDefault(), this.close(n, 'f-throwOut' + (e.current.f < 0 ? 'Up' : 'Down')));
					})),
				s.on('change', (t) => {
					var e;
					let i = null === (e = this.getSlide()) || void 0 === e ? void 0 : e.triggerEl;
					if (i) {
						const e = new CustomEvent('slideTo', { bubbles: !0, cancelable: !0, detail: t.page });
						i.dispatchEvent(e);
					}
				}),
				s.on(['refresh', 'change'], (t) => {
					const e = this.container;
					if (!e) return;
					for (const i of e.querySelectorAll('[data-fancybox-current-index]')) i.innerHTML = t.page + 1;
					for (const i of e.querySelectorAll('[data-fancybox-count]')) i.innerHTML = t.pages.length;
					if (!t.isInfinite) {
						for (const i of e.querySelectorAll('[data-fancybox-next]')) t.page < t.pages.length - 1 ? (i.removeAttribute(pe), i.removeAttribute(fe)) : (i.setAttribute(pe, ''), i.setAttribute(fe, '-1'));
						for (const i of e.querySelectorAll('[data-fancybox-prev]')) t.page > 0 ? (i.removeAttribute(pe), i.removeAttribute(fe)) : (i.setAttribute(pe, ''), i.setAttribute(fe, '-1'));
					}
					const i = this.getSlide();
					if (!i) return;
					let n = i.downloadSrc || '';
					n || 'image' !== i.type || i.error || !be(i[ve]) || (n = i[ve]);
					for (const t of e.querySelectorAll('[data-fancybox-download]')) {
						const e = i.downloadFilename;
						n ? (t.removeAttribute(pe), t.removeAttribute(fe), t.setAttribute(me, n), t.setAttribute(ge, e || n), t.setAttribute('target', '_blank')) : (t.setAttribute(pe, ''), t.setAttribute(fe, '-1'), t.removeAttribute(me), t.removeAttribute(ge));
					}
				}),
				this.emit('initCarousel');
		}
		attachEvents() {
			const t = this,
				e = t.container;
			if (!e) return;
			e.addEventListener('click', t.onClick, { passive: !1, capture: !1 }), e.addEventListener('wheel', t.onWheel, { passive: !1, capture: !1 }), document.addEventListener('keydown', t.onKeydown, { passive: !1, capture: !0 }), document.addEventListener('visibilitychange', t.onVisibilityChange, !1), document.addEventListener('mousemove', t.onMousemove), t.option('trapFocus') && document.addEventListener('focus', t.onFocus, !0), window.addEventListener('resize', t.onResize);
			const i = window.visualViewport;
			i && (i.addEventListener('scroll', t.onResize), i.addEventListener('resize', t.onResize));
		}
		detachEvents() {
			const t = this,
				e = t.container;
			if (!e) return;
			document.removeEventListener('keydown', t.onKeydown, { passive: !1, capture: !0 }), e.removeEventListener('wheel', t.onWheel, { passive: !1, capture: !1 }), e.removeEventListener('click', t.onClick, { passive: !1, capture: !1 }), document.removeEventListener('mousemove', t.onMousemove), window.removeEventListener('resize', t.onResize);
			const i = window.visualViewport;
			i && (i.removeEventListener('resize', t.onResize), i.removeEventListener('scroll', t.onResize)), document.removeEventListener('visibilitychange', t.onVisibilityChange, !1), document.removeEventListener('focus', t.onFocus, !0);
		}
		scale() {
			const t = this.container;
			if (!t) return;
			const e = window.visualViewport,
				i = Math.max(1, (null == e ? void 0 : e.scale) || 1);
			let n = '',
				s = '',
				o = '';
			if (e && i > 1) {
				let t = `${e.offsetLeft}px`,
					a = `${e.offsetTop}px`;
				(n = e.width * i + 'px'), (s = e.height * i + 'px'), (o = `translate3d(${t}, ${a}, 0) scale(${1 / i})`);
			}
			(t.style.transform = o), (t.style.width = n), (t.style.height = s);
		}
		onClick(t) {
			var e;
			const { container: i, isCompact: n } = this;
			if (!i || this.isClosing()) return;
			!n && this.option('idle') && this.resetIdle();
			const s = t.composedPath()[0];
			if (s.closest('.fancybox-spinner') || s.closest('[data-fancybox-close]')) return t.preventDefault(), void this.close(t);
			if (s.closest('[data-fancybox-prev]')) return t.preventDefault(), void this.prev();
			if (s.closest('[data-fancybox-next]')) return t.preventDefault(), void this.next();
			if ('click' === t.type && 0 === t.detail) return;
			if (Math.abs(t.pageX - Se) > 30 || Math.abs(t.pageY - Pe) > 30) return;
			const o = document.activeElement;
			if (ye() && o && i.contains(o)) return;
			if (n && 'image' === (null === (e = this.getSlide()) || void 0 === e ? void 0 : e.type))
				return void (this.clickTimer
					? (clearTimeout(this.clickTimer), (this.clickTimer = null))
					: (this.clickTimer = setTimeout(() => {
							this.toggleIdle(), (this.clickTimer = null);
					  }, 350)));
			if ((this.emit('click', t), t.defaultPrevented)) return;
			let a = !1;
			if (s.closest('.fancybox__content')) {
				if (o) {
					if (o.closest('[contenteditable]')) return;
					s.matches(st) || o.blur();
				}
				if (ye()) return;
				a = this.option('contentClick');
			} else s.closest('.fancybox__carousel') && !s.matches(st) && (a = this.option('backdropClick'));
			'close' === a ? (t.preventDefault(), this.close(t)) : 'next' === a ? (t.preventDefault(), this.next()) : 'prev' === a && (t.preventDefault(), this.prev());
		}
		onWheel(t) {
			const e = t.target;
			let i = this.option('wheel', t);
			e.closest('.fancybox__thumbs') && (i = 'slide');
			const s = 'slide' === i,
				o = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (t, e) {
					return Math.abs(e) > Math.abs(t) ? e : t;
				}),
				a = Math.max(-1, Math.min(1, o)),
				r = Date.now();
			this.pwt && r - this.pwt < 300 ? s && t.preventDefault() : ((this.pwt = r), this.emit('wheel', t, a), t.defaultPrevented || ('close' === i ? (t.preventDefault(), this.close(t)) : 'slide' === i && (n(e) || (t.preventDefault(), this[a > 0 ? 'prev' : 'next']()))));
		}
		onScroll() {
			window.scrollTo(Ce, Te);
		}
		onKeydown(t) {
			if (!this.isTopmost()) return;
			this.isCompact || !this.option('idle') || this.isClosing() || this.resetIdle();
			const e = t.key,
				i = this.option('keyboard');
			if (!i) return;
			const n = t.composedPath()[0],
				s = document.activeElement && document.activeElement.classList,
				o = (s && s.contains('f-button')) || n.dataset.carouselPage || n.dataset.carouselIndex;
			if ('Escape' !== e && !o && S(n)) {
				if (n.isContentEditable || -1 !== ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].indexOf(n.nodeName)) return;
			}
			if (('Tab' === t.key ? C(this.container, re) : P(this.container, re), t.ctrlKey || t.altKey || t.shiftKey)) return;
			this.emit('keydown', e, t);
			const a = i[e];
			a && 'function' == typeof this[a] && (t.preventDefault(), this[a]());
		}
		onResize() {
			const t = this.container;
			if (!t) return;
			const e = this.isCompact;
			t.classList.toggle(ce, e), this.manageCaption(this.getSlide()), this.isCompact ? this.clearIdle() : this.endIdle(), this.scale(), this.emit('resize');
		}
		onFocus(t) {
			this.isTopmost() && this.checkFocus(t);
		}
		onMousemove(t) {
			(this.prevMouseMoveEvent = t), !this.isCompact && this.option('idle') && this.resetIdle();
		}
		onVisibilityChange() {
			'visible' === document.visibilityState ? this.checkFocus() : this.endIdle();
		}
		manageCloseBtn(t) {
			const e = this.optionFor(t, 'closeButton') || !1;
			if ('auto' === e) {
				const t = this.plugins.Toolbar;
				if (t && t.state === Ut.Ready) return;
			}
			if (!e) return;
			if (!t.contentEl || t.closeBtnEl) return;
			const i = this.option('tpl.closeButton');
			if (i) {
				const e = s(this.localize(i));
				(t.closeBtnEl = t.contentEl.appendChild(e)), t.el && C(t.el, 'has-close-btn');
			}
		}
		manageCaption(t = void 0) {
			var e, i;
			const n = 'fancybox__caption',
				s = this.container;
			if (!s) return;
			P(s, ue);
			const o = this.isCompact || this.option('commonCaption'),
				a = !o;
			if ((this.caption && this.stop(this.caption), a && this.caption && (this.caption.remove(), (this.caption = null)), o && !this.caption)) for (const t of (null === (e = this.carousel) || void 0 === e ? void 0 : e.slides) || []) t.captionEl && (t.captionEl.remove(), (t.captionEl = void 0), P(t.el, ue), null === (i = t.el) || void 0 === i || i.removeAttribute('aria-labelledby'));
			if ((t || (t = this.getSlide()), !t || (o && !this.isCurrentSlide(t)))) return;
			const r = t.el;
			let l = this.optionFor(t, 'caption', '');
			if (!l)
				return void (
					o &&
					this.caption &&
					this.animate(this.caption, 'f-fadeOut', () => {
						this.caption && (this.caption.innerHTML = '');
					})
				);
			let c = null;
			if (a) {
				if (((c = t.captionEl || null), r && !c)) {
					const e = n + `_${this.id}_${t.index}`;
					(c = document.createElement('div')), C(c, n), c.setAttribute('id', e), (t.captionEl = r.appendChild(c)), C(r, ue), r.setAttribute('aria-labelledby', e);
				}
			} else {
				if (((c = this.caption), c || (c = s.querySelector('.' + n)), !c)) {
					(c = document.createElement('div')), (c.dataset.fancyboxCaption = ''), C(c, n);
					(this.footer || s).prepend(c);
				}
				C(s, ue), (this.caption = c);
			}
			c && ((c.innerHTML = ''), be(l) || 'number' == typeof l ? (c.innerHTML = l + '') : l instanceof HTMLElement && c.appendChild(l));
		}
		checkFocus(t) {
			this.focus(t);
		}
		focus(t) {
			var e;
			if (this.ignoreFocusChange) return;
			const i = document.activeElement || null,
				n = (null == t ? void 0 : t.target) || null,
				s = this.container,
				o = null === (e = this.carousel) || void 0 === e ? void 0 : e.viewport;
			if (!s || !o) return;
			if (!t && i && s.contains(i)) return;
			const a = this.getSlide(),
				r = a && a.state === ct.Ready ? a.el : null;
			if (!r || r.contains(i) || s === i) return;
			t && t.cancelable && t.preventDefault(), (this.ignoreFocusChange = !0);
			const l = Array.from(s.querySelectorAll(st));
			let c = [],
				h = null;
			for (let t of l) {
				const e = !t.offsetParent || !!t.closest('[aria-hidden="true"]'),
					i = r && r.contains(t),
					n = !o.contains(t);
				if (t === s || ((i || n) && !e)) {
					c.push(t);
					const e = t.dataset.origTabindex;
					void 0 !== e && e && (t.tabIndex = parseFloat(e)), t.removeAttribute('data-orig-tabindex'), (!t.hasAttribute('autoFocus') && h) || (h = t);
				} else {
					const e = void 0 === t.dataset.origTabindex ? t.getAttribute('tabindex') || '' : t.dataset.origTabindex;
					e && (t.dataset.origTabindex = e), (t.tabIndex = -1);
				}
			}
			let d = null;
			t ? (!n || c.indexOf(n) < 0) && ((d = h || s), c.length && (i === Ee ? (d = c[0]) : (this.lastFocus !== s && i !== xe) || (d = c[c.length - 1]))) : (d = a && 'image' === a.type ? s : h || s), d && ot(d), (this.lastFocus = document.activeElement), (this.ignoreFocusChange = !1);
		}
		next() {
			const t = this.carousel;
			t && t.pages.length > 1 && t.slideNext();
		}
		prev() {
			const t = this.carousel;
			t && t.pages.length > 1 && t.slidePrev();
		}
		jumpTo(...t) {
			this.carousel && this.carousel.slideTo(...t);
		}
		isTopmost() {
			var t;
			return (null === (t = Ae.getInstance()) || void 0 === t ? void 0 : t.id) == this.id;
		}
		animate(t = null, e = '', i) {
			if (!t || !e) return void (i && i());
			this.stop(t);
			const n = (s) => {
				s.target === t && t.dataset.animationName && (t.removeEventListener('animationend', n), delete t.dataset.animationName, i && i(), P(t, e));
			};
			(t.dataset.animationName = e), t.addEventListener('animationend', n), C(t, e);
		}
		stop(t) {
			t && t.dispatchEvent(new CustomEvent('animationend', { bubbles: !1, cancelable: !0, currentTarget: t }));
		}
		setContent(t, e = '', i = !0) {
			if (this.isClosing()) return;
			const n = t.el;
			if (!n) return;
			let o = null;
			if ((S(e) ? (o = e) : ((o = s(e + '')), S(o) || ((o = document.createElement('div')), (o.innerHTML = e + ''))), ['img', 'picture', 'iframe', 'video', 'audio'].includes(o.nodeName.toLowerCase()))) {
				const t = document.createElement('div');
				t.appendChild(o), (o = t);
			}
			S(o) && t.filter && !t.error && (o = o.querySelector(t.filter)),
				o && S(o)
					? (C(o, 'fancybox__content'), t.id && o.setAttribute('id', t.id), n.classList.add(`has-${t.error ? 'error' : t.type || 'unknown'}`), n.prepend(o), 'none' === o.style.display && (o.style.display = ''), 'none' === getComputedStyle(o).getPropertyValue('display') && (o.style.display = t.display || this.option('defaultDisplay') || 'flex'), (t.contentEl = o), i && this.revealContent(t), this.manageCloseBtn(t), this.manageCaption(t))
					: this.setError(t, '{{ELEMENT_NOT_FOUND}}');
		}
		revealContent(t, e) {
			const i = t.el,
				n = t.contentEl;
			i &&
				n &&
				(this.emit('reveal', t),
				this.hideLoading(t),
				(t.state = ct.Opening),
				(e = this.isOpeningSlide(t) ? (void 0 === e ? this.optionFor(t, 'showClass') : e) : 'f-fadeIn')
					? this.animate(n, e, () => {
							this.done(t);
					  })
					: this.done(t));
		}
		done(t) {
			this.isClosing() ||
				((t.state = ct.Ready),
				this.emit('done', t),
				C(t.el, 'is-done'),
				this.isCurrentSlide(t) &&
					this.option('autoFocus') &&
					queueMicrotask(() => {
						var e;
						null === (e = t.panzoom) || void 0 === e || e.updateControls(), this.option('autoFocus') && this.focus();
					}),
				this.isOpeningSlide(t) && (P(this.container, de), !this.isCompact && this.option('idle') && this.setIdle()));
		}
		isCurrentSlide(t) {
			const e = this.getSlide();
			return !(!t || !e) && e.index === t.index;
		}
		isOpeningSlide(t) {
			var e, i;
			return null === (null === (e = this.carousel) || void 0 === e ? void 0 : e.prevPage) && t && t.index === (null === (i = this.getSlide()) || void 0 === i ? void 0 : i.index);
		}
		showLoading(t) {
			t.state = ct.Loading;
			const e = t.el;
			if (!e) return;
			C(e, he),
				this.emit('loading', t),
				t.spinnerEl ||
					setTimeout(() => {
						if (!this.isClosing() && !t.spinnerEl && t.state === ct.Loading) {
							let i = s(E);
							C(i, 'fancybox-spinner'), (t.spinnerEl = i), e.prepend(i), this.animate(i, 'f-fadeIn');
						}
					}, 250);
		}
		hideLoading(t) {
			const e = t.el;
			if (!e) return;
			const i = t.spinnerEl;
			this.isClosing()
				? null == i || i.remove()
				: (P(e, he),
				  i &&
						this.animate(i, 'f-fadeOut', () => {
							i.remove();
						}),
				  t.state === ct.Loading && (this.emit('loaded', t), (t.state = ct.Ready)));
		}
		setError(t, e) {
			if (this.isClosing()) return;
			const i = new Event('error', { bubbles: !0, cancelable: !0 });
			if ((this.emit('error', i, t), i.defaultPrevented)) return;
			(t.error = e), this.hideLoading(t), this.clearContent(t);
			const n = document.createElement('div');
			n.classList.add('fancybox-error'), (n.innerHTML = this.localize(e || '<p>{{ERROR}}</p>')), this.setContent(t, n);
		}
		clearContent(t) {
			if (void 0 === t.state) return;
			this.emit('clearContent', t), t.contentEl && (t.contentEl.remove(), (t.contentEl = void 0));
			const e = t.el;
			e && (P(e, 'has-error'), P(e, 'has-unknown'), P(e, `has-${t.type || 'unknown'}`)), t.closeBtnEl && t.closeBtnEl.remove(), (t.closeBtnEl = void 0), t.captionEl && t.captionEl.remove(), (t.captionEl = void 0), t.spinnerEl && t.spinnerEl.remove(), (t.spinnerEl = void 0);
		}
		getSlide() {
			var t;
			const e = this.carousel;
			return (null === (t = null == e ? void 0 : e.pages[null == e ? void 0 : e.page]) || void 0 === t ? void 0 : t.slides[0]) || void 0;
		}
		close(t, e) {
			if (this.isClosing()) return;
			const i = new Event('shouldClose', { bubbles: !0, cancelable: !0 });
			if ((this.emit('shouldClose', i, t), i.defaultPrevented)) return;
			t && t.cancelable && (t.preventDefault(), t.stopPropagation());
			const n = () => {
				this.proceedClose(t, e);
			};
			this.startedFs && we && we.isFullscreen() ? Promise.resolve(we.exit()).then(() => n()) : n();
		}
		clearIdle() {
			this.idleTimer && clearTimeout(this.idleTimer), (this.idleTimer = null);
		}
		setIdle(t = !1) {
			const e = () => {
				this.clearIdle(), (this.idle = !0), C(this.container, 'is-idle'), this.emit('setIdle');
			};
			if ((this.clearIdle(), !this.isClosing()))
				if (t) e();
				else {
					const t = this.option('idle');
					t && (this.idleTimer = setTimeout(e, t));
				}
		}
		endIdle() {
			this.clearIdle(), this.idle && !this.isClosing() && ((this.idle = !1), P(this.container, 'is-idle'), this.emit('endIdle'));
		}
		resetIdle() {
			this.endIdle(), this.setIdle();
		}
		toggleIdle() {
			this.idle ? this.endIdle() : this.setIdle(!0);
		}
		toggleFullscreen() {
			we &&
				(we.isFullscreen()
					? we.exit()
					: we.request().then(() => {
							this.startedFs = !0;
					  }));
		}
		isClosing() {
			return [lt.Closing, lt.CustomClosing, lt.Destroy].includes(this.state);
		}
		proceedClose(t, e) {
			var i, n;
			(this.state = lt.Closing), this.clearIdle(), this.detachEvents();
			const s = this.container,
				o = this.carousel,
				a = this.getSlide(),
				r = a && this.option('placeFocusBack') ? a.triggerEl || this.option('triggerEl') : null;
			if ((r && (et(r) ? ot(r) : r.focus()), s && (P(s, de), C(s, 'is-closing'), s.setAttribute(ae, 'true'), this.option('animated') && C(s, le), (s.style.pointerEvents = 'none')), o)) {
				o.clearTransitions(), null === (i = o.panzoom) || void 0 === i || i.destroy(), null === (n = o.plugins.Navigation) || void 0 === n || n.detach();
				for (const t of o.slides) {
					(t.state = ct.Closing), this.hideLoading(t);
					const e = t.contentEl;
					e && this.stop(e);
					const i = null == t ? void 0 : t.panzoom;
					i && (i.stop(), i.detachEvents(), i.detachObserver()), this.isCurrentSlide(t) || o.emit('removeSlide', t);
				}
			}
			(Ce = window.scrollX),
				(Te = window.scrollY),
				window.addEventListener('scroll', this.onScroll),
				this.emit('close', t),
				this.state !== lt.CustomClosing
					? (void 0 === e && a && (e = this.optionFor(a, 'hideClass')),
					  e && a
							? (this.animate(a.contentEl, e, () => {
									o && o.emit('removeSlide', a);
							  }),
							  setTimeout(() => {
									this.destroy();
							  }, 500))
							: this.destroy())
					: setTimeout(() => {
							this.destroy();
					  }, 500);
		}
		destroy() {
			var t;
			if (this.state === lt.Destroy) return;
			window.removeEventListener('scroll', this.onScroll), (this.state = lt.Destroy), null === (t = this.carousel) || void 0 === t || t.destroy();
			const e = this.container;
			e && e.remove(), Me.delete(this.id);
			const i = Ae.getInstance();
			i
				? i.focus()
				: (xe && (xe.remove(), (xe = null)),
				  Ee && (Ee.remove(), (Ee = null)),
				  P(document.documentElement, ie),
				  (() => {
						if (!it) return;
						const t = document,
							e = t.body;
						e.classList.remove(ne), e.style.setProperty(oe, ''), t.documentElement.style.setProperty(se, '');
				  })(),
				  this.emit('destroy'));
		}
		static bind(t, e, i) {
			if (!it) return;
			let n,
				s = '',
				o = {};
			if ((void 0 === t ? (n = document.body) : be(t) ? ((n = document.body), (s = t), 'object' == typeof e && (o = e || {})) : ((n = t), be(e) && (s = e), 'object' == typeof i && (o = i || {})), !n || !S(n))) return;
			s = s || '[data-fancybox]';
			const a = Ae.openers.get(n) || new Map();
			a.set(s, o), Ae.openers.set(n, a), 1 === a.size && n.addEventListener('click', Ae.fromEvent);
		}
		static unbind(t, e) {
			let i,
				n = '';
			if ((be(t) ? ((i = document.body), (n = t)) : ((i = t), be(e) && (n = e)), !i)) return;
			const s = Ae.openers.get(i);
			s && n && s.delete(n), (n && s) || (Ae.openers.delete(i), i.removeEventListener('click', Ae.fromEvent));
		}
		static destroy() {
			let t;
			for (; (t = Ae.getInstance()); ) t.destroy();
			for (const t of Ae.openers.keys()) t.removeEventListener('click', Ae.fromEvent);
			Ae.openers = new Map();
		}
		static fromEvent(t) {
			if (t.defaultPrevented) return;
			if (t.button && 0 !== t.button) return;
			if (t.ctrlKey || t.metaKey || t.shiftKey) return;
			let e = t.composedPath()[0];
			const i = e.closest('[data-fancybox-trigger]');
			if (i) {
				const t = i.dataset.fancyboxTrigger || '',
					n = document.querySelectorAll(`[data-fancybox="${t}"]`),
					s = parseInt(i.dataset.fancyboxIndex || '', 10) || 0;
				e = n[s] || e;
			}
			if (!(e && e instanceof Element)) return;
			let n, s, o, a;
			if (
				([...Ae.openers].reverse().find(
					([t, i]) =>
						!(
							!t.contains(e) ||
							![...i].reverse().find(([i, r]) => {
								let l = e.closest(i);
								return !!l && ((n = t), (s = i), (o = l), (a = r), !0);
							})
						)
				),
				!n || !s || !o)
			)
				return;
			(a = a || {}), t.preventDefault(), (e = o);
			let r = [],
				l = p({}, rt, a);
			(l.event = t), (l.triggerEl = e), (l.delegate = i);
			const c = l.groupAll,
				h = l.groupAttr,
				d = h && e ? e.getAttribute(`${h}`) : '';
			if (((!e || d || c) && (r = [].slice.call(n.querySelectorAll(s))), e && !c && (r = d ? r.filter((t) => t.getAttribute(`${h}`) === d) : [e]), !r.length)) return;
			const u = Ae.getInstance();
			return u && u.options.triggerEl && r.indexOf(u.options.triggerEl) > -1 ? void 0 : (e && (l.startIndex = r.indexOf(e)), Ae.fromNodes(r, l));
		}
		static fromSelector(t, e, i) {
			let n = null,
				s = '',
				o = {};
			if ((be(t) ? ((n = document.body), (s = t), 'object' == typeof e && (o = e || {})) : t instanceof HTMLElement && be(e) && ((n = t), (s = e), 'object' == typeof i && (o = i || {})), !n || !s)) return !1;
			const a = Ae.openers.get(n);
			return !!a && ((o = p({}, a.get(s) || {}, o)), !!o && Ae.fromNodes(Array.from(n.querySelectorAll(s)), o));
		}
		static fromNodes(t, e) {
			e = p({}, rt, e || {});
			const i = [];
			for (const n of t) {
				const t = n.dataset || {},
					s = t[ve] || n.getAttribute(me) || n.getAttribute('currentSrc') || n.getAttribute(ve) || void 0;
				let o;
				const a = e.delegate;
				let r;
				a && i.length === e.startIndex && (o = a instanceof HTMLImageElement ? a : a.querySelector('img:not([aria-hidden])')), o || (o = n instanceof HTMLImageElement ? n : n.querySelector('img:not([aria-hidden])')), o && ((r = o.currentSrc || o[ve] || void 0), !r && o.dataset && (r = o.dataset.lazySrc || o.dataset[ve] || void 0));
				const l = { src: s, triggerEl: n, thumbEl: o, thumbElSrc: r, thumbSrc: r };
				for (const e in t) {
					let i = t[e] + '';
					(i = 'false' !== i && ('true' === i || i)), (l[e] = i);
				}
				i.push(l);
			}
			return new Ae(i, e);
		}
		static getInstance(t) {
			if (t) return Me.get(t);
			return (
				Array.from(Me.values())
					.reverse()
					.find((t) => !t.isClosing() && t) || null
			);
		}
		static getSlide() {
			var t;
			return (null === (t = Ae.getInstance()) || void 0 === t ? void 0 : t.getSlide()) || null;
		}
		static show(t = [], e = {}) {
			return new Ae(t, e);
		}
		static next() {
			const t = Ae.getInstance();
			t && t.next();
		}
		static prev() {
			const t = Ae.getInstance();
			t && t.prev();
		}
		static close(t = !0, ...e) {
			if (t) for (const t of Me.values()) t.close(...e);
			else {
				const t = Ae.getInstance();
				t && t.close(...e);
			}
		}
	}
	Object.defineProperty(Ae, 'version', { enumerable: !0, configurable: !0, writable: !0, value: '5.0.36' }), Object.defineProperty(Ae, 'defaults', { enumerable: !0, configurable: !0, writable: !0, value: rt }), Object.defineProperty(Ae, 'Plugins', { enumerable: !0, configurable: !0, writable: !0, value: ee }), Object.defineProperty(Ae, 'openers', { enumerable: !0, configurable: !0, writable: !0, value: new Map() }), (t.Carousel = tt), (t.Fancybox = Ae), (t.Panzoom = D);
});

!(function (e, t) {
	'object' == typeof exports && 'object' == typeof module ? (module.exports = t()) : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? (exports.AOS = t()) : (e.AOS = t());
})(this, function () {
	return (function (e) {
		function t(o) {
			if (n[o]) return n[o].exports;
			var i = (n[o] = { exports: {}, id: o, loaded: !1 });
			return e[o].call(i.exports, i, i.exports, t), (i.loaded = !0), i.exports;
		}
		var n = {};
		return (t.m = e), (t.c = n), (t.p = 'dist/'), t(0);
	})([
		function (e, t, n) {
			'use strict';
			function o(e) {
				return e && e.__esModule ? e : { default: e };
			}
			var i =
					Object.assign ||
					function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var n = arguments[t];
							for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
						}
						return e;
					},
				r = n(1),
				a = (o(r), n(6)),
				u = o(a),
				c = n(7),
				f = o(c),
				s = n(8),
				d = o(s),
				l = n(9),
				p = o(l),
				m = n(10),
				b = o(m),
				v = n(11),
				y = o(v),
				g = n(14),
				h = o(g),
				w = [],
				k = !1,
				x = document.all && !window.atob,
				j = { offset: 120, delay: 0, easing: 'ease', duration: 400, disable: !1, once: !1, startEvent: 'DOMContentLoaded', throttleDelay: 99, debounceDelay: 50, disableMutationObserver: !1 },
				O = function () {
					var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
					if ((e && (k = !0), k)) return (w = (0, y.default)(w, j)), (0, b.default)(w, j.once), w;
				},
				_ = function () {
					(w = (0, h.default)()), O();
				},
				S = function () {
					w.forEach(function (e, t) {
						e.node.removeAttribute('data-aos'), e.node.removeAttribute('data-aos-easing'), e.node.removeAttribute('data-aos-duration'), e.node.removeAttribute('data-aos-delay');
					});
				},
				z = function (e) {
					return e === !0 || ('mobile' === e && p.default.mobile()) || ('phone' === e && p.default.phone()) || ('tablet' === e && p.default.tablet()) || ('function' == typeof e && e() === !0);
				},
				A = function (e) {
					return (
						(j = i(j, e)),
						(w = (0, h.default)()),
						z(j.disable) || x
							? S()
							: (document.querySelector('body').setAttribute('data-aos-easing', j.easing),
							  document.querySelector('body').setAttribute('data-aos-duration', j.duration),
							  document.querySelector('body').setAttribute('data-aos-delay', j.delay),
							  'DOMContentLoaded' === j.startEvent && ['complete', 'interactive'].indexOf(document.readyState) > -1
									? O(!0)
									: 'load' === j.startEvent
									? window.addEventListener(j.startEvent, function () {
											O(!0);
									  })
									: document.addEventListener(j.startEvent, function () {
											O(!0);
									  }),
							  window.addEventListener('resize', (0, f.default)(O, j.debounceDelay, !0)),
							  window.addEventListener('orientationchange', (0, f.default)(O, j.debounceDelay, !0)),
							  window.addEventListener(
									'scroll',
									(0, u.default)(function () {
										(0, b.default)(w, j.once);
									}, j.throttleDelay)
							  ),
							  j.disableMutationObserver || (0, d.default)('[data-aos]', _),
							  w)
					);
				};
			e.exports = { init: A, refresh: O, refreshHard: _ };
		},
		function (e, t) {},
		,
		,
		,
		,
		function (e, t) {
			(function (t) {
				'use strict';
				function n(e, t, n) {
					function o(t) {
						var n = b,
							o = v;
						return (b = v = void 0), (k = t), (g = e.apply(o, n));
					}
					function r(e) {
						return (k = e), (h = setTimeout(s, t)), _ ? o(e) : g;
					}
					function a(e) {
						var n = e - w,
							o = e - k,
							i = t - n;
						return S ? j(i, y - o) : i;
					}
					function c(e) {
						var n = e - w,
							o = e - k;
						return void 0 === w || n >= t || n < 0 || (S && o >= y);
					}
					function s() {
						var e = O();
						return c(e) ? d(e) : void (h = setTimeout(s, a(e)));
					}
					function d(e) {
						return (h = void 0), z && b ? o(e) : ((b = v = void 0), g);
					}
					function l() {
						void 0 !== h && clearTimeout(h), (k = 0), (b = w = v = h = void 0);
					}
					function p() {
						return void 0 === h ? g : d(O());
					}
					function m() {
						var e = O(),
							n = c(e);
						if (((b = arguments), (v = this), (w = e), n)) {
							if (void 0 === h) return r(w);
							if (S) return (h = setTimeout(s, t)), o(w);
						}
						return void 0 === h && (h = setTimeout(s, t)), g;
					}
					var b,
						v,
						y,
						g,
						h,
						w,
						k = 0,
						_ = !1,
						S = !1,
						z = !0;
					if ('function' != typeof e) throw new TypeError(f);
					return (t = u(t) || 0), i(n) && ((_ = !!n.leading), (S = 'maxWait' in n), (y = S ? x(u(n.maxWait) || 0, t) : y), (z = 'trailing' in n ? !!n.trailing : z)), (m.cancel = l), (m.flush = p), m;
				}
				function o(e, t, o) {
					var r = !0,
						a = !0;
					if ('function' != typeof e) throw new TypeError(f);
					return i(o) && ((r = 'leading' in o ? !!o.leading : r), (a = 'trailing' in o ? !!o.trailing : a)), n(e, t, { leading: r, maxWait: t, trailing: a });
				}
				function i(e) {
					var t = 'undefined' == typeof e ? 'undefined' : c(e);
					return !!e && ('object' == t || 'function' == t);
				}
				function r(e) {
					return !!e && 'object' == ('undefined' == typeof e ? 'undefined' : c(e));
				}
				function a(e) {
					return 'symbol' == ('undefined' == typeof e ? 'undefined' : c(e)) || (r(e) && k.call(e) == d);
				}
				function u(e) {
					if ('number' == typeof e) return e;
					if (a(e)) return s;
					if (i(e)) {
						var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
						e = i(t) ? t + '' : t;
					}
					if ('string' != typeof e) return 0 === e ? e : +e;
					e = e.replace(l, '');
					var n = m.test(e);
					return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? s : +e;
				}
				var c =
						'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
							? function (e) {
									return typeof e;
							  }
							: function (e) {
									return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
							  },
					f = 'Expected a function',
					s = NaN,
					d = '[object Symbol]',
					l = /^\s+|\s+$/g,
					p = /^[-+]0x[0-9a-f]+$/i,
					m = /^0b[01]+$/i,
					b = /^0o[0-7]+$/i,
					v = parseInt,
					y = 'object' == ('undefined' == typeof t ? 'undefined' : c(t)) && t && t.Object === Object && t,
					g = 'object' == ('undefined' == typeof self ? 'undefined' : c(self)) && self && self.Object === Object && self,
					h = y || g || Function('return this')(),
					w = Object.prototype,
					k = w.toString,
					x = Math.max,
					j = Math.min,
					O = function () {
						return h.Date.now();
					};
				e.exports = o;
			}).call(
				t,
				(function () {
					return this;
				})()
			);
		},
		function (e, t) {
			(function (t) {
				'use strict';
				function n(e, t, n) {
					function i(t) {
						var n = b,
							o = v;
						return (b = v = void 0), (O = t), (g = e.apply(o, n));
					}
					function r(e) {
						return (O = e), (h = setTimeout(s, t)), _ ? i(e) : g;
					}
					function u(e) {
						var n = e - w,
							o = e - O,
							i = t - n;
						return S ? x(i, y - o) : i;
					}
					function f(e) {
						var n = e - w,
							o = e - O;
						return void 0 === w || n >= t || n < 0 || (S && o >= y);
					}
					function s() {
						var e = j();
						return f(e) ? d(e) : void (h = setTimeout(s, u(e)));
					}
					function d(e) {
						return (h = void 0), z && b ? i(e) : ((b = v = void 0), g);
					}
					function l() {
						void 0 !== h && clearTimeout(h), (O = 0), (b = w = v = h = void 0);
					}
					function p() {
						return void 0 === h ? g : d(j());
					}
					function m() {
						var e = j(),
							n = f(e);
						if (((b = arguments), (v = this), (w = e), n)) {
							if (void 0 === h) return r(w);
							if (S) return (h = setTimeout(s, t)), i(w);
						}
						return void 0 === h && (h = setTimeout(s, t)), g;
					}
					var b,
						v,
						y,
						g,
						h,
						w,
						O = 0,
						_ = !1,
						S = !1,
						z = !0;
					if ('function' != typeof e) throw new TypeError(c);
					return (t = a(t) || 0), o(n) && ((_ = !!n.leading), (S = 'maxWait' in n), (y = S ? k(a(n.maxWait) || 0, t) : y), (z = 'trailing' in n ? !!n.trailing : z)), (m.cancel = l), (m.flush = p), m;
				}
				function o(e) {
					var t = 'undefined' == typeof e ? 'undefined' : u(e);
					return !!e && ('object' == t || 'function' == t);
				}
				function i(e) {
					return !!e && 'object' == ('undefined' == typeof e ? 'undefined' : u(e));
				}
				function r(e) {
					return 'symbol' == ('undefined' == typeof e ? 'undefined' : u(e)) || (i(e) && w.call(e) == s);
				}
				function a(e) {
					if ('number' == typeof e) return e;
					if (r(e)) return f;
					if (o(e)) {
						var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
						e = o(t) ? t + '' : t;
					}
					if ('string' != typeof e) return 0 === e ? e : +e;
					e = e.replace(d, '');
					var n = p.test(e);
					return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? f : +e;
				}
				var u =
						'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
							? function (e) {
									return typeof e;
							  }
							: function (e) {
									return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
							  },
					c = 'Expected a function',
					f = NaN,
					s = '[object Symbol]',
					d = /^\s+|\s+$/g,
					l = /^[-+]0x[0-9a-f]+$/i,
					p = /^0b[01]+$/i,
					m = /^0o[0-7]+$/i,
					b = parseInt,
					v = 'object' == ('undefined' == typeof t ? 'undefined' : u(t)) && t && t.Object === Object && t,
					y = 'object' == ('undefined' == typeof self ? 'undefined' : u(self)) && self && self.Object === Object && self,
					g = v || y || Function('return this')(),
					h = Object.prototype,
					w = h.toString,
					k = Math.max,
					x = Math.min,
					j = function () {
						return g.Date.now();
					};
				e.exports = n;
			}).call(
				t,
				(function () {
					return this;
				})()
			);
		},
		function (e, t) {
			'use strict';
			function n(e, t) {
				var n = new r(o);
				(a = t), n.observe(i.documentElement, { childList: !0, subtree: !0, removedNodes: !0 });
			}
			function o(e) {
				e &&
					e.forEach(function (e) {
						var t = Array.prototype.slice.call(e.addedNodes),
							n = Array.prototype.slice.call(e.removedNodes),
							o = t.concat(n).filter(function (e) {
								return e.hasAttribute && e.hasAttribute('data-aos');
							}).length;
						o && a();
					});
			}
			Object.defineProperty(t, '__esModule', { value: !0 });
			var i = window.document,
				r = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
				a = function () {};
			t.default = n;
		},
		function (e, t) {
			'use strict';
			function n(e, t) {
				if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
			}
			function o() {
				return navigator.userAgent || navigator.vendor || window.opera || '';
			}
			Object.defineProperty(t, '__esModule', { value: !0 });
			var i = (function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							(o.enumerable = o.enumerable || !1), (o.configurable = !0), 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t;
					};
				})(),
				r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
				a =
					/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
				u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
				c =
					/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
				f = (function () {
					function e() {
						n(this, e);
					}
					return (
						i(e, [
							{
								key: 'phone',
								value: function () {
									var e = o();
									return !(!r.test(e) && !a.test(e.substr(0, 4)));
								}
							},
							{
								key: 'mobile',
								value: function () {
									var e = o();
									return !(!u.test(e) && !c.test(e.substr(0, 4)));
								}
							},
							{
								key: 'tablet',
								value: function () {
									return this.mobile() && !this.phone();
								}
							}
						]),
						e
					);
				})();
			t.default = new f();
		},
		function (e, t) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var n = function (e, t, n) {
					var o = e.node.getAttribute('data-aos-once');
					t > e.position ? e.node.classList.add('aos-animate') : 'undefined' != typeof o && ('false' === o || (!n && 'true' !== o)) && e.node.classList.remove('aos-animate');
				},
				o = function (e, t) {
					var o = window.pageYOffset,
						i = window.innerHeight;
					e.forEach(function (e, r) {
						n(e, i + o, t);
					});
				};
			t.default = o;
		},
		function (e, t, n) {
			'use strict';
			function o(e) {
				return e && e.__esModule ? e : { default: e };
			}
			Object.defineProperty(t, '__esModule', { value: !0 });
			var i = n(12),
				r = o(i),
				a = function (e, t) {
					return (
						e.forEach(function (e, n) {
							e.node.classList.add('aos-init'), (e.position = (0, r.default)(e.node, t.offset));
						}),
						e
					);
				};
			t.default = a;
		},
		function (e, t, n) {
			'use strict';
			function o(e) {
				return e && e.__esModule ? e : { default: e };
			}
			Object.defineProperty(t, '__esModule', { value: !0 });
			var i = n(13),
				r = o(i),
				a = function (e, t) {
					var n = 0,
						o = 0,
						i = window.innerHeight,
						a = { offset: e.getAttribute('data-aos-offset'), anchor: e.getAttribute('data-aos-anchor'), anchorPlacement: e.getAttribute('data-aos-anchor-placement') };
					switch ((a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)), a.anchor && document.querySelectorAll(a.anchor) && (e = document.querySelectorAll(a.anchor)[0]), (n = (0, r.default)(e).top), a.anchorPlacement)) {
						case 'top-bottom':
							break;
						case 'center-bottom':
							n += e.offsetHeight / 2;
							break;
						case 'bottom-bottom':
							n += e.offsetHeight;
							break;
						case 'top-center':
							n += i / 2;
							break;
						case 'bottom-center':
							n += i / 2 + e.offsetHeight;
							break;
						case 'center-center':
							n += i / 2 + e.offsetHeight / 2;
							break;
						case 'top-top':
							n += i;
							break;
						case 'bottom-top':
							n += e.offsetHeight + i;
							break;
						case 'center-top':
							n += e.offsetHeight / 2 + i;
					}
					return a.anchorPlacement || a.offset || isNaN(t) || (o = t), n + o;
				};
			t.default = a;
		},
		function (e, t) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var n = function (e) {
				for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop); ) (t += e.offsetLeft - ('BODY' != e.tagName ? e.scrollLeft : 0)), (n += e.offsetTop - ('BODY' != e.tagName ? e.scrollTop : 0)), (e = e.offsetParent);
				return { top: n, left: t };
			};
			t.default = n;
		},
		function (e, t) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var n = function (e) {
				return (
					(e = e || document.querySelectorAll('[data-aos]')),
					Array.prototype.map.call(e, function (e) {
						return { node: e };
					})
				);
			};
			t.default = n;
		}
	]);
});

/**
 * Swiper 10.3.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2023 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: September 28, 2023
 */
var Swiper = (function () {
	'use strict';
	function e(e) {
		return null !== e && 'object' == typeof e && 'constructor' in e && e.constructor === Object;
	}
	function t(s, a) {
		void 0 === s && (s = {}),
			void 0 === a && (a = {}),
			Object.keys(a).forEach((i) => {
				void 0 === s[i] ? (s[i] = a[i]) : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i]);
			});
	}
	const s = {
		body: {},
		addEventListener() {},
		removeEventListener() {},
		activeElement: { blur() {}, nodeName: '' },
		querySelector: () => null,
		querySelectorAll: () => [],
		getElementById: () => null,
		createEvent: () => ({ initEvent() {} }),
		createElement: () => ({ children: [], childNodes: [], style: {}, setAttribute() {}, getElementsByTagName: () => [] }),
		createElementNS: () => ({}),
		importNode: () => null,
		location: { hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', protocol: '', search: '' }
	};
	function a() {
		const e = 'undefined' != typeof document ? document : {};
		return t(e, s), e;
	}
	const i = {
		document: s,
		navigator: { userAgent: '' },
		location: { hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', protocol: '', search: '' },
		history: { replaceState() {}, pushState() {}, go() {}, back() {} },
		CustomEvent: function () {
			return this;
		},
		addEventListener() {},
		removeEventListener() {},
		getComputedStyle: () => ({ getPropertyValue: () => '' }),
		Image() {},
		Date() {},
		screen: {},
		setTimeout() {},
		clearTimeout() {},
		matchMedia: () => ({}),
		requestAnimationFrame: (e) => ('undefined' == typeof setTimeout ? (e(), null) : setTimeout(e, 0)),
		cancelAnimationFrame(e) {
			'undefined' != typeof setTimeout && clearTimeout(e);
		}
	};
	function r() {
		const e = 'undefined' != typeof window ? window : {};
		return t(e, i), e;
	}
	function n(e, t) {
		return void 0 === t && (t = 0), setTimeout(e, t);
	}
	function l() {
		return Date.now();
	}
	function o(e, t) {
		void 0 === t && (t = 'x');
		const s = r();
		let a, i, n;
		const l = (function (e) {
			const t = r();
			let s;
			return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle), s || (s = e.style), s;
		})(e);
		return (
			s.WebKitCSSMatrix
				? ((i = l.transform || l.webkitTransform),
				  i.split(',').length > 6 &&
						(i = i
							.split(', ')
							.map((e) => e.replace(',', '.'))
							.join(', ')),
				  (n = new s.WebKitCSSMatrix('none' === i ? '' : i)))
				: ((n = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,')), (a = n.toString().split(','))),
			'x' === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])),
			'y' === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])),
			i || 0
		);
	}
	function d(e) {
		return 'object' == typeof e && null !== e && e.constructor && 'Object' === Object.prototype.toString.call(e).slice(8, -1);
	}
	function c() {
		const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
			t = ['__proto__', 'constructor', 'prototype'];
		for (let a = 1; a < arguments.length; a += 1) {
			const i = a < 0 || arguments.length <= a ? void 0 : arguments[a];
			if (null != i && ((s = i), !('undefined' != typeof window && void 0 !== window.HTMLElement ? s instanceof HTMLElement : s && (1 === s.nodeType || 11 === s.nodeType)))) {
				const s = Object.keys(Object(i)).filter((e) => t.indexOf(e) < 0);
				for (let t = 0, a = s.length; t < a; t += 1) {
					const a = s[t],
						r = Object.getOwnPropertyDescriptor(i, a);
					void 0 !== r && r.enumerable && (d(e[a]) && d(i[a]) ? (i[a].__swiper__ ? (e[a] = i[a]) : c(e[a], i[a])) : !d(e[a]) && d(i[a]) ? ((e[a] = {}), i[a].__swiper__ ? (e[a] = i[a]) : c(e[a], i[a])) : (e[a] = i[a]));
				}
			}
		}
		var s;
		return e;
	}
	function p(e, t, s) {
		e.style.setProperty(t, s);
	}
	function u(e) {
		let { swiper: t, targetPosition: s, side: a } = e;
		const i = r(),
			n = -t.translate;
		let l,
			o = null;
		const d = t.params.speed;
		(t.wrapperEl.style.scrollSnapType = 'none'), i.cancelAnimationFrame(t.cssModeFrameID);
		const c = s > n ? 'next' : 'prev',
			p = (e, t) => ('next' === c && e >= t) || ('prev' === c && e <= t),
			u = () => {
				(l = new Date().getTime()), null === o && (o = l);
				const e = Math.max(Math.min((l - o) / d, 1), 0),
					r = 0.5 - Math.cos(e * Math.PI) / 2;
				let c = n + r * (s - n);
				if ((p(c, s) && (c = s), t.wrapperEl.scrollTo({ [a]: c }), p(c, s)))
					return (
						(t.wrapperEl.style.overflow = 'hidden'),
						(t.wrapperEl.style.scrollSnapType = ''),
						setTimeout(() => {
							(t.wrapperEl.style.overflow = ''), t.wrapperEl.scrollTo({ [a]: c });
						}),
						void i.cancelAnimationFrame(t.cssModeFrameID)
					);
				t.cssModeFrameID = i.requestAnimationFrame(u);
			};
		u();
	}
	function m(e) {
		return e.querySelector('.swiper-slide-transform') || (e.shadowRoot && e.shadowRoot.querySelector('.swiper-slide-transform')) || e;
	}
	function h(e, t) {
		return void 0 === t && (t = ''), [...e.children].filter((e) => e.matches(t));
	}
	function f(e, t) {
		void 0 === t && (t = []);
		const s = document.createElement(e);
		return s.classList.add(...(Array.isArray(t) ? t : [t])), s;
	}
	function g(e) {
		const t = r(),
			s = a(),
			i = e.getBoundingClientRect(),
			n = s.body,
			l = e.clientTop || n.clientTop || 0,
			o = e.clientLeft || n.clientLeft || 0,
			d = e === t ? t.scrollY : e.scrollTop,
			c = e === t ? t.scrollX : e.scrollLeft;
		return { top: i.top + d - l, left: i.left + c - o };
	}
	function v(e, t) {
		return r().getComputedStyle(e, null).getPropertyValue(t);
	}
	function w(e) {
		let t,
			s = e;
		if (s) {
			for (t = 0; null !== (s = s.previousSibling); ) 1 === s.nodeType && (t += 1);
			return t;
		}
	}
	function b(e, t) {
		const s = [];
		let a = e.parentElement;
		for (; a; ) t ? a.matches(t) && s.push(a) : s.push(a), (a = a.parentElement);
		return s;
	}
	function y(e, t) {
		t &&
			e.addEventListener('transitionend', function s(a) {
				a.target === e && (t.call(e, a), e.removeEventListener('transitionend', s));
			});
	}
	function E(e, t, s) {
		const a = r();
		return s ? e['width' === t ? 'offsetWidth' : 'offsetHeight'] + parseFloat(a.getComputedStyle(e, null).getPropertyValue('width' === t ? 'margin-right' : 'margin-top')) + parseFloat(a.getComputedStyle(e, null).getPropertyValue('width' === t ? 'margin-left' : 'margin-bottom')) : e.offsetWidth;
	}
	let x, S, T;
	function M() {
		return (
			x ||
				(x = (function () {
					const e = r(),
						t = a();
					return { smoothScroll: t.documentElement && t.documentElement.style && 'scrollBehavior' in t.documentElement.style, touch: !!('ontouchstart' in e || (e.DocumentTouch && t instanceof e.DocumentTouch)) };
				})()),
			x
		);
	}
	function C(e) {
		return (
			void 0 === e && (e = {}),
			S ||
				(S = (function (e) {
					let { userAgent: t } = void 0 === e ? {} : e;
					const s = M(),
						a = r(),
						i = a.navigator.platform,
						n = t || a.navigator.userAgent,
						l = { ios: !1, android: !1 },
						o = a.screen.width,
						d = a.screen.height,
						c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
					let p = n.match(/(iPad).*OS\s([\d_]+)/);
					const u = n.match(/(iPod)(.*OS\s([\d_]+))?/),
						m = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
						h = 'Win32' === i;
					let f = 'MacIntel' === i;
					return !p && f && s.touch && ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'].indexOf(`${o}x${d}`) >= 0 && ((p = n.match(/(Version)\/([\d.]+)/)), p || (p = [0, 1, '13_0_0']), (f = !1)), c && !h && ((l.os = 'android'), (l.android = !0)), (p || m || u) && ((l.os = 'ios'), (l.ios = !0)), l;
				})(e)),
			S
		);
	}
	function P() {
		return (
			T ||
				(T = (function () {
					const e = r();
					let t = !1;
					function s() {
						const t = e.navigator.userAgent.toLowerCase();
						return t.indexOf('safari') >= 0 && t.indexOf('chrome') < 0 && t.indexOf('android') < 0;
					}
					if (s()) {
						const s = String(e.navigator.userAgent);
						if (s.includes('Version/')) {
							const [e, a] = s
								.split('Version/')[1]
								.split(' ')[0]
								.split('.')
								.map((e) => Number(e));
							t = e < 16 || (16 === e && a < 2);
						}
					}
					return { isSafari: t || s(), needPerspectiveFix: t, isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent) };
				})()),
			T
		);
	}
	var L = {
		on(e, t, s) {
			const a = this;
			if (!a.eventsListeners || a.destroyed) return a;
			if ('function' != typeof t) return a;
			const i = s ? 'unshift' : 'push';
			return (
				e.split(' ').forEach((e) => {
					a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][i](t);
				}),
				a
			);
		},
		once(e, t, s) {
			const a = this;
			if (!a.eventsListeners || a.destroyed) return a;
			if ('function' != typeof t) return a;
			function i() {
				a.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
				for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n];
				t.apply(a, r);
			}
			return (i.__emitterProxy = t), a.on(e, i, s);
		},
		onAny(e, t) {
			const s = this;
			if (!s.eventsListeners || s.destroyed) return s;
			if ('function' != typeof e) return s;
			const a = t ? 'unshift' : 'push';
			return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e), s;
		},
		offAny(e) {
			const t = this;
			if (!t.eventsListeners || t.destroyed) return t;
			if (!t.eventsAnyListeners) return t;
			const s = t.eventsAnyListeners.indexOf(e);
			return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
		},
		off(e, t) {
			const s = this;
			return !s.eventsListeners || s.destroyed
				? s
				: s.eventsListeners
				? (e.split(' ').forEach((e) => {
						void 0 === t
							? (s.eventsListeners[e] = [])
							: s.eventsListeners[e] &&
							  s.eventsListeners[e].forEach((a, i) => {
									(a === t || (a.__emitterProxy && a.__emitterProxy === t)) && s.eventsListeners[e].splice(i, 1);
							  });
				  }),
				  s)
				: s;
		},
		emit() {
			const e = this;
			if (!e.eventsListeners || e.destroyed) return e;
			if (!e.eventsListeners) return e;
			let t, s, a;
			for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++) r[n] = arguments[n];
			'string' == typeof r[0] || Array.isArray(r[0]) ? ((t = r[0]), (s = r.slice(1, r.length)), (a = e)) : ((t = r[0].events), (s = r[0].data), (a = r[0].context || e)), s.unshift(a);
			return (
				(Array.isArray(t) ? t : t.split(' ')).forEach((t) => {
					e.eventsAnyListeners &&
						e.eventsAnyListeners.length &&
						e.eventsAnyListeners.forEach((e) => {
							e.apply(a, [t, ...s]);
						}),
						e.eventsListeners &&
							e.eventsListeners[t] &&
							e.eventsListeners[t].forEach((e) => {
								e.apply(a, s);
							});
				}),
				e
			);
		}
	};
	const z = (e, t) => {
			if (!e || e.destroyed || !e.params) return;
			const s = t.closest(e.isElement ? 'swiper-slide' : `.${e.params.slideClass}`);
			if (s) {
				let t = s.querySelector(`.${e.params.lazyPreloaderClass}`);
				!t &&
					e.isElement &&
					(s.shadowRoot
						? (t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`))
						: requestAnimationFrame(() => {
								s.shadowRoot && ((t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`)), t && t.remove());
						  })),
					t && t.remove();
			}
		},
		A = (e, t) => {
			if (!e.slides[t]) return;
			const s = e.slides[t].querySelector('[loading="lazy"]');
			s && s.removeAttribute('loading');
		},
		$ = (e) => {
			if (!e || e.destroyed || !e.params) return;
			let t = e.params.lazyPreloadPrevNext;
			const s = e.slides.length;
			if (!s || !t || t < 0) return;
			t = Math.min(t, s);
			const a = 'auto' === e.params.slidesPerView ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView),
				i = e.activeIndex;
			if (e.params.grid && e.params.grid.rows > 1) {
				const s = i,
					r = [s - t];
				return (
					r.push(...Array.from({ length: t }).map((e, t) => s + a + t)),
					void e.slides.forEach((t, s) => {
						r.includes(t.column) && A(e, s);
					})
				);
			}
			const r = i + a - 1;
			if (e.params.rewind || e.params.loop)
				for (let a = i - t; a <= r + t; a += 1) {
					const t = ((a % s) + s) % s;
					(t < i || t > r) && A(e, t);
				}
			else for (let a = Math.max(i - t, 0); a <= Math.min(r + t, s - 1); a += 1) a !== i && (a > r || a < i) && A(e, a);
		};
	var I = {
		updateSize: function () {
			const e = this;
			let t, s;
			const a = e.el;
			(t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a.clientWidth),
				(s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a.clientHeight),
				(0 === t && e.isHorizontal()) || (0 === s && e.isVertical()) || ((t = t - parseInt(v(a, 'padding-left') || 0, 10) - parseInt(v(a, 'padding-right') || 0, 10)), (s = s - parseInt(v(a, 'padding-top') || 0, 10) - parseInt(v(a, 'padding-bottom') || 0, 10)), Number.isNaN(t) && (t = 0), Number.isNaN(s) && (s = 0), Object.assign(e, { width: t, height: s, size: e.isHorizontal() ? t : s }));
		},
		updateSlides: function () {
			const e = this;
			function t(t) {
				return e.isHorizontal() ? t : { width: 'height', 'margin-top': 'margin-left', 'margin-bottom ': 'margin-right', 'margin-left': 'margin-top', 'margin-right': 'margin-bottom', 'padding-left': 'padding-top', 'padding-right': 'padding-bottom', marginRight: 'marginBottom' }[t];
			}
			function s(e, s) {
				return parseFloat(e.getPropertyValue(t(s)) || 0);
			}
			const a = e.params,
				{ wrapperEl: i, slidesEl: r, size: n, rtlTranslate: l, wrongRTL: o } = e,
				d = e.virtual && a.virtual.enabled,
				c = d ? e.virtual.slides.length : e.slides.length,
				u = h(r, `.${e.params.slideClass}, swiper-slide`),
				m = d ? e.virtual.slides.length : u.length;
			let f = [];
			const g = [],
				w = [];
			let b = a.slidesOffsetBefore;
			'function' == typeof b && (b = a.slidesOffsetBefore.call(e));
			let y = a.slidesOffsetAfter;
			'function' == typeof y && (y = a.slidesOffsetAfter.call(e));
			const x = e.snapGrid.length,
				S = e.slidesGrid.length;
			let T = a.spaceBetween,
				M = -b,
				C = 0,
				P = 0;
			if (void 0 === n) return;
			'string' == typeof T && T.indexOf('%') >= 0 ? (T = (parseFloat(T.replace('%', '')) / 100) * n) : 'string' == typeof T && (T = parseFloat(T)),
				(e.virtualSize = -T),
				u.forEach((e) => {
					l ? (e.style.marginLeft = '') : (e.style.marginRight = ''), (e.style.marginBottom = ''), (e.style.marginTop = '');
				}),
				a.centeredSlides && a.cssMode && (p(i, '--swiper-centered-offset-before', ''), p(i, '--swiper-centered-offset-after', ''));
			const L = a.grid && a.grid.rows > 1 && e.grid;
			let z;
			L && e.grid.initSlides(m);
			const A = 'auto' === a.slidesPerView && a.breakpoints && Object.keys(a.breakpoints).filter((e) => void 0 !== a.breakpoints[e].slidesPerView).length > 0;
			for (let i = 0; i < m; i += 1) {
				let r;
				if (((z = 0), u[i] && (r = u[i]), L && e.grid.updateSlide(i, r, m, t), !u[i] || 'none' !== v(r, 'display'))) {
					if ('auto' === a.slidesPerView) {
						A && (u[i].style[t('width')] = '');
						const n = getComputedStyle(r),
							l = r.style.transform,
							o = r.style.webkitTransform;
						if ((l && (r.style.transform = 'none'), o && (r.style.webkitTransform = 'none'), a.roundLengths)) z = e.isHorizontal() ? E(r, 'width', !0) : E(r, 'height', !0);
						else {
							const e = s(n, 'width'),
								t = s(n, 'padding-left'),
								a = s(n, 'padding-right'),
								i = s(n, 'margin-left'),
								l = s(n, 'margin-right'),
								o = n.getPropertyValue('box-sizing');
							if (o && 'border-box' === o) z = e + i + l;
							else {
								const { clientWidth: s, offsetWidth: n } = r;
								z = e + t + a + i + l + (n - s);
							}
						}
						l && (r.style.transform = l), o && (r.style.webkitTransform = o), a.roundLengths && (z = Math.floor(z));
					} else (z = (n - (a.slidesPerView - 1) * T) / a.slidesPerView), a.roundLengths && (z = Math.floor(z)), u[i] && (u[i].style[t('width')] = `${z}px`);
					u[i] && (u[i].swiperSlideSize = z),
						w.push(z),
						a.centeredSlides ? ((M = M + z / 2 + C / 2 + T), 0 === C && 0 !== i && (M = M - n / 2 - T), 0 === i && (M = M - n / 2 - T), Math.abs(M) < 0.001 && (M = 0), a.roundLengths && (M = Math.floor(M)), P % a.slidesPerGroup == 0 && f.push(M), g.push(M)) : (a.roundLengths && (M = Math.floor(M)), (P - Math.min(e.params.slidesPerGroupSkip, P)) % e.params.slidesPerGroup == 0 && f.push(M), g.push(M), (M = M + z + T)),
						(e.virtualSize += z + T),
						(C = z),
						(P += 1);
				}
			}
			if (((e.virtualSize = Math.max(e.virtualSize, n) + y), l && o && ('slide' === a.effect || 'coverflow' === a.effect) && (i.style.width = `${e.virtualSize + T}px`), a.setWrapperSize && (i.style[t('width')] = `${e.virtualSize + T}px`), L && e.grid.updateWrapperSize(z, f, t), !a.centeredSlides)) {
				const t = [];
				for (let s = 0; s < f.length; s += 1) {
					let i = f[s];
					a.roundLengths && (i = Math.floor(i)), f[s] <= e.virtualSize - n && t.push(i);
				}
				(f = t), Math.floor(e.virtualSize - n) - Math.floor(f[f.length - 1]) > 1 && f.push(e.virtualSize - n);
			}
			if (d && a.loop) {
				const t = w[0] + T;
				if (a.slidesPerGroup > 1) {
					const s = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / a.slidesPerGroup),
						i = t * a.slidesPerGroup;
					for (let e = 0; e < s; e += 1) f.push(f[f.length - 1] + i);
				}
				for (let s = 0; s < e.virtual.slidesBefore + e.virtual.slidesAfter; s += 1) 1 === a.slidesPerGroup && f.push(f[f.length - 1] + t), g.push(g[g.length - 1] + t), (e.virtualSize += t);
			}
			if ((0 === f.length && (f = [0]), 0 !== T)) {
				const s = e.isHorizontal() && l ? 'marginLeft' : t('marginRight');
				u.filter((e, t) => !(a.cssMode && !a.loop) || t !== u.length - 1).forEach((e) => {
					e.style[s] = `${T}px`;
				});
			}
			if (a.centeredSlides && a.centeredSlidesBounds) {
				let e = 0;
				w.forEach((t) => {
					e += t + (T || 0);
				}),
					(e -= T);
				const t = e - n;
				f = f.map((e) => (e <= 0 ? -b : e > t ? t + y : e));
			}
			if (a.centerInsufficientSlides) {
				let e = 0;
				if (
					(w.forEach((t) => {
						e += t + (T || 0);
					}),
					(e -= T),
					e < n)
				) {
					const t = (n - e) / 2;
					f.forEach((e, s) => {
						f[s] = e - t;
					}),
						g.forEach((e, s) => {
							g[s] = e + t;
						});
				}
			}
			if ((Object.assign(e, { slides: u, snapGrid: f, slidesGrid: g, slidesSizesGrid: w }), a.centeredSlides && a.cssMode && !a.centeredSlidesBounds)) {
				p(i, '--swiper-centered-offset-before', -f[0] + 'px'), p(i, '--swiper-centered-offset-after', e.size / 2 - w[w.length - 1] / 2 + 'px');
				const t = -e.snapGrid[0],
					s = -e.slidesGrid[0];
				(e.snapGrid = e.snapGrid.map((e) => e + t)), (e.slidesGrid = e.slidesGrid.map((e) => e + s));
			}
			if ((m !== c && e.emit('slidesLengthChange'), f.length !== x && (e.params.watchOverflow && e.checkOverflow(), e.emit('snapGridLengthChange')), g.length !== S && e.emit('slidesGridLengthChange'), a.watchSlidesProgress && e.updateSlidesOffset(), !(d || a.cssMode || ('slide' !== a.effect && 'fade' !== a.effect)))) {
				const t = `${a.containerModifierClass}backface-hidden`,
					s = e.el.classList.contains(t);
				m <= a.maxBackfaceHiddenSlides ? s || e.el.classList.add(t) : s && e.el.classList.remove(t);
			}
		},
		updateAutoHeight: function (e) {
			const t = this,
				s = [],
				a = t.virtual && t.params.virtual.enabled;
			let i,
				r = 0;
			'number' == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
			const n = (e) => (a ? t.slides[t.getSlideIndexByData(e)] : t.slides[e]);
			if ('auto' !== t.params.slidesPerView && t.params.slidesPerView > 1)
				if (t.params.centeredSlides)
					(t.visibleSlides || []).forEach((e) => {
						s.push(e);
					});
				else
					for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
						const e = t.activeIndex + i;
						if (e > t.slides.length && !a) break;
						s.push(n(e));
					}
			else s.push(n(t.activeIndex));
			for (i = 0; i < s.length; i += 1)
				if (void 0 !== s[i]) {
					const e = s[i].offsetHeight;
					r = e > r ? e : r;
				}
			(r || 0 === r) && (t.wrapperEl.style.height = `${r}px`);
		},
		updateSlidesOffset: function () {
			const e = this,
				t = e.slides,
				s = e.isElement ? (e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop) : 0;
			for (let a = 0; a < t.length; a += 1) t[a].swiperSlideOffset = (e.isHorizontal() ? t[a].offsetLeft : t[a].offsetTop) - s - e.cssOverflowAdjustment();
		},
		updateSlidesProgress: function (e) {
			void 0 === e && (e = (this && this.translate) || 0);
			const t = this,
				s = t.params,
				{ slides: a, rtlTranslate: i, snapGrid: r } = t;
			if (0 === a.length) return;
			void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
			let n = -e;
			i && (n = e),
				a.forEach((e) => {
					e.classList.remove(s.slideVisibleClass);
				}),
				(t.visibleSlidesIndexes = []),
				(t.visibleSlides = []);
			let l = s.spaceBetween;
			'string' == typeof l && l.indexOf('%') >= 0 ? (l = (parseFloat(l.replace('%', '')) / 100) * t.size) : 'string' == typeof l && (l = parseFloat(l));
			for (let e = 0; e < a.length; e += 1) {
				const o = a[e];
				let d = o.swiperSlideOffset;
				s.cssMode && s.centeredSlides && (d -= a[0].swiperSlideOffset);
				const c = (n + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
					p = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
					u = -(n - d),
					m = u + t.slidesSizesGrid[e];
				((u >= 0 && u < t.size - 1) || (m > 1 && m <= t.size) || (u <= 0 && m >= t.size)) && (t.visibleSlides.push(o), t.visibleSlidesIndexes.push(e), a[e].classList.add(s.slideVisibleClass)), (o.progress = i ? -c : c), (o.originalProgress = i ? -p : p);
			}
		},
		updateProgress: function (e) {
			const t = this;
			if (void 0 === e) {
				const s = t.rtlTranslate ? -1 : 1;
				e = (t && t.translate && t.translate * s) || 0;
			}
			const s = t.params,
				a = t.maxTranslate() - t.minTranslate();
			let { progress: i, isBeginning: r, isEnd: n, progressLoop: l } = t;
			const o = r,
				d = n;
			if (0 === a) (i = 0), (r = !0), (n = !0);
			else {
				i = (e - t.minTranslate()) / a;
				const s = Math.abs(e - t.minTranslate()) < 1,
					l = Math.abs(e - t.maxTranslate()) < 1;
				(r = s || i <= 0), (n = l || i >= 1), s && (i = 0), l && (i = 1);
			}
			if (s.loop) {
				const s = t.getSlideIndexByData(0),
					a = t.getSlideIndexByData(t.slides.length - 1),
					i = t.slidesGrid[s],
					r = t.slidesGrid[a],
					n = t.slidesGrid[t.slidesGrid.length - 1],
					o = Math.abs(e);
				(l = o >= i ? (o - i) / n : (o + n - r) / n), l > 1 && (l -= 1);
			}
			Object.assign(t, { progress: i, progressLoop: l, isBeginning: r, isEnd: n }), (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) && t.updateSlidesProgress(e), r && !o && t.emit('reachBeginning toEdge'), n && !d && t.emit('reachEnd toEdge'), ((o && !r) || (d && !n)) && t.emit('fromEdge'), t.emit('progress', i);
		},
		updateSlidesClasses: function () {
			const e = this,
				{ slides: t, params: s, slidesEl: a, activeIndex: i } = e,
				r = e.virtual && s.virtual.enabled,
				n = (e) => h(a, `.${s.slideClass}${e}, swiper-slide${e}`)[0];
			let l;
			if (
				(t.forEach((e) => {
					e.classList.remove(s.slideActiveClass, s.slideNextClass, s.slidePrevClass);
				}),
				r)
			)
				if (s.loop) {
					let t = i - e.virtual.slidesBefore;
					t < 0 && (t = e.virtual.slides.length + t), t >= e.virtual.slides.length && (t -= e.virtual.slides.length), (l = n(`[data-swiper-slide-index="${t}"]`));
				} else l = n(`[data-swiper-slide-index="${i}"]`);
			else l = t[i];
			if (l) {
				l.classList.add(s.slideActiveClass);
				let e = (function (e, t) {
					const s = [];
					for (; e.nextElementSibling; ) {
						const a = e.nextElementSibling;
						t ? a.matches(t) && s.push(a) : s.push(a), (e = a);
					}
					return s;
				})(l, `.${s.slideClass}, swiper-slide`)[0];
				s.loop && !e && (e = t[0]), e && e.classList.add(s.slideNextClass);
				let a = (function (e, t) {
					const s = [];
					for (; e.previousElementSibling; ) {
						const a = e.previousElementSibling;
						t ? a.matches(t) && s.push(a) : s.push(a), (e = a);
					}
					return s;
				})(l, `.${s.slideClass}, swiper-slide`)[0];
				s.loop && 0 === !a && (a = t[t.length - 1]), a && a.classList.add(s.slidePrevClass);
			}
			e.emitSlidesClasses();
		},
		updateActiveIndex: function (e) {
			const t = this,
				s = t.rtlTranslate ? t.translate : -t.translate,
				{ snapGrid: a, params: i, activeIndex: r, realIndex: n, snapIndex: l } = t;
			let o,
				d = e;
			const c = (e) => {
				let s = e - t.virtual.slidesBefore;
				return s < 0 && (s = t.virtual.slides.length + s), s >= t.virtual.slides.length && (s -= t.virtual.slides.length), s;
			};
			if (
				(void 0 === d &&
					(d = (function (e) {
						const { slidesGrid: t, params: s } = e,
							a = e.rtlTranslate ? e.translate : -e.translate;
						let i;
						for (let e = 0; e < t.length; e += 1) void 0 !== t[e + 1] ? (a >= t[e] && a < t[e + 1] - (t[e + 1] - t[e]) / 2 ? (i = e) : a >= t[e] && a < t[e + 1] && (i = e + 1)) : a >= t[e] && (i = e);
						return s.normalizeSlideIndex && (i < 0 || void 0 === i) && (i = 0), i;
					})(t)),
				a.indexOf(s) >= 0)
			)
				o = a.indexOf(s);
			else {
				const e = Math.min(i.slidesPerGroupSkip, d);
				o = e + Math.floor((d - e) / i.slidesPerGroup);
			}
			if ((o >= a.length && (o = a.length - 1), d === r)) return o !== l && ((t.snapIndex = o), t.emit('snapIndexChange')), void (t.params.loop && t.virtual && t.params.virtual.enabled && (t.realIndex = c(d)));
			let p;
			(p = t.virtual && i.virtual.enabled && i.loop ? c(d) : t.slides[d] ? parseInt(t.slides[d].getAttribute('data-swiper-slide-index') || d, 10) : d), Object.assign(t, { previousSnapIndex: l, snapIndex: o, previousRealIndex: n, realIndex: p, previousIndex: r, activeIndex: d }), t.initialized && $(t), t.emit('activeIndexChange'), t.emit('snapIndexChange'), (t.initialized || t.params.runCallbacksOnInit) && (n !== p && t.emit('realIndexChange'), t.emit('slideChange'));
		},
		updateClickedSlide: function (e, t) {
			const s = this,
				a = s.params;
			let i = e.closest(`.${a.slideClass}, swiper-slide`);
			!i &&
				s.isElement &&
				t &&
				t.length > 1 &&
				t.includes(e) &&
				[...t.slice(t.indexOf(e) + 1, t.length)].forEach((e) => {
					!i && e.matches && e.matches(`.${a.slideClass}, swiper-slide`) && (i = e);
				});
			let r,
				n = !1;
			if (i)
				for (let e = 0; e < s.slides.length; e += 1)
					if (s.slides[e] === i) {
						(n = !0), (r = e);
						break;
					}
			if (!i || !n) return (s.clickedSlide = void 0), void (s.clickedIndex = void 0);
			(s.clickedSlide = i), s.virtual && s.params.virtual.enabled ? (s.clickedIndex = parseInt(i.getAttribute('data-swiper-slide-index'), 10)) : (s.clickedIndex = r), a.slideToClickedSlide && void 0 !== s.clickedIndex && s.clickedIndex !== s.activeIndex && s.slideToClickedSlide();
		}
	};
	var k = {
		getTranslate: function (e) {
			void 0 === e && (e = this.isHorizontal() ? 'x' : 'y');
			const { params: t, rtlTranslate: s, translate: a, wrapperEl: i } = this;
			if (t.virtualTranslate) return s ? -a : a;
			if (t.cssMode) return a;
			let r = o(i, e);
			return (r += this.cssOverflowAdjustment()), s && (r = -r), r || 0;
		},
		setTranslate: function (e, t) {
			const s = this,
				{ rtlTranslate: a, params: i, wrapperEl: r, progress: n } = s;
			let l,
				o = 0,
				d = 0;
			s.isHorizontal() ? (o = a ? -e : e) : (d = e), i.roundLengths && ((o = Math.floor(o)), (d = Math.floor(d))), (s.previousTranslate = s.translate), (s.translate = s.isHorizontal() ? o : d), i.cssMode ? (r[s.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = s.isHorizontal() ? -o : -d) : i.virtualTranslate || (s.isHorizontal() ? (o -= s.cssOverflowAdjustment()) : (d -= s.cssOverflowAdjustment()), (r.style.transform = `translate3d(${o}px, ${d}px, 0px)`));
			const c = s.maxTranslate() - s.minTranslate();
			(l = 0 === c ? 0 : (e - s.minTranslate()) / c), l !== n && s.updateProgress(e), s.emit('setTranslate', s.translate, t);
		},
		minTranslate: function () {
			return -this.snapGrid[0];
		},
		maxTranslate: function () {
			return -this.snapGrid[this.snapGrid.length - 1];
		},
		translateTo: function (e, t, s, a, i) {
			void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), void 0 === a && (a = !0);
			const r = this,
				{ params: n, wrapperEl: l } = r;
			if (r.animating && n.preventInteractionOnTransition) return !1;
			const o = r.minTranslate(),
				d = r.maxTranslate();
			let c;
			if (((c = a && e > o ? o : a && e < d ? d : e), r.updateProgress(c), n.cssMode)) {
				const e = r.isHorizontal();
				if (0 === t) l[e ? 'scrollLeft' : 'scrollTop'] = -c;
				else {
					if (!r.support.smoothScroll) return u({ swiper: r, targetPosition: -c, side: e ? 'left' : 'top' }), !0;
					l.scrollTo({ [e ? 'left' : 'top']: -c, behavior: 'smooth' });
				}
				return !0;
			}
			return (
				0 === t
					? (r.setTransition(0), r.setTranslate(c), s && (r.emit('beforeTransitionStart', t, i), r.emit('transitionEnd')))
					: (r.setTransition(t),
					  r.setTranslate(c),
					  s && (r.emit('beforeTransitionStart', t, i), r.emit('transitionStart')),
					  r.animating ||
							((r.animating = !0),
							r.onTranslateToWrapperTransitionEnd ||
								(r.onTranslateToWrapperTransitionEnd = function (e) {
									r && !r.destroyed && e.target === this && (r.wrapperEl.removeEventListener('transitionend', r.onTranslateToWrapperTransitionEnd), (r.onTranslateToWrapperTransitionEnd = null), delete r.onTranslateToWrapperTransitionEnd, s && r.emit('transitionEnd'));
								}),
							r.wrapperEl.addEventListener('transitionend', r.onTranslateToWrapperTransitionEnd))),
				!0
			);
		}
	};
	function O(e) {
		let { swiper: t, runCallbacks: s, direction: a, step: i } = e;
		const { activeIndex: r, previousIndex: n } = t;
		let l = a;
		if ((l || (l = r > n ? 'next' : r < n ? 'prev' : 'reset'), t.emit(`transition${i}`), s && r !== n)) {
			if ('reset' === l) return void t.emit(`slideResetTransition${i}`);
			t.emit(`slideChangeTransition${i}`), 'next' === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`);
		}
	}
	var D = {
		slideTo: function (e, t, s, a, i) {
			void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), 'string' == typeof e && (e = parseInt(e, 10));
			const r = this;
			let n = e;
			n < 0 && (n = 0);
			const { params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: p, rtlTranslate: m, wrapperEl: h, enabled: f } = r;
			if ((r.animating && l.preventInteractionOnTransition) || (!f && !a && !i)) return !1;
			const g = Math.min(r.params.slidesPerGroupSkip, n);
			let v = g + Math.floor((n - g) / r.params.slidesPerGroup);
			v >= o.length && (v = o.length - 1);
			const w = -o[v];
			if (l.normalizeSlideIndex)
				for (let e = 0; e < d.length; e += 1) {
					const t = -Math.floor(100 * w),
						s = Math.floor(100 * d[e]),
						a = Math.floor(100 * d[e + 1]);
					void 0 !== d[e + 1] ? (t >= s && t < a - (a - s) / 2 ? (n = e) : t >= s && t < a && (n = e + 1)) : t >= s && (n = e);
				}
			if (r.initialized && n !== p) {
				if (!r.allowSlideNext && (m ? w > r.translate && w > r.minTranslate() : w < r.translate && w < r.minTranslate())) return !1;
				if (!r.allowSlidePrev && w > r.translate && w > r.maxTranslate() && (p || 0) !== n) return !1;
			}
			let b;
			if ((n !== (c || 0) && s && r.emit('beforeSlideChangeStart'), r.updateProgress(w), (b = n > p ? 'next' : n < p ? 'prev' : 'reset'), (m && -w === r.translate) || (!m && w === r.translate))) return r.updateActiveIndex(n), l.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), 'slide' !== l.effect && r.setTranslate(w), 'reset' !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)), !1;
			if (l.cssMode) {
				const e = r.isHorizontal(),
					s = m ? w : -w;
				if (0 === t) {
					const t = r.virtual && r.params.virtual.enabled;
					t && ((r.wrapperEl.style.scrollSnapType = 'none'), (r._immediateVirtual = !0)),
						t && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0
							? ((r._cssModeVirtualInitialSet = !0),
							  requestAnimationFrame(() => {
									h[e ? 'scrollLeft' : 'scrollTop'] = s;
							  }))
							: (h[e ? 'scrollLeft' : 'scrollTop'] = s),
						t &&
							requestAnimationFrame(() => {
								(r.wrapperEl.style.scrollSnapType = ''), (r._immediateVirtual = !1);
							});
				} else {
					if (!r.support.smoothScroll) return u({ swiper: r, targetPosition: s, side: e ? 'left' : 'top' }), !0;
					h.scrollTo({ [e ? 'left' : 'top']: s, behavior: 'smooth' });
				}
				return !0;
			}
			return (
				r.setTransition(t),
				r.setTranslate(w),
				r.updateActiveIndex(n),
				r.updateSlidesClasses(),
				r.emit('beforeTransitionStart', t, a),
				r.transitionStart(s, b),
				0 === t
					? r.transitionEnd(s, b)
					: r.animating ||
					  ((r.animating = !0),
					  r.onSlideToWrapperTransitionEnd ||
							(r.onSlideToWrapperTransitionEnd = function (e) {
								r && !r.destroyed && e.target === this && (r.wrapperEl.removeEventListener('transitionend', r.onSlideToWrapperTransitionEnd), (r.onSlideToWrapperTransitionEnd = null), delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(s, b));
							}),
					  r.wrapperEl.addEventListener('transitionend', r.onSlideToWrapperTransitionEnd)),
				!0
			);
		},
		slideToLoop: function (e, t, s, a) {
			if ((void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), 'string' == typeof e)) {
				e = parseInt(e, 10);
			}
			const i = this;
			let r = e;
			return i.params.loop && (i.virtual && i.params.virtual.enabled ? (r += i.virtual.slidesBefore) : (r = i.getSlideIndexByData(r))), i.slideTo(r, t, s, a);
		},
		slideNext: function (e, t, s) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
			const a = this,
				{ enabled: i, params: r, animating: n } = a;
			if (!i) return a;
			let l = r.slidesPerGroup;
			'auto' === r.slidesPerView && 1 === r.slidesPerGroup && r.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic('current', !0), 1));
			const o = a.activeIndex < r.slidesPerGroupSkip ? 1 : l,
				d = a.virtual && r.virtual.enabled;
			if (r.loop) {
				if (n && !d && r.loopPreventsSliding) return !1;
				if ((a.loopFix({ direction: 'next' }), (a._clientLeft = a.wrapperEl.clientLeft), a.activeIndex === a.slides.length - 1 && r.cssMode))
					return (
						requestAnimationFrame(() => {
							a.slideTo(a.activeIndex + o, e, t, s);
						}),
						!0
					);
			}
			return r.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s);
		},
		slidePrev: function (e, t, s) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
			const a = this,
				{ params: i, snapGrid: r, slidesGrid: n, rtlTranslate: l, enabled: o, animating: d } = a;
			if (!o) return a;
			const c = a.virtual && i.virtual.enabled;
			if (i.loop) {
				if (d && !c && i.loopPreventsSliding) return !1;
				a.loopFix({ direction: 'prev' }), (a._clientLeft = a.wrapperEl.clientLeft);
			}
			function p(e) {
				return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
			}
			const u = p(l ? a.translate : -a.translate),
				m = r.map((e) => p(e));
			let h = r[m.indexOf(u) - 1];
			if (void 0 === h && i.cssMode) {
				let e;
				r.forEach((t, s) => {
					u >= t && (e = s);
				}),
					void 0 !== e && (h = r[e > 0 ? e - 1 : e]);
			}
			let f = 0;
			if ((void 0 !== h && ((f = n.indexOf(h)), f < 0 && (f = a.activeIndex - 1), 'auto' === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && ((f = f - a.slidesPerViewDynamic('previous', !0) + 1), (f = Math.max(f, 0)))), i.rewind && a.isBeginning)) {
				const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
				return a.slideTo(i, e, t, s);
			}
			return i.loop && 0 === a.activeIndex && i.cssMode
				? (requestAnimationFrame(() => {
						a.slideTo(f, e, t, s);
				  }),
				  !0)
				: a.slideTo(f, e, t, s);
		},
		slideReset: function (e, t, s) {
			return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, s);
		},
		slideToClosest: function (e, t, s, a) {
			void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === a && (a = 0.5);
			const i = this;
			let r = i.activeIndex;
			const n = Math.min(i.params.slidesPerGroupSkip, r),
				l = n + Math.floor((r - n) / i.params.slidesPerGroup),
				o = i.rtlTranslate ? i.translate : -i.translate;
			if (o >= i.snapGrid[l]) {
				const e = i.snapGrid[l];
				o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup);
			} else {
				const e = i.snapGrid[l - 1];
				o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup);
			}
			return (r = Math.max(r, 0)), (r = Math.min(r, i.slidesGrid.length - 1)), i.slideTo(r, e, t, s);
		},
		slideToClickedSlide: function () {
			const e = this,
				{ params: t, slidesEl: s } = e,
				a = 'auto' === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
			let i,
				r = e.clickedIndex;
			const l = e.isElement ? 'swiper-slide' : `.${t.slideClass}`;
			if (t.loop) {
				if (e.animating) return;
				(i = parseInt(e.clickedSlide.getAttribute('data-swiper-slide-index'), 10)),
					t.centeredSlides
						? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2
							? (e.loopFix(),
							  (r = e.getSlideIndex(h(s, `${l}[data-swiper-slide-index="${i}"]`)[0])),
							  n(() => {
									e.slideTo(r);
							  }))
							: e.slideTo(r)
						: r > e.slides.length - a
						? (e.loopFix(),
						  (r = e.getSlideIndex(h(s, `${l}[data-swiper-slide-index="${i}"]`)[0])),
						  n(() => {
								e.slideTo(r);
						  }))
						: e.slideTo(r);
			} else e.slideTo(r);
		}
	};
	var G = {
		loopCreate: function (e) {
			const t = this,
				{ params: s, slidesEl: a } = t;
			if (!s.loop || (t.virtual && t.params.virtual.enabled)) return;
			h(a, `.${s.slideClass}, swiper-slide`).forEach((e, t) => {
				e.setAttribute('data-swiper-slide-index', t);
			}),
				t.loopFix({ slideRealIndex: e, direction: s.centeredSlides ? void 0 : 'next' });
		},
		loopFix: function (e) {
			let { slideRealIndex: t, slideTo: s = !0, direction: a, setTranslate: i, activeSlideIndex: r, byController: n, byMousewheel: l } = void 0 === e ? {} : e;
			const o = this;
			if (!o.params.loop) return;
			o.emit('beforeLoopFix');
			const { slides: d, allowSlidePrev: c, allowSlideNext: p, slidesEl: u, params: m } = o;
			if (((o.allowSlidePrev = !0), (o.allowSlideNext = !0), o.virtual && m.virtual.enabled)) return s && (m.centeredSlides || 0 !== o.snapIndex ? (m.centeredSlides && o.snapIndex < m.slidesPerView ? o.slideTo(o.virtual.slides.length + o.snapIndex, 0, !1, !0) : o.snapIndex === o.snapGrid.length - 1 && o.slideTo(o.virtual.slidesBefore, 0, !1, !0)) : o.slideTo(o.virtual.slides.length, 0, !1, !0)), (o.allowSlidePrev = c), (o.allowSlideNext = p), void o.emit('loopFix');
			const h = 'auto' === m.slidesPerView ? o.slidesPerViewDynamic() : Math.ceil(parseFloat(m.slidesPerView, 10));
			let f = m.loopedSlides || h;
			f % m.slidesPerGroup != 0 && (f += m.slidesPerGroup - (f % m.slidesPerGroup)), (o.loopedSlides = f);
			const g = [],
				v = [];
			let w = o.activeIndex;
			void 0 === r ? (r = o.getSlideIndex(o.slides.filter((e) => e.classList.contains(m.slideActiveClass))[0])) : (w = r);
			const b = 'next' === a || !a,
				y = 'prev' === a || !a;
			let E = 0,
				x = 0;
			if (r < f) {
				E = Math.max(f - r, m.slidesPerGroup);
				for (let e = 0; e < f - r; e += 1) {
					const t = e - Math.floor(e / d.length) * d.length;
					g.push(d.length - t - 1);
				}
			} else if (r > o.slides.length - 2 * f) {
				x = Math.max(r - (o.slides.length - 2 * f), m.slidesPerGroup);
				for (let e = 0; e < x; e += 1) {
					const t = e - Math.floor(e / d.length) * d.length;
					v.push(t);
				}
			}
			if (
				(y &&
					g.forEach((e) => {
						(o.slides[e].swiperLoopMoveDOM = !0), u.prepend(o.slides[e]), (o.slides[e].swiperLoopMoveDOM = !1);
					}),
				b &&
					v.forEach((e) => {
						(o.slides[e].swiperLoopMoveDOM = !0), u.append(o.slides[e]), (o.slides[e].swiperLoopMoveDOM = !1);
					}),
				o.recalcSlides(),
				'auto' === m.slidesPerView && o.updateSlides(),
				m.watchSlidesProgress && o.updateSlidesOffset(),
				s)
			)
				if (g.length > 0 && y)
					if (void 0 === t) {
						const e = o.slidesGrid[w],
							t = o.slidesGrid[w + E] - e;
						l ? o.setTranslate(o.translate - t) : (o.slideTo(w + E, 0, !1, !0), i && ((o.touches[o.isHorizontal() ? 'startX' : 'startY'] += t), (o.touchEventsData.currentTranslate = o.translate)));
					} else i && (o.slideToLoop(t, 0, !1, !0), (o.touchEventsData.currentTranslate = o.translate));
				else if (v.length > 0 && b)
					if (void 0 === t) {
						const e = o.slidesGrid[w],
							t = o.slidesGrid[w - x] - e;
						l ? o.setTranslate(o.translate - t) : (o.slideTo(w - x, 0, !1, !0), i && ((o.touches[o.isHorizontal() ? 'startX' : 'startY'] += t), (o.touchEventsData.currentTranslate = o.translate)));
					} else o.slideToLoop(t, 0, !1, !0);
			if (((o.allowSlidePrev = c), (o.allowSlideNext = p), o.controller && o.controller.control && !n)) {
				const e = { slideRealIndex: t, direction: a, setTranslate: i, activeSlideIndex: r, byController: !0 };
				Array.isArray(o.controller.control)
					? o.controller.control.forEach((t) => {
							!t.destroyed && t.params.loop && t.loopFix({ ...e, slideTo: t.params.slidesPerView === m.slidesPerView && s });
					  })
					: o.controller.control instanceof o.constructor && o.controller.control.params.loop && o.controller.control.loopFix({ ...e, slideTo: o.controller.control.params.slidesPerView === m.slidesPerView && s });
			}
			o.emit('loopFix');
		},
		loopDestroy: function () {
			const e = this,
				{ params: t, slidesEl: s } = e;
			if (!t.loop || (e.virtual && e.params.virtual.enabled)) return;
			e.recalcSlides();
			const a = [];
			e.slides.forEach((e) => {
				const t = void 0 === e.swiperSlideIndex ? 1 * e.getAttribute('data-swiper-slide-index') : e.swiperSlideIndex;
				a[t] = e;
			}),
				e.slides.forEach((e) => {
					e.removeAttribute('data-swiper-slide-index');
				}),
				a.forEach((e) => {
					s.append(e);
				}),
				e.recalcSlides(),
				e.slideTo(e.realIndex, 0);
		}
	};
	function H(e) {
		const t = this,
			s = a(),
			i = r(),
			n = t.touchEventsData;
		n.evCache.push(e);
		const { params: o, touches: d, enabled: c } = t;
		if (!c) return;
		if (!o.simulateTouch && 'mouse' === e.pointerType) return;
		if (t.animating && o.preventInteractionOnTransition) return;
		!t.animating && o.cssMode && o.loop && t.loopFix();
		let p = e;
		p.originalEvent && (p = p.originalEvent);
		let u = p.target;
		if ('wrapper' === o.touchEventsTarget && !t.wrapperEl.contains(u)) return;
		if ('which' in p && 3 === p.which) return;
		if ('button' in p && p.button > 0) return;
		if (n.isTouched && n.isMoved) return;
		const m = !!o.noSwipingClass && '' !== o.noSwipingClass,
			h = e.composedPath ? e.composedPath() : e.path;
		m && p.target && p.target.shadowRoot && h && (u = h[0]);
		const f = o.noSwipingSelector ? o.noSwipingSelector : `.${o.noSwipingClass}`,
			g = !(!p.target || !p.target.shadowRoot);
		if (
			o.noSwiping &&
			(g
				? (function (e, t) {
						return (
							void 0 === t && (t = this),
							(function t(s) {
								if (!s || s === a() || s === r()) return null;
								s.assignedSlot && (s = s.assignedSlot);
								const i = s.closest(e);
								return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
							})(t)
						);
				  })(f, u)
				: u.closest(f))
		)
			return void (t.allowClick = !0);
		if (o.swipeHandler && !u.closest(o.swipeHandler)) return;
		(d.currentX = p.pageX), (d.currentY = p.pageY);
		const v = d.currentX,
			w = d.currentY,
			b = o.edgeSwipeDetection || o.iOSEdgeSwipeDetection,
			y = o.edgeSwipeThreshold || o.iOSEdgeSwipeThreshold;
		if (b && (v <= y || v >= i.innerWidth - y)) {
			if ('prevent' !== b) return;
			e.preventDefault();
		}
		Object.assign(n, { isTouched: !0, isMoved: !1, allowTouchCallbacks: !0, isScrolling: void 0, startMoving: void 0 }), (d.startX = v), (d.startY = w), (n.touchStartTime = l()), (t.allowClick = !0), t.updateSize(), (t.swipeDirection = void 0), o.threshold > 0 && (n.allowThresholdMove = !1);
		let E = !0;
		u.matches(n.focusableElements) && ((E = !1), 'SELECT' === u.nodeName && (n.isTouched = !1)), s.activeElement && s.activeElement.matches(n.focusableElements) && s.activeElement !== u && s.activeElement.blur();
		const x = E && t.allowTouchMove && o.touchStartPreventDefault;
		(!o.touchStartForcePreventDefault && !x) || u.isContentEditable || p.preventDefault(), o.freeMode && o.freeMode.enabled && t.freeMode && t.animating && !o.cssMode && t.freeMode.onTouchStart(), t.emit('touchStart', p);
	}
	function X(e) {
		const t = a(),
			s = this,
			i = s.touchEventsData,
			{ params: r, touches: n, rtlTranslate: o, enabled: d } = s;
		if (!d) return;
		if (!r.simulateTouch && 'mouse' === e.pointerType) return;
		let c = e;
		if ((c.originalEvent && (c = c.originalEvent), !i.isTouched)) return void (i.startMoving && i.isScrolling && s.emit('touchMoveOpposite', c));
		const p = i.evCache.findIndex((e) => e.pointerId === c.pointerId);
		p >= 0 && (i.evCache[p] = c);
		const u = i.evCache.length > 1 ? i.evCache[0] : c,
			m = u.pageX,
			h = u.pageY;
		if (c.preventedByNestedSwiper) return (n.startX = m), void (n.startY = h);
		if (!s.allowTouchMove) return c.target.matches(i.focusableElements) || (s.allowClick = !1), void (i.isTouched && (Object.assign(n, { startX: m, startY: h, prevX: s.touches.currentX, prevY: s.touches.currentY, currentX: m, currentY: h }), (i.touchStartTime = l())));
		if (r.touchReleaseOnEdges && !r.loop)
			if (s.isVertical()) {
				if ((h < n.startY && s.translate <= s.maxTranslate()) || (h > n.startY && s.translate >= s.minTranslate())) return (i.isTouched = !1), void (i.isMoved = !1);
			} else if ((m < n.startX && s.translate <= s.maxTranslate()) || (m > n.startX && s.translate >= s.minTranslate())) return;
		if (t.activeElement && c.target === t.activeElement && c.target.matches(i.focusableElements)) return (i.isMoved = !0), void (s.allowClick = !1);
		if ((i.allowTouchCallbacks && s.emit('touchMove', c), c.targetTouches && c.targetTouches.length > 1)) return;
		(n.currentX = m), (n.currentY = h);
		const f = n.currentX - n.startX,
			g = n.currentY - n.startY;
		if (s.params.threshold && Math.sqrt(f ** 2 + g ** 2) < s.params.threshold) return;
		if (void 0 === i.isScrolling) {
			let e;
			(s.isHorizontal() && n.currentY === n.startY) || (s.isVertical() && n.currentX === n.startX) ? (i.isScrolling = !1) : f * f + g * g >= 25 && ((e = (180 * Math.atan2(Math.abs(g), Math.abs(f))) / Math.PI), (i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle));
		}
		if ((i.isScrolling && s.emit('touchMoveOpposite', c), void 0 === i.startMoving && ((n.currentX === n.startX && n.currentY === n.startY) || (i.startMoving = !0)), i.isScrolling || (s.zoom && s.params.zoom && s.params.zoom.enabled && i.evCache.length > 1))) return void (i.isTouched = !1);
		if (!i.startMoving) return;
		(s.allowClick = !1), !r.cssMode && c.cancelable && c.preventDefault(), r.touchMoveStopPropagation && !r.nested && c.stopPropagation();
		let v = s.isHorizontal() ? f : g,
			w = s.isHorizontal() ? n.currentX - n.previousX : n.currentY - n.previousY;
		r.oneWayMovement && ((v = Math.abs(v) * (o ? 1 : -1)), (w = Math.abs(w) * (o ? 1 : -1))), (n.diff = v), (v *= r.touchRatio), o && ((v = -v), (w = -w));
		const b = s.touchesDirection;
		(s.swipeDirection = v > 0 ? 'prev' : 'next'), (s.touchesDirection = w > 0 ? 'prev' : 'next');
		const y = s.params.loop && !r.cssMode,
			E = ('next' === s.swipeDirection && s.allowSlideNext) || ('prev' === s.swipeDirection && s.allowSlidePrev);
		if (!i.isMoved) {
			if ((y && E && s.loopFix({ direction: s.swipeDirection }), (i.startTranslate = s.getTranslate()), s.setTransition(0), s.animating)) {
				const e = new window.CustomEvent('transitionend', { bubbles: !0, cancelable: !0 });
				s.wrapperEl.dispatchEvent(e);
			}
			(i.allowMomentumBounce = !1), !r.grabCursor || (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) || s.setGrabCursor(!0), s.emit('sliderFirstMove', c);
		}
		let x;
		i.isMoved && b !== s.touchesDirection && y && E && Math.abs(v) >= 1 && (s.loopFix({ direction: s.swipeDirection, setTranslate: !0 }), (x = !0)), s.emit('sliderMove', c), (i.isMoved = !0), (i.currentTranslate = v + i.startTranslate);
		let S = !0,
			T = r.resistanceRatio;
		if (
			(r.touchReleaseOnEdges && (T = 0),
			v > 0
				? (y && E && !x && i.currentTranslate > (r.centeredSlides ? s.minTranslate() - s.size / 2 : s.minTranslate()) && s.loopFix({ direction: 'prev', setTranslate: !0, activeSlideIndex: 0 }), i.currentTranslate > s.minTranslate() && ((S = !1), r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + v) ** T)))
				: v < 0 && (y && E && !x && i.currentTranslate < (r.centeredSlides ? s.maxTranslate() + s.size / 2 : s.maxTranslate()) && s.loopFix({ direction: 'next', setTranslate: !0, activeSlideIndex: s.slides.length - ('auto' === r.slidesPerView ? s.slidesPerViewDynamic() : Math.ceil(parseFloat(r.slidesPerView, 10))) }), i.currentTranslate < s.maxTranslate() && ((S = !1), r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - v) ** T))),
			S && (c.preventedByNestedSwiper = !0),
			!s.allowSlideNext && 'next' === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate),
			!s.allowSlidePrev && 'prev' === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate),
			s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate),
			r.threshold > 0)
		) {
			if (!(Math.abs(v) > r.threshold || i.allowThresholdMove)) return void (i.currentTranslate = i.startTranslate);
			if (!i.allowThresholdMove) return (i.allowThresholdMove = !0), (n.startX = n.currentX), (n.startY = n.currentY), (i.currentTranslate = i.startTranslate), void (n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY);
		}
		r.followFinger && !r.cssMode && (((r.freeMode && r.freeMode.enabled && s.freeMode) || r.watchSlidesProgress) && (s.updateActiveIndex(), s.updateSlidesClasses()), r.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(), s.updateProgress(i.currentTranslate), s.setTranslate(i.currentTranslate));
	}
	function Y(e) {
		const t = this,
			s = t.touchEventsData,
			a = s.evCache.findIndex((t) => t.pointerId === e.pointerId);
		if ((a >= 0 && s.evCache.splice(a, 1), ['pointercancel', 'pointerout', 'pointerleave', 'contextmenu'].includes(e.type))) {
			if (!(['pointercancel', 'contextmenu'].includes(e.type) && (t.browser.isSafari || t.browser.isWebView))) return;
		}
		const { params: i, touches: r, rtlTranslate: o, slidesGrid: d, enabled: c } = t;
		if (!c) return;
		if (!i.simulateTouch && 'mouse' === e.pointerType) return;
		let p = e;
		if ((p.originalEvent && (p = p.originalEvent), s.allowTouchCallbacks && t.emit('touchEnd', p), (s.allowTouchCallbacks = !1), !s.isTouched)) return s.isMoved && i.grabCursor && t.setGrabCursor(!1), (s.isMoved = !1), void (s.startMoving = !1);
		i.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
		const u = l(),
			m = u - s.touchStartTime;
		if (t.allowClick) {
			const e = p.path || (p.composedPath && p.composedPath());
			t.updateClickedSlide((e && e[0]) || p.target, e), t.emit('tap click', p), m < 300 && u - s.lastClickTime < 300 && t.emit('doubleTap doubleClick', p);
		}
		if (
			((s.lastClickTime = l()),
			n(() => {
				t.destroyed || (t.allowClick = !0);
			}),
			!s.isTouched || !s.isMoved || !t.swipeDirection || 0 === r.diff || s.currentTranslate === s.startTranslate)
		)
			return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
		let h;
		if (((s.isTouched = !1), (s.isMoved = !1), (s.startMoving = !1), (h = i.followFinger ? (o ? t.translate : -t.translate) : -s.currentTranslate), i.cssMode)) return;
		if (i.freeMode && i.freeMode.enabled) return void t.freeMode.onTouchEnd({ currentPos: h });
		let f = 0,
			g = t.slidesSizesGrid[0];
		for (let e = 0; e < d.length; e += e < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) {
			const t = e < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
			void 0 !== d[e + t] ? h >= d[e] && h < d[e + t] && ((f = e), (g = d[e + t] - d[e])) : h >= d[e] && ((f = e), (g = d[d.length - 1] - d[d.length - 2]));
		}
		let v = null,
			w = null;
		i.rewind && (t.isBeginning ? (w = i.virtual && i.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1) : t.isEnd && (v = 0));
		const b = (h - d[f]) / g,
			y = f < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
		if (m > i.longSwipesMs) {
			if (!i.longSwipes) return void t.slideTo(t.activeIndex);
			'next' === t.swipeDirection && (b >= i.longSwipesRatio ? t.slideTo(i.rewind && t.isEnd ? v : f + y) : t.slideTo(f)), 'prev' === t.swipeDirection && (b > 1 - i.longSwipesRatio ? t.slideTo(f + y) : null !== w && b < 0 && Math.abs(b) > i.longSwipesRatio ? t.slideTo(w) : t.slideTo(f));
		} else {
			if (!i.shortSwipes) return void t.slideTo(t.activeIndex);
			t.navigation && (p.target === t.navigation.nextEl || p.target === t.navigation.prevEl) ? (p.target === t.navigation.nextEl ? t.slideTo(f + y) : t.slideTo(f)) : ('next' === t.swipeDirection && t.slideTo(null !== v ? v : f + y), 'prev' === t.swipeDirection && t.slideTo(null !== w ? w : f));
		}
	}
	function N() {
		const e = this,
			{ params: t, el: s } = e;
		if (s && 0 === s.offsetWidth) return;
		t.breakpoints && e.setBreakpoint();
		const { allowSlideNext: a, allowSlidePrev: i, snapGrid: r } = e,
			n = e.virtual && e.params.virtual.enabled;
		(e.allowSlideNext = !0), (e.allowSlidePrev = !0), e.updateSize(), e.updateSlides(), e.updateSlidesClasses();
		const l = n && t.loop;
		!('auto' === t.slidesPerView || t.slidesPerView > 1) || !e.isEnd || e.isBeginning || e.params.centeredSlides || l ? (e.params.loop && !n ? e.slideToLoop(e.realIndex, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0)) : e.slideTo(e.slides.length - 1, 0, !1, !0),
			e.autoplay &&
				e.autoplay.running &&
				e.autoplay.paused &&
				(clearTimeout(e.autoplay.resizeTimeout),
				(e.autoplay.resizeTimeout = setTimeout(() => {
					e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume();
				}, 500))),
			(e.allowSlidePrev = i),
			(e.allowSlideNext = a),
			e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
	}
	function B(e) {
		const t = this;
		t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())));
	}
	function R() {
		const e = this,
			{ wrapperEl: t, rtlTranslate: s, enabled: a } = e;
		if (!a) return;
		let i;
		(e.previousTranslate = e.translate), e.isHorizontal() ? (e.translate = -t.scrollLeft) : (e.translate = -t.scrollTop), 0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
		const r = e.maxTranslate() - e.minTranslate();
		(i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r), i !== e.progress && e.updateProgress(s ? -e.translate : e.translate), e.emit('setTranslate', e.translate, !1);
	}
	function q(e) {
		const t = this;
		z(t, e.target), t.params.cssMode || ('auto' !== t.params.slidesPerView && !t.params.autoHeight) || t.update();
	}
	let V = !1;
	function F() {}
	const _ = (e, t) => {
		const s = a(),
			{ params: i, el: r, wrapperEl: n, device: l } = e,
			o = !!i.nested,
			d = 'on' === t ? 'addEventListener' : 'removeEventListener',
			c = t;
		r[d]('pointerdown', e.onTouchStart, { passive: !1 }),
			s[d]('pointermove', e.onTouchMove, { passive: !1, capture: o }),
			s[d]('pointerup', e.onTouchEnd, { passive: !0 }),
			s[d]('pointercancel', e.onTouchEnd, { passive: !0 }),
			s[d]('pointerout', e.onTouchEnd, { passive: !0 }),
			s[d]('pointerleave', e.onTouchEnd, { passive: !0 }),
			s[d]('contextmenu', e.onTouchEnd, { passive: !0 }),
			(i.preventClicks || i.preventClicksPropagation) && r[d]('click', e.onClick, !0),
			i.cssMode && n[d]('scroll', e.onScroll),
			i.updateOnWindowResize ? e[c](l.ios || l.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', N, !0) : e[c]('observerUpdate', N, !0),
			r[d]('load', e.onLoad, { capture: !0 });
	};
	const j = (e, t) => e.grid && t.grid && t.grid.rows > 1;
	var W = {
		init: !0,
		direction: 'horizontal',
		oneWayMovement: !1,
		touchEventsTarget: 'wrapper',
		initialSlide: 0,
		speed: 300,
		cssMode: !1,
		updateOnWindowResize: !0,
		resizeObserver: !0,
		nested: !1,
		createElements: !1,
		enabled: !0,
		focusableElements: 'input, select, option, textarea, button, video, label',
		width: null,
		height: null,
		preventInteractionOnTransition: !1,
		userAgent: null,
		url: null,
		edgeSwipeDetection: !1,
		edgeSwipeThreshold: 20,
		autoHeight: !1,
		setWrapperSize: !1,
		virtualTranslate: !1,
		effect: 'slide',
		breakpoints: void 0,
		breakpointsBase: 'window',
		spaceBetween: 0,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slidesPerGroupSkip: 0,
		slidesPerGroupAuto: !1,
		centeredSlides: !1,
		centeredSlidesBounds: !1,
		slidesOffsetBefore: 0,
		slidesOffsetAfter: 0,
		normalizeSlideIndex: !0,
		centerInsufficientSlides: !1,
		watchOverflow: !0,
		roundLengths: !1,
		touchRatio: 1,
		touchAngle: 45,
		simulateTouch: !0,
		shortSwipes: !0,
		longSwipes: !0,
		longSwipesRatio: 0.5,
		longSwipesMs: 300,
		followFinger: !0,
		allowTouchMove: !0,
		threshold: 5,
		touchMoveStopPropagation: !1,
		touchStartPreventDefault: !0,
		touchStartForcePreventDefault: !1,
		touchReleaseOnEdges: !1,
		uniqueNavElements: !0,
		resistance: !0,
		resistanceRatio: 0.85,
		watchSlidesProgress: !1,
		grabCursor: !1,
		preventClicks: !0,
		preventClicksPropagation: !0,
		slideToClickedSlide: !1,
		loop: !1,
		loopedSlides: null,
		loopPreventsSliding: !0,
		rewind: !1,
		allowSlidePrev: !0,
		allowSlideNext: !0,
		swipeHandler: null,
		noSwiping: !0,
		noSwipingClass: 'swiper-no-swiping',
		noSwipingSelector: null,
		passiveListeners: !0,
		maxBackfaceHiddenSlides: 10,
		containerModifierClass: 'swiper-',
		slideClass: 'swiper-slide',
		slideActiveClass: 'swiper-slide-active',
		slideVisibleClass: 'swiper-slide-visible',
		slideNextClass: 'swiper-slide-next',
		slidePrevClass: 'swiper-slide-prev',
		wrapperClass: 'swiper-wrapper',
		lazyPreloaderClass: 'swiper-lazy-preloader',
		lazyPreloadPrevNext: 0,
		runCallbacksOnInit: !0,
		_emitClasses: !1
	};
	function U(e, t) {
		return function (s) {
			void 0 === s && (s = {});
			const a = Object.keys(s)[0],
				i = s[a];
			'object' == typeof i && null !== i ? (!0 === e[a] && (e[a] = { enabled: !0 }), 'navigation' === a && e[a] && e[a].enabled && !e[a].prevEl && !e[a].nextEl && (e[a].auto = !0), ['pagination', 'scrollbar'].indexOf(a) >= 0 && e[a] && e[a].enabled && !e[a].el && (e[a].auto = !0), a in e && 'enabled' in i ? ('object' != typeof e[a] || 'enabled' in e[a] || (e[a].enabled = !0), e[a] || (e[a] = { enabled: !1 }), c(t, s)) : c(t, s)) : c(t, s);
		};
	}
	const K = {
			eventsEmitter: L,
			update: I,
			translate: k,
			transition: {
				setTransition: function (e, t) {
					const s = this;
					s.params.cssMode || ((s.wrapperEl.style.transitionDuration = `${e}ms`), (s.wrapperEl.style.transitionDelay = 0 === e ? '0ms' : '')), s.emit('setTransition', e, t);
				},
				transitionStart: function (e, t) {
					void 0 === e && (e = !0);
					const s = this,
						{ params: a } = s;
					a.cssMode || (a.autoHeight && s.updateAutoHeight(), O({ swiper: s, runCallbacks: e, direction: t, step: 'Start' }));
				},
				transitionEnd: function (e, t) {
					void 0 === e && (e = !0);
					const s = this,
						{ params: a } = s;
					(s.animating = !1), a.cssMode || (s.setTransition(0), O({ swiper: s, runCallbacks: e, direction: t, step: 'End' }));
				}
			},
			slide: D,
			loop: G,
			grabCursor: {
				setGrabCursor: function (e) {
					const t = this;
					if (!t.params.simulateTouch || (t.params.watchOverflow && t.isLocked) || t.params.cssMode) return;
					const s = 'container' === t.params.touchEventsTarget ? t.el : t.wrapperEl;
					t.isElement && (t.__preventObserver__ = !0),
						(s.style.cursor = 'move'),
						(s.style.cursor = e ? 'grabbing' : 'grab'),
						t.isElement &&
							requestAnimationFrame(() => {
								t.__preventObserver__ = !1;
							});
				},
				unsetGrabCursor: function () {
					const e = this;
					(e.params.watchOverflow && e.isLocked) ||
						e.params.cssMode ||
						(e.isElement && (e.__preventObserver__ = !0),
						(e['container' === e.params.touchEventsTarget ? 'el' : 'wrapperEl'].style.cursor = ''),
						e.isElement &&
							requestAnimationFrame(() => {
								e.__preventObserver__ = !1;
							}));
				}
			},
			events: {
				attachEvents: function () {
					const e = this,
						t = a(),
						{ params: s } = e;
					(e.onTouchStart = H.bind(e)), (e.onTouchMove = X.bind(e)), (e.onTouchEnd = Y.bind(e)), s.cssMode && (e.onScroll = R.bind(e)), (e.onClick = B.bind(e)), (e.onLoad = q.bind(e)), V || (t.addEventListener('touchstart', F), (V = !0)), _(e, 'on');
				},
				detachEvents: function () {
					_(this, 'off');
				}
			},
			breakpoints: {
				setBreakpoint: function () {
					const e = this,
						{ realIndex: t, initialized: s, params: a, el: i } = e,
						r = a.breakpoints;
					if (!r || (r && 0 === Object.keys(r).length)) return;
					const n = e.getBreakpoint(r, e.params.breakpointsBase, e.el);
					if (!n || e.currentBreakpoint === n) return;
					const l = (n in r ? r[n] : void 0) || e.originalParams,
						o = j(e, a),
						d = j(e, l),
						p = a.enabled;
					o && !d ? (i.classList.remove(`${a.containerModifierClass}grid`, `${a.containerModifierClass}grid-column`), e.emitContainerClasses()) : !o && d && (i.classList.add(`${a.containerModifierClass}grid`), ((l.grid.fill && 'column' === l.grid.fill) || (!l.grid.fill && 'column' === a.grid.fill)) && i.classList.add(`${a.containerModifierClass}grid-column`), e.emitContainerClasses()),
						['navigation', 'pagination', 'scrollbar'].forEach((t) => {
							if (void 0 === l[t]) return;
							const s = a[t] && a[t].enabled,
								i = l[t] && l[t].enabled;
							s && !i && e[t].disable(), !s && i && e[t].enable();
						});
					const u = l.direction && l.direction !== a.direction,
						m = a.loop && (l.slidesPerView !== a.slidesPerView || u),
						h = a.loop;
					u && s && e.changeDirection(), c(e.params, l);
					const f = e.params.enabled,
						g = e.params.loop;
					Object.assign(e, { allowTouchMove: e.params.allowTouchMove, allowSlideNext: e.params.allowSlideNext, allowSlidePrev: e.params.allowSlidePrev }), p && !f ? e.disable() : !p && f && e.enable(), (e.currentBreakpoint = n), e.emit('_beforeBreakpoint', l), s && (m ? (e.loopDestroy(), e.loopCreate(t), e.updateSlides()) : !h && g ? (e.loopCreate(t), e.updateSlides()) : h && !g && e.loopDestroy()), e.emit('breakpoint', l);
				},
				getBreakpoint: function (e, t, s) {
					if ((void 0 === t && (t = 'window'), !e || ('container' === t && !s))) return;
					let a = !1;
					const i = r(),
						n = 'window' === t ? i.innerHeight : s.clientHeight,
						l = Object.keys(e).map((e) => {
							if ('string' == typeof e && 0 === e.indexOf('@')) {
								const t = parseFloat(e.substr(1));
								return { value: n * t, point: e };
							}
							return { value: e, point: e };
						});
					l.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
					for (let e = 0; e < l.length; e += 1) {
						const { point: r, value: n } = l[e];
						'window' === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r);
					}
					return a || 'max';
				}
			},
			checkOverflow: {
				checkOverflow: function () {
					const e = this,
						{ isLocked: t, params: s } = e,
						{ slidesOffsetBefore: a } = s;
					if (a) {
						const t = e.slides.length - 1,
							s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
						e.isLocked = e.size > s;
					} else e.isLocked = 1 === e.snapGrid.length;
					!0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked), !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked), t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? 'lock' : 'unlock');
				}
			},
			classes: {
				addClasses: function () {
					const e = this,
						{ classNames: t, params: s, rtl: a, el: i, device: r } = e,
						n = (function (e, t) {
							const s = [];
							return (
								e.forEach((e) => {
									'object' == typeof e
										? Object.keys(e).forEach((a) => {
												e[a] && s.push(t + a);
										  })
										: 'string' == typeof e && s.push(t + e);
								}),
								s
							);
						})(['initialized', s.direction, { 'free-mode': e.params.freeMode && s.freeMode.enabled }, { autoheight: s.autoHeight }, { rtl: a }, { grid: s.grid && s.grid.rows > 1 }, { 'grid-column': s.grid && s.grid.rows > 1 && 'column' === s.grid.fill }, { android: r.android }, { ios: r.ios }, { 'css-mode': s.cssMode }, { centered: s.cssMode && s.centeredSlides }, { 'watch-progress': s.watchSlidesProgress }], s.containerModifierClass);
					t.push(...n), i.classList.add(...t), e.emitContainerClasses();
				},
				removeClasses: function () {
					const { el: e, classNames: t } = this;
					e.classList.remove(...t), this.emitContainerClasses();
				}
			}
		},
		Z = {};
	class Q {
		constructor() {
			let e, t;
			for (var s = arguments.length, i = new Array(s), r = 0; r < s; r++) i[r] = arguments[r];
			1 === i.length && i[0].constructor && 'Object' === Object.prototype.toString.call(i[0]).slice(8, -1) ? (t = i[0]) : ([e, t] = i), t || (t = {}), (t = c({}, t)), e && !t.el && (t.el = e);
			const n = a();
			if (t.el && 'string' == typeof t.el && n.querySelectorAll(t.el).length > 1) {
				const e = [];
				return (
					n.querySelectorAll(t.el).forEach((s) => {
						const a = c({}, t, { el: s });
						e.push(new Q(a));
					}),
					e
				);
			}
			const l = this;
			(l.__swiper__ = !0), (l.support = M()), (l.device = C({ userAgent: t.userAgent })), (l.browser = P()), (l.eventsListeners = {}), (l.eventsAnyListeners = []), (l.modules = [...l.__modules__]), t.modules && Array.isArray(t.modules) && l.modules.push(...t.modules);
			const o = {};
			l.modules.forEach((e) => {
				e({ params: t, swiper: l, extendParams: U(t, o), on: l.on.bind(l), once: l.once.bind(l), off: l.off.bind(l), emit: l.emit.bind(l) });
			});
			const d = c({}, W, o);
			return (
				(l.params = c({}, d, Z, t)),
				(l.originalParams = c({}, l.params)),
				(l.passedParams = c({}, t)),
				l.params &&
					l.params.on &&
					Object.keys(l.params.on).forEach((e) => {
						l.on(e, l.params.on[e]);
					}),
				l.params && l.params.onAny && l.onAny(l.params.onAny),
				Object.assign(l, {
					enabled: l.params.enabled,
					el: e,
					classNames: [],
					slides: [],
					slidesGrid: [],
					snapGrid: [],
					slidesSizesGrid: [],
					isHorizontal: () => 'horizontal' === l.params.direction,
					isVertical: () => 'vertical' === l.params.direction,
					activeIndex: 0,
					realIndex: 0,
					isBeginning: !0,
					isEnd: !1,
					translate: 0,
					previousTranslate: 0,
					progress: 0,
					velocity: 0,
					animating: !1,
					cssOverflowAdjustment() {
						return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
					},
					allowSlideNext: l.params.allowSlideNext,
					allowSlidePrev: l.params.allowSlidePrev,
					touchEventsData: { isTouched: void 0, isMoved: void 0, allowTouchCallbacks: void 0, touchStartTime: void 0, isScrolling: void 0, currentTranslate: void 0, startTranslate: void 0, allowThresholdMove: void 0, focusableElements: l.params.focusableElements, lastClickTime: 0, clickTimeout: void 0, velocities: [], allowMomentumBounce: void 0, startMoving: void 0, evCache: [] },
					allowClick: !0,
					allowTouchMove: l.params.allowTouchMove,
					touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
					imagesToLoad: [],
					imagesLoaded: 0
				}),
				l.emit('_swiper'),
				l.params.init && l.init(),
				l
			);
		}
		getSlideIndex(e) {
			const { slidesEl: t, params: s } = this,
				a = w(h(t, `.${s.slideClass}, swiper-slide`)[0]);
			return w(e) - a;
		}
		getSlideIndexByData(e) {
			return this.getSlideIndex(this.slides.filter((t) => 1 * t.getAttribute('data-swiper-slide-index') === e)[0]);
		}
		recalcSlides() {
			const { slidesEl: e, params: t } = this;
			this.slides = h(e, `.${t.slideClass}, swiper-slide`);
		}
		enable() {
			const e = this;
			e.enabled || ((e.enabled = !0), e.params.grabCursor && e.setGrabCursor(), e.emit('enable'));
		}
		disable() {
			const e = this;
			e.enabled && ((e.enabled = !1), e.params.grabCursor && e.unsetGrabCursor(), e.emit('disable'));
		}
		setProgress(e, t) {
			const s = this;
			e = Math.min(Math.max(e, 0), 1);
			const a = s.minTranslate(),
				i = (s.maxTranslate() - a) * e + a;
			s.translateTo(i, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses();
		}
		emitContainerClasses() {
			const e = this;
			if (!e.params._emitClasses || !e.el) return;
			const t = e.el.className.split(' ').filter((t) => 0 === t.indexOf('swiper') || 0 === t.indexOf(e.params.containerModifierClass));
			e.emit('_containerClasses', t.join(' '));
		}
		getSlideClasses(e) {
			const t = this;
			return t.destroyed
				? ''
				: e.className
						.split(' ')
						.filter((e) => 0 === e.indexOf('swiper-slide') || 0 === e.indexOf(t.params.slideClass))
						.join(' ');
		}
		emitSlidesClasses() {
			const e = this;
			if (!e.params._emitClasses || !e.el) return;
			const t = [];
			e.slides.forEach((s) => {
				const a = e.getSlideClasses(s);
				t.push({ slideEl: s, classNames: a }), e.emit('_slideClass', s, a);
			}),
				e.emit('_slideClasses', t);
		}
		slidesPerViewDynamic(e, t) {
			void 0 === e && (e = 'current'), void 0 === t && (t = !1);
			const { params: s, slides: a, slidesGrid: i, slidesSizesGrid: r, size: n, activeIndex: l } = this;
			let o = 1;
			if ('number' == typeof s.slidesPerView) return s.slidesPerView;
			if (s.centeredSlides) {
				let e,
					t = a[l] ? a[l].swiperSlideSize : 0;
				for (let s = l + 1; s < a.length; s += 1) a[s] && !e && ((t += a[s].swiperSlideSize), (o += 1), t > n && (e = !0));
				for (let s = l - 1; s >= 0; s -= 1) a[s] && !e && ((t += a[s].swiperSlideSize), (o += 1), t > n && (e = !0));
			} else if ('current' === e)
				for (let e = l + 1; e < a.length; e += 1) {
					(t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1);
				}
			else
				for (let e = l - 1; e >= 0; e -= 1) {
					i[l] - i[e] < n && (o += 1);
				}
			return o;
		}
		update() {
			const e = this;
			if (!e || e.destroyed) return;
			const { snapGrid: t, params: s } = e;
			function a() {
				const t = e.rtlTranslate ? -1 * e.translate : e.translate,
					s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
				e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
			}
			let i;
			if (
				(s.breakpoints && e.setBreakpoint(),
				[...e.el.querySelectorAll('[loading="lazy"]')].forEach((t) => {
					t.complete && z(e, t);
				}),
				e.updateSize(),
				e.updateSlides(),
				e.updateProgress(),
				e.updateSlidesClasses(),
				s.freeMode && s.freeMode.enabled && !s.cssMode)
			)
				a(), s.autoHeight && e.updateAutoHeight();
			else {
				if (('auto' === s.slidesPerView || s.slidesPerView > 1) && e.isEnd && !s.centeredSlides) {
					const t = e.virtual && s.virtual.enabled ? e.virtual.slides : e.slides;
					i = e.slideTo(t.length - 1, 0, !1, !0);
				} else i = e.slideTo(e.activeIndex, 0, !1, !0);
				i || a();
			}
			s.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit('update');
		}
		changeDirection(e, t) {
			void 0 === t && (t = !0);
			const s = this,
				a = s.params.direction;
			return (
				e || (e = 'horizontal' === a ? 'vertical' : 'horizontal'),
				e === a ||
					('horizontal' !== e && 'vertical' !== e) ||
					(s.el.classList.remove(`${s.params.containerModifierClass}${a}`),
					s.el.classList.add(`${s.params.containerModifierClass}${e}`),
					s.emitContainerClasses(),
					(s.params.direction = e),
					s.slides.forEach((t) => {
						'vertical' === e ? (t.style.width = '') : (t.style.height = '');
					}),
					s.emit('changeDirection'),
					t && s.update()),
				s
			);
		}
		changeLanguageDirection(e) {
			const t = this;
			(t.rtl && 'rtl' === e) || (!t.rtl && 'ltr' === e) || ((t.rtl = 'rtl' === e), (t.rtlTranslate = 'horizontal' === t.params.direction && t.rtl), t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), (t.el.dir = 'rtl')) : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), (t.el.dir = 'ltr')), t.update());
		}
		mount(e) {
			const t = this;
			if (t.mounted) return !0;
			let s = e || t.params.el;
			if (('string' == typeof s && (s = document.querySelector(s)), !s)) return !1;
			(s.swiper = t), s.parentNode && s.parentNode.host && 'SWIPER-CONTAINER' === s.parentNode.host.nodeName && (t.isElement = !0);
			const a = () => `.${(t.params.wrapperClass || '').trim().split(' ').join('.')}`;
			let i = (() => {
				if (s && s.shadowRoot && s.shadowRoot.querySelector) {
					return s.shadowRoot.querySelector(a());
				}
				return h(s, a())[0];
			})();
			return (
				!i &&
					t.params.createElements &&
					((i = f('div', t.params.wrapperClass)),
					s.append(i),
					h(s, `.${t.params.slideClass}`).forEach((e) => {
						i.append(e);
					})),
				Object.assign(t, { el: s, wrapperEl: i, slidesEl: t.isElement && !s.parentNode.host.slideSlots ? s.parentNode.host : i, hostEl: t.isElement ? s.parentNode.host : s, mounted: !0, rtl: 'rtl' === s.dir.toLowerCase() || 'rtl' === v(s, 'direction'), rtlTranslate: 'horizontal' === t.params.direction && ('rtl' === s.dir.toLowerCase() || 'rtl' === v(s, 'direction')), wrongRTL: '-webkit-box' === v(i, 'display') }),
				!0
			);
		}
		init(e) {
			const t = this;
			if (t.initialized) return t;
			if (!1 === t.mount(e)) return t;
			t.emit('beforeInit'),
				t.params.breakpoints && t.setBreakpoint(),
				t.addClasses(),
				t.updateSize(),
				t.updateSlides(),
				t.params.watchOverflow && t.checkOverflow(),
				t.params.grabCursor && t.enabled && t.setGrabCursor(),
				t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
				t.params.loop && t.loopCreate(),
				t.attachEvents();
			const s = [...t.el.querySelectorAll('[loading="lazy"]')];
			return (
				t.isElement && s.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),
				s.forEach((e) => {
					e.complete
						? z(t, e)
						: e.addEventListener('load', (e) => {
								z(t, e.target);
						  });
				}),
				$(t),
				(t.initialized = !0),
				$(t),
				t.emit('init'),
				t.emit('afterInit'),
				t
			);
		}
		destroy(e, t) {
			void 0 === e && (e = !0), void 0 === t && (t = !0);
			const s = this,
				{ params: a, el: i, wrapperEl: r, slides: n } = s;
			return (
				void 0 === s.params ||
					s.destroyed ||
					(s.emit('beforeDestroy'),
					(s.initialized = !1),
					s.detachEvents(),
					a.loop && s.loopDestroy(),
					t &&
						(s.removeClasses(),
						i.removeAttribute('style'),
						r.removeAttribute('style'),
						n &&
							n.length &&
							n.forEach((e) => {
								e.classList.remove(a.slideVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass), e.removeAttribute('style'), e.removeAttribute('data-swiper-slide-index');
							})),
					s.emit('destroy'),
					Object.keys(s.eventsListeners).forEach((e) => {
						s.off(e);
					}),
					!1 !== e &&
						((s.el.swiper = null),
						(function (e) {
							const t = e;
							Object.keys(t).forEach((e) => {
								try {
									t[e] = null;
								} catch (e) {}
								try {
									delete t[e];
								} catch (e) {}
							});
						})(s)),
					(s.destroyed = !0)),
				null
			);
		}
		static extendDefaults(e) {
			c(Z, e);
		}
		static get extendedDefaults() {
			return Z;
		}
		static get defaults() {
			return W;
		}
		static installModule(e) {
			Q.prototype.__modules__ || (Q.prototype.__modules__ = []);
			const t = Q.prototype.__modules__;
			'function' == typeof e && t.indexOf(e) < 0 && t.push(e);
		}
		static use(e) {
			return Array.isArray(e) ? (e.forEach((e) => Q.installModule(e)), Q) : (Q.installModule(e), Q);
		}
	}
	function J(e, t, s, a) {
		return (
			e.params.createElements &&
				Object.keys(a).forEach((i) => {
					if (!s[i] && !0 === s.auto) {
						let r = h(e.el, `.${a[i]}`)[0];
						r || ((r = f('div', a[i])), (r.className = a[i]), e.el.append(r)), (s[i] = r), (t[i] = r);
					}
				}),
			s
		);
	}
	function ee(e) {
		return (
			void 0 === e && (e = ''),
			`.${e
				.trim()
				.replace(/([\.:!+\/])/g, '\\$1')
				.replace(/ /g, '.')}`
		);
	}
	function te(e) {
		const t = this,
			{ params: s, slidesEl: a } = t;
		s.loop && t.loopDestroy();
		const i = (e) => {
			if ('string' == typeof e) {
				const t = document.createElement('div');
				(t.innerHTML = e), a.append(t.children[0]), (t.innerHTML = '');
			} else a.append(e);
		};
		if ('object' == typeof e && 'length' in e) for (let t = 0; t < e.length; t += 1) e[t] && i(e[t]);
		else i(e);
		t.recalcSlides(), s.loop && t.loopCreate(), (s.observer && !t.isElement) || t.update();
	}
	function se(e) {
		const t = this,
			{ params: s, activeIndex: a, slidesEl: i } = t;
		s.loop && t.loopDestroy();
		let r = a + 1;
		const n = (e) => {
			if ('string' == typeof e) {
				const t = document.createElement('div');
				(t.innerHTML = e), i.prepend(t.children[0]), (t.innerHTML = '');
			} else i.prepend(e);
		};
		if ('object' == typeof e && 'length' in e) {
			for (let t = 0; t < e.length; t += 1) e[t] && n(e[t]);
			r = a + e.length;
		} else n(e);
		t.recalcSlides(), s.loop && t.loopCreate(), (s.observer && !t.isElement) || t.update(), t.slideTo(r, 0, !1);
	}
	function ae(e, t) {
		const s = this,
			{ params: a, activeIndex: i, slidesEl: r } = s;
		let n = i;
		a.loop && ((n -= s.loopedSlides), s.loopDestroy(), s.recalcSlides());
		const l = s.slides.length;
		if (e <= 0) return void s.prependSlide(t);
		if (e >= l) return void s.appendSlide(t);
		let o = n > e ? n + 1 : n;
		const d = [];
		for (let t = l - 1; t >= e; t -= 1) {
			const e = s.slides[t];
			e.remove(), d.unshift(e);
		}
		if ('object' == typeof t && 'length' in t) {
			for (let e = 0; e < t.length; e += 1) t[e] && r.append(t[e]);
			o = n > e ? n + t.length : n;
		} else r.append(t);
		for (let e = 0; e < d.length; e += 1) r.append(d[e]);
		s.recalcSlides(), a.loop && s.loopCreate(), (a.observer && !s.isElement) || s.update(), a.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1);
	}
	function ie(e) {
		const t = this,
			{ params: s, activeIndex: a } = t;
		let i = a;
		s.loop && ((i -= t.loopedSlides), t.loopDestroy());
		let r,
			n = i;
		if ('object' == typeof e && 'length' in e) {
			for (let s = 0; s < e.length; s += 1) (r = e[s]), t.slides[r] && t.slides[r].remove(), r < n && (n -= 1);
			n = Math.max(n, 0);
		} else (r = e), t.slides[r] && t.slides[r].remove(), r < n && (n -= 1), (n = Math.max(n, 0));
		t.recalcSlides(), s.loop && t.loopCreate(), (s.observer && !t.isElement) || t.update(), s.loop ? t.slideTo(n + t.loopedSlides, 0, !1) : t.slideTo(n, 0, !1);
	}
	function re() {
		const e = this,
			t = [];
		for (let s = 0; s < e.slides.length; s += 1) t.push(s);
		e.removeSlide(t);
	}
	function ne(e) {
		const { effect: t, swiper: s, on: a, setTranslate: i, setTransition: r, overwriteParams: n, perspective: l, recreateShadows: o, getEffectParams: d } = e;
		let c;
		a('beforeInit', () => {
			if (s.params.effect !== t) return;
			s.classNames.push(`${s.params.containerModifierClass}${t}`), l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
			const e = n ? n() : {};
			Object.assign(s.params, e), Object.assign(s.originalParams, e);
		}),
			a('setTranslate', () => {
				s.params.effect === t && i();
			}),
			a('setTransition', (e, a) => {
				s.params.effect === t && r(a);
			}),
			a('transitionEnd', () => {
				if (s.params.effect === t && o) {
					if (!d || !d().slideShadows) return;
					s.slides.forEach((e) => {
						e.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach((e) => e.remove());
					}),
						o();
				}
			}),
			a('virtualUpdate', () => {
				s.params.effect === t &&
					(s.slides.length || (c = !0),
					requestAnimationFrame(() => {
						c && s.slides && s.slides.length && (i(), (c = !1));
					}));
			});
	}
	function le(e, t) {
		const s = m(t);
		return s !== t && ((s.style.backfaceVisibility = 'hidden'), (s.style['-webkit-backface-visibility'] = 'hidden')), s;
	}
	function oe(e) {
		let { swiper: t, duration: s, transformElements: a, allSlides: i } = e;
		const { activeIndex: r } = t;
		if (t.params.virtualTranslate && 0 !== s) {
			let e,
				s = !1;
			(e = i
				? a
				: a.filter((e) => {
						const s = e.classList.contains('swiper-slide-transform')
							? ((e) => {
									if (!e.parentElement) return t.slides.filter((t) => t.shadowRoot && t.shadowRoot === e.parentNode)[0];
									return e.parentElement;
							  })(e)
							: e;
						return t.getSlideIndex(s) === r;
				  })),
				e.forEach((e) => {
					y(e, () => {
						if (s) return;
						if (!t || t.destroyed) return;
						(s = !0), (t.animating = !1);
						const e = new window.CustomEvent('transitionend', { bubbles: !0, cancelable: !0 });
						t.wrapperEl.dispatchEvent(e);
					});
				});
		}
	}
	function de(e, t, s) {
		const a = `swiper-slide-shadow${s ? `-${s}` : ''}${e ? ` swiper-slide-shadow-${e}` : ''}`,
			i = m(t);
		let r = i.querySelector(`.${a.split(' ').join('.')}`);
		return r || ((r = f('div', a.split(' '))), i.append(r)), r;
	}
	Object.keys(K).forEach((e) => {
		Object.keys(K[e]).forEach((t) => {
			Q.prototype[t] = K[e][t];
		});
	}),
		Q.use([
			function (e) {
				let { swiper: t, on: s, emit: a } = e;
				const i = r();
				let n = null,
					l = null;
				const o = () => {
						t && !t.destroyed && t.initialized && (a('beforeResize'), a('resize'));
					},
					d = () => {
						t && !t.destroyed && t.initialized && a('orientationchange');
					};
				s('init', () => {
					t.params.resizeObserver && void 0 !== i.ResizeObserver
						? t &&
						  !t.destroyed &&
						  t.initialized &&
						  ((n = new ResizeObserver((e) => {
								l = i.requestAnimationFrame(() => {
									const { width: s, height: a } = t;
									let i = s,
										r = a;
									e.forEach((e) => {
										let { contentBoxSize: s, contentRect: a, target: n } = e;
										(n && n !== t.el) || ((i = a ? a.width : (s[0] || s).inlineSize), (r = a ? a.height : (s[0] || s).blockSize));
									}),
										(i === s && r === a) || o();
								});
						  })),
						  n.observe(t.el))
						: (i.addEventListener('resize', o), i.addEventListener('orientationchange', d));
				}),
					s('destroy', () => {
						l && i.cancelAnimationFrame(l), n && n.unobserve && t.el && (n.unobserve(t.el), (n = null)), i.removeEventListener('resize', o), i.removeEventListener('orientationchange', d);
					});
			},
			function (e) {
				let { swiper: t, extendParams: s, on: a, emit: i } = e;
				const n = [],
					l = r(),
					o = function (e, s) {
						void 0 === s && (s = {});
						const a = new (l.MutationObserver || l.WebkitMutationObserver)((e) => {
							if (t.__preventObserver__) return;
							if (1 === e.length) return void i('observerUpdate', e[0]);
							const s = function () {
								i('observerUpdate', e[0]);
							};
							l.requestAnimationFrame ? l.requestAnimationFrame(s) : l.setTimeout(s, 0);
						});
						a.observe(e, { attributes: void 0 === s.attributes || s.attributes, childList: void 0 === s.childList || s.childList, characterData: void 0 === s.characterData || s.characterData }), n.push(a);
					};
				s({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
					a('init', () => {
						if (t.params.observer) {
							if (t.params.observeParents) {
								const e = b(t.hostEl);
								for (let t = 0; t < e.length; t += 1) o(e[t]);
							}
							o(t.hostEl, { childList: t.params.observeSlideChildren }), o(t.wrapperEl, { attributes: !1 });
						}
					}),
					a('destroy', () => {
						n.forEach((e) => {
							e.disconnect();
						}),
							n.splice(0, n.length);
					});
			}
		]);
	const ce = [
		function (e) {
			let t,
				{ swiper: s, extendParams: i, on: r, emit: n } = e;
			i({ virtual: { enabled: !1, slides: [], cache: !0, renderSlide: null, renderExternal: null, renderExternalUpdate: !0, addSlidesBefore: 0, addSlidesAfter: 0 } });
			const l = a();
			s.virtual = { cache: {}, from: void 0, to: void 0, slides: [], offset: 0, slidesGrid: [] };
			const o = l.createElement('div');
			function d(e, t) {
				const a = s.params.virtual;
				if (a.cache && s.virtual.cache[t]) return s.virtual.cache[t];
				let i;
				return a.renderSlide ? ((i = a.renderSlide.call(s, e, t)), 'string' == typeof i && ((o.innerHTML = i), (i = o.children[0]))) : (i = s.isElement ? f('swiper-slide') : f('div', s.params.slideClass)), i.setAttribute('data-swiper-slide-index', t), a.renderSlide || (i.innerHTML = e), a.cache && (s.virtual.cache[t] = i), i;
			}
			function c(e) {
				const { slidesPerView: t, slidesPerGroup: a, centeredSlides: i, loop: r } = s.params,
					{ addSlidesBefore: l, addSlidesAfter: o } = s.params.virtual,
					{ from: c, to: p, slides: u, slidesGrid: m, offset: f } = s.virtual;
				s.params.cssMode || s.updateActiveIndex();
				const g = s.activeIndex || 0;
				let v, w, b;
				(v = s.rtlTranslate ? 'right' : s.isHorizontal() ? 'left' : 'top'), i ? ((w = Math.floor(t / 2) + a + o), (b = Math.floor(t / 2) + a + l)) : ((w = t + (a - 1) + o), (b = (r ? t : a) + l));
				let y = g - b,
					E = g + w;
				r || ((y = Math.max(y, 0)), (E = Math.min(E, u.length - 1)));
				let x = (s.slidesGrid[y] || 0) - (s.slidesGrid[0] || 0);
				function S() {
					s.updateSlides(), s.updateProgress(), s.updateSlidesClasses(), n('virtualUpdate');
				}
				if ((r && g >= b ? ((y -= b), i || (x += s.slidesGrid[0])) : r && g < b && ((y = -b), i && (x += s.slidesGrid[0])), Object.assign(s.virtual, { from: y, to: E, offset: x, slidesGrid: s.slidesGrid, slidesBefore: b, slidesAfter: w }), c === y && p === E && !e))
					return (
						s.slidesGrid !== m &&
							x !== f &&
							s.slides.forEach((e) => {
								e.style[v] = x - Math.abs(s.cssOverflowAdjustment()) + 'px';
							}),
						s.updateProgress(),
						void n('virtualUpdate')
					);
				if (s.params.virtual.renderExternal)
					return (
						s.params.virtual.renderExternal.call(s, {
							offset: x,
							from: y,
							to: E,
							slides: (function () {
								const e = [];
								for (let t = y; t <= E; t += 1) e.push(u[t]);
								return e;
							})()
						}),
						void (s.params.virtual.renderExternalUpdate ? S() : n('virtualUpdate'))
					);
				const T = [],
					M = [],
					C = (e) => {
						let t = e;
						return e < 0 ? (t = u.length + e) : t >= u.length && (t -= u.length), t;
					};
				if (e)
					s.slides
						.filter((e) => e.matches(`.${s.params.slideClass}, swiper-slide`))
						.forEach((e) => {
							e.remove();
						});
				else
					for (let e = c; e <= p; e += 1)
						if (e < y || e > E) {
							const t = C(e);
							s.slides
								.filter((e) => e.matches(`.${s.params.slideClass}[data-swiper-slide-index="${t}"], swiper-slide[data-swiper-slide-index="${t}"]`))
								.forEach((e) => {
									e.remove();
								});
						}
				const P = r ? -u.length : 0,
					L = r ? 2 * u.length : u.length;
				for (let t = P; t < L; t += 1)
					if (t >= y && t <= E) {
						const s = C(t);
						void 0 === p || e ? M.push(s) : (t > p && M.push(s), t < c && T.push(s));
					}
				if (
					(M.forEach((e) => {
						s.slidesEl.append(d(u[e], e));
					}),
					r)
				)
					for (let e = T.length - 1; e >= 0; e -= 1) {
						const t = T[e];
						s.slidesEl.prepend(d(u[t], t));
					}
				else
					T.sort((e, t) => t - e),
						T.forEach((e) => {
							s.slidesEl.prepend(d(u[e], e));
						});
				h(s.slidesEl, '.swiper-slide, swiper-slide').forEach((e) => {
					e.style[v] = x - Math.abs(s.cssOverflowAdjustment()) + 'px';
				}),
					S();
			}
			r('beforeInit', () => {
				if (!s.params.virtual.enabled) return;
				let e;
				if (void 0 === s.passedParams.virtual.slides) {
					const t = [...s.slidesEl.children].filter((e) => e.matches(`.${s.params.slideClass}, swiper-slide`));
					t &&
						t.length &&
						((s.virtual.slides = [...t]),
						(e = !0),
						t.forEach((e, t) => {
							e.setAttribute('data-swiper-slide-index', t), (s.virtual.cache[t] = e), e.remove();
						}));
				}
				e || (s.virtual.slides = s.params.virtual.slides), s.classNames.push(`${s.params.containerModifierClass}virtual`), (s.params.watchSlidesProgress = !0), (s.originalParams.watchSlidesProgress = !0), c();
			}),
				r('setTranslate', () => {
					s.params.virtual.enabled &&
						(s.params.cssMode && !s._immediateVirtual
							? (clearTimeout(t),
							  (t = setTimeout(() => {
									c();
							  }, 100)))
							: c());
				}),
				r('init update resize', () => {
					s.params.virtual.enabled && s.params.cssMode && p(s.wrapperEl, '--swiper-virtual-size', `${s.virtualSize}px`);
				}),
				Object.assign(s.virtual, {
					appendSlide: function (e) {
						if ('object' == typeof e && 'length' in e) for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.push(e[t]);
						else s.virtual.slides.push(e);
						c(!0);
					},
					prependSlide: function (e) {
						const t = s.activeIndex;
						let a = t + 1,
							i = 1;
						if (Array.isArray(e)) {
							for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.unshift(e[t]);
							(a = t + e.length), (i = e.length);
						} else s.virtual.slides.unshift(e);
						if (s.params.virtual.cache) {
							const e = s.virtual.cache,
								t = {};
							Object.keys(e).forEach((s) => {
								const a = e[s],
									r = a.getAttribute('data-swiper-slide-index');
								r && a.setAttribute('data-swiper-slide-index', parseInt(r, 10) + i), (t[parseInt(s, 10) + i] = a);
							}),
								(s.virtual.cache = t);
						}
						c(!0), s.slideTo(a, 0);
					},
					removeSlide: function (e) {
						if (null == e) return;
						let t = s.activeIndex;
						if (Array.isArray(e))
							for (let a = e.length - 1; a >= 0; a -= 1)
								s.params.virtual.cache &&
									(delete s.virtual.cache[e[a]],
									Object.keys(s.virtual.cache).forEach((t) => {
										t > e && ((s.virtual.cache[t - 1] = s.virtual.cache[t]), s.virtual.cache[t - 1].setAttribute('data-swiper-slide-index', t - 1), delete s.virtual.cache[t]);
									})),
									s.virtual.slides.splice(e[a], 1),
									e[a] < t && (t -= 1),
									(t = Math.max(t, 0));
						else
							s.params.virtual.cache &&
								(delete s.virtual.cache[e],
								Object.keys(s.virtual.cache).forEach((t) => {
									t > e && ((s.virtual.cache[t - 1] = s.virtual.cache[t]), s.virtual.cache[t - 1].setAttribute('data-swiper-slide-index', t - 1), delete s.virtual.cache[t]);
								})),
								s.virtual.slides.splice(e, 1),
								e < t && (t -= 1),
								(t = Math.max(t, 0));
						c(!0), s.slideTo(t, 0);
					},
					removeAllSlides: function () {
						(s.virtual.slides = []), s.params.virtual.cache && (s.virtual.cache = {}), c(!0), s.slideTo(0, 0);
					},
					update: c
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: i, emit: n } = e;
			const l = a(),
				o = r();
			function d(e) {
				if (!t.enabled) return;
				const { rtlTranslate: s } = t;
				let a = e;
				a.originalEvent && (a = a.originalEvent);
				const i = a.keyCode || a.charCode,
					r = t.params.keyboard.pageUpDown,
					d = r && 33 === i,
					c = r && 34 === i,
					p = 37 === i,
					u = 39 === i,
					m = 38 === i,
					h = 40 === i;
				if (!t.allowSlideNext && ((t.isHorizontal() && u) || (t.isVertical() && h) || c)) return !1;
				if (!t.allowSlidePrev && ((t.isHorizontal() && p) || (t.isVertical() && m) || d)) return !1;
				if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || (l.activeElement && l.activeElement.nodeName && ('input' === l.activeElement.nodeName.toLowerCase() || 'textarea' === l.activeElement.nodeName.toLowerCase())))) {
					if (t.params.keyboard.onlyInViewport && (d || c || p || u || m || h)) {
						let e = !1;
						if (b(t.el, `.${t.params.slideClass}, swiper-slide`).length > 0 && 0 === b(t.el, `.${t.params.slideActiveClass}`).length) return;
						const a = t.el,
							i = a.clientWidth,
							r = a.clientHeight,
							n = o.innerWidth,
							l = o.innerHeight,
							d = g(a);
						s && (d.left -= a.scrollLeft);
						const c = [
							[d.left, d.top],
							[d.left + i, d.top],
							[d.left, d.top + r],
							[d.left + i, d.top + r]
						];
						for (let t = 0; t < c.length; t += 1) {
							const s = c[t];
							if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
								if (0 === s[0] && 0 === s[1]) continue;
								e = !0;
							}
						}
						if (!e) return;
					}
					t.isHorizontal() ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1)), (((c || u) && !s) || ((d || p) && s)) && t.slideNext(), (((d || p) && !s) || ((c || u) && s)) && t.slidePrev()) : ((d || c || m || h) && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1)), (c || h) && t.slideNext(), (d || m) && t.slidePrev()), n('keyPress', i);
				}
			}
			function c() {
				t.keyboard.enabled || (l.addEventListener('keydown', d), (t.keyboard.enabled = !0));
			}
			function p() {
				t.keyboard.enabled && (l.removeEventListener('keydown', d), (t.keyboard.enabled = !1));
			}
			(t.keyboard = { enabled: !1 }),
				s({ keyboard: { enabled: !1, onlyInViewport: !0, pageUpDown: !0 } }),
				i('init', () => {
					t.params.keyboard.enabled && c();
				}),
				i('destroy', () => {
					t.keyboard.enabled && p();
				}),
				Object.assign(t.keyboard, { enable: c, disable: p });
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const o = r();
			let d;
			s({ mousewheel: { enabled: !1, releaseOnEdges: !1, invert: !1, forceToAxis: !1, sensitivity: 1, eventsTarget: 'container', thresholdDelta: null, thresholdTime: null, noMousewheelClass: 'swiper-no-mousewheel' } }), (t.mousewheel = { enabled: !1 });
			let c,
				p = l();
			const u = [];
			function m() {
				t.enabled && (t.mouseEntered = !0);
			}
			function h() {
				t.enabled && (t.mouseEntered = !1);
			}
			function f(e) {
				return !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) && !(t.params.mousewheel.thresholdTime && l() - p < t.params.mousewheel.thresholdTime) && ((e.delta >= 6 && l() - p < 60) || (e.direction < 0 ? (t.isEnd && !t.params.loop) || t.animating || (t.slideNext(), i('scroll', e.raw)) : (t.isBeginning && !t.params.loop) || t.animating || (t.slidePrev(), i('scroll', e.raw)), (p = new o.Date().getTime()), !1));
			}
			function g(e) {
				let s = e,
					a = !0;
				if (!t.enabled) return;
				if (e.target.closest(`.${t.params.mousewheel.noMousewheelClass}`)) return;
				const r = t.params.mousewheel;
				t.params.cssMode && s.preventDefault();
				let o = t.el;
				'container' !== t.params.mousewheel.eventsTarget && (o = document.querySelector(t.params.mousewheel.eventsTarget));
				const p = o && o.contains(s.target);
				if (!t.mouseEntered && !p && !r.releaseOnEdges) return !0;
				s.originalEvent && (s = s.originalEvent);
				let m = 0;
				const h = t.rtlTranslate ? -1 : 1,
					g = (function (e) {
						let t = 0,
							s = 0,
							a = 0,
							i = 0;
						return (
							'detail' in e && (s = e.detail),
							'wheelDelta' in e && (s = -e.wheelDelta / 120),
							'wheelDeltaY' in e && (s = -e.wheelDeltaY / 120),
							'wheelDeltaX' in e && (t = -e.wheelDeltaX / 120),
							'axis' in e && e.axis === e.HORIZONTAL_AXIS && ((t = s), (s = 0)),
							(a = 10 * t),
							(i = 10 * s),
							'deltaY' in e && (i = e.deltaY),
							'deltaX' in e && (a = e.deltaX),
							e.shiftKey && !a && ((a = i), (i = 0)),
							(a || i) && e.deltaMode && (1 === e.deltaMode ? ((a *= 40), (i *= 40)) : ((a *= 800), (i *= 800))),
							a && !t && (t = a < 1 ? -1 : 1),
							i && !s && (s = i < 1 ? -1 : 1),
							{ spinX: t, spinY: s, pixelX: a, pixelY: i }
						);
					})(s);
				if (r.forceToAxis)
					if (t.isHorizontal()) {
						if (!(Math.abs(g.pixelX) > Math.abs(g.pixelY))) return !0;
						m = -g.pixelX * h;
					} else {
						if (!(Math.abs(g.pixelY) > Math.abs(g.pixelX))) return !0;
						m = -g.pixelY;
					}
				else m = Math.abs(g.pixelX) > Math.abs(g.pixelY) ? -g.pixelX * h : -g.pixelY;
				if (0 === m) return !0;
				r.invert && (m = -m);
				let v = t.getTranslate() + m * r.sensitivity;
				if ((v >= t.minTranslate() && (v = t.minTranslate()), v <= t.maxTranslate() && (v = t.maxTranslate()), (a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate())), a && t.params.nested && s.stopPropagation(), t.params.freeMode && t.params.freeMode.enabled)) {
					const e = { time: l(), delta: Math.abs(m), direction: Math.sign(m) },
						a = c && e.time < c.time + 500 && e.delta <= c.delta && e.direction === c.direction;
					if (!a) {
						c = void 0;
						let l = t.getTranslate() + m * r.sensitivity;
						const o = t.isBeginning,
							p = t.isEnd;
						if ((l >= t.minTranslate() && (l = t.minTranslate()), l <= t.maxTranslate() && (l = t.maxTranslate()), t.setTransition(0), t.setTranslate(l), t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses(), ((!o && t.isBeginning) || (!p && t.isEnd)) && t.updateSlidesClasses(), t.params.loop && t.loopFix({ direction: e.direction < 0 ? 'next' : 'prev', byMousewheel: !0 }), t.params.freeMode.sticky)) {
							clearTimeout(d), (d = void 0), u.length >= 15 && u.shift();
							const s = u.length ? u[u.length - 1] : void 0,
								a = u[0];
							if ((u.push(e), s && (e.delta > s.delta || e.direction !== s.direction))) u.splice(0);
							else if (u.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
								const s = m > 0 ? 0.8 : 0.2;
								(c = e),
									u.splice(0),
									(d = n(() => {
										t.slideToClosest(t.params.speed, !0, void 0, s);
									}, 0));
							}
							d ||
								(d = n(() => {
									(c = e), u.splice(0), t.slideToClosest(t.params.speed, !0, void 0, 0.5);
								}, 500));
						}
						if ((a || i('scroll', s), t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(), r.releaseOnEdges && (l === t.minTranslate() || l === t.maxTranslate()))) return !0;
					}
				} else {
					const s = { time: l(), delta: Math.abs(m), direction: Math.sign(m), raw: e };
					u.length >= 2 && u.shift();
					const a = u.length ? u[u.length - 1] : void 0;
					if (
						(u.push(s),
						a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && f(s) : f(s),
						(function (e) {
							const s = t.params.mousewheel;
							if (e.direction < 0) {
								if (t.isEnd && !t.params.loop && s.releaseOnEdges) return !0;
							} else if (t.isBeginning && !t.params.loop && s.releaseOnEdges) return !0;
							return !1;
						})(s))
					)
						return !0;
				}
				return s.preventDefault ? s.preventDefault() : (s.returnValue = !1), !1;
			}
			function v(e) {
				let s = t.el;
				'container' !== t.params.mousewheel.eventsTarget && (s = document.querySelector(t.params.mousewheel.eventsTarget)), s[e]('mouseenter', m), s[e]('mouseleave', h), s[e]('wheel', g);
			}
			function w() {
				return t.params.cssMode ? (t.wrapperEl.removeEventListener('wheel', g), !0) : !t.mousewheel.enabled && (v('addEventListener'), (t.mousewheel.enabled = !0), !0);
			}
			function b() {
				return t.params.cssMode ? (t.wrapperEl.addEventListener(event, g), !0) : !!t.mousewheel.enabled && (v('removeEventListener'), (t.mousewheel.enabled = !1), !0);
			}
			a('init', () => {
				!t.params.mousewheel.enabled && t.params.cssMode && b(), t.params.mousewheel.enabled && w();
			}),
				a('destroy', () => {
					t.params.cssMode && w(), t.mousewheel.enabled && b();
				}),
				Object.assign(t.mousewheel, { enable: w, disable: b });
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			s({ navigation: { nextEl: null, prevEl: null, hideOnClick: !1, disabledClass: 'swiper-button-disabled', hiddenClass: 'swiper-button-hidden', lockClass: 'swiper-button-lock', navigationDisabledClass: 'swiper-navigation-disabled' } }), (t.navigation = { nextEl: null, prevEl: null });
			const r = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
			function n(e) {
				let s;
				return e && 'string' == typeof e && t.isElement && ((s = t.el.querySelector(e)), s) ? s : (e && ('string' == typeof e && (s = [...document.querySelectorAll(e)]), t.params.uniqueNavElements && 'string' == typeof e && s.length > 1 && 1 === t.el.querySelectorAll(e).length && (s = t.el.querySelector(e))), e && !s ? e : s);
			}
			function l(e, s) {
				const a = t.params.navigation;
				(e = r(e)).forEach((e) => {
					e && (e.classList[s ? 'add' : 'remove'](...a.disabledClass.split(' ')), 'BUTTON' === e.tagName && (e.disabled = s), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? 'add' : 'remove'](a.lockClass));
				});
			}
			function o() {
				const { nextEl: e, prevEl: s } = t.navigation;
				if (t.params.loop) return l(s, !1), void l(e, !1);
				l(s, t.isBeginning && !t.params.rewind), l(e, t.isEnd && !t.params.rewind);
			}
			function d(e) {
				e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(), i('navigationPrev'));
			}
			function c(e) {
				e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(), i('navigationNext'));
			}
			function p() {
				const e = t.params.navigation;
				if (((t.params.navigation = J(t, t.originalParams.navigation, t.params.navigation, { nextEl: 'swiper-button-next', prevEl: 'swiper-button-prev' })), !e.nextEl && !e.prevEl)) return;
				let s = n(e.nextEl),
					a = n(e.prevEl);
				Object.assign(t.navigation, { nextEl: s, prevEl: a }), (s = r(s)), (a = r(a));
				const i = (s, a) => {
					s && s.addEventListener('click', 'next' === a ? c : d), !t.enabled && s && s.classList.add(...e.lockClass.split(' '));
				};
				s.forEach((e) => i(e, 'next')), a.forEach((e) => i(e, 'prev'));
			}
			function u() {
				let { nextEl: e, prevEl: s } = t.navigation;
				(e = r(e)), (s = r(s));
				const a = (e, s) => {
					e.removeEventListener('click', 'next' === s ? c : d), e.classList.remove(...t.params.navigation.disabledClass.split(' '));
				};
				e.forEach((e) => a(e, 'next')), s.forEach((e) => a(e, 'prev'));
			}
			a('init', () => {
				!1 === t.params.navigation.enabled ? m() : (p(), o());
			}),
				a('toEdge fromEdge lock unlock', () => {
					o();
				}),
				a('destroy', () => {
					u();
				}),
				a('enable disable', () => {
					let { nextEl: e, prevEl: s } = t.navigation;
					(e = r(e)), (s = r(s)), t.enabled ? o() : [...e, ...s].filter((e) => !!e).forEach((e) => e.classList.add(t.params.navigation.lockClass));
				}),
				a('click', (e, s) => {
					let { nextEl: a, prevEl: n } = t.navigation;
					(a = r(a)), (n = r(n));
					const l = s.target;
					if (t.params.navigation.hideOnClick && !n.includes(l) && !a.includes(l)) {
						if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === l || t.pagination.el.contains(l))) return;
						let e;
						a.length ? (e = a[0].classList.contains(t.params.navigation.hiddenClass)) : n.length && (e = n[0].classList.contains(t.params.navigation.hiddenClass)), i(!0 === e ? 'navigationShow' : 'navigationHide'), [...a, ...n].filter((e) => !!e).forEach((e) => e.classList.toggle(t.params.navigation.hiddenClass));
					}
				});
			const m = () => {
				t.el.classList.add(...t.params.navigation.navigationDisabledClass.split(' ')), u();
			};
			Object.assign(t.navigation, {
				enable: () => {
					t.el.classList.remove(...t.params.navigation.navigationDisabledClass.split(' ')), p(), o();
				},
				disable: m,
				update: o,
				init: p,
				destroy: u
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const r = 'swiper-pagination';
			let n;
			s({
				pagination: {
					el: null,
					bulletElement: 'span',
					clickable: !1,
					hideOnClick: !1,
					renderBullet: null,
					renderProgressbar: null,
					renderFraction: null,
					renderCustom: null,
					progressbarOpposite: !1,
					type: 'bullets',
					dynamicBullets: !1,
					dynamicMainBullets: 1,
					formatFractionCurrent: (e) => e,
					formatFractionTotal: (e) => e,
					bulletClass: `${r}-bullet`,
					bulletActiveClass: `${r}-bullet-active`,
					modifierClass: `${r}-`,
					currentClass: `${r}-current`,
					totalClass: `${r}-total`,
					hiddenClass: `${r}-hidden`,
					progressbarFillClass: `${r}-progressbar-fill`,
					progressbarOppositeClass: `${r}-progressbar-opposite`,
					clickableClass: `${r}-clickable`,
					lockClass: `${r}-lock`,
					horizontalClass: `${r}-horizontal`,
					verticalClass: `${r}-vertical`,
					paginationDisabledClass: `${r}-disabled`
				}
			}),
				(t.pagination = { el: null, bullets: [] });
			let l = 0;
			const o = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
			function d() {
				return !t.params.pagination.el || !t.pagination.el || (Array.isArray(t.pagination.el) && 0 === t.pagination.el.length);
			}
			function c(e, s) {
				const { bulletActiveClass: a } = t.params.pagination;
				e && (e = e[('prev' === s ? 'previous' : 'next') + 'ElementSibling']) && (e.classList.add(`${a}-${s}`), (e = e[('prev' === s ? 'previous' : 'next') + 'ElementSibling']) && e.classList.add(`${a}-${s}-${s}`));
			}
			function p(e) {
				const s = e.target.closest(ee(t.params.pagination.bulletClass));
				if (!s) return;
				e.preventDefault();
				const a = w(s) * t.params.slidesPerGroup;
				if (t.params.loop) {
					if (t.realIndex === a) return;
					const e = t.realIndex,
						s = t.getSlideIndexByData(a),
						i = t.getSlideIndexByData(t.realIndex),
						r = (a) => {
							const i = t.activeIndex;
							t.loopFix({ direction: a, activeSlideIndex: s, slideTo: !1 });
							i === t.activeIndex && t.slideToLoop(e, 0, !1, !0);
						};
					if (s > t.slides.length - t.loopedSlides) r(s > i ? 'next' : 'prev');
					else if (t.params.centeredSlides) {
						const e = 'auto' === t.params.slidesPerView ? t.slidesPerViewDynamic() : Math.ceil(parseFloat(t.params.slidesPerView, 10));
						s < Math.floor(e / 2) && r('prev');
					}
					t.slideToLoop(a);
				} else t.slideTo(a);
			}
			function u() {
				const e = t.rtl,
					s = t.params.pagination;
				if (d()) return;
				let a,
					r,
					p = t.pagination.el;
				p = o(p);
				const u = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
					m = t.params.loop ? Math.ceil(u / t.params.slidesPerGroup) : t.snapGrid.length;
				if ((t.params.loop ? ((r = t.previousRealIndex || 0), (a = t.params.slidesPerGroup > 1 ? Math.floor(t.realIndex / t.params.slidesPerGroup) : t.realIndex)) : void 0 !== t.snapIndex ? ((a = t.snapIndex), (r = t.previousSnapIndex)) : ((r = t.previousIndex || 0), (a = t.activeIndex || 0)), 'bullets' === s.type && t.pagination.bullets && t.pagination.bullets.length > 0)) {
					const i = t.pagination.bullets;
					let o, d, u;
					if (
						(s.dynamicBullets &&
							((n = E(i[0], t.isHorizontal() ? 'width' : 'height', !0)),
							p.forEach((e) => {
								e.style[t.isHorizontal() ? 'width' : 'height'] = n * (s.dynamicMainBullets + 4) + 'px';
							}),
							s.dynamicMainBullets > 1 && void 0 !== r && ((l += a - (r || 0)), l > s.dynamicMainBullets - 1 ? (l = s.dynamicMainBullets - 1) : l < 0 && (l = 0)),
							(o = Math.max(a - l, 0)),
							(d = o + (Math.min(i.length, s.dynamicMainBullets) - 1)),
							(u = (d + o) / 2)),
						i.forEach((e) => {
							const t = [...['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map((e) => `${s.bulletActiveClass}${e}`)].map((e) => ('string' == typeof e && e.includes(' ') ? e.split(' ') : e)).flat();
							e.classList.remove(...t);
						}),
						p.length > 1)
					)
						i.forEach((e) => {
							const i = w(e);
							i === a ? e.classList.add(...s.bulletActiveClass.split(' ')) : t.isElement && e.setAttribute('part', 'bullet'), s.dynamicBullets && (i >= o && i <= d && e.classList.add(...`${s.bulletActiveClass}-main`.split(' ')), i === o && c(e, 'prev'), i === d && c(e, 'next'));
						});
					else {
						const e = i[a];
						if (
							(e && e.classList.add(...s.bulletActiveClass.split(' ')),
							t.isElement &&
								i.forEach((e, t) => {
									e.setAttribute('part', t === a ? 'bullet-active' : 'bullet');
								}),
							s.dynamicBullets)
						) {
							const e = i[o],
								t = i[d];
							for (let e = o; e <= d; e += 1) i[e] && i[e].classList.add(...`${s.bulletActiveClass}-main`.split(' '));
							c(e, 'prev'), c(t, 'next');
						}
					}
					if (s.dynamicBullets) {
						const a = Math.min(i.length, s.dynamicMainBullets + 4),
							r = (n * a - n) / 2 - u * n,
							l = e ? 'right' : 'left';
						i.forEach((e) => {
							e.style[t.isHorizontal() ? l : 'top'] = `${r}px`;
						});
					}
				}
				p.forEach((e, r) => {
					if (
						('fraction' === s.type &&
							(e.querySelectorAll(ee(s.currentClass)).forEach((e) => {
								e.textContent = s.formatFractionCurrent(a + 1);
							}),
							e.querySelectorAll(ee(s.totalClass)).forEach((e) => {
								e.textContent = s.formatFractionTotal(m);
							})),
						'progressbar' === s.type)
					) {
						let i;
						i = s.progressbarOpposite ? (t.isHorizontal() ? 'vertical' : 'horizontal') : t.isHorizontal() ? 'horizontal' : 'vertical';
						const r = (a + 1) / m;
						let n = 1,
							l = 1;
						'horizontal' === i ? (n = r) : (l = r),
							e.querySelectorAll(ee(s.progressbarFillClass)).forEach((e) => {
								(e.style.transform = `translate3d(0,0,0) scaleX(${n}) scaleY(${l})`), (e.style.transitionDuration = `${t.params.speed}ms`);
							});
					}
					'custom' === s.type && s.renderCustom ? ((e.innerHTML = s.renderCustom(t, a + 1, m)), 0 === r && i('paginationRender', e)) : (0 === r && i('paginationRender', e), i('paginationUpdate', e)), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? 'add' : 'remove'](s.lockClass);
				});
			}
			function m() {
				const e = t.params.pagination;
				if (d()) return;
				const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length;
				let a = t.pagination.el;
				a = o(a);
				let r = '';
				if ('bullets' === e.type) {
					let a = t.params.loop ? Math.ceil(s / t.params.slidesPerGroup) : t.snapGrid.length;
					t.params.freeMode && t.params.freeMode.enabled && a > s && (a = s);
					for (let s = 0; s < a; s += 1) e.renderBullet ? (r += e.renderBullet.call(t, s, e.bulletClass)) : (r += `<${e.bulletElement} ${t.isElement ? 'part="bullet"' : ''} class="${e.bulletClass}"></${e.bulletElement}>`);
				}
				'fraction' === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`),
					'progressbar' === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`),
					(t.pagination.bullets = []),
					a.forEach((s) => {
						'custom' !== e.type && (s.innerHTML = r || ''), 'bullets' === e.type && t.pagination.bullets.push(...s.querySelectorAll(ee(e.bulletClass)));
					}),
					'custom' !== e.type && i('paginationRender', a[0]);
			}
			function h() {
				t.params.pagination = J(t, t.originalParams.pagination, t.params.pagination, { el: 'swiper-pagination' });
				const e = t.params.pagination;
				if (!e.el) return;
				let s;
				'string' == typeof e.el && t.isElement && (s = t.el.querySelector(e.el)),
					s || 'string' != typeof e.el || (s = [...document.querySelectorAll(e.el)]),
					s || (s = e.el),
					s &&
						0 !== s.length &&
						(t.params.uniqueNavElements && 'string' == typeof e.el && Array.isArray(s) && s.length > 1 && ((s = [...t.el.querySelectorAll(e.el)]), s.length > 1 && (s = s.filter((e) => b(e, '.swiper')[0] === t.el)[0])),
						Array.isArray(s) && 1 === s.length && (s = s[0]),
						Object.assign(t.pagination, { el: s }),
						(s = o(s)),
						s.forEach((s) => {
							'bullets' === e.type && e.clickable && s.classList.add(...(e.clickableClass || '').split(' ')),
								s.classList.add(e.modifierClass + e.type),
								s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
								'bullets' === e.type && e.dynamicBullets && (s.classList.add(`${e.modifierClass}${e.type}-dynamic`), (l = 0), e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)),
								'progressbar' === e.type && e.progressbarOpposite && s.classList.add(e.progressbarOppositeClass),
								e.clickable && s.addEventListener('click', p),
								t.enabled || s.classList.add(e.lockClass);
						}));
			}
			function f() {
				const e = t.params.pagination;
				if (d()) return;
				let s = t.pagination.el;
				s &&
					((s = o(s)),
					s.forEach((s) => {
						s.classList.remove(e.hiddenClass), s.classList.remove(e.modifierClass + e.type), s.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass), e.clickable && (s.classList.remove(...(e.clickableClass || '').split(' ')), s.removeEventListener('click', p));
					})),
					t.pagination.bullets && t.pagination.bullets.forEach((t) => t.classList.remove(...e.bulletActiveClass.split(' ')));
			}
			a('changeDirection', () => {
				if (!t.pagination || !t.pagination.el) return;
				const e = t.params.pagination;
				let { el: s } = t.pagination;
				(s = o(s)),
					s.forEach((s) => {
						s.classList.remove(e.horizontalClass, e.verticalClass), s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass);
					});
			}),
				a('init', () => {
					!1 === t.params.pagination.enabled ? g() : (h(), m(), u());
				}),
				a('activeIndexChange', () => {
					void 0 === t.snapIndex && u();
				}),
				a('snapIndexChange', () => {
					u();
				}),
				a('snapGridLengthChange', () => {
					m(), u();
				}),
				a('destroy', () => {
					f();
				}),
				a('enable disable', () => {
					let { el: e } = t.pagination;
					e && ((e = o(e)), e.forEach((e) => e.classList[t.enabled ? 'remove' : 'add'](t.params.pagination.lockClass)));
				}),
				a('lock unlock', () => {
					u();
				}),
				a('click', (e, s) => {
					const a = s.target,
						r = o(t.pagination.el);
					if (t.params.pagination.el && t.params.pagination.hideOnClick && r && r.length > 0 && !a.classList.contains(t.params.pagination.bulletClass)) {
						if (t.navigation && ((t.navigation.nextEl && a === t.navigation.nextEl) || (t.navigation.prevEl && a === t.navigation.prevEl))) return;
						const e = r[0].classList.contains(t.params.pagination.hiddenClass);
						i(!0 === e ? 'paginationShow' : 'paginationHide'), r.forEach((e) => e.classList.toggle(t.params.pagination.hiddenClass));
					}
				});
			const g = () => {
				t.el.classList.add(t.params.pagination.paginationDisabledClass);
				let { el: e } = t.pagination;
				e && ((e = o(e)), e.forEach((e) => e.classList.add(t.params.pagination.paginationDisabledClass))), f();
			};
			Object.assign(t.pagination, {
				enable: () => {
					t.el.classList.remove(t.params.pagination.paginationDisabledClass);
					let { el: e } = t.pagination;
					e && ((e = o(e)), e.forEach((e) => e.classList.remove(t.params.pagination.paginationDisabledClass))), h(), m(), u();
				},
				disable: g,
				render: m,
				update: u,
				init: h,
				destroy: f
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: i, emit: r } = e;
			const l = a();
			let o,
				d,
				c,
				p,
				u = !1,
				m = null,
				h = null;
			function v() {
				if (!t.params.scrollbar.el || !t.scrollbar.el) return;
				const { scrollbar: e, rtlTranslate: s } = t,
					{ dragEl: a, el: i } = e,
					r = t.params.scrollbar,
					n = t.params.loop ? t.progressLoop : t.progress;
				let l = d,
					o = (c - d) * n;
				s ? ((o = -o), o > 0 ? ((l = d - o), (o = 0)) : -o + d > c && (l = c + o)) : o < 0 ? ((l = d + o), (o = 0)) : o + d > c && (l = c - o),
					t.isHorizontal() ? ((a.style.transform = `translate3d(${o}px, 0, 0)`), (a.style.width = `${l}px`)) : ((a.style.transform = `translate3d(0px, ${o}px, 0)`), (a.style.height = `${l}px`)),
					r.hide &&
						(clearTimeout(m),
						(i.style.opacity = 1),
						(m = setTimeout(() => {
							(i.style.opacity = 0), (i.style.transitionDuration = '400ms');
						}, 1e3)));
			}
			function w() {
				if (!t.params.scrollbar.el || !t.scrollbar.el) return;
				const { scrollbar: e } = t,
					{ dragEl: s, el: a } = e;
				(s.style.width = ''),
					(s.style.height = ''),
					(c = t.isHorizontal() ? a.offsetWidth : a.offsetHeight),
					(p = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0))),
					(d = 'auto' === t.params.scrollbar.dragSize ? c * p : parseInt(t.params.scrollbar.dragSize, 10)),
					t.isHorizontal() ? (s.style.width = `${d}px`) : (s.style.height = `${d}px`),
					(a.style.display = p >= 1 ? 'none' : ''),
					t.params.scrollbar.hide && (a.style.opacity = 0),
					t.params.watchOverflow && t.enabled && e.el.classList[t.isLocked ? 'add' : 'remove'](t.params.scrollbar.lockClass);
			}
			function b(e) {
				return t.isHorizontal() ? e.clientX : e.clientY;
			}
			function y(e) {
				const { scrollbar: s, rtlTranslate: a } = t,
					{ el: i } = s;
				let r;
				(r = (b(e) - g(i)[t.isHorizontal() ? 'left' : 'top'] - (null !== o ? o : d / 2)) / (c - d)), (r = Math.max(Math.min(r, 1), 0)), a && (r = 1 - r);
				const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
				t.updateProgress(n), t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses();
			}
			function E(e) {
				const s = t.params.scrollbar,
					{ scrollbar: a, wrapperEl: i } = t,
					{ el: n, dragEl: l } = a;
				(u = !0), (o = e.target === l ? b(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? 'left' : 'top'] : null), e.preventDefault(), e.stopPropagation(), (i.style.transitionDuration = '100ms'), (l.style.transitionDuration = '100ms'), y(e), clearTimeout(h), (n.style.transitionDuration = '0ms'), s.hide && (n.style.opacity = 1), t.params.cssMode && (t.wrapperEl.style['scroll-snap-type'] = 'none'), r('scrollbarDragStart', e);
			}
			function x(e) {
				const { scrollbar: s, wrapperEl: a } = t,
					{ el: i, dragEl: n } = s;
				u && (e.preventDefault ? e.preventDefault() : (e.returnValue = !1), y(e), (a.style.transitionDuration = '0ms'), (i.style.transitionDuration = '0ms'), (n.style.transitionDuration = '0ms'), r('scrollbarDragMove', e));
			}
			function S(e) {
				const s = t.params.scrollbar,
					{ scrollbar: a, wrapperEl: i } = t,
					{ el: l } = a;
				u &&
					((u = !1),
					t.params.cssMode && ((t.wrapperEl.style['scroll-snap-type'] = ''), (i.style.transitionDuration = '')),
					s.hide &&
						(clearTimeout(h),
						(h = n(() => {
							(l.style.opacity = 0), (l.style.transitionDuration = '400ms');
						}, 1e3))),
					r('scrollbarDragEnd', e),
					s.snapOnRelease && t.slideToClosest());
			}
			function T(e) {
				const { scrollbar: s, params: a } = t,
					i = s.el;
				if (!i) return;
				const r = i,
					n = !!a.passiveListeners && { passive: !1, capture: !1 },
					o = !!a.passiveListeners && { passive: !0, capture: !1 };
				if (!r) return;
				const d = 'on' === e ? 'addEventListener' : 'removeEventListener';
				r[d]('pointerdown', E, n), l[d]('pointermove', x, n), l[d]('pointerup', S, o);
			}
			function M() {
				const { scrollbar: e, el: s } = t;
				t.params.scrollbar = J(t, t.originalParams.scrollbar, t.params.scrollbar, { el: 'swiper-scrollbar' });
				const a = t.params.scrollbar;
				if (!a.el) return;
				let i, r;
				'string' == typeof a.el && t.isElement && (i = t.el.querySelector(a.el)),
					i || 'string' != typeof a.el ? i || (i = a.el) : (i = l.querySelectorAll(a.el)),
					t.params.uniqueNavElements && 'string' == typeof a.el && i.length > 1 && 1 === s.querySelectorAll(a.el).length && (i = s.querySelector(a.el)),
					i.length > 0 && (i = i[0]),
					i.classList.add(t.isHorizontal() ? a.horizontalClass : a.verticalClass),
					i && ((r = i.querySelector(`.${t.params.scrollbar.dragClass}`)), r || ((r = f('div', t.params.scrollbar.dragClass)), i.append(r))),
					Object.assign(e, { el: i, dragEl: r }),
					a.draggable && t.params.scrollbar.el && t.scrollbar.el && T('on'),
					i && i.classList[t.enabled ? 'remove' : 'add'](t.params.scrollbar.lockClass);
			}
			function C() {
				const e = t.params.scrollbar,
					s = t.scrollbar.el;
				s && s.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass), t.params.scrollbar.el && t.scrollbar.el && T('off');
			}
			s({ scrollbar: { el: null, dragSize: 'auto', hide: !1, draggable: !1, snapOnRelease: !0, lockClass: 'swiper-scrollbar-lock', dragClass: 'swiper-scrollbar-drag', scrollbarDisabledClass: 'swiper-scrollbar-disabled', horizontalClass: 'swiper-scrollbar-horizontal', verticalClass: 'swiper-scrollbar-vertical' } }),
				(t.scrollbar = { el: null, dragEl: null }),
				i('init', () => {
					!1 === t.params.scrollbar.enabled ? P() : (M(), w(), v());
				}),
				i('update resize observerUpdate lock unlock', () => {
					w();
				}),
				i('setTranslate', () => {
					v();
				}),
				i('setTransition', (e, s) => {
					!(function (e) {
						t.params.scrollbar.el && t.scrollbar.el && (t.scrollbar.dragEl.style.transitionDuration = `${e}ms`);
					})(s);
				}),
				i('enable disable', () => {
					const { el: e } = t.scrollbar;
					e && e.classList[t.enabled ? 'remove' : 'add'](t.params.scrollbar.lockClass);
				}),
				i('destroy', () => {
					C();
				});
			const P = () => {
				t.el.classList.add(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.el && t.scrollbar.el.classList.add(t.params.scrollbar.scrollbarDisabledClass), C();
			};
			Object.assign(t.scrollbar, {
				enable: () => {
					t.el.classList.remove(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.el && t.scrollbar.el.classList.remove(t.params.scrollbar.scrollbarDisabledClass), M(), w(), v();
				},
				disable: P,
				updateSize: w,
				setTranslate: v,
				init: M,
				destroy: C
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ parallax: { enabled: !1 } });
			const i = '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]',
				r = (e, s) => {
					const { rtl: a } = t,
						i = a ? -1 : 1,
						r = e.getAttribute('data-swiper-parallax') || '0';
					let n = e.getAttribute('data-swiper-parallax-x'),
						l = e.getAttribute('data-swiper-parallax-y');
					const o = e.getAttribute('data-swiper-parallax-scale'),
						d = e.getAttribute('data-swiper-parallax-opacity'),
						c = e.getAttribute('data-swiper-parallax-rotate');
					if ((n || l ? ((n = n || '0'), (l = l || '0')) : t.isHorizontal() ? ((n = r), (l = '0')) : ((l = r), (n = '0')), (n = n.indexOf('%') >= 0 ? parseInt(n, 10) * s * i + '%' : n * s * i + 'px'), (l = l.indexOf('%') >= 0 ? parseInt(l, 10) * s + '%' : l * s + 'px'), null != d)) {
						const t = d - (d - 1) * (1 - Math.abs(s));
						e.style.opacity = t;
					}
					let p = `translate3d(${n}, ${l}, 0px)`;
					if (null != o) {
						p += ` scale(${o - (o - 1) * (1 - Math.abs(s))})`;
					}
					if (c && null != c) {
						p += ` rotate(${c * s * -1}deg)`;
					}
					e.style.transform = p;
				},
				n = () => {
					const { el: e, slides: s, progress: a, snapGrid: n, isElement: l } = t,
						o = h(e, i);
					t.isElement && o.push(...h(t.hostEl, i)),
						o.forEach((e) => {
							r(e, a);
						}),
						s.forEach((e, s) => {
							let l = e.progress;
							t.params.slidesPerGroup > 1 && 'auto' !== t.params.slidesPerView && (l += Math.ceil(s / 2) - a * (n.length - 1)),
								(l = Math.min(Math.max(l, -1), 1)),
								e.querySelectorAll(`${i}, [data-swiper-parallax-rotate]`).forEach((e) => {
									r(e, l);
								});
						});
				};
			a('beforeInit', () => {
				t.params.parallax.enabled && ((t.params.watchSlidesProgress = !0), (t.originalParams.watchSlidesProgress = !0));
			}),
				a('init', () => {
					t.params.parallax.enabled && n();
				}),
				a('setTranslate', () => {
					t.params.parallax.enabled && n();
				}),
				a('setTransition', (e, s) => {
					t.params.parallax.enabled &&
						(function (e) {
							void 0 === e && (e = t.params.speed);
							const { el: s, hostEl: a } = t,
								r = [...s.querySelectorAll(i)];
							t.isElement && r.push(...a.querySelectorAll(i)),
								r.forEach((t) => {
									let s = parseInt(t.getAttribute('data-swiper-parallax-duration'), 10) || e;
									0 === e && (s = 0), (t.style.transitionDuration = `${s}ms`);
								});
						})(s);
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a, emit: i } = e;
			const n = r();
			s({ zoom: { enabled: !1, maxRatio: 3, minRatio: 1, toggle: !0, containerClass: 'swiper-zoom-container', zoomedSlideClass: 'swiper-slide-zoomed' } }), (t.zoom = { enabled: !1 });
			let l,
				d,
				c = 1,
				p = !1;
			const u = [],
				m = { originX: 0, originY: 0, slideEl: void 0, slideWidth: void 0, slideHeight: void 0, imageEl: void 0, imageWrapEl: void 0, maxRatio: 3 },
				f = { isTouched: void 0, isMoved: void 0, currentX: void 0, currentY: void 0, minX: void 0, minY: void 0, maxX: void 0, maxY: void 0, width: void 0, height: void 0, startX: void 0, startY: void 0, touchesStart: {}, touchesCurrent: {} },
				v = { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 };
			let w = 1;
			function y() {
				if (u.length < 2) return 1;
				const e = u[0].pageX,
					t = u[0].pageY,
					s = u[1].pageX,
					a = u[1].pageY;
				return Math.sqrt((s - e) ** 2 + (a - t) ** 2);
			}
			function E(e) {
				const s = t.isElement ? 'swiper-slide' : `.${t.params.slideClass}`;
				return !!e.target.matches(s) || t.slides.filter((t) => t.contains(e.target)).length > 0;
			}
			function x(e) {
				if (('mouse' === e.pointerType && u.splice(0, u.length), !E(e))) return;
				const s = t.params.zoom;
				if (((l = !1), (d = !1), u.push(e), !(u.length < 2))) {
					if (((l = !0), (m.scaleStart = y()), !m.slideEl)) {
						(m.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`)), m.slideEl || (m.slideEl = t.slides[t.activeIndex]);
						let a = m.slideEl.querySelector(`.${s.containerClass}`);
						if ((a && (a = a.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0]), (m.imageEl = a), (m.imageWrapEl = a ? b(m.imageEl, `.${s.containerClass}`)[0] : void 0), !m.imageWrapEl)) return void (m.imageEl = void 0);
						m.maxRatio = m.imageWrapEl.getAttribute('data-swiper-zoom') || s.maxRatio;
					}
					if (m.imageEl) {
						const [e, t] = (function () {
							if (u.length < 2) return { x: null, y: null };
							const e = m.imageEl.getBoundingClientRect();
							return [(u[0].pageX + (u[1].pageX - u[0].pageX) / 2 - e.x - n.scrollX) / c, (u[0].pageY + (u[1].pageY - u[0].pageY) / 2 - e.y - n.scrollY) / c];
						})();
						(m.originX = e), (m.originY = t), (m.imageEl.style.transitionDuration = '0ms');
					}
					p = !0;
				}
			}
			function S(e) {
				if (!E(e)) return;
				const s = t.params.zoom,
					a = t.zoom,
					i = u.findIndex((t) => t.pointerId === e.pointerId);
				i >= 0 && (u[i] = e), u.length < 2 || ((d = !0), (m.scaleMove = y()), m.imageEl && ((a.scale = (m.scaleMove / m.scaleStart) * c), a.scale > m.maxRatio && (a.scale = m.maxRatio - 1 + (a.scale - m.maxRatio + 1) ** 0.5), a.scale < s.minRatio && (a.scale = s.minRatio + 1 - (s.minRatio - a.scale + 1) ** 0.5), (m.imageEl.style.transform = `translate3d(0,0,0) scale(${a.scale})`)));
			}
			function T(e) {
				if (!E(e)) return;
				if ('mouse' === e.pointerType && 'pointerout' === e.type) return;
				const s = t.params.zoom,
					a = t.zoom,
					i = u.findIndex((t) => t.pointerId === e.pointerId);
				i >= 0 && u.splice(i, 1),
					l &&
						d &&
						((l = !1),
						(d = !1),
						m.imageEl && ((a.scale = Math.max(Math.min(a.scale, m.maxRatio), s.minRatio)), (m.imageEl.style.transitionDuration = `${t.params.speed}ms`), (m.imageEl.style.transform = `translate3d(0,0,0) scale(${a.scale})`), (c = a.scale), (p = !1), a.scale > 1 && m.slideEl ? m.slideEl.classList.add(`${s.zoomedSlideClass}`) : a.scale <= 1 && m.slideEl && m.slideEl.classList.remove(`${s.zoomedSlideClass}`), 1 === a.scale && ((m.originX = 0), (m.originY = 0), (m.slideEl = void 0))));
			}
			function M(e) {
				if (
					!E(e) ||
					!(function (e) {
						const s = `.${t.params.zoom.containerClass}`;
						return !!e.target.matches(s) || [...t.hostEl.querySelectorAll(s)].filter((t) => t.contains(e.target)).length > 0;
					})(e)
				)
					return;
				const s = t.zoom;
				if (!m.imageEl) return;
				if (!f.isTouched || !m.slideEl) return;
				f.isMoved || ((f.width = m.imageEl.offsetWidth), (f.height = m.imageEl.offsetHeight), (f.startX = o(m.imageWrapEl, 'x') || 0), (f.startY = o(m.imageWrapEl, 'y') || 0), (m.slideWidth = m.slideEl.offsetWidth), (m.slideHeight = m.slideEl.offsetHeight), (m.imageWrapEl.style.transitionDuration = '0ms'));
				const a = f.width * s.scale,
					i = f.height * s.scale;
				if (a < m.slideWidth && i < m.slideHeight) return;
				(f.minX = Math.min(m.slideWidth / 2 - a / 2, 0)), (f.maxX = -f.minX), (f.minY = Math.min(m.slideHeight / 2 - i / 2, 0)), (f.maxY = -f.minY), (f.touchesCurrent.x = u.length > 0 ? u[0].pageX : e.pageX), (f.touchesCurrent.y = u.length > 0 ? u[0].pageY : e.pageY);
				if ((Math.max(Math.abs(f.touchesCurrent.x - f.touchesStart.x), Math.abs(f.touchesCurrent.y - f.touchesStart.y)) > 5 && (t.allowClick = !1), !f.isMoved && !p)) {
					if (t.isHorizontal() && ((Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x) || (Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x))) return void (f.isTouched = !1);
					if (!t.isHorizontal() && ((Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y) || (Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y))) return void (f.isTouched = !1);
				}
				e.cancelable && e.preventDefault(), e.stopPropagation(), (f.isMoved = !0);
				const r = (s.scale - c) / (m.maxRatio - t.params.zoom.minRatio),
					{ originX: n, originY: l } = m;
				(f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX + r * (f.width - 2 * n)),
					(f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY + r * (f.height - 2 * l)),
					f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** 0.8),
					f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** 0.8),
					f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** 0.8),
					f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** 0.8),
					v.prevPositionX || (v.prevPositionX = f.touchesCurrent.x),
					v.prevPositionY || (v.prevPositionY = f.touchesCurrent.y),
					v.prevTime || (v.prevTime = Date.now()),
					(v.x = (f.touchesCurrent.x - v.prevPositionX) / (Date.now() - v.prevTime) / 2),
					(v.y = (f.touchesCurrent.y - v.prevPositionY) / (Date.now() - v.prevTime) / 2),
					Math.abs(f.touchesCurrent.x - v.prevPositionX) < 2 && (v.x = 0),
					Math.abs(f.touchesCurrent.y - v.prevPositionY) < 2 && (v.y = 0),
					(v.prevPositionX = f.touchesCurrent.x),
					(v.prevPositionY = f.touchesCurrent.y),
					(v.prevTime = Date.now()),
					(m.imageWrapEl.style.transform = `translate3d(${f.currentX}px, ${f.currentY}px,0)`);
			}
			function C() {
				const e = t.zoom;
				m.slideEl && t.activeIndex !== t.slides.indexOf(m.slideEl) && (m.imageEl && (m.imageEl.style.transform = 'translate3d(0,0,0) scale(1)'), m.imageWrapEl && (m.imageWrapEl.style.transform = 'translate3d(0,0,0)'), m.slideEl.classList.remove(`${t.params.zoom.zoomedSlideClass}`), (e.scale = 1), (c = 1), (m.slideEl = void 0), (m.imageEl = void 0), (m.imageWrapEl = void 0), (m.originX = 0), (m.originY = 0));
			}
			function P(e) {
				const s = t.zoom,
					a = t.params.zoom;
				if (!m.slideEl) {
					e && e.target && (m.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`)), m.slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? (m.slideEl = h(t.slidesEl, `.${t.params.slideActiveClass}`)[0]) : (m.slideEl = t.slides[t.activeIndex]));
					let s = m.slideEl.querySelector(`.${a.containerClass}`);
					s && (s = s.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0]), (m.imageEl = s), (m.imageWrapEl = s ? b(m.imageEl, `.${a.containerClass}`)[0] : void 0);
				}
				if (!m.imageEl || !m.imageWrapEl) return;
				let i, r, l, o, d, p, u, v, w, y, E, x, S, T, M, C, P, L;
				t.params.cssMode && ((t.wrapperEl.style.overflow = 'hidden'), (t.wrapperEl.style.touchAction = 'none')), m.slideEl.classList.add(`${a.zoomedSlideClass}`), void 0 === f.touchesStart.x && e ? ((i = e.pageX), (r = e.pageY)) : ((i = f.touchesStart.x), (r = f.touchesStart.y));
				const z = 'number' == typeof e ? e : null;
				1 === c && z && ((i = void 0), (r = void 0)),
					(s.scale = z || m.imageWrapEl.getAttribute('data-swiper-zoom') || a.maxRatio),
					(c = z || m.imageWrapEl.getAttribute('data-swiper-zoom') || a.maxRatio),
					!e || (1 === c && z)
						? ((u = 0), (v = 0))
						: ((P = m.slideEl.offsetWidth), (L = m.slideEl.offsetHeight), (l = g(m.slideEl).left + n.scrollX), (o = g(m.slideEl).top + n.scrollY), (d = l + P / 2 - i), (p = o + L / 2 - r), (w = m.imageEl.offsetWidth), (y = m.imageEl.offsetHeight), (E = w * s.scale), (x = y * s.scale), (S = Math.min(P / 2 - E / 2, 0)), (T = Math.min(L / 2 - x / 2, 0)), (M = -S), (C = -T), (u = d * s.scale), (v = p * s.scale), u < S && (u = S), u > M && (u = M), v < T && (v = T), v > C && (v = C)),
					z && 1 === s.scale && ((m.originX = 0), (m.originY = 0)),
					(m.imageWrapEl.style.transitionDuration = '300ms'),
					(m.imageWrapEl.style.transform = `translate3d(${u}px, ${v}px,0)`),
					(m.imageEl.style.transitionDuration = '300ms'),
					(m.imageEl.style.transform = `translate3d(0,0,0) scale(${s.scale})`);
			}
			function L() {
				const e = t.zoom,
					s = t.params.zoom;
				if (!m.slideEl) {
					t.params.virtual && t.params.virtual.enabled && t.virtual ? (m.slideEl = h(t.slidesEl, `.${t.params.slideActiveClass}`)[0]) : (m.slideEl = t.slides[t.activeIndex]);
					let e = m.slideEl.querySelector(`.${s.containerClass}`);
					e && (e = e.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0]), (m.imageEl = e), (m.imageWrapEl = e ? b(m.imageEl, `.${s.containerClass}`)[0] : void 0);
				}
				m.imageEl && m.imageWrapEl && (t.params.cssMode && ((t.wrapperEl.style.overflow = ''), (t.wrapperEl.style.touchAction = '')), (e.scale = 1), (c = 1), (m.imageWrapEl.style.transitionDuration = '300ms'), (m.imageWrapEl.style.transform = 'translate3d(0,0,0)'), (m.imageEl.style.transitionDuration = '300ms'), (m.imageEl.style.transform = 'translate3d(0,0,0) scale(1)'), m.slideEl.classList.remove(`${s.zoomedSlideClass}`), (m.slideEl = void 0), (m.originX = 0), (m.originY = 0));
			}
			function z(e) {
				const s = t.zoom;
				s.scale && 1 !== s.scale ? L() : P(e);
			}
			function A() {
				return { passiveListener: !!t.params.passiveListeners && { passive: !0, capture: !1 }, activeListenerWithCapture: !t.params.passiveListeners || { passive: !1, capture: !0 } };
			}
			function $() {
				const e = t.zoom;
				if (e.enabled) return;
				e.enabled = !0;
				const { passiveListener: s, activeListenerWithCapture: a } = A();
				t.wrapperEl.addEventListener('pointerdown', x, s),
					t.wrapperEl.addEventListener('pointermove', S, a),
					['pointerup', 'pointercancel', 'pointerout'].forEach((e) => {
						t.wrapperEl.addEventListener(e, T, s);
					}),
					t.wrapperEl.addEventListener('pointermove', M, a);
			}
			function I() {
				const e = t.zoom;
				if (!e.enabled) return;
				e.enabled = !1;
				const { passiveListener: s, activeListenerWithCapture: a } = A();
				t.wrapperEl.removeEventListener('pointerdown', x, s),
					t.wrapperEl.removeEventListener('pointermove', S, a),
					['pointerup', 'pointercancel', 'pointerout'].forEach((e) => {
						t.wrapperEl.removeEventListener(e, T, s);
					}),
					t.wrapperEl.removeEventListener('pointermove', M, a);
			}
			Object.defineProperty(t.zoom, 'scale', {
				get: () => w,
				set(e) {
					if (w !== e) {
						const t = m.imageEl,
							s = m.slideEl;
						i('zoomChange', e, t, s);
					}
					w = e;
				}
			}),
				a('init', () => {
					t.params.zoom.enabled && $();
				}),
				a('destroy', () => {
					I();
				}),
				a('touchStart', (e, s) => {
					t.zoom.enabled &&
						(function (e) {
							const s = t.device;
							if (!m.imageEl) return;
							if (f.isTouched) return;
							s.android && e.cancelable && e.preventDefault(), (f.isTouched = !0);
							const a = u.length > 0 ? u[0] : e;
							(f.touchesStart.x = a.pageX), (f.touchesStart.y = a.pageY);
						})(s);
				}),
				a('touchEnd', (e, s) => {
					t.zoom.enabled &&
						(function () {
							const e = t.zoom;
							if (!m.imageEl) return;
							if (!f.isTouched || !f.isMoved) return (f.isTouched = !1), void (f.isMoved = !1);
							(f.isTouched = !1), (f.isMoved = !1);
							let s = 300,
								a = 300;
							const i = v.x * s,
								r = f.currentX + i,
								n = v.y * a,
								l = f.currentY + n;
							0 !== v.x && (s = Math.abs((r - f.currentX) / v.x)), 0 !== v.y && (a = Math.abs((l - f.currentY) / v.y));
							const o = Math.max(s, a);
							(f.currentX = r), (f.currentY = l);
							const d = f.width * e.scale,
								c = f.height * e.scale;
							(f.minX = Math.min(m.slideWidth / 2 - d / 2, 0)), (f.maxX = -f.minX), (f.minY = Math.min(m.slideHeight / 2 - c / 2, 0)), (f.maxY = -f.minY), (f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX)), (f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY)), (m.imageWrapEl.style.transitionDuration = `${o}ms`), (m.imageWrapEl.style.transform = `translate3d(${f.currentX}px, ${f.currentY}px,0)`);
						})();
				}),
				a('doubleTap', (e, s) => {
					!t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && z(s);
				}),
				a('transitionEnd', () => {
					t.zoom.enabled && t.params.zoom.enabled && C();
				}),
				a('slideChange', () => {
					t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && C();
				}),
				Object.assign(t.zoom, { enable: $, disable: I, in: P, out: L, toggle: z });
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			function i(e, t) {
				const s = (function () {
					let e, t, s;
					return (a, i) => {
						for (t = -1, e = a.length; e - t > 1; ) (s = (e + t) >> 1), a[s] <= i ? (t = s) : (e = s);
						return e;
					};
				})();
				let a, i;
				return (
					(this.x = e),
					(this.y = t),
					(this.lastIndex = e.length - 1),
					(this.interpolate = function (e) {
						return e ? ((i = s(this.x, e)), (a = i - 1), ((e - this.x[a]) * (this.y[i] - this.y[a])) / (this.x[i] - this.x[a]) + this.y[a]) : 0;
					}),
					this
				);
			}
			function r() {
				t.controller.control && t.controller.spline && ((t.controller.spline = void 0), delete t.controller.spline);
			}
			s({ controller: { control: void 0, inverse: !1, by: 'slide' } }),
				(t.controller = { control: void 0 }),
				a('beforeInit', () => {
					if ('undefined' != typeof window && ('string' == typeof t.params.controller.control || t.params.controller.control instanceof HTMLElement)) {
						const e = document.querySelector(t.params.controller.control);
						if (e && e.swiper) t.controller.control = e.swiper;
						else if (e) {
							const s = (a) => {
								(t.controller.control = a.detail[0]), t.update(), e.removeEventListener('init', s);
							};
							e.addEventListener('init', s);
						}
					} else t.controller.control = t.params.controller.control;
				}),
				a('update', () => {
					r();
				}),
				a('resize', () => {
					r();
				}),
				a('observerUpdate', () => {
					r();
				}),
				a('setTranslate', (e, s, a) => {
					t.controller.control && !t.controller.control.destroyed && t.controller.setTranslate(s, a);
				}),
				a('setTransition', (e, s, a) => {
					t.controller.control && !t.controller.control.destroyed && t.controller.setTransition(s, a);
				}),
				Object.assign(t.controller, {
					setTranslate: function (e, s) {
						const a = t.controller.control;
						let r, n;
						const l = t.constructor;
						function o(e) {
							if (e.destroyed) return;
							const s = t.rtlTranslate ? -t.translate : t.translate;
							'slide' === t.params.controller.by &&
								(!(function (e) {
									t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid);
								})(e),
								(n = -t.controller.spline.interpolate(-s))),
								(n && 'container' !== t.params.controller.by) || ((r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate())), (!Number.isNaN(r) && Number.isFinite(r)) || (r = 1), (n = (s - t.minTranslate()) * r + e.minTranslate())),
								t.params.controller.inverse && (n = e.maxTranslate() - n),
								e.updateProgress(n),
								e.setTranslate(n, t),
								e.updateActiveIndex(),
								e.updateSlidesClasses();
						}
						if (Array.isArray(a)) for (let e = 0; e < a.length; e += 1) a[e] !== s && a[e] instanceof l && o(a[e]);
						else a instanceof l && s !== a && o(a);
					},
					setTransition: function (e, s) {
						const a = t.constructor,
							i = t.controller.control;
						let r;
						function l(s) {
							s.destroyed ||
								(s.setTransition(e, t),
								0 !== e &&
									(s.transitionStart(),
									s.params.autoHeight &&
										n(() => {
											s.updateAutoHeight();
										}),
									y(s.wrapperEl, () => {
										i && s.transitionEnd();
									})));
						}
						if (Array.isArray(i)) for (r = 0; r < i.length; r += 1) i[r] !== s && i[r] instanceof a && l(i[r]);
						else i instanceof a && s !== i && l(i);
					}
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ a11y: { enabled: !0, notificationClass: 'swiper-notification', prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide', firstSlideMessage: 'This is the first slide', lastSlideMessage: 'This is the last slide', paginationBulletMessage: 'Go to slide {{index}}', slideLabelMessage: '{{index}} / {{slidesLength}}', containerMessage: null, containerRoleDescriptionMessage: null, itemRoleDescriptionMessage: null, slideRole: 'group', id: null } }), (t.a11y = { clicked: !1 });
			let i = null;
			function r(e) {
				const t = i;
				0 !== t.length && ((t.innerHTML = ''), (t.innerHTML = e));
			}
			const n = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
			function l(e) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('tabIndex', '0');
				});
			}
			function o(e) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('tabIndex', '-1');
				});
			}
			function d(e, t) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('role', t);
				});
			}
			function c(e, t) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('aria-roledescription', t);
				});
			}
			function p(e, t) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('aria-label', t);
				});
			}
			function u(e) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('aria-disabled', !0);
				});
			}
			function m(e) {
				(e = n(e)).forEach((e) => {
					e.setAttribute('aria-disabled', !1);
				});
			}
			function h(e) {
				if (13 !== e.keyCode && 32 !== e.keyCode) return;
				const s = t.params.a11y,
					a = e.target;
				(t.pagination && t.pagination.el && (a === t.pagination.el || t.pagination.el.contains(e.target)) && !e.target.matches(ee(t.params.pagination.bulletClass))) ||
					(t.navigation && t.navigation.nextEl && a === t.navigation.nextEl && ((t.isEnd && !t.params.loop) || t.slideNext(), t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)), t.navigation && t.navigation.prevEl && a === t.navigation.prevEl && ((t.isBeginning && !t.params.loop) || t.slidePrev(), t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)), t.pagination && a.matches(ee(t.params.pagination.bulletClass)) && a.click());
			}
			function g() {
				return t.pagination && t.pagination.bullets && t.pagination.bullets.length;
			}
			function v() {
				return g() && t.params.pagination.clickable;
			}
			const b = (e, t, s) => {
					l(e),
						'BUTTON' !== e.tagName && (d(e, 'button'), e.addEventListener('keydown', h)),
						p(e, s),
						(function (e, t) {
							(e = n(e)).forEach((e) => {
								e.setAttribute('aria-controls', t);
							});
						})(e, t);
				},
				y = () => {
					t.a11y.clicked = !0;
				},
				E = () => {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							t.destroyed || (t.a11y.clicked = !1);
						});
					});
				},
				x = (e) => {
					if (t.a11y.clicked) return;
					const s = e.target.closest(`.${t.params.slideClass}, swiper-slide`);
					if (!s || !t.slides.includes(s)) return;
					const a = t.slides.indexOf(s) === t.activeIndex,
						i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
					a || i || (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) || (t.isHorizontal() ? (t.el.scrollLeft = 0) : (t.el.scrollTop = 0), t.slideTo(t.slides.indexOf(s), 0));
				},
				S = () => {
					const e = t.params.a11y;
					e.itemRoleDescriptionMessage && c(t.slides, e.itemRoleDescriptionMessage), e.slideRole && d(t.slides, e.slideRole);
					const s = t.slides.length;
					e.slideLabelMessage &&
						t.slides.forEach((a, i) => {
							const r = t.params.loop ? parseInt(a.getAttribute('data-swiper-slide-index'), 10) : i;
							p(a, e.slideLabelMessage.replace(/\{\{index\}\}/, r + 1).replace(/\{\{slidesLength\}\}/, s));
						});
				},
				T = () => {
					const e = t.params.a11y;
					t.el.append(i);
					const s = t.el;
					e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage), e.containerMessage && p(s, e.containerMessage);
					const a = t.wrapperEl,
						r = e.id || a.getAttribute('id') || `swiper-wrapper-${((l = 16), void 0 === l && (l = 16), 'x'.repeat(l).replace(/x/g, () => Math.round(16 * Math.random()).toString(16)))}`;
					var l;
					const o = t.params.autoplay && t.params.autoplay.enabled ? 'off' : 'polite';
					var d;
					(d = r),
						n(a).forEach((e) => {
							e.setAttribute('id', d);
						}),
						(function (e, t) {
							(e = n(e)).forEach((e) => {
								e.setAttribute('aria-live', t);
							});
						})(a, o),
						S();
					let { nextEl: u, prevEl: m } = t.navigation ? t.navigation : {};
					if (((u = n(u)), (m = n(m)), u && u.forEach((t) => b(t, r, e.nextSlideMessage)), m && m.forEach((t) => b(t, r, e.prevSlideMessage)), v())) {
						(Array.isArray(t.pagination.el) ? t.pagination.el : [t.pagination.el]).forEach((e) => {
							e.addEventListener('keydown', h);
						});
					}
					t.el.addEventListener('focus', x, !0), t.el.addEventListener('pointerdown', y, !0), t.el.addEventListener('pointerup', E, !0);
				};
			a('beforeInit', () => {
				(i = f('span', t.params.a11y.notificationClass)), i.setAttribute('aria-live', 'assertive'), i.setAttribute('aria-atomic', 'true');
			}),
				a('afterInit', () => {
					t.params.a11y.enabled && T();
				}),
				a('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
					t.params.a11y.enabled && S();
				}),
				a('fromEdge toEdge afterInit lock unlock', () => {
					t.params.a11y.enabled &&
						(function () {
							if (t.params.loop || t.params.rewind || !t.navigation) return;
							const { nextEl: e, prevEl: s } = t.navigation;
							s && (t.isBeginning ? (u(s), o(s)) : (m(s), l(s))), e && (t.isEnd ? (u(e), o(e)) : (m(e), l(e)));
						})();
				}),
				a('paginationUpdate', () => {
					t.params.a11y.enabled &&
						(function () {
							const e = t.params.a11y;
							g() &&
								t.pagination.bullets.forEach((s) => {
									t.params.pagination.clickable && (l(s), t.params.pagination.renderBullet || (d(s, 'button'), p(s, e.paginationBulletMessage.replace(/\{\{index\}\}/, w(s) + 1)))), s.matches(ee(t.params.pagination.bulletActiveClass)) ? s.setAttribute('aria-current', 'true') : s.removeAttribute('aria-current');
								});
						})();
				}),
				a('destroy', () => {
					t.params.a11y.enabled &&
						(function () {
							i && i.remove();
							let { nextEl: e, prevEl: s } = t.navigation ? t.navigation : {};
							(e = n(e)),
								(s = n(s)),
								e && e.forEach((e) => e.removeEventListener('keydown', h)),
								s && s.forEach((e) => e.removeEventListener('keydown', h)),
								v() &&
									(Array.isArray(t.pagination.el) ? t.pagination.el : [t.pagination.el]).forEach((e) => {
										e.removeEventListener('keydown', h);
									});
							t.el.removeEventListener('focus', x, !0), t.el.removeEventListener('pointerdown', y, !0), t.el.removeEventListener('pointerup', E, !0);
						})();
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ history: { enabled: !1, root: '', replaceState: !1, key: 'slides', keepQuery: !1 } });
			let i = !1,
				n = {};
			const l = (e) =>
					e
						.toString()
						.replace(/\s+/g, '-')
						.replace(/[^\w-]+/g, '')
						.replace(/--+/g, '-')
						.replace(/^-+/, '')
						.replace(/-+$/, ''),
				o = (e) => {
					const t = r();
					let s;
					s = e ? new URL(e) : t.location;
					const a = s.pathname
							.slice(1)
							.split('/')
							.filter((e) => '' !== e),
						i = a.length;
					return { key: a[i - 2], value: a[i - 1] };
				},
				d = (e, s) => {
					const a = r();
					if (!i || !t.params.history.enabled) return;
					let n;
					n = t.params.url ? new URL(t.params.url) : a.location;
					const o = t.slides[s];
					let d = l(o.getAttribute('data-history'));
					if (t.params.history.root.length > 0) {
						let s = t.params.history.root;
						'/' === s[s.length - 1] && (s = s.slice(0, s.length - 1)), (d = `${s}/${e ? `${e}/` : ''}${d}`);
					} else n.pathname.includes(e) || (d = `${e ? `${e}/` : ''}${d}`);
					t.params.history.keepQuery && (d += n.search);
					const c = a.history.state;
					(c && c.value === d) || (t.params.history.replaceState ? a.history.replaceState({ value: d }, null, d) : a.history.pushState({ value: d }, null, d));
				},
				c = (e, s, a) => {
					if (s)
						for (let i = 0, r = t.slides.length; i < r; i += 1) {
							const r = t.slides[i];
							if (l(r.getAttribute('data-history')) === s) {
								const s = t.getSlideIndex(r);
								t.slideTo(s, e, a);
							}
						}
					else t.slideTo(0, e, a);
				},
				p = () => {
					(n = o(t.params.url)), c(t.params.speed, n.value, !1);
				};
			a('init', () => {
				t.params.history.enabled &&
					(() => {
						const e = r();
						if (t.params.history) {
							if (!e.history || !e.history.pushState) return (t.params.history.enabled = !1), void (t.params.hashNavigation.enabled = !0);
							(i = !0), (n = o(t.params.url)), n.key || n.value ? (c(0, n.value, t.params.runCallbacksOnInit), t.params.history.replaceState || e.addEventListener('popstate', p)) : t.params.history.replaceState || e.addEventListener('popstate', p);
						}
					})();
			}),
				a('destroy', () => {
					t.params.history.enabled &&
						(() => {
							const e = r();
							t.params.history.replaceState || e.removeEventListener('popstate', p);
						})();
				}),
				a('transitionEnd _freeModeNoMomentumRelease', () => {
					i && d(t.params.history.key, t.activeIndex);
				}),
				a('slideChange', () => {
					i && t.params.cssMode && d(t.params.history.key, t.activeIndex);
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, emit: i, on: n } = e,
				l = !1;
			const o = a(),
				d = r();
			s({
				hashNavigation: {
					enabled: !1,
					replaceState: !1,
					watchState: !1,
					getSlideIndex(e, s) {
						if (t.virtual && t.params.virtual.enabled) {
							const e = t.slides.filter((e) => e.getAttribute('data-hash') === s)[0];
							if (!e) return 0;
							return parseInt(e.getAttribute('data-swiper-slide-index'), 10);
						}
						return t.getSlideIndex(h(t.slidesEl, `.${t.params.slideClass}[data-hash="${s}"], swiper-slide[data-hash="${s}"]`)[0]);
					}
				}
			});
			const c = () => {
					i('hashChange');
					const e = o.location.hash.replace('#', ''),
						s = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex];
					if (e !== (s ? s.getAttribute('data-hash') : '')) {
						const s = t.params.hashNavigation.getSlideIndex(t, e);
						if (void 0 === s || Number.isNaN(s)) return;
						t.slideTo(s);
					}
				},
				p = () => {
					if (!l || !t.params.hashNavigation.enabled) return;
					const e = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex],
						s = e ? e.getAttribute('data-hash') || e.getAttribute('data-history') : '';
					t.params.hashNavigation.replaceState && d.history && d.history.replaceState ? (d.history.replaceState(null, null, `#${s}` || ''), i('hashSet')) : ((o.location.hash = s || ''), i('hashSet'));
				};
			n('init', () => {
				t.params.hashNavigation.enabled &&
					(() => {
						if (!t.params.hashNavigation.enabled || (t.params.history && t.params.history.enabled)) return;
						l = !0;
						const e = o.location.hash.replace('#', '');
						if (e) {
							const s = 0,
								a = t.params.hashNavigation.getSlideIndex(t, e);
							t.slideTo(a || 0, s, t.params.runCallbacksOnInit, !0);
						}
						t.params.hashNavigation.watchState && d.addEventListener('hashchange', c);
					})();
			}),
				n('destroy', () => {
					t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d.removeEventListener('hashchange', c);
				}),
				n('transitionEnd _freeModeNoMomentumRelease', () => {
					l && p();
				}),
				n('slideChange', () => {
					l && t.params.cssMode && p();
				});
		},
		function (e) {
			let t,
				s,
				{ swiper: i, extendParams: r, on: n, emit: l, params: o } = e;
			(i.autoplay = { running: !1, paused: !1, timeLeft: 0 }), r({ autoplay: { enabled: !1, delay: 3e3, waitForTransition: !0, disableOnInteraction: !0, stopOnLastSlide: !1, reverseDirection: !1, pauseOnMouseEnter: !1 } });
			let d,
				c,
				p,
				u,
				m,
				h,
				f,
				g = o && o.autoplay ? o.autoplay.delay : 3e3,
				v = o && o.autoplay ? o.autoplay.delay : 3e3,
				w = new Date().getTime;
			function b(e) {
				i && !i.destroyed && i.wrapperEl && e.target === i.wrapperEl && (i.wrapperEl.removeEventListener('transitionend', b), M());
			}
			const y = () => {
					if (i.destroyed || !i.autoplay.running) return;
					i.autoplay.paused ? (c = !0) : c && ((v = d), (c = !1));
					const e = i.autoplay.paused ? d : w + v - new Date().getTime();
					(i.autoplay.timeLeft = e),
						l('autoplayTimeLeft', e, e / g),
						(s = requestAnimationFrame(() => {
							y();
						}));
				},
				E = (e) => {
					if (i.destroyed || !i.autoplay.running) return;
					cancelAnimationFrame(s), y();
					let a = void 0 === e ? i.params.autoplay.delay : e;
					(g = i.params.autoplay.delay), (v = i.params.autoplay.delay);
					const r = (() => {
						let e;
						if (((e = i.virtual && i.params.virtual.enabled ? i.slides.filter((e) => e.classList.contains('swiper-slide-active'))[0] : i.slides[i.activeIndex]), !e)) return;
						return parseInt(e.getAttribute('data-swiper-autoplay'), 10);
					})();
					!Number.isNaN(r) && r > 0 && void 0 === e && ((a = r), (g = r), (v = r)), (d = a);
					const n = i.params.speed,
						o = () => {
							i &&
								!i.destroyed &&
								(i.params.autoplay.reverseDirection ? (!i.isBeginning || i.params.loop || i.params.rewind ? (i.slidePrev(n, !0, !0), l('autoplay')) : i.params.autoplay.stopOnLastSlide || (i.slideTo(i.slides.length - 1, n, !0, !0), l('autoplay'))) : !i.isEnd || i.params.loop || i.params.rewind ? (i.slideNext(n, !0, !0), l('autoplay')) : i.params.autoplay.stopOnLastSlide || (i.slideTo(0, n, !0, !0), l('autoplay')),
								i.params.cssMode &&
									((w = new Date().getTime()),
									requestAnimationFrame(() => {
										E();
									})));
						};
					return (
						a > 0
							? (clearTimeout(t),
							  (t = setTimeout(() => {
									o();
							  }, a)))
							: requestAnimationFrame(() => {
									o();
							  }),
						a
					);
				},
				x = () => {
					(i.autoplay.running = !0), E(), l('autoplayStart');
				},
				S = () => {
					(i.autoplay.running = !1), clearTimeout(t), cancelAnimationFrame(s), l('autoplayStop');
				},
				T = (e, s) => {
					if (i.destroyed || !i.autoplay.running) return;
					clearTimeout(t), e || (f = !0);
					const a = () => {
						l('autoplayPause'), i.params.autoplay.waitForTransition ? i.wrapperEl.addEventListener('transitionend', b) : M();
					};
					if (((i.autoplay.paused = !0), s)) return h && (d = i.params.autoplay.delay), (h = !1), void a();
					const r = d || i.params.autoplay.delay;
					(d = r - (new Date().getTime() - w)), (i.isEnd && d < 0 && !i.params.loop) || (d < 0 && (d = 0), a());
				},
				M = () => {
					(i.isEnd && d < 0 && !i.params.loop) || i.destroyed || !i.autoplay.running || ((w = new Date().getTime()), f ? ((f = !1), E(d)) : E(), (i.autoplay.paused = !1), l('autoplayResume'));
				},
				C = () => {
					if (i.destroyed || !i.autoplay.running) return;
					const e = a();
					'hidden' === e.visibilityState && ((f = !0), T(!0)), 'visible' === e.visibilityState && M();
				},
				P = (e) => {
					'mouse' === e.pointerType && ((f = !0), i.animating || i.autoplay.paused || T(!0));
				},
				L = (e) => {
					'mouse' === e.pointerType && i.autoplay.paused && M();
				};
			n('init', () => {
				i.params.autoplay.enabled && (i.params.autoplay.pauseOnMouseEnter && (i.el.addEventListener('pointerenter', P), i.el.addEventListener('pointerleave', L)), a().addEventListener('visibilitychange', C), (w = new Date().getTime()), x());
			}),
				n('destroy', () => {
					i.el.removeEventListener('pointerenter', P), i.el.removeEventListener('pointerleave', L), a().removeEventListener('visibilitychange', C), i.autoplay.running && S();
				}),
				n('beforeTransitionStart', (e, t, s) => {
					!i.destroyed && i.autoplay.running && (s || !i.params.autoplay.disableOnInteraction ? T(!0, !0) : S());
				}),
				n('sliderFirstMove', () => {
					!i.destroyed &&
						i.autoplay.running &&
						(i.params.autoplay.disableOnInteraction
							? S()
							: ((p = !0),
							  (u = !1),
							  (f = !1),
							  (m = setTimeout(() => {
									(f = !0), (u = !0), T(!0);
							  }, 200))));
				}),
				n('touchEnd', () => {
					if (!i.destroyed && i.autoplay.running && p) {
						if ((clearTimeout(m), clearTimeout(t), i.params.autoplay.disableOnInteraction)) return (u = !1), void (p = !1);
						u && i.params.cssMode && M(), (u = !1), (p = !1);
					}
				}),
				n('slideChange', () => {
					!i.destroyed && i.autoplay.running && (h = !0);
				}),
				Object.assign(i.autoplay, { start: x, stop: S, pause: T, resume: M });
		},
		function (e) {
			let { swiper: t, extendParams: s, on: i } = e;
			s({ thumbs: { swiper: null, multipleActiveThumbs: !0, autoScrollOffset: 0, slideThumbActiveClass: 'swiper-slide-thumb-active', thumbsContainerClass: 'swiper-thumbs' } });
			let r = !1,
				n = !1;
			function l() {
				const e = t.thumbs.swiper;
				if (!e || e.destroyed) return;
				const s = e.clickedIndex,
					a = e.clickedSlide;
				if (a && a.classList.contains(t.params.thumbs.slideThumbActiveClass)) return;
				if (null == s) return;
				let i;
				(i = e.params.loop ? parseInt(e.clickedSlide.getAttribute('data-swiper-slide-index'), 10) : s), t.params.loop ? t.slideToLoop(i) : t.slideTo(i);
			}
			function o() {
				const { thumbs: e } = t.params;
				if (r) return !1;
				r = !0;
				const s = t.constructor;
				if (e.swiper instanceof s) (t.thumbs.swiper = e.swiper), Object.assign(t.thumbs.swiper.originalParams, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), Object.assign(t.thumbs.swiper.params, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), t.thumbs.swiper.update();
				else if (d(e.swiper)) {
					const a = Object.assign({}, e.swiper);
					Object.assign(a, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), (t.thumbs.swiper = new s(a)), (n = !0);
				}
				return t.thumbs.swiper.el.classList.add(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on('tap', l), !0;
			}
			function c(e) {
				const s = t.thumbs.swiper;
				if (!s || s.destroyed) return;
				const a = 'auto' === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView;
				let i = 1;
				const r = t.params.thumbs.slideThumbActiveClass;
				if ((t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView), t.params.thumbs.multipleActiveThumbs || (i = 1), (i = Math.floor(i)), s.slides.forEach((e) => e.classList.remove(r)), s.params.loop || (s.params.virtual && s.params.virtual.enabled)))
					for (let e = 0; e < i; e += 1)
						h(s.slidesEl, `[data-swiper-slide-index="${t.realIndex + e}"]`).forEach((e) => {
							e.classList.add(r);
						});
				else for (let e = 0; e < i; e += 1) s.slides[t.realIndex + e] && s.slides[t.realIndex + e].classList.add(r);
				const n = t.params.thumbs.autoScrollOffset,
					l = n && !s.params.loop;
				if (t.realIndex !== s.realIndex || l) {
					const i = s.activeIndex;
					let r, o;
					if (s.params.loop) {
						const e = s.slides.filter((e) => e.getAttribute('data-swiper-slide-index') === `${t.realIndex}`)[0];
						(r = s.slides.indexOf(e)), (o = t.activeIndex > t.previousIndex ? 'next' : 'prev');
					} else (r = t.realIndex), (o = r > t.previousIndex ? 'next' : 'prev');
					l && (r += 'next' === o ? n : -1 * n), s.visibleSlidesIndexes && s.visibleSlidesIndexes.indexOf(r) < 0 && (s.params.centeredSlides ? (r = r > i ? r - Math.floor(a / 2) + 1 : r + Math.floor(a / 2) - 1) : r > i && s.params.slidesPerGroup, s.slideTo(r, e ? 0 : void 0));
				}
			}
			(t.thumbs = { swiper: null }),
				i('beforeInit', () => {
					const { thumbs: e } = t.params;
					if (e && e.swiper)
						if ('string' == typeof e.swiper || e.swiper instanceof HTMLElement) {
							const s = a(),
								i = () => {
									const a = 'string' == typeof e.swiper ? s.querySelector(e.swiper) : e.swiper;
									if (a && a.swiper) (e.swiper = a.swiper), o(), c(!0);
									else if (a) {
										const s = (i) => {
											(e.swiper = i.detail[0]), a.removeEventListener('init', s), o(), c(!0), e.swiper.update(), t.update();
										};
										a.addEventListener('init', s);
									}
									return a;
								},
								r = () => {
									if (t.destroyed) return;
									i() || requestAnimationFrame(r);
								};
							requestAnimationFrame(r);
						} else o(), c(!0);
				}),
				i('slideChange update resize observerUpdate', () => {
					c();
				}),
				i('setTransition', (e, s) => {
					const a = t.thumbs.swiper;
					a && !a.destroyed && a.setTransition(s);
				}),
				i('beforeDestroy', () => {
					const e = t.thumbs.swiper;
					e && !e.destroyed && n && e.destroy();
				}),
				Object.assign(t.thumbs, { init: o, update: c });
		},
		function (e) {
			let { swiper: t, extendParams: s, emit: a, once: i } = e;
			s({ freeMode: { enabled: !1, momentum: !0, momentumRatio: 1, momentumBounce: !0, momentumBounceRatio: 1, momentumVelocityRatio: 1, sticky: !1, minimumVelocity: 0.02 } }),
				Object.assign(t, {
					freeMode: {
						onTouchStart: function () {
							if (t.params.cssMode) return;
							const e = t.getTranslate();
							t.setTranslate(e), t.setTransition(0), (t.touchEventsData.velocities.length = 0), t.freeMode.onTouchEnd({ currentPos: t.rtl ? t.translate : -t.translate });
						},
						onTouchMove: function () {
							if (t.params.cssMode) return;
							const { touchEventsData: e, touches: s } = t;
							0 === e.velocities.length && e.velocities.push({ position: s[t.isHorizontal() ? 'startX' : 'startY'], time: e.touchStartTime }), e.velocities.push({ position: s[t.isHorizontal() ? 'currentX' : 'currentY'], time: l() });
						},
						onTouchEnd: function (e) {
							let { currentPos: s } = e;
							if (t.params.cssMode) return;
							const { params: r, wrapperEl: n, rtlTranslate: o, snapGrid: d, touchEventsData: c } = t,
								p = l() - c.touchStartTime;
							if (s < -t.minTranslate()) t.slideTo(t.activeIndex);
							else if (s > -t.maxTranslate()) t.slides.length < d.length ? t.slideTo(d.length - 1) : t.slideTo(t.slides.length - 1);
							else {
								if (r.freeMode.momentum) {
									if (c.velocities.length > 1) {
										const e = c.velocities.pop(),
											s = c.velocities.pop(),
											a = e.position - s.position,
											i = e.time - s.time;
										(t.velocity = a / i), (t.velocity /= 2), Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0), (i > 150 || l() - e.time > 300) && (t.velocity = 0);
									} else t.velocity = 0;
									(t.velocity *= r.freeMode.momentumVelocityRatio), (c.velocities.length = 0);
									let e = 1e3 * r.freeMode.momentumRatio;
									const s = t.velocity * e;
									let p = t.translate + s;
									o && (p = -p);
									let u,
										m = !1;
									const h = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
									let f;
									if (p < t.maxTranslate()) r.freeMode.momentumBounce ? (p + t.maxTranslate() < -h && (p = t.maxTranslate() - h), (u = t.maxTranslate()), (m = !0), (c.allowMomentumBounce = !0)) : (p = t.maxTranslate()), r.loop && r.centeredSlides && (f = !0);
									else if (p > t.minTranslate()) r.freeMode.momentumBounce ? (p - t.minTranslate() > h && (p = t.minTranslate() + h), (u = t.minTranslate()), (m = !0), (c.allowMomentumBounce = !0)) : (p = t.minTranslate()), r.loop && r.centeredSlides && (f = !0);
									else if (r.freeMode.sticky) {
										let e;
										for (let t = 0; t < d.length; t += 1)
											if (d[t] > -p) {
												e = t;
												break;
											}
										(p = Math.abs(d[e] - p) < Math.abs(d[e - 1] - p) || 'next' === t.swipeDirection ? d[e] : d[e - 1]), (p = -p);
									}
									if (
										(f &&
											i('transitionEnd', () => {
												t.loopFix();
											}),
										0 !== t.velocity)
									) {
										if (((e = o ? Math.abs((-p - t.translate) / t.velocity) : Math.abs((p - t.translate) / t.velocity)), r.freeMode.sticky)) {
											const s = Math.abs((o ? -p : p) - t.translate),
												a = t.slidesSizesGrid[t.activeIndex];
											e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed;
										}
									} else if (r.freeMode.sticky) return void t.slideToClosest();
									r.freeMode.momentumBounce && m
										? (t.updateProgress(u),
										  t.setTransition(e),
										  t.setTranslate(p),
										  t.transitionStart(!0, t.swipeDirection),
										  (t.animating = !0),
										  y(n, () => {
												t &&
													!t.destroyed &&
													c.allowMomentumBounce &&
													(a('momentumBounce'),
													t.setTransition(r.speed),
													setTimeout(() => {
														t.setTranslate(u),
															y(n, () => {
																t && !t.destroyed && t.transitionEnd();
															});
													}, 0));
										  }))
										: t.velocity
										? (a('_freeModeNoMomentumRelease'),
										  t.updateProgress(p),
										  t.setTransition(e),
										  t.setTranslate(p),
										  t.transitionStart(!0, t.swipeDirection),
										  t.animating ||
												((t.animating = !0),
												y(n, () => {
													t && !t.destroyed && t.transitionEnd();
												})))
										: t.updateProgress(p),
										t.updateActiveIndex(),
										t.updateSlidesClasses();
								} else {
									if (r.freeMode.sticky) return void t.slideToClosest();
									r.freeMode && a('_freeModeNoMomentumRelease');
								}
								(!r.freeMode.momentum || p >= r.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses());
							}
						}
					}
				});
		},
		function (e) {
			let t,
				s,
				a,
				i,
				{ swiper: r, extendParams: n, on: l } = e;
			n({ grid: { rows: 1, fill: 'column' } });
			const o = () => {
				let e = r.params.spaceBetween;
				return 'string' == typeof e && e.indexOf('%') >= 0 ? (e = (parseFloat(e.replace('%', '')) / 100) * r.size) : 'string' == typeof e && (e = parseFloat(e)), e;
			};
			l('init', () => {
				i = r.params.grid && r.params.grid.rows > 1;
			}),
				l('update', () => {
					const { params: e, el: t } = r,
						s = e.grid && e.grid.rows > 1;
					i && !s ? (t.classList.remove(`${e.containerModifierClass}grid`, `${e.containerModifierClass}grid-column`), (a = 1), r.emitContainerClasses()) : !i && s && (t.classList.add(`${e.containerModifierClass}grid`), 'column' === e.grid.fill && t.classList.add(`${e.containerModifierClass}grid-column`), r.emitContainerClasses()), (i = s);
				}),
				(r.grid = {
					initSlides: (e) => {
						const { slidesPerView: i } = r.params,
							{ rows: n, fill: l } = r.params.grid;
						(a = Math.floor(e / n)), (t = Math.floor(e / n) === e / n ? e : Math.ceil(e / n) * n), 'auto' !== i && 'row' === l && (t = Math.max(t, i * n)), (s = t / n);
					},
					updateSlide: (e, i, n, l) => {
						const { slidesPerGroup: d } = r.params,
							c = o(),
							{ rows: p, fill: u } = r.params.grid;
						let m, h, f;
						if ('row' === u && d > 1) {
							const s = Math.floor(e / (d * p)),
								a = e - p * d * s,
								r = 0 === s ? d : Math.min(Math.ceil((n - s * p * d) / p), d);
							(f = Math.floor(a / r)), (h = a - f * r + s * d), (m = h + (f * t) / p), (i.style.order = m);
						} else 'column' === u ? ((h = Math.floor(e / p)), (f = e - h * p), (h > a || (h === a && f === p - 1)) && ((f += 1), f >= p && ((f = 0), (h += 1)))) : ((f = Math.floor(e / s)), (h = e - f * s));
						(i.row = f), (i.column = h), (i.style[l('margin-top')] = 0 !== f ? c && `${c}px` : '');
					},
					updateWrapperSize: (e, s, a) => {
						const { centeredSlides: i, roundLengths: n } = r.params,
							l = o(),
							{ rows: d } = r.params.grid;
						if (((r.virtualSize = (e + l) * t), (r.virtualSize = Math.ceil(r.virtualSize / d) - l), (r.wrapperEl.style[a('width')] = `${r.virtualSize + l}px`), i)) {
							const e = [];
							for (let t = 0; t < s.length; t += 1) {
								let a = s[t];
								n && (a = Math.floor(a)), s[t] < r.virtualSize + s[0] && e.push(a);
							}
							s.splice(0, s.length), s.push(...e);
						}
					}
				});
		},
		function (e) {
			let { swiper: t } = e;
			Object.assign(t, { appendSlide: te.bind(t), prependSlide: se.bind(t), addSlide: ae.bind(t), removeSlide: ie.bind(t), removeAllSlides: re.bind(t) });
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ fadeEffect: { crossFade: !1 } }),
				ne({
					effect: 'fade',
					swiper: t,
					on: a,
					setTranslate: () => {
						const { slides: e } = t;
						t.params.fadeEffect;
						for (let s = 0; s < e.length; s += 1) {
							const e = t.slides[s];
							let a = -e.swiperSlideOffset;
							t.params.virtualTranslate || (a -= t.translate);
							let i = 0;
							t.isHorizontal() || ((i = a), (a = 0));
							const r = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e.progress), 0) : 1 + Math.min(Math.max(e.progress, -1), 0),
								n = le(0, e);
							(n.style.opacity = r), (n.style.transform = `translate3d(${a}px, ${i}px, 0px)`);
						}
					},
					setTransition: (e) => {
						const s = t.slides.map((e) => m(e));
						s.forEach((t) => {
							t.style.transitionDuration = `${e}ms`;
						}),
							oe({ swiper: t, duration: e, transformElements: s, allSlides: !0 });
					},
					overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !t.params.cssMode })
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: 0.94 } });
			const i = (e, t, s) => {
				let a = s ? e.querySelector('.swiper-slide-shadow-left') : e.querySelector('.swiper-slide-shadow-top'),
					i = s ? e.querySelector('.swiper-slide-shadow-right') : e.querySelector('.swiper-slide-shadow-bottom');
				a || ((a = f('div', ('swiper-slide-shadow-cube swiper-slide-shadow-' + (s ? 'left' : 'top')).split(' '))), e.append(a)), i || ((i = f('div', ('swiper-slide-shadow-cube swiper-slide-shadow-' + (s ? 'right' : 'bottom')).split(' '))), e.append(i)), a && (a.style.opacity = Math.max(-t, 0)), i && (i.style.opacity = Math.max(t, 0));
			};
			ne({
				effect: 'cube',
				swiper: t,
				on: a,
				setTranslate: () => {
					const { el: e, wrapperEl: s, slides: a, width: r, height: n, rtlTranslate: l, size: o, browser: d } = t,
						c = t.params.cubeEffect,
						p = t.isHorizontal(),
						u = t.virtual && t.params.virtual.enabled;
					let m,
						h = 0;
					c.shadow && (p ? ((m = t.wrapperEl.querySelector('.swiper-cube-shadow')), m || ((m = f('div', 'swiper-cube-shadow')), t.wrapperEl.append(m)), (m.style.height = `${r}px`)) : ((m = e.querySelector('.swiper-cube-shadow')), m || ((m = f('div', 'swiper-cube-shadow')), e.append(m))));
					for (let e = 0; e < a.length; e += 1) {
						const t = a[e];
						let s = e;
						u && (s = parseInt(t.getAttribute('data-swiper-slide-index'), 10));
						let r = 90 * s,
							n = Math.floor(r / 360);
						l && ((r = -r), (n = Math.floor(-r / 360)));
						const d = Math.max(Math.min(t.progress, 1), -1);
						let m = 0,
							f = 0,
							g = 0;
						s % 4 == 0 ? ((m = 4 * -n * o), (g = 0)) : (s - 1) % 4 == 0 ? ((m = 0), (g = 4 * -n * o)) : (s - 2) % 4 == 0 ? ((m = o + 4 * n * o), (g = o)) : (s - 3) % 4 == 0 && ((m = -o), (g = 3 * o + 4 * o * n)), l && (m = -m), p || ((f = m), (m = 0));
						const v = `rotateX(${p ? 0 : -r}deg) rotateY(${p ? r : 0}deg) translate3d(${m}px, ${f}px, ${g}px)`;
						d <= 1 && d > -1 && ((h = 90 * s + 90 * d), l && (h = 90 * -s - 90 * d)), (t.style.transform = v), c.slideShadows && i(t, d, p);
					}
					if (((s.style.transformOrigin = `50% 50% -${o / 2}px`), (s.style['-webkit-transform-origin'] = `50% 50% -${o / 2}px`), c.shadow))
						if (p) m.style.transform = `translate3d(0px, ${r / 2 + c.shadowOffset}px, ${-r / 2}px) rotateX(90deg) rotateZ(0deg) scale(${c.shadowScale})`;
						else {
							const e = Math.abs(h) - 90 * Math.floor(Math.abs(h) / 90),
								t = 1.5 - (Math.sin((2 * e * Math.PI) / 360) / 2 + Math.cos((2 * e * Math.PI) / 360) / 2),
								s = c.shadowScale,
								a = c.shadowScale / t,
								i = c.shadowOffset;
							m.style.transform = `scale3d(${s}, 1, ${a}) translate3d(0px, ${n / 2 + i}px, ${-n / 2 / a}px) rotateX(-90deg)`;
						}
					const g = (d.isSafari || d.isWebView) && d.needPerspectiveFix ? -o / 2 : 0;
					(s.style.transform = `translate3d(0px,0,${g}px) rotateX(${t.isHorizontal() ? 0 : h}deg) rotateY(${t.isHorizontal() ? -h : 0}deg)`), s.style.setProperty('--swiper-cube-translate-z', `${g}px`);
				},
				setTransition: (e) => {
					const { el: s, slides: a } = t;
					if (
						(a.forEach((t) => {
							(t.style.transitionDuration = `${e}ms`),
								t.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach((t) => {
									t.style.transitionDuration = `${e}ms`;
								});
						}),
						t.params.cubeEffect.shadow && !t.isHorizontal())
					) {
						const t = s.querySelector('.swiper-cube-shadow');
						t && (t.style.transitionDuration = `${e}ms`);
					}
				},
				recreateShadows: () => {
					const e = t.isHorizontal();
					t.slides.forEach((t) => {
						const s = Math.max(Math.min(t.progress, 1), -1);
						i(t, s, e);
					});
				},
				getEffectParams: () => t.params.cubeEffect,
				perspective: () => !0,
				overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: !0, resistanceRatio: 0, spaceBetween: 0, centeredSlides: !1, virtualTranslate: !0 })
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ flipEffect: { slideShadows: !0, limitRotation: !0 } });
			const i = (e, s) => {
				let a = t.isHorizontal() ? e.querySelector('.swiper-slide-shadow-left') : e.querySelector('.swiper-slide-shadow-top'),
					i = t.isHorizontal() ? e.querySelector('.swiper-slide-shadow-right') : e.querySelector('.swiper-slide-shadow-bottom');
				a || (a = de('flip', e, t.isHorizontal() ? 'left' : 'top')), i || (i = de('flip', e, t.isHorizontal() ? 'right' : 'bottom')), a && (a.style.opacity = Math.max(-s, 0)), i && (i.style.opacity = Math.max(s, 0));
			};
			ne({
				effect: 'flip',
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e, rtlTranslate: s } = t,
						a = t.params.flipEffect;
					for (let r = 0; r < e.length; r += 1) {
						const n = e[r];
						let l = n.progress;
						t.params.flipEffect.limitRotation && (l = Math.max(Math.min(n.progress, 1), -1));
						const o = n.swiperSlideOffset;
						let d = -180 * l,
							c = 0,
							p = t.params.cssMode ? -o - t.translate : -o,
							u = 0;
						t.isHorizontal() ? s && (d = -d) : ((u = p), (p = 0), (c = -d), (d = 0)), (n.style.zIndex = -Math.abs(Math.round(l)) + e.length), a.slideShadows && i(n, l);
						const m = `translate3d(${p}px, ${u}px, 0px) rotateX(${c}deg) rotateY(${d}deg)`;
						le(0, n).style.transform = m;
					}
				},
				setTransition: (e) => {
					const s = t.slides.map((e) => m(e));
					s.forEach((t) => {
						(t.style.transitionDuration = `${e}ms`),
							t.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach((t) => {
								t.style.transitionDuration = `${e}ms`;
							});
					}),
						oe({ swiper: t, duration: e, transformElements: s });
				},
				recreateShadows: () => {
					t.params.flipEffect,
						t.slides.forEach((e) => {
							let s = e.progress;
							t.params.flipEffect.limitRotation && (s = Math.max(Math.min(e.progress, 1), -1)), i(e, s);
						});
				},
				getEffectParams: () => t.params.flipEffect,
				perspective: () => !0,
				overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !t.params.cssMode })
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ coverflowEffect: { rotate: 50, stretch: 0, depth: 100, scale: 1, modifier: 1, slideShadows: !0 } }),
				ne({
					effect: 'coverflow',
					swiper: t,
					on: a,
					setTranslate: () => {
						const { width: e, height: s, slides: a, slidesSizesGrid: i } = t,
							r = t.params.coverflowEffect,
							n = t.isHorizontal(),
							l = t.translate,
							o = n ? e / 2 - l : s / 2 - l,
							d = n ? r.rotate : -r.rotate,
							c = r.depth;
						for (let e = 0, t = a.length; e < t; e += 1) {
							const t = a[e],
								s = i[e],
								l = (o - t.swiperSlideOffset - s / 2) / s,
								p = 'function' == typeof r.modifier ? r.modifier(l) : l * r.modifier;
							let u = n ? d * p : 0,
								m = n ? 0 : d * p,
								h = -c * Math.abs(p),
								f = r.stretch;
							'string' == typeof f && -1 !== f.indexOf('%') && (f = (parseFloat(r.stretch) / 100) * s);
							let g = n ? 0 : f * p,
								v = n ? f * p : 0,
								w = 1 - (1 - r.scale) * Math.abs(p);
							Math.abs(v) < 0.001 && (v = 0), Math.abs(g) < 0.001 && (g = 0), Math.abs(h) < 0.001 && (h = 0), Math.abs(u) < 0.001 && (u = 0), Math.abs(m) < 0.001 && (m = 0), Math.abs(w) < 0.001 && (w = 0);
							const b = `translate3d(${v}px,${g}px,${h}px)  rotateX(${m}deg) rotateY(${u}deg) scale(${w})`;
							if (((le(0, t).style.transform = b), (t.style.zIndex = 1 - Math.abs(Math.round(p))), r.slideShadows)) {
								let e = n ? t.querySelector('.swiper-slide-shadow-left') : t.querySelector('.swiper-slide-shadow-top'),
									s = n ? t.querySelector('.swiper-slide-shadow-right') : t.querySelector('.swiper-slide-shadow-bottom');
								e || (e = de('coverflow', t, n ? 'left' : 'top')), s || (s = de('coverflow', t, n ? 'right' : 'bottom')), e && (e.style.opacity = p > 0 ? p : 0), s && (s.style.opacity = -p > 0 ? -p : 0);
							}
						}
					},
					setTransition: (e) => {
						t.slides
							.map((e) => m(e))
							.forEach((t) => {
								(t.style.transitionDuration = `${e}ms`),
									t.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach((t) => {
										t.style.transitionDuration = `${e}ms`;
									});
							});
					},
					perspective: () => !0,
					overwriteParams: () => ({ watchSlidesProgress: !0 })
				});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ creativeEffect: { limitProgress: 1, shadowPerProgress: !1, progressMultiplier: 1, perspective: !0, prev: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 }, next: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 } } });
			const i = (e) => ('string' == typeof e ? e : `${e}px`);
			ne({
				effect: 'creative',
				swiper: t,
				on: a,
				setTranslate: () => {
					const { slides: e, wrapperEl: s, slidesSizesGrid: a } = t,
						r = t.params.creativeEffect,
						{ progressMultiplier: n } = r,
						l = t.params.centeredSlides;
					if (l) {
						const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
						s.style.transform = `translateX(calc(50% - ${e}px))`;
					}
					for (let s = 0; s < e.length; s += 1) {
						const a = e[s],
							o = a.progress,
							d = Math.min(Math.max(a.progress, -r.limitProgress), r.limitProgress);
						let c = d;
						l || (c = Math.min(Math.max(a.originalProgress, -r.limitProgress), r.limitProgress));
						const p = a.swiperSlideOffset,
							u = [t.params.cssMode ? -p - t.translate : -p, 0, 0],
							m = [0, 0, 0];
						let h = !1;
						t.isHorizontal() || ((u[1] = u[0]), (u[0] = 0));
						let f = { translate: [0, 0, 0], rotate: [0, 0, 0], scale: 1, opacity: 1 };
						d < 0 ? ((f = r.next), (h = !0)) : d > 0 && ((f = r.prev), (h = !0)),
							u.forEach((e, t) => {
								u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d * n)}))`;
							}),
							m.forEach((e, t) => {
								m[t] = f.rotate[t] * Math.abs(d * n);
							}),
							(a.style.zIndex = -Math.abs(Math.round(o)) + e.length);
						const g = u.join(', '),
							v = `rotateX(${m[0]}deg) rotateY(${m[1]}deg) rotateZ(${m[2]}deg)`,
							w = c < 0 ? `scale(${1 + (1 - f.scale) * c * n})` : `scale(${1 - (1 - f.scale) * c * n})`,
							b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n,
							y = `translate3d(${g}) ${v} ${w}`;
						if ((h && f.shadow) || !h) {
							let e = a.querySelector('.swiper-slide-shadow');
							if ((!e && f.shadow && (e = de('creative', a)), e)) {
								const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
								e.style.opacity = Math.min(Math.max(Math.abs(t), 0), 1);
							}
						}
						const E = le(0, a);
						(E.style.transform = y), (E.style.opacity = b), f.origin && (E.style.transformOrigin = f.origin);
					}
				},
				setTransition: (e) => {
					const s = t.slides.map((e) => m(e));
					s.forEach((t) => {
						(t.style.transitionDuration = `${e}ms`),
							t.querySelectorAll('.swiper-slide-shadow').forEach((t) => {
								t.style.transitionDuration = `${e}ms`;
							});
					}),
						oe({ swiper: t, duration: e, transformElements: s, allSlides: !0 });
				},
				perspective: () => t.params.creativeEffect.perspective,
				overwriteParams: () => ({ watchSlidesProgress: !0, virtualTranslate: !t.params.cssMode })
			});
		},
		function (e) {
			let { swiper: t, extendParams: s, on: a } = e;
			s({ cardsEffect: { slideShadows: !0, rotate: !0, perSlideRotate: 2, perSlideOffset: 8 } }),
				ne({
					effect: 'cards',
					swiper: t,
					on: a,
					setTranslate: () => {
						const { slides: e, activeIndex: s, rtlTranslate: a } = t,
							i = t.params.cardsEffect,
							{ startTranslate: r, isTouched: n } = t.touchEventsData,
							l = a ? -t.translate : t.translate;
						for (let o = 0; o < e.length; o += 1) {
							const d = e[o],
								c = d.progress,
								p = Math.min(Math.max(c, -4), 4);
							let u = d.swiperSlideOffset;
							t.params.centeredSlides && !t.params.cssMode && (t.wrapperEl.style.transform = `translateX(${t.minTranslate()}px)`), t.params.centeredSlides && t.params.cssMode && (u -= e[0].swiperSlideOffset);
							let m = t.params.cssMode ? -u - t.translate : -u,
								h = 0;
							const f = -100 * Math.abs(p);
							let g = 1,
								v = -i.perSlideRotate * p,
								w = i.perSlideOffset - 0.75 * Math.abs(p);
							const b = t.virtual && t.params.virtual.enabled ? t.virtual.from + o : o,
								y = (b === s || b === s - 1) && p > 0 && p < 1 && (n || t.params.cssMode) && l < r,
								E = (b === s || b === s + 1) && p < 0 && p > -1 && (n || t.params.cssMode) && l > r;
							if (y || E) {
								const e = (1 - Math.abs((Math.abs(p) - 0.5) / 0.5)) ** 0.5;
								(v += -28 * p * e), (g += -0.5 * e), (w += 96 * e), (h = -25 * e * Math.abs(p) + '%');
							}
							if (((m = p < 0 ? `calc(${m}px ${a ? '-' : '+'} (${w * Math.abs(p)}%))` : p > 0 ? `calc(${m}px ${a ? '-' : '+'} (-${w * Math.abs(p)}%))` : `${m}px`), !t.isHorizontal())) {
								const e = h;
								(h = m), (m = e);
							}
							const x = p < 0 ? '' + (1 + (1 - g) * p) : '' + (1 - (1 - g) * p),
								S = `\n        translate3d(${m}, ${h}, ${f}px)\n        rotateZ(${i.rotate ? (a ? -v : v) : 0}deg)\n        scale(${x})\n      `;
							if (i.slideShadows) {
								let e = d.querySelector('.swiper-slide-shadow');
								e || (e = de('cards', d)), e && (e.style.opacity = Math.min(Math.max((Math.abs(p) - 0.5) / 0.5, 0), 1));
							}
							d.style.zIndex = -Math.abs(Math.round(c)) + e.length;
							le(0, d).style.transform = S;
						}
					},
					setTransition: (e) => {
						const s = t.slides.map((e) => m(e));
						s.forEach((t) => {
							(t.style.transitionDuration = `${e}ms`),
								t.querySelectorAll('.swiper-slide-shadow').forEach((t) => {
									t.style.transitionDuration = `${e}ms`;
								});
						}),
							oe({ swiper: t, duration: e, transformElements: s });
					},
					perspective: () => !0,
					overwriteParams: () => ({ watchSlidesProgress: !0, virtualTranslate: !t.params.cssMode })
				});
		}
	];
	return Q.use(ce), Q;
})();

/*
 * jQuery Open/Close plugin
 */
(function ($) {
	function OpenClose(options) {
		this.options = $.extend(
			{
				addClassBeforeAnimation: true,
				hideOnClickOutside: false,
				activeClass: 'active',
				opener: '.opener',
				slider: '.slide',
				animSpeed: 400,
				effect: 'fade',
				event: 'click'
			},
			options
		);
		this.init();
	}
	OpenClose.prototype = {
		init: function () {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function () {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);
		},
		attachEvents: function () {
			// add handler
			var self = this;
			this.eventHandler = function (e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.slider.attr('aria-hidden', 'true');
			self.opener.attr('aria-expanded', 'false');
			self.opener.on(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'hover') {
				self.opener.on('mouseenter', function () {
					if (!self.holder.hasClass(self.options.activeClass)) {
						self.showSlide();
					}
				});
				self.holder.on('mouseleave', function () {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function (e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).on('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function () {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.attr('aria-hidden', 'false');
			self.opener.attr('aria-expanded', 'true');
			self.slider.removeClass(slideHiddenClass);
			$(document).on('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function () {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function () {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).off('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function () {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.slider.attr('aria-hidden', 'true');
					self.opener.attr('aria-expanded', 'false');
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function () {
			this.slider.removeClass(slideHiddenClass).css({
				display: ''
			});
			this.opener.off(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).off('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function (name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function () {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	})();

	// animation effects
	var toggleEffects = {
		slide: {
			show: function (o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function (o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function (o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function (o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function (o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function (o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function (opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function () {
			var $holder = jQuery(this);
			var instance = $holder.data('OpenClose');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data(
					'OpenClose',
					new OpenClose(
						$.extend(
							{
								holder: this
							},
							opt
						)
					)
				);
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
})(jQuery);
