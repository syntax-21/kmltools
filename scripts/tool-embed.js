(function () {
    if (window.self === window.top) {
        return;
    }

    let resizeObserver = null;
    let mutationObserver = null;
    let scheduled = false;
    let lastPostedHeight = 0;

    function getContentRoot() {
        return document.querySelector('main.page-shell') || document.body;
    }

    function getDocumentHeight() {
        const root = getContentRoot();
        if (!root) {
            return 0;
        }

        return Math.ceil(Math.max(
            root.getBoundingClientRect().height,
            root.offsetHeight,
            root.scrollHeight
        ));
    }

    function postHeight() {
        scheduled = false;

        const height = getDocumentHeight();
        if (!height) {
            return;
        }

        if (Math.abs(lastPostedHeight - height) < 4) {
            return;
        }

        lastPostedHeight = height;

        window.parent.postMessage({
            type: 'kmltools:frame-size',
            height: height
        }, '*');
    }

    function schedulePostHeight() {
        if (scheduled) {
            return;
        }

        scheduled = true;
        window.requestAnimationFrame(postHeight);
    }

    function initializeObservers() {
        if (!document.body || !document.documentElement) {
            return;
        }

        schedulePostHeight();

        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(schedulePostHeight);
            resizeObserver.observe(document.body);
            resizeObserver.observe(document.documentElement);
        }

        mutationObserver = new MutationObserver(schedulePostHeight);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });

        window.setTimeout(schedulePostHeight, 120);
        window.setTimeout(schedulePostHeight, 400);
        window.setTimeout(schedulePostHeight, 1200);
    }

    window.addEventListener('load', initializeObservers);
    window.addEventListener('resize', schedulePostHeight);
    document.addEventListener('readystatechange', schedulePostHeight);

    if (document.readyState === 'complete') {
        initializeObservers();
    }
})();
