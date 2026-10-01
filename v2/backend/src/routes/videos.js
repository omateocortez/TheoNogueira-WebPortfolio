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

router.get("/", async (req, res) => {
    const data = await cache.getOrFetch("videos", async () => {
        const [narrative, commercial] = await Promise.all([
            getShowcaseVideos(config.vimeoAlbumNarrative, config.vimeoToken),
            getShowcaseVideos(config.vimeoAlbumCommercial, config.vimeoToken),
        ]);

        return { narrative, commercial };
    });

    res.json(data);
});

router.get("/recent", async (req, res) => {
    const data = await cache.getOrFetch("recent", () =>
        getRecentVideos(config.vimeoToken, 3)
    );

    res.json(data);
});

module.exports = router;
