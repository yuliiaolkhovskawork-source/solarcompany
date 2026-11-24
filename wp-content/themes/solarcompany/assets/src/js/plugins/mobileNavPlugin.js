/*
 * Simple Mobile Navigation
 */
; (function ($) {
    function MobileNav(options)
    {
        this.options = $.extend(
            {
                container: null,
                hideOnClickOutside: false,
                menuActiveClass: 'nav-active',
                menuOpener: '.nav-opener',
                menuDrop: '.nav-drop',
                toggleEvent: 'click',
                outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
            }, options
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
            }

            this.onFocusOut = function (e) {

                clearTimeout(self.blurTimer);

                self.blurTimer = setTimeout(
                    function () {
                        const $focusedElem = $(document.activeElement);

                        if (!$focusedElem.closest(self.drop).length) {
                            self.inFocus = false;
                            self.drop.removeClass('in-focus');
                            self.makeCallback('onFocusOut');
                        }
                    }, 100
                );
            }

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

            this.makeCallback('onShow');
        },
        hide: function () {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.attr('aria-expanded', 'false');
            this.drop.attr('aria-hidden', 'true');

            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }

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
            this.drop.removeAttr('aria-hidden');
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function () {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
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

        return this.each(
            function () {
                var $container = jQuery(this);
                var instance = $container.data('MobileNav');

                if (typeof opt === 'object' || typeof opt === 'undefined') {
                    $container.data(
                        'MobileNav', new MobileNav(
                            $.extend(
                                {
                                    container: this
                                }, opt
                            )
                        )
                    );
                } else if (typeof method === 'string' && instance) {
                    if (typeof instance[method] === 'function') {
                        args.shift();
                        instance[method].apply(instance, args);
                    }
                }
            }
        );
    };
}(jQuery));