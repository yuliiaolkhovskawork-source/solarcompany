import AOS from 'aos';

export default function initAos()
{
    AOS.init({
        once: true,
        duration: 600,
        easing: 'ease-out',
    });

    // AOS caches trigger offsets on init; lazy images, videos and sliders change the page height later,
    // which leaves elements further down the page waiting for a scroll position they never reach.
    let refreshTimer;
    const observer = new ResizeObserver(() => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => AOS.refresh(), 150);
    });

    observer.observe(document.body);
}
