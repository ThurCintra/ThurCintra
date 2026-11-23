// Gera preview.html: mostra o README como ele aparece no perfil do GitHub.
// Usa a API de Markdown do GitHub (mesmo renderizador do site).
// Uso:  node preview.mjs   e abra preview.html por um servidor local.
import { readFileSync, writeFileSync } from 'node:fs'

const md = readFileSync('README.md', 'utf8')
const res = await fetch('https://api.github.com/markdown', {
  method: 'POST',
  headers: { Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
  // mode "markdown" = mesmo modo dos arquivos README (o "gfm" é o de comentários)
  body: JSON.stringify({ text: md, mode: 'markdown' }),
})
let html = await res.text()

// A cobrinha só existe depois que o workflow rodar no GitHub: mostra um aviso no lugar.
html = html.replace(
  /<picture>[\s\S]*?<\/picture>/,
  '<div style="border:1px dashed #30363d;border-radius:6px;padding:28px;color:#9198a1">🐍 Aqui aparece a cobrinha comendo seu gráfico de contribuições (gerada pelo GitHub Actions depois do primeiro push).</div>',
)

const page = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prévia do perfil · ThurCintra</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown-dark.css">
<style>
body{margin:0;background:#0d1117;color:#e6edf3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif}
.top{background:#010409;border-bottom:1px solid #30363d;padding:16px 24px;font-size:14px;color:#9198a1}.top b{color:#e6edf3}
.wrap{max-width:1280px;margin:0 auto;padding:24px;display:grid;grid-template-columns:296px minmax(0,1fr);gap:24px}
.side img{width:296px;height:296px;border-radius:50%;border:1px solid #30363d}
.side h1{margin:16px 0 0;font-size:24px}.side p{color:#9198a1;font-size:20px;margin:0}
.box{border:1px solid #30363d;border-radius:6px;padding:24px}
.box .head{font-size:12px;color:#9198a1;margin-bottom:16px;font-family:ui-monospace,Consolas,monospace}
@media(max-width:1012px){.wrap{grid-template-columns:minmax(0,1fr)}.side{display:flex;gap:16px;align-items:center}.side img{width:96px;height:96px}.side h1{margin:0}}
</style></head><body>
<div class="top">Prévia local · <b>github.com/ThurCintra</b> (README do repositório ThurCintra/ThurCintra)</div>
<div class="wrap"><aside class="side"><img src="https://avatars.githubusercontent.com/u/211813042?v=4" alt=""><div><h1>Arthur Cintra</h1><p>ThurCintra</p></div></aside>
<main class="box"><div class="head">ThurCintra / README.md</div><article class="markdown-body" style="background:transparent">${html}</article></main></div>
</body></html>`

writeFileSync('preview.html', page)
console.log('preview.html gerado')
