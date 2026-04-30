(function () {
    const toolButtons = Array.from(document.querySelectorAll('.nav-item[data-tab]'));
    const toolPanels = Array.from(document.querySelectorAll('.tab-content[data-tool-panel]'));
    const toolFrames = Array.from(document.querySelectorAll('.tool-stage iframe'));
    const activeToolTag = document.getElementById('activeToolTag');
    const activeToolName = document.getElementById('activeToolName');
    const activeToolDescription = document.getElementById('activeToolDescription');
    const activeToolFrameTitle = document.getElementById('activeToolFrameTitle');
    const workspaceStatus = document.getElementById('workspaceStatus');
    const toolLaunchLink = document.getElementById('toolLaunchLink');
    const activeMeta = document.getElementById('activeMeta');
    const countdownEl = document.getElementById('countdown');

    function applyTelegramMode() {
        if (!window.Telegram || !Telegram.WebApp) {
            return;
        }

        document.body.classList.add('telegram-webapp');
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();

        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=666, height=990, initial-scale=1.0';
        }
    }

    function ensureFrameLoaded(tabId) {
        const panel = document.getElementById(tabId);
        if (!panel) {
            return;
        }

        const frame = panel.querySelector('iframe[data-src]');
        if (frame && !frame.getAttribute('src')) {
            frame.setAttribute('src', frame.dataset.src);
        }
    }

    function calculateFrameHeight(frame) {
        const doc = frame.contentDocument;
        if (!doc || !doc.documentElement || !doc.body) {
            return null;
        }

        const body = doc.body;
        const html = doc.documentElement;
        return Math.max(
            720,
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
        );
    }

    function resizeFrame(frame) {
        try {
            const nextHeight = calculateFrameHeight(frame);
            if (!nextHeight) {
                return;
            }

            frame.style.height = `${nextHeight + 8}px`;
        } catch (error) {
            console.warn('Unable to resize tool frame:', error);
        }
    }

    function attachFrameAutoResize(frame) {
        if (!frame || frame.dataset.autosizeBound === 'true') {
            return;
        }

        frame.dataset.autosizeBound = 'true';

        const initializeObservers = function () {
            try {
                const doc = frame.contentDocument;
                const body = doc && doc.body;
                const html = doc && doc.documentElement;
                if (!doc || !body || !html) {
                    return;
                }

                resizeFrame(frame);

                if (frame.__resizeObserver) {
                    frame.__resizeObserver.disconnect();
                }

                if (frame.__mutationObserver) {
                    frame.__mutationObserver.disconnect();
                }

                const scheduleResize = function () {
                    window.requestAnimationFrame(function () {
                        resizeFrame(frame);
                    });
                };

                if ('ResizeObserver' in window) {
                    frame.__resizeObserver = new ResizeObserver(scheduleResize);
                    frame.__resizeObserver.observe(body);
                    frame.__resizeObserver.observe(html);
                }

                frame.__mutationObserver = new MutationObserver(scheduleResize);
                frame.__mutationObserver.observe(body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });

                window.setTimeout(scheduleResize, 80);
                window.setTimeout(scheduleResize, 260);
                window.setTimeout(scheduleResize, 900);
            } catch (error) {
                console.warn('Unable to attach frame observers:', error);
            }
        };

        frame.addEventListener('load', initializeObservers);

        if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
            initializeObservers();
        }
    }

    function syncToolMetadata(button) {
        if (!button) {
            return;
        }

        const title = button.dataset.title || button.textContent.trim();
        const description = button.dataset.description || '';
        const badge = button.dataset.badge || 'Tool Aktif';
        const status = button.dataset.status || 'Siap digunakan di browser';
        const url = button.dataset.url || '';

        if (activeToolTag) {
            activeToolTag.textContent = badge;
        }

        if (activeToolName) {
            activeToolName.textContent = title;
        }

        if (activeToolDescription) {
            activeToolDescription.textContent = description;
        }

        if (activeToolFrameTitle) {
            activeToolFrameTitle.textContent = title;
        }

        if (workspaceStatus) {
            workspaceStatus.textContent = status;
        }

        if (toolLaunchLink) {
            toolLaunchLink.href = url || '#';
            toolLaunchLink.setAttribute('aria-disabled', url ? 'false' : 'true');
        }

        if (activeMeta) {
            activeMeta.textContent = button.dataset.meta || 'Workspace browser-based';
        }

        document.title = `${title} | KML Tools`;
    }

    function setActiveTool(tabId, updateLocation) {
        const targetButton = toolButtons.find((button) => button.dataset.tab === tabId);
        const targetPanel = document.getElementById(tabId);

        if (!targetButton || !targetPanel) {
            return;
        }

        toolButtons.forEach((button) => {
            const isActive = button === targetButton;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        toolPanels.forEach((panel) => {
            const isActive = panel === targetPanel;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', String(!isActive));
        });

        ensureFrameLoaded(tabId);
        syncToolMetadata(targetButton);

        const activeFrame = targetPanel.querySelector('iframe');
        if (activeFrame) {
            window.requestAnimationFrame(function () {
                resizeFrame(activeFrame);
            });
            window.setTimeout(function () {
                resizeFrame(activeFrame);
            }, 180);
        }

        if (updateLocation) {
            window.location.hash = tabId;
        }
    }

    function getInitialTool() {
        const params = new URLSearchParams(window.location.search);
        const requested = params.get('tool') || window.location.hash.replace('#', '');
        if (requested && document.getElementById(requested)) {
            return requested;
        }

        const activeButton = toolButtons.find((button) => button.classList.contains('active'));
        return activeButton ? activeButton.dataset.tab : (toolButtons[0] ? toolButtons[0].dataset.tab : '');
    }

    function updateCountdown() {
        if (!countdownEl) {
            return;
        }

        const target = countdownEl.dataset.targetDate;
        if (!target) {
            return;
        }

        const targetDate = new Date(target).getTime();
        const now = Date.now();
        const diff = targetDate - now;

        if (Number.isNaN(targetDate)) {
            countdownEl.textContent = 'Tanggal tidak valid';
            return;
        }

        if (diff <= 0) {
            countdownEl.textContent = 'Masa aktif selesai';
            return;
        }

        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.textContent = `${months} Bulan | ${days} Hari | ${hours} Jam | ${minutes} Menit | ${seconds} Detik`;
    }

    async function clearCacheAndCookies() {
        try {
            document.cookie.split(';').forEach((cookie) => {
                document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
            });

            localStorage.clear();
            sessionStorage.clear();

            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map((name) => caches.delete(name)));
            }

            const nextUrl = `${window.location.pathname}?nocache=${Date.now()}${window.location.hash}`;
            window.location.replace(nextUrl);
        } catch (error) {
            console.error('Error clearing cache and cookies:', error);
            window.alert('Terjadi kesalahan saat membersihkan cache dan cookies.');
        }
    }

    window.clearCacheAndCookies = clearCacheAndCookies;

    document.addEventListener('click', function (event) {
        const button = event.target.closest('.nav-item[data-tab]');
        if (!button) {
            return;
        }

        setActiveTool(button.dataset.tab, true);
    });

    window.addEventListener('hashchange', function () {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            setActiveTool(hash, false);
        }
    });

    applyTelegramMode();
    toolFrames.forEach(attachFrameAutoResize);
    const initialTool = getInitialTool();
    if (initialTool) {
        setActiveTool(initialTool, false);
    }

    updateCountdown();
    if (countdownEl) {
        window.setInterval(updateCountdown, 1000);
    }
})();
