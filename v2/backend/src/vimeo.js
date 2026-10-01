const VIMEO_API_BASE = "https://api.vimeo.com";
const REQUEST_TIMEOUT_MS = 8000;
const VIDEO_FIELDS = "name,uri,pictures.sizes,privacy.view";

// Marca o erro como "de Vimeo" para o error handler do Express responder de
// forma consistente (502 + mensagem fixa), sem assumir que todo erro da
// aplicação é sobre vídeo — ver src/app.js.
function toVimeoError(message) {
    const error = new Error(message);
    error.publicStatus = 502;
    error.publicMessage = "Não foi possível carregar os vídeos agora";
    return error;
}

async function vimeoFetch(path, token, params = {}) {
    const url = new URL(`${VIMEO_API_BASE}${path}`);
    url.searchParams.set("fields", VIDEO_FIELDS);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    let response;
    try {
        response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (cause) {
        throw toVimeoError(`Falha ao conectar ao Vimeo em ${path}: ${cause.message}`);
    }

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        const error = toVimeoError(
            `Vimeo respondeu ${response.status} para ${path}: ${body.slice(0, 300)}`
        );
        error.status = response.status;
        throw error;
    }

    return response.json();
}

function pickThumbnail(video) {
    const sizes = video.pictures?.sizes;
    if (!sizes || sizes.length === 0) return null;

    const atLeast960 = sizes.find((size) => size.width >= 960);
    if (atLeast960) return atLeast960.link;

    return sizes.at(-1).link;
}

function mapVideo(video) {
    return {
        id: video.uri.split("/").pop(),
        title: video.name,
        thumbnail: pickThumbnail(video),
    };
}

async function getShowcaseVideos(albumId, token) {
    if (!albumId) return [];

    const data = await vimeoFetch(`/me/albums/${albumId}/videos`, token, {
        per_page: 100,
        sort: "default",
    });

    return data.data.map(mapVideo);
}

async function getRecentVideos(token, count = 3) {
    const data = await vimeoFetch("/me/videos", token, {
        sort: "date",
        direction: "desc",
        per_page: 25,
    });

    return data.data
        .filter((video) => video.privacy?.view === "anybody")
        .slice(0, count)
        .map(mapVideo);
}

module.exports = { getShowcaseVideos, getRecentVideos };
