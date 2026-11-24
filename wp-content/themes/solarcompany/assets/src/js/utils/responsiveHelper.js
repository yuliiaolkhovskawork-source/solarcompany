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
    function resizeHandler()
    {
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

    // test range
    function matchRange(r1, r2)
    {
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
    function matchQuery(query, r1, r2)
    {
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
    function parseRange(rangeStr)
    {
        const rangeData = rangeStr.split('..');
        const x1 = parseInt(rangeData[0], 10) || -Infinity;
        const x2 = parseInt(rangeData[1], 10) || Infinity;

        return [x1, x2].sort(
            function (a, b) {
                return a - b;
            }
        );
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
}());