require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.listen(3000, () => console.log("API rodando na porta 3000"));

async function getShowcaseVideos(albumId) {
    if (!albumId) return [];
    try {
        const response = await axios.get(
            `https://api.vimeo.com/me/albums/${albumId}/videos`,
            { headers: { Authorization: `Bearer ${process.env.VIMEO_TOKEN}` } }
        );
        return response.data.data.map(video => ({
            title: video.name,
            id: video.uri.split("/").pop(),
            thumbnail: video.pictures.sizes.at(-1).link
        }));
    } catch {
        return [];
    }
}

app.get("/api/videos", async (req, res) => {
    try {
        const [narrative, commercial] = await Promise.all([
            getShowcaseVideos(process.env.VIMEO_ALBUM_NARRATIVE),
            getShowcaseVideos(process.env.VIMEO_ALBUM_COMMERCIAL),
        ]);

        res.json({ narrative, commercial });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao buscar Vimeo" });
    }
});

app.get("/api/videos/recent", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.vimeo.com/me/videos?sort=date&direction=desc&per_page=3",
            { headers: { Authorization: `Bearer ${process.env.VIMEO_TOKEN}` } }
        );

        const videos = response.data.data.map(video => ({
            title: video.name,
            id: video.uri.split("/").pop(),
            thumbnail: video.pictures.sizes.at(-1).link
        }));

        res.json(videos);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao buscar vídeos recentes" });
    }
});
