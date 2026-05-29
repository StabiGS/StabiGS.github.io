function initializeMediaSection(options) {
    const {
        element,
        source,
        thumbnails,
        descriptionId,
        defaultStyles = {
            normal: '2px solid #fff',
            active: '3px solid #92A8D1'
        }
    } = options;

    if (thumbnails.length === 0) return;

    thumbnails[0].style.border = defaultStyles.active;
    source.src = thumbnails[0].getAttribute('data-video');
    element.load();
    element.play();
    
    const descElement = document.getElementById(descriptionId);
    if (descElement) {
        const initialDescription = thumbnails[0].getAttribute('data-description') || '';
        descElement.textContent = initialDescription;
    }

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.style.border = defaultStyles.normal);
            this.style.border = defaultStyles.active;
            
            source.src = this.getAttribute('data-video');
            element.load();
            element.play();
            
            const description = this.getAttribute('data-description') || '';
            if (descElement) {
                descElement.textContent = description;
                descElement.style.height = "50px";
                descElement.style.overflow = "auto";
            }
        });
    });
}

// Keep two videos aligned by restarting them together when either loops/ends.
function synchronizePairLoop(videoA, videoB) {
    if (!videoA || !videoB) return null;

    let isSyncing = false;
    let previousTimeA = 0;
    let previousTimeB = 0;

    const restartBoth = () => {
        if (isSyncing) return;
        isSyncing = true;

        try {
            videoA.currentTime = 0;
            videoB.currentTime = 0;
        } catch (e) {
            // Ignore seek errors while media is loading.
        }

        const playA = videoA.play();
        const playB = videoB.play();

        if (playA && typeof playA.catch === 'function') {
            playA.catch(() => {});
        }
        if (playB && typeof playB.catch === 'function') {
            playB.catch(() => {});
        }

        previousTimeA = 0;
        previousTimeB = 0;
        requestAnimationFrame(() => {
            isSyncing = false;
        });
    };

    const detectLoopBoundary = (video, previousTime) => {
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) {
            return video.currentTime;
        }

        const wrappedAround = video.currentTime + 0.05 < previousTime && previousTime > duration - 0.25;
        if (wrappedAround) {
            restartBoth();
        }

        return video.currentTime;
    };

    videoA.addEventListener('timeupdate', () => {
        previousTimeA = detectLoopBoundary(videoA, previousTimeA);
    });

    videoB.addEventListener('timeupdate', () => {
        previousTimeB = detectLoopBoundary(videoB, previousTimeB);
    });

    videoA.addEventListener('ended', restartBoth);
    videoB.addEventListener('ended', restartBoth);

    return restartBoth;
}

function initializePairedMediaSection(options) {
    const {
        primaryElement,
        primarySource,
        secondaryElement,
        secondarySource,
        thumbnails,
        descriptionId,
        defaultStyles = {
            normal: '2px solid #fff',
            active: '3px solid #92A8D1'
        }
    } = options;

    if (thumbnails.length === 0 || !primaryElement || !primarySource || !secondaryElement || !secondarySource) {
        return;
    }

    const restartPair = synchronizePairLoop(primaryElement, secondaryElement);

    const applyThumbnail = (thumbnail) => {
        const shakySrc = thumbnail.getAttribute('data-shaky');
        const smoothedSrc = thumbnail.getAttribute('data-smoothed');

        if (shakySrc) {
            primarySource.src = shakySrc;
            primaryElement.load();
        }

        if (smoothedSrc) {
            secondarySource.src = smoothedSrc;
            secondaryElement.load();
        }

        if (typeof restartPair === 'function') {
            // Hard resync immediately after switching both sources.
            restartPair();
        } else {
            const playA = primaryElement.play();
            const playB = secondaryElement.play();
            if (playA && typeof playA.catch === 'function') {
                playA.catch(() => {});
            }
            if (playB && typeof playB.catch === 'function') {
                playB.catch(() => {});
            }
        }

        const descElement = document.getElementById(descriptionId);
        if (descElement) {
            const description = thumbnail.getAttribute('data-description') || '';
            descElement.textContent = description;
            descElement.style.height = '50px';
            descElement.style.overflow = 'auto';
        }
    };

    thumbnails[0].style.border = defaultStyles.active;
    applyThumbnail(thumbnails[0]);

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.style.border = defaultStyles.normal);
            this.style.border = defaultStyles.active;
            applyThumbnail(this);
        });
    });
}

