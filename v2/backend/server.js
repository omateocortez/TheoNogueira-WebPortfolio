const createApp = require("./src/app");
const config = require("./src/config");

const app = createApp();

const server = app.listen(config.port, () => {
    console.log(`API rodando na porta ${config.port}`);
});

function shutdown(signal) {
    console.log(`${signal} recebido, encerrando servidor...`);
    server.close((err) => {
        if (err) {
            console.error("Erro ao encerrar servidor:", err);
            process.exit(1);
        }
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
