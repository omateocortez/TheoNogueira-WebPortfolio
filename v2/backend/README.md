# Backend — theonogueira.com

API Express que busca vídeos do Vimeo e serve o site estático da v2.

## Como rodar

```bash
cd v2/backend
cp .env-example .env   # preencha VIMEO_TOKEN (e os IDs de vitrine, se já existirem)
npm install
npm start               # produção
npm run dev             # com --watch, reinicia ao salvar
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`)
e serve o site inteiro — não é preciso rodar o front separadamente.

## Estrutura

```
v2/backend/
├── server.js            # sobe o app e trata SIGTERM/SIGINT
├── src/
│   ├── config.js         # carrega e valida o .env
│   ├── app.js             # Express: estáticos, rotas, 404, erro
│   ├── routes/videos.js   # GET /api/videos e /api/videos/recent
│   ├── vimeo.js           # chamadas à API do Vimeo + mapeamento
│   └── cache.js           # cache em memória com TTL
├── .env                  # não versionado
└── .env-example
```

## Rotas

| Rota | Descrição |
|---|---|
| `GET /api/health` | `{ status: "ok" }` |
| `GET /api/videos` | `{ narrative: [...], commercial: [...] }` |
| `GET /api/videos/recent` | até 3 vídeos recentes e públicos da conta |
| `GET /`, `/films.html`, `/about.html`, `/contact.html` | páginas da v2 |
| `GET /css/*`, `/js/*` | estáticos da v2 |
| `GET /assets/*` | imagens/ícones compartilhados (raiz do repo) |

Cada vídeo tem o formato `{ id, title, thumbnail }`. `thumbnail` é `null`
quando o Vimeo ainda não processou as imagens do vídeo. Uma vitrine sem ID
configurado (`VIMEO_ALBUM_NARRATIVE`/`VIMEO_ALBUM_COMMERCIAL`) retorna `[]`
sem chamar o Vimeo — é o estado atual da vitrine "narrative".

Apenas `backend/` fica fora do que é servido publicamente: nada em
`v2/backend` (incluindo o `.env`) é acessível por HTTP.

## Cache

As respostas de vídeo ficam em cache em memória por `CACHE_TTL_MINUTES`
(padrão 15 minutos), para não bater na API do Vimeo a cada visita.
`narrative`, `commercial` e `recent` têm cada uma sua própria chave de
cache — uma falha ao buscar uma vitrine não descarta nem atrasa a outra.

Se a busca ao Vimeo falhar e já existir um valor em cache (mesmo expirado),
esse valor antigo é devolvido e um aviso é logado. Se ainda não houver
nenhum valor em cache para aquela chave:
- em `/api/videos`, a vitrine que falhou volta como `[]` (logado como erro)
  e a resposta continua `200` — o site funciona mesmo que uma vitrine
  esteja fora do ar;
- em `/api/videos/recent`, o erro sobe e vira `502` na resposta.

O cache é em memória do processo: reinicia zerado a cada deploy/restart.

## Outros middlewares

- `helmet` (sem CSP — o site carrega Bootstrap via jsdelivr, Google Fonts e
  thumbnails/player do Vimeo; uma política de CSP correta pra isso fica
  para depois).
- `compression` para gzip nas respostas.
- `morgan` para log de acesso (`dev` fora de produção, `combined` quando
  `NODE_ENV=production`).
