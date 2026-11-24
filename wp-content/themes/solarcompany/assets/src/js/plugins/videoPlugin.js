/*
 * Background Video module
 */
export default class BgVideo {
    constructor (holder, options) {
        this.options = {
            containerClass: 'js-video',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            loadedClass: 'video-loaded',
            playingClass: 'playing',
            pausedClass: 'paused',
            posterBlock: '.poster',
            posterClass: 'poster',
            fluidVideoClass: 'fluid-video',
            autoplayVideoClass: 'bg-video',
            vimeoAPI: '//player.vimeo.com/api/player.js',
            youtubeAPI: '//www.youtube.com/iframe_api',
            ...options
        };

        if (holder) {
            this.holder = holder;

            this.init();
        }
    }

    init () {
        this.holder.BgVideo = this;
        this.videoData = JSON.parse(this.holder.dataset.video);
        this.btnPlay = this.holder.querySelector(this.options.btnPlay);
        this.btnPause = this.holder.querySelector(this.options.btnPause);
        this.autoplay = this.videoData.autoplay === undefined ? false : this.videoData.autoplay;
        this.fluidWidth = this.videoData.fluidWidth === undefined ? false : this.videoData.fluidWidth;
        this.poster = this.holder.querySelector(this.options.posterBlock);
        this.videoContainer = null;
        this.player = null;

        if (this.autoplay) {
            this.holder.classList.add(this.options.autoplayVideoClass);
        }

        if (this.fluidWidth) {
            this.holder.classList.add(this.options.fluidVideoClass);
        }

        this.initPlayer();
        this.attachEvents();

        this.holder.classList.remove(this.options.loadedClass, this.options.playingClass, this.options.pausedClass);
    }

    initPlayer () {
        switch (this.videoData.type) {
            case 'youtube':
                this.initYoutube();
                break;
            case 'vimeo':
                this.initVimeo();
                break;
            case 'html5':
                this.initHTML5Video();
                break;
            default:
                return false;
        }
    }

    attachEvents () {
        this.playClickHandler = (e) => {
            e.preventDefault();
            this.playVideo();
        };

        this.pauseClickHandler = (e) => {
            e.preventDefault();
            this.pauseVideo();
        };

        this.resizeHandler = () => {
            if (this.videoContainer !== null && !this.fluidWidth) {
                this.resizeVideo();
            }
        };

        this.debouncedResizeHandler = this.debounce(this.resizeHandler, 250);

        if (this.btnPlay) {
            this.btnPlay.addEventListener('click', this.playClickHandler);
        }

        if (this.btnPause) {
            this.btnPause.addEventListener('click', this.pauseClickHandler);
        }

        this.resizeHandler();

        window.addEventListener('load', this.resizeHandler);
        window.addEventListener('resize', this.debouncedResizeHandler);
    }

