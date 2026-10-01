const path = require("path");
const express = require("express");
const cors = require("cors");

const config = require("./config");
const videosRouter = require("./routes/videos");

// v2/backend/src -> v2
const V2_ROOT = path.join(__dirname, "../..");
// v2/backend/src -> raiz do repositório
const REPO_ROOT = path.join(__dirname, "../../..");

const PAGES = ["index.html", "films.html", "about.html", "contact.html"];

function createApp() {
    const app = express();
    app.disable("x-powered-by");

    if (config.allowedOrigins.length > 0) {
        app.use("/api", cors({ origin: config.allowedOrigins }));
    }

    // Serve apenas as pastas públicas da v2 e os assets compartilhados na
    // raiz do repo. NUNCA sirva v2/ inteiro com express.static: isso
    // exporia v2/backend (incluindo o .env) para qualquer visitante.
    app.use("/css", express.static(path.join(V2_ROOT, "css")));
    app.use("/js", express.static(path.join(V2_ROOT, "js")));
    app.use("/assets", express.static(path.join(REPO_ROOT, "assets")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(V2_ROOT, "index.html"));
    });

    for (const page of PAGES) {
        app.get(`/${page}`, (req, res) => {
            res.sendFile(path.join(V2_ROOT, page));
        });
    }

    app.get("/api/health", (req, res) => res.json({ status: "ok" }));
    app.use("/api/videos", videosRouter);

    app.use("/api", (req, res) => {
        res.status(404).json({ error: "Rota não encontrada" });
    });

    // Express 5 encaminha rejeições de handlers async automaticamente,
    // então nenhuma rota precisa de try/catch — tudo cai aqui.
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(502).json({ error: "Não foi possível carregar os vídeos agora" });
    });

    return app;
}

module.exports = createApp;
