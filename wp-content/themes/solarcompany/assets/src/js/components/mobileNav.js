import '../plugins/mobileNavPlugin';

// mobile menu init
export default function initMobileNav()
{
    jQuery('body').mobileNav(
        {
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener'
        }
    );

    jQuery('.main-menu > li:has(.item-drop)').mobileNav(
        {
            menuActiveClass: 'item-focused',
            menuOpener: '.arrow',
            hideOnClickOutside: true,
            menuDrop: '.item-drop',
            onFocusOut: function () {
                this.hide();
            }
        }
    );
}