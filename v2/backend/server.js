const createApp = require("./src/app");
const config = require("./src/config");

const app = createApp();

const server = app.listen(config.port, () => {
    console.log(`API rodando na porta ${config.port}`);
});

const SHUTDOWN_TIMEOUT_MS = 10000;

function shutdown(signal) {
    console.log(`${signal} recebido, encerrando servidor...`);

    // Rede de segurança: se alguma conexão ficar pendurada e o close()
    // nunca chamar o callback, força a saída em vez de deixar o processo
    // pendurado (orquestradores como Docker/Render mandam SIGKILL depois
    // de alguns segundos, o que é um shutdown "sujo").
    const forceExitTimer = setTimeout(() => {
        console.error("Timeout ao encerrar servidor, forçando saída.");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExitTimer.unref();

    server.close((err) => {
        clearTimeout(forceExitTimer);
        if (err) {
            console.error("Erro ao encerrar servidor:", err);
            process.exit(1);
        }
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
