// Até esse número de vídeos (destaque incluído), a vitrine usa o primeiro
// vídeo como destaque grande + os demais numa mini-grade ao lado. Acima
// disso, uma grade uniforme de 3 colunas fica mais equilibrada do que um
// destaque ao lado de uma coluna de vídeos bem mais alta que ele.
const FEATURED_VIDEO_THRESHOLD = 6;

function filmCardHTML(video, { category, tall = false, revealClass = "reveal" } = {}) {
    const description = category === "narrative" ? "Narrative work" : "Commercial work";
    return `
        <button type="button" class="work-card film-card${tall ? " is-tall" : ""} ${revealClass}"
            data-video-trigger
            data-video-id="${video.id}"
            data-video-title="${video.title}"
            data-video-meta="${category}"
            data-video-description="${description}">
            <div class="work-card-media">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="work-card-overlay"><div class="play-circle"></div></div>
            </div>
            <div class="work-card-title">${video.title}</div>
            <div class="work-card-meta">${category}</div>
        </button>
    `;
}

function renderFeaturedLayout(videos, category) {
    const [hero, ...rest] = videos;
    return `
        ${filmCardHTML(hero, { category, tall: true })}
        <div class="films-grid-rest reveal delay-2">
            ${rest.map(video => filmCardHTML(video, { category })).join("")}
        </div>
    `;
}

function renderUniformLayout(videos, category) {
    return videos
        .map((video, i) => filmCardHTML(video, { category, revealClass: `reveal${i > 0 ? ' delay-' + i : ''}` }))
        .join("");
}

function renderShowcase(container, videos, category) {
    const useFeatured = videos.length > 1 && videos.length <= FEATURED_VIDEO_THRESHOLD;
    container.classList.toggle("two-col", useFeatured);
    container.innerHTML = useFeatured
        ? renderFeaturedLayout(videos, category)
        : renderUniformLayout(videos, category);
}

async function renderVideos() {
    const data = await getVideos();
    if (!data) return;

    const narrativeEl = document.getElementById("narrative-videos");
    const narrativeSection = document.getElementById("narrative");
    const narrativeNavLink = document.querySelector('a[href="#narrative"]');

    if (data.narrative?.length) {
        renderShowcase(narrativeEl, data.narrative, "narrative");
    } else {
        if (narrativeSection) narrativeSection.style.display = "none";
        if (narrativeNavLink) narrativeNavLink.style.display = "none";
    }

    const commercialEl = document.getElementById("commercial-videos");
    const commercialSection = document.getElementById("commercial");

    if (data.commercial?.length) {
        renderShowcase(commercialEl, data.commercial, "commercial");
    } else {
        if (commercialSection) commercialSection.style.display = "none";
    }

    window.bindLightboxTriggers();
}

renderVideos();
