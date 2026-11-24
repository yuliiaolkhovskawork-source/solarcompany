
import SimpleBar from 'simplebar';

export default function initSimpleBar()
{
    Array.prototype.forEach.call(
        document.querySelectorAll('.scroll-block'),
        (el) => new SimpleBar(el, { autoHide: false })
    );
}