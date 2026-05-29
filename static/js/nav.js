function showSection(id) {
    const sectionAlias = {
        vs_mon: 'vs_shaky',
        vs_das: 'vs_rstab',
        vs_cut: 'vs_deep3d'
    };

    const resolvedId = sectionAlias[id] || id;

    const sections = document.getElementsByClassName('dynamic-section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }

    const selectedSection = document.getElementById(resolvedId);
    if (!selectedSection) {
        return;
    }
    selectedSection.style.display = 'block';

    const iframes = selectedSection.getElementsByTagName('iframe');
    for (let iframe of iframes) {
        if (!iframe.hasAttribute('data-loaded')) {
            if (iframe.hasAttribute('data-src')) {
                iframe.src = iframe.getAttribute('data-src');
                iframe.removeAttribute('data-src');
            }
            iframe.setAttribute('data-loaded', 'true');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dynamic-section iframe').forEach(function(iframe) {
        if (!iframe.hasAttribute('data-src')) {
            iframe.setAttribute('data-src', iframe.src);
            iframe.removeAttribute('src');
        }
    });

    document.getElementById('nav1').classList.add('active');
    
    setupFixedContainers();
    
    showSection('vs_shaky');
});

function setActive(navId) {
    document.querySelectorAll('nav ul li a').forEach(function(link) {
        link.classList.remove('active');
    });
    
    document.getElementById(navId).classList.add('active');
}

function setupFixedContainers() {
    const videoContainers = [
        document.getElementById('compare-video'),
        document.getElementById('compare-video-stabigs'),
        document.getElementById('compare-video-das3r'),
        document.getElementById('compare-video-das3r-stabigs'),
        document.getElementById('compare-video-cut3r'),
        document.getElementById('compare-video-cut3r-stabigs'),
        document.getElementById('compare-video-meshflow'),
        document.getElementById('compare-video-meshflow-stabigs'),
        document.getElementById('compare-video-fusta'),
        document.getElementById('compare-video-fusta-stabigs'),
        document.getElementById('compare-video-difrint'),
        document.getElementById('compare-video-difrint-stabigs'),
        document.getElementById('compare-video-gavs'),
        document.getElementById('compare-video-gavs-stabigs')
    ];
    
    videoContainers.forEach(container => {
        if (container) {
            container.style.height = "500px";
            container.style.objectFit = "contain";
            container.style.backgroundColor = "transparent";
        }
    });
    
    const descriptionContainers = [
        document.getElementById('compare-description'),
        document.getElementById('compare-description-das3r'),
        document.getElementById('compare-description-cut3r'),
        document.getElementById('compare-description-meshflow'),
        document.getElementById('compare-description-fusta'),
        document.getElementById('compare-description-difrint'),
        document.getElementById('compare-description-gavs')
    ];
    
    descriptionContainers.forEach(container => {
        if (container) {
            container.style.height = "50px";
            container.style.overflow = "auto";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
        }
    });
}

function initCarouselResults() {
    document.querySelectorAll('#carousel-results video source[data-src]').forEach(srcTag => {
        const realSrc = srcTag.getAttribute('data-src');
        srcTag.setAttribute('src', realSrc);
        srcTag.removeAttribute('data-src');
    });

    bulmaCarousel.attach('#carousel-results', {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        initialSlide: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        pagination: false
    });
}

function openInNewTab(element) {
    var url = element.getAttribute('data-link');
    window.open(url, '_blank').focus();
}

document.querySelectorAll('nav ul li a').forEach(function(link) {
    link.addEventListener('click', function() {
        
        const attentionSection = document.getElementById('attn-vis');
        if (attentionSection) {
            attentionSection.style.display = 'block';
        }

        const clusterSection = document.getElementById('cluster-vis');
        if (clusterSection) {
            clusterSection.style.display = 'block';
        }

        const maskSection = document.getElementById('mask-vis');
        if (maskSection) {
            maskSection.style.display = 'block';
        }
    });
});
