const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

function parseList(value) {
    if (!value) return [];
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const vimeoToken = process.env.VIMEO_TOKEN;

if (!vimeoToken) {
    console.error(
        "Erro de configuração: VIMEO_TOKEN não foi definido em v2/backend/.env"
    );
    process.exit(1);
}

const config = {
    vimeoToken,
    // Sem ID de vitrine, a vitrine correspondente retorna [] sem chamar o Vimeo.
    vimeoAlbumNarrative: process.env.VIMEO_ALBUM_NARRATIVE || null,
    vimeoAlbumCommercial: process.env.VIMEO_ALBUM_COMMERCIAL || null,
    port: parsePositiveInt(process.env.PORT, 3000),
    cacheTtlMinutes: parsePositiveInt(process.env.CACHE_TTL_MINUTES, 15),
    allowedOrigins: parseList(process.env.ALLOWED_ORIGINS),
};

module.exports = config;
