import '../plugins/accordionPlugin';
import '../utils/responsiveHelper';

// accordion menu init
export default function initAccordion()
{
    ResponsiveHelper.addRange(
        {
            '..1365': {
                on: function () {
                    jQuery('.acc-js').slideAccordion(
                        {
                            opener: '.acc-opener-js',
                            slider: '.item-drop',
                            animSpeed: 300,
                            allowClickWhenExpanded: true,
                            activeClass: 'acc-active',
                            scrollToActiveItem: {
                                enable: true,
                                breakpoint: 1365,
                                extraOffset: 0
                            },
                            onShow: function () {
                                updateScrollTrigger(this);
                            },
                            onHide: function () {
                                updateScrollTrigger(this);
                            }
                        }
                    );
                },
                off: function () {
                    jQuery('.acc-js').slideAccordion('destroy');
                }
            }
        }
    );
    jQuery('.accordion').slideAccordion(
        {
            opener: '.opener',
            slider: '.slide',
            animSpeed: 300,
            scrollToActiveItem: {
                enable: true,
                extraOffset: 0
            },
            onShow: function () {
                updateScrollTrigger(this);
            },
            onHide: function () {
                updateScrollTrigger(this);
            }
        }
    );

    function updateScrollTrigger(self)
    {
        const parent = self.$holder.closest('.pinned-container');
        const fixedSection = parent?.find('.js-fixed-section');

        if (!fixedSection.length) { return;
        }

        const fixedSectionAPI = fixedSection[0].FixedSectionInstance;

        if (fixedSectionAPI && fixedSectionAPI.timeline) {
            fixedSectionAPI.timeline.scrollTrigger.refresh();
        }
    }
}