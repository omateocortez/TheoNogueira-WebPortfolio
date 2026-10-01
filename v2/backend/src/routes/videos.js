const express = require("express");

const config = require("../config");
const { getShowcaseVideos, getRecentVideos } = require("../vimeo");
const { createCache } = require("../cache");

const router = express.Router();
const cache = createCache({ ttlMs: config.cacheTtlMinutes * 60 * 1000 });

router.use((req, res, next) => {
    res.set("Cache-Control", "public, max-age=300");
    next();
});

// Cada vitrine tem sua própria chave de cache: se o Vimeo falhar para uma
// delas, a outra não é descartada nem volta para um valor antigo à toa — só
// a vitrine afetada cai no fallback do cache. Se nem isso existir ainda
// (primeira chamada falhando), devolve [] para aquela vitrine em vez de
// derrubar a resposta inteira — o site precisa funcionar sem ela.
async function fetchShowcase(key, albumId) {
    try {
        return await cache.getOrFetch(key, () =>
            getShowcaseVideos(albumId, config.vimeoToken)
        );
    } catch (error) {
        console.error(`[videos] falha ao obter vitrine "${key}": ${error.message}`);
        return [];
    }
}

router.get("/", async (req, res) => {
    const [narrative, commercial] = await Promise.all([
        fetchShowcase("videos:narrative", config.vimeoAlbumNarrative),
        fetchShowcase("videos:commercial", config.vimeoAlbumCommercial),
    ]);

    res.json({ narrative, commercial });
});

router.get("/recent", async (req, res) => {
    const data = await cache.getOrFetch("recent", () =>
        getRecentVideos(config.vimeoToken, 3)
    );

    res.json(data);
});

module.exports = router;
