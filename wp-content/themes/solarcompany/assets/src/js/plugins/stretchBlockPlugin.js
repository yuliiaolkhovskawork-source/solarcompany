/*
 * Stretch block module
 */
export default class StretchBlock {
    constructor(holder, options)
    {
        this.options = {
            element: 'svg',
            ratio: 1.777,
            ...options
        };

        if (holder) {
            this.holder = holder;

            this.init();
        }
    }

    init()
    {
        this.element = this.holder.querySelector(this.options.element);

        if (!this.element) { return;
        }

        this.resizeHandler();
        window.addEventListener('resize', this.debounce(this.resizeHandler));
    }

    resizeHandler()
    {
        this.holder.style.height = `${window.innerHeight}px`;

        const dimensions = this.getProportion(
            {
                holderWidth: this.holder.clientWidth,
                holderHeight: this.holder.clientHeight
            }
        );

        Object.assign(
            this.element.style, {
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                top: `${dimensions.top}px`,
                left: `${dimensions.left}px`,
                position: 'absolute'
            }
        );
    }

    getProportion({ holderWidth, holderHeight })
    {
        let elementWidth = holderWidth;
        let elementHeight = elementWidth / this.options.ratio;

        if (elementHeight < holderHeight) {
            elementHeight = holderHeight;
            elementWidth = holderHeight * this.options.ratio;
        }

        return {
            width: elementWidth,
            height: elementHeight,
            top: (holderHeight - elementHeight) / 2,
            left: (holderWidth - elementWidth) / 2
        };
    }

    destroy()
    {
        window.removeEventListener('resize', this.debounce(this.resizeHandler));

        this.holder.style.height = '';
        this.element.removeAttribute('style');
    }

    debounce(func)
    {
        let timeout = null;

        return (...args) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => func.apply(this, args), 250);
        };
    }
}