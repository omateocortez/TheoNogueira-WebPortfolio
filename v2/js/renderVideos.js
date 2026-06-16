async function renderVideos() {
    const data = await getVideos();
    if (!data) return;

    const narrativeEl = document.getElementById("narrative-videos");
    if (narrativeEl && data.narrative?.length) {
        const videos = data.narrative;
        narrativeEl.innerHTML = `
            <button type="button" class="work-card film-card is-tall reveal"
                data-video-trigger
                data-video-id="${videos[0].id}"
                data-video-title="${videos[0].title}"
                data-video-meta="narrative"
                data-video-description="Narrative work">
                <div class="work-card-media">
                    <img src="${videos[0].thumbnail}" alt="${videos[0].title}">
                    <div class="work-card-overlay"><div class="play-circle"></div></div>
                </div>
                <div class="work-card-title">${videos[0].title}</div>
                <div class="work-card-meta">narrative</div>
            </button>
            <div class="reveal delay-2">
                ${videos.slice(1).map(video => `
                    <button type="button" class="work-card film-card"
                        data-video-trigger
                        data-video-id="${video.id}"
                        data-video-title="${video.title}"
                        data-video-meta="narrative"
                        data-video-description="Narrative work"
                        style="display:block; margin-bottom:2rem;">
                        <div class="work-card-media">
                            <img src="${video.thumbnail}" alt="${video.title}">
                            <div class="work-card-overlay"><div class="play-circle"></div></div>
                        </div>
                        <div class="work-card-title">${video.title}</div>
                        <div class="work-card-meta">narrative</div>
                    </button>
                `).join("")}
            </div>
        `;
    }

    const commercialEl = document.getElementById("commercial-videos");
    const commercialSection = document.getElementById("commercial");

    if (data.commercial?.length) {
        commercialEl.innerHTML = data.commercial.map((video, i) => `
        <button type="button" class="work-card film-card reveal${i > 0 ? ' delay-' + i : ''}"
            data-video-trigger
            data-video-id="${video.id}"
            data-video-title="${video.title}"
            data-video-meta="commercial"
            data-video-description="Commercial work">
            <div class="work-card-media">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="work-card-overlay"><div class="play-circle"></div></div>
            </div>
            <div class="work-card-title">${video.title}</div>
            <div class="work-card-meta">commercial</div>
        </button>
    `).join("");
    } else {
        if (commercialSection) commercialSection.style.display = "none";
    }

    window.bindLightboxTriggers();
}

renderVideos();