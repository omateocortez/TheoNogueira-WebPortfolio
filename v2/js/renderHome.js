async function renderRecentVideos() {
    try {
        const response = await fetch("http://localhost:3000/api/videos/recent");
        const videos = await response.json();

        const grid = document.querySelector(".home-work-grid");
        if (!grid || !videos?.length) return;

        const delays = ["delay-1", "delay-2", "delay-3"];

        grid.innerHTML = videos.map((video, i) => `
            <button
                type="button"
                class="work-card reveal ${delays[i]}"
                data-video-trigger
                data-video-id="${video.id}"
                data-video-title="${video.title}"
                data-video-meta="recent work"
                data-video-description=""
            >
                <div class="work-card-media">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="work-card-overlay"><div class="play-circle"></div></div>
                </div>
                <div class="work-card-title">${video.title}</div>
                <div class="work-card-meta">recent work</div>
            </button>
        `).join("");

        window.bindLightboxTriggers();

    } catch (error) {
        console.error("Erro ao renderizar vídeos recentes", error);
    }
}

renderRecentVideos();