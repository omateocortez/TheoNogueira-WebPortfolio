require("dotenv").config();
const express = require("express");
const cors = require ("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/api/videos", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.vimeo.com/me/videos",
            {
                headers: {
                    Authorization: `Bearer ${process.env.VIMEO_TOKEN}`
                }
            }
        );

        const videos = response.data.data.map(video => ({
            title: video.name,
            id: video.uri.split("/").pop(),
            thumbnail: video.pictures.sizes.at(-1).link
        }));

        res.json({
            narrative: videos
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: "Erro ao buscar Vimeo"
        });
    }
});

app.listen(3000, () => {
    console.log("API rodando na porta 3000");
});