const style = document.createElement('style');
style.innerHTML = `
    .thumbnail {
        border-radius: 6px;
        box-shadow: 0 0 4px #888;
        width: 100px;
        height: 70px;
        object-fit: cover;
        transition: transform 0.3s ease;
        vertical-align: bottom;
        cursor: pointer;
    }

    .thumbnail:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function () {
    const pairedSections = [
        {
            primaryElement: document.getElementById('compare-video'),
            primarySource: document.getElementById('compare-video-source'),
            secondaryElement: document.getElementById('compare-video-stabigs'),
            secondarySource: document.getElementById('compare-video-source-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail'),
            descriptionId: 'compare-description'
        },
        {
            primaryElement: document.getElementById('compare-video-das3r'),
            primarySource: document.getElementById('compare-video-source-das3r'),
            secondaryElement: document.getElementById('compare-video-das3r-stabigs'),
            secondarySource: document.getElementById('compare-video-source-das3r-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-das3r'),
            descriptionId: 'compare-description-das3r'
        },
        {
            primaryElement: document.getElementById('compare-video-cut3r'),
            primarySource: document.getElementById('compare-video-source-cut3r'),
            secondaryElement: document.getElementById('compare-video-cut3r-stabigs'),
            secondarySource: document.getElementById('compare-video-source-cut3r-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-cut3r'),
            descriptionId: 'compare-description-cut3r'
        },
        {
            primaryElement: document.getElementById('compare-video-meshflow'),
            primarySource: document.getElementById('compare-video-source-meshflow'),
            secondaryElement: document.getElementById('compare-video-meshflow-stabigs'),
            secondarySource: document.getElementById('compare-video-source-meshflow-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-meshflow'),
            descriptionId: 'compare-description-meshflow'
        },
        {
            primaryElement: document.getElementById('compare-video-fusta'),
            primarySource: document.getElementById('compare-video-source-fusta'),
            secondaryElement: document.getElementById('compare-video-fusta-stabigs'),
            secondarySource: document.getElementById('compare-video-source-fusta-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-fusta'),
            descriptionId: 'compare-description-fusta'
        },
        {
            primaryElement: document.getElementById('compare-video-difrint'),
            primarySource: document.getElementById('compare-video-source-difrint'),
            secondaryElement: document.getElementById('compare-video-difrint-stabigs'),
            secondarySource: document.getElementById('compare-video-source-difrint-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-difrint'),
            descriptionId: 'compare-description-difrint'
        },
        {
            primaryElement: document.getElementById('compare-video-gavs'),
            primarySource: document.getElementById('compare-video-source-gavs'),
            secondaryElement: document.getElementById('compare-video-gavs-stabigs'),
            secondarySource: document.getElementById('compare-video-source-gavs-stabigs'),
            thumbnails: document.querySelectorAll('.compare-thumbnail-gavs'),
            descriptionId: 'compare-description-gavs'
        }
    ];

    pairedSections.forEach(section => initializePairedMediaSection(section));

    const videoElement = document.getElementById('compare-video');
    const videoSource = document.getElementById('compare-video-source');
    const thumbnails = document.querySelectorAll('.compare-thumbnail');
    
    const videoElementDas3r = document.getElementById('compare-video-das3r');
    const videoSourceDas3r = document.getElementById('compare-video-source-das3r');
    const thumbnailsDas3r = document.querySelectorAll('.compare-thumbnail-das3r');
    
    const videoElementCut3r = document.getElementById('compare-video-cut3r');
    const videoSourceCut3r = document.getElementById('compare-video-source-cut3r');
    const thumbnailsCut3r = document.querySelectorAll('.compare-thumbnail-cut3r');
    
    [
        videoElement,
        videoElementDas3r,
        videoElementCut3r,
        document.getElementById('compare-video-stabigs'),
        document.getElementById('compare-video-das3r-stabigs'),
        document.getElementById('compare-video-cut3r-stabigs'),
        document.getElementById('compare-video-meshflow'),
        document.getElementById('compare-video-meshflow-stabigs'),
        document.getElementById('compare-video-fusta'),
        document.getElementById('compare-video-fusta-stabigs'),
        document.getElementById('compare-video-difrint'),
        document.getElementById('compare-video-difrint-stabigs'),
        document.getElementById('compare-video-gavs'),
        document.getElementById('compare-video-gavs-stabigs')
    ].forEach(video => {
        if (video) {
            video.style.margin = "0 auto";
            video.style.display = "block";
        }
    });

    const disentangleVideo = document.getElementById('disentangle-video');
    const disentangleShakyVideo = document.getElementById('disentangle-video-shaky');
    const disentangleStabigsVideo = document.getElementById('disentangle-video-stabigs');
    const disentangleThumbnails = document.querySelectorAll('.disentangle-video-thumbnail');

    function setVideoSource(videoElement, src) {
        const sourceElement = videoElement.querySelector('source');
        if (!sourceElement) return;
        sourceElement.src = src;
        videoElement.load();
        videoElement.play();
    }

    synchronizePairLoop(disentangleShakyVideo, disentangleStabigsVideo);
    
    if(disentangleThumbnails.length > 0) {
        disentangleThumbnails[0].style.border = '3px solid #92A8D1';
    }

    disentangleThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            disentangleThumbnails.forEach(t => {
                t.style.border = '2px solid #fff';
            });
            
            this.style.border = '3px solid #92A8D1';
            
            const scene = this.getAttribute('data-scene');

            if (scene && disentangleShakyVideo && disentangleStabigsVideo) {
                const resolvedScene = scene === 'intense_roadsite' ? 'intense_roadside' : scene;
                let baseFolder, sceneFolder;
                
                if (resolvedScene.startsWith('intense_')) {
                    baseFolder = 'intense';
                    sceneFolder = resolvedScene;
                } else if (resolvedScene.startsWith('mild_')) {
                    baseFolder = 'mild';
                    sceneFolder = resolvedScene;
                } else if (resolvedScene.startsWith('synthetic_')) {
                    baseFolder = 'synthetic';
                    sceneFolder = resolvedScene.replace('synthetic_', '');
                } else {
                    baseFolder = 'complex';
                    sceneFolder = resolvedScene;
                }
                
                const shakyName = (baseFolder === 'complex' || baseFolder === 'synthetic') ? 'shaky_fixed.mp4' : 'shaky.mp4'; //'shaky_h264.mp4'
                const shakySrc = `static/videos/${baseFolder}/${sceneFolder}/${shakyName}`;
                const smoothedSrc = `static/videos/${baseFolder}/${sceneFolder}/smoothed.mp4`;

                setVideoSource(disentangleShakyVideo, shakySrc);
                setVideoSource(disentangleStabigsVideo, smoothedSrc);
            } else if (disentangleVideo) {
                const videoSrc = this.getAttribute('data-video');
                if (videoSrc) {
                    disentangleVideo.querySelector('source').src = videoSrc;
                    disentangleVideo.load();
                    disentangleVideo.play();
                }
            }
        });
    });
}); 