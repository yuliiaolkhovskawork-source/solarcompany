import BgVideo from '../plugins/videoPlugin';

export default function initVideo () {
    document.querySelectorAll('div[data-video]:not(.sbi_link_area)').forEach((holder) => {
        new BgVideo(holder);
    });
}