    initYoutube () {
        const container = document.createElement('div');

        container.setAttribute('class', this.options.containerClass);
        this.holder.append(container);

        const options = {
            playlist: this.autoplay ? this.videoData.video : null,
            autoplay: this.autoplay ? 1 : 0,
            playsinline: 1,
            loop: this.autoplay ? 1 : 0,
            mute: this.autoplay ? 1 : 0,
            controls: this.autoplay ? 0 : 1,
            showinfo: 0,
            modestbranding: 1,
            disablekb: 1,
            rel: 0,
            fs: this.autoplay ? 0 : 1,
            cc_load_policy: 0,
            iv_load_policy: 3
        };

        const loadPlayer = () => {
            const player = new YT.Player(container, {
                videoId: this.videoData.video,
                playerVars: options,
                events: {
                    onReady: () => {
                        if (this.autoplay) {
                            player.mute();
                            player.playVideo();
                        }

                        this.videoContainer = this.holder.querySelector('iframe');

                        this.onVideoLoaded();

                        this.player = {
                            play: () => player.playVideo(),
                            pause: () => player.pauseVideo(),
                            mute: () => player.mute(),
                            unmute: () => player.unMute()
                        };

                        if (!this.poster) {
                            const posterUrl = `https://img.youtube.com/vi/${this.videoData.video}/maxresdefault.jpg`;

                            if (posterUrl) {
                                this.createPoster(posterUrl);
                            }
                        }
                    },
                    onStateChange: (state) => {
                        switch (state.data) {
                            case 0:
                                this.onVideoEnded();
                                break;
                            case 1:
                                this.onVideoPlayed();
                                break;
                            case 2:
                                this.onVideoPaused();
                                break;
                            default:
                                break;
                        }
                    }
                }
            });
        };

        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            const youtubeReady = window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady = () => {
                if (youtubeReady) youtubeReady();

                loadPlayer();
            };

            this.loadScript(this.options.youtubeAPI);
        } else {
            loadPlayer();
        }
    }

    initVimeo () {
        const blockId = this.getRandomId();

        const options = {
            id: this.videoData.video,
            autoplay: this.autoplay,
            autopause: !this.autoplay,
            muted: this.autoplay,
            loop: this.autoplay,
            controls: !this.autoplay,
            byline: !this.autoplay,
            title: !this.autoplay,
            playsinline: true
        };

        const loadPlayer = () => {
            this.holder.setAttribute('id', blockId);

            const player = new Vimeo.Player(blockId, options);

            player.ready().then(() => {
                this.videoContainer = this.holder.querySelector('iframe');

                this.videoContainer.setAttribute('class', this.options.containerClass);

                this.onVideoLoaded();

                player.on('play', () => this.onVideoPlayed());
                player.on('pause', () => this.onVideoPaused());
                player.on('ended', () => this.onVideoEnded());

                this.player = {
                    play: () => player.play(),
                    pause: () => player.pause(),
                    mute: () => player.setVolume(0),
                    unmute: () => player.setVolume(1)
                };
            });

            if (!this.poster) {
                fetch(`https://vimeo.com/api/v2/video/${this.videoData.video}.json`)
                    .then((res) => res.json())
                    .then((data) => {
                        const posterUrl = data[0].thumbnail_large;

                        if (posterUrl) {
                            this.createPoster(posterUrl);
                        }
                    });
            }
        };

        if (typeof Vimeo === 'undefined' || typeof Vimeo.Player === 'undefined') {
            this.loadScript(this.options.vimeoAPI, loadPlayer);
        } else {
            loadPlayer();
        }
    }

    initHTML5Video () {
        this.videoContainer = document.createElement('video');

        this.videoContainer.setAttribute('class', this.options.containerClass);
        this.videoContainer.setAttribute('src', this.videoData.video);

        this.videoContainer.setAttribute('playsinline', '');
        this.videoContainer.playsInline = true;

        if (this.autoplay) {
            this.videoContainer.setAttribute('muted', '');
            this.videoContainer.setAttribute('autoplay', '');
            this.videoContainer.setAttribute('loop', '');

            // if attributes are not supported
            this.videoContainer.muted = true;
            this.videoContainer.autoplay = true;
            this.videoContainer.loop = true;
        } else {
            this.videoContainer.setAttribute('controls', '');
        }

        this.holder.append(this.videoContainer);

        if (!this.poster) {
            const onSeeked = () => {
                requestAnimationFrame(() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = this.videoContainer.videoWidth;
                    canvas.height = this.videoContainer.videoHeight;

                    ctx.drawImage(this.videoContainer, 0, 0, canvas.width, canvas.height);

                    const posterUrl = canvas.toDataURL('image/jpeg');

                    if (posterUrl && posterUrl !== 'data:,') {
                        this.createPoster(posterUrl);
                    }

                    this.videoContainer.removeEventListener('seeked', onSeeked);
                });
            };

            this.videoContainer.addEventListener('seeked', onSeeked);

            this.videoContainer.addEventListener('loadedmetadata', () => {
                this.videoContainer.currentTime = 0.1;
            }, { once: true });
        }

        this.videoContainer.addEventListener('loadeddata', () => this.onVideoLoaded());
        this.videoContainer.addEventListener('progress', () => this.onVideoLoaded());
        this.videoContainer.addEventListener('play', () => this.onVideoPlayed());
        this.videoContainer.addEventListener('pause', () => this.onVideoPaused());
        this.videoContainer.addEventListener('ended', () => this.onVideoEnded());

        this.player = {
            play: () => this.videoContainer.play(),
            pause: () => this.videoContainer.pause(),
            mute: () => (this.videoContainer.volume = 0),
            unmute: () => (this.videoContainer.volume = 1)
        };
    }

    createPoster (src) {
        if (!src) return;

        const posterHolder = document.createElement('div');
        const poster = document.createElement('img');

        posterHolder.setAttribute('class', this.options.posterClass);

        poster.setAttribute('src', src);
        posterHolder.append(poster);
        this.holder.insertAdjacentElement('afterbegin', posterHolder);
    }

    playVideo () {
        if (!this.holder.classList.contains(this.options.loadedClass)) return;

        if (!this.holder.classList.contains(this.options.playingClass) || this.holder.classList.contains(this.options.pausedClass)) {
            this.player.play();
            this.holder.blur();

            this.holder.classList.add(this.options.playingClass);
            this.holder.classList.remove(this.options.pausedClass);
        } else {
            if (!this.btnPause) {
                this.pauseVideo();

                this.holder.classList.remove(this.options.playingClass);
                this.holder.classList.add(this.options.pausedClass);
            }
        }
    }

    pauseVideo () {
        this.player.pause();
    }

    pauseAllVideos () {
        if (this.autoplay) return;

        document.querySelectorAll(`[data-video].${this.options.playingClass}`).forEach((holder) => {
            if (holder !== this.holder && !holder.BgVideo.autoplay) {
                holder.BgVideo.player.pause();
            }
        });
    }

    onVideoLoaded () {
        this.resizeHandler();

        this.holder.classList.add(this.options.loadedClass);

        if (this.autoplay || this.btnPlay) {
            this.videoContainer.setAttribute('tabindex', '-1');
        }
    }

    onVideoPlayed () {
        this.pauseAllVideos();

        this.holder.classList.add(this.options.playingClass);
        this.holder.classList.remove(this.options.pausedClass);

        if (!this.autoplay && this.btnPlay) {
            this.videoContainer.removeAttribute('tabindex');
        }
    }

    onVideoPaused () {
        this.holder.classList.add(this.options.pausedClass);
    }

    onVideoEnded () {
        this.holder.classList.remove(this.options.playingClass, this.options.pausedClass);
    }

    getDimensions ({ videoRatio, maskWidth, maskHeight, videoWidth, videoHeight }) {
        const ratio = videoRatio || videoWidth / videoHeight;
        let slideWidth = maskWidth;
        let slideHeight = slideWidth / ratio;

        if (slideHeight < maskHeight) {
            slideHeight = maskHeight;
            slideWidth = slideHeight * ratio;
        }

        return {
            width: slideWidth,
            height: slideHeight,
            top: (maskHeight - slideHeight) / 2,
            left: (maskWidth - slideWidth) / 2
        };
    }

    getRatio () {
        const width = this.videoContainer.getAttribute('width');
        const height = this.videoContainer.getAttribute('height');

        return width && height ? width / height : 16 / 9;
    }

    resizeVideo () {
        const styles = this.getDimensions({
            videoRatio: this.getRatio(),
            maskWidth: this.holder.offsetWidth,
            maskHeight: this.holder.offsetHeight
        });

        this.videoContainer.style.width = `${styles.width}px`;
        this.videoContainer.style.height = `${styles.height}px`;
        this.videoContainer.style.marginTop = `${styles.top}px`;
        this.videoContainer.style.marginLeft = `${styles.left}px`;
    }

    loadScript (url, callback) {
        const tag = document.createElement('script');
        const firstScriptTag = document.getElementsByTagName('script')[0];

        tag.src = url;
        tag.onload = callback;
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    getRandomId () {
        const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    debounce (func, delay = 250) {
        let timer = null;

        return (...args) => {
            clearTimeout(timer);

            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    destroy () {
        this.videoContainer.remove();
        this.btnPlay.removeEventListener('click', this.playClickHandler);
        this.btnPause.removeEventListener('click', this.pauseClickHandler);

        window.removeEventListener('load', this.resizeHandler);
        window.removeEventListener('resize', this.debouncedResizeHandler);

        this.holder.classList.remove(this.options.loadedClass, this.options.playingClass, this.options.pausedClass);

        this.holder.BgVideo = null;
    }
}