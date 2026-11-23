// Gera os SVGs animados do README do perfil (pasta assets/).
// Uso:  node gerar-svgs.mjs
// Para mudar as frases que "digitam" no banner, edite PHRASES abaixo.
// As animações usam SMIL/CSS dentro do SVG, que o GitHub mostra normalmente.
import { mkdirSync, writeFileSync } from 'node:fs'

// Cada frase deve ter no máximo ~32 caracteres para caber no terminal.
const PHRASES = [
  'Desenvolvedor em formação',
  'IA & Cibersegurança',
  'React · Node.js · Python · C#',
  'Electron · .NET · YOLOv8',
  'Aberto a estágio / júnior',
]

const C = {
  bg: '#0B0F14',
  surface: '#121A23',
  surface2: '#18222D',
  line: '#233040',
  fg: '#E6EDF3',
  muted: '#93A1AE',
  accent: '#34D399',
  accent2: '#A78BFA',
}
const MONO = "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace"
const SANS = "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif"
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

mkdirSync('assets', { recursive: true })

/* ------------------------------------------------------------------ */
/* Banner do topo: nome com brilho, terminal que digita as frases      */
/* ------------------------------------------------------------------ */
function header() {
  const W = 1200
  const H = 330
  const fs = 24 // fonte do terminal
  const cw = fs * 0.6 // largura aproximada de um caractere monoespaçado
  const tx = 660 // início do texto digitado
  const ty = 246
  const per = 4.5 // segundos por frase
  const total = per * PHRASES.length

  // Cada frase: digita (40%), espera (35%), apaga (15%), pausa (10%)
  const phraseEls = PHRASES.map((p, i) => {
    const w = Math.ceil(p.length * cw) + 4
    const s = (i * per) / total
    const k = (f) => +(s + (f * per) / total).toFixed(4)
    const keyTimes = [0, k(0), k(0.4), k(0.75), k(0.9), 1]
    const vals = [0, 0, w, w, 0, 0]
    const fixed = keyTimes.map((t, j) => (j > 0 && t <= keyTimes[j - 1] ? keyTimes[j - 1] + 0.0001 : t))
    return `
    <clipPath id="clip${i}"><rect x="${tx}" y="${ty - fs}" height="${fs + 10}" width="0">
      <animate attributeName="width" dur="${total}s" repeatCount="indefinite" values="${vals.join(';')}" keyTimes="${fixed.join(';')}" />
    </rect></clipPath>
    <text x="${tx}" y="${ty}" clip-path="url(#clip${i})" class="type">${esc(p)}</text>`
  })

  // Cursor acompanha o fim do texto
  const curTimes = [0]
  const curVals = [tx]
  PHRASES.forEach((p, i) => {
    const w = Math.ceil(p.length * cw) + 4
    const s = (i * per) / total
    const k = (f) => +(s + (f * per) / total).toFixed(4)
    curTimes.push(k(0.0001), k(0.4), k(0.75), k(0.9))
    curVals.push(tx, tx + w, tx + w, tx)
  })
  curTimes.push(1)
  curVals.push(tx)
  for (let j = 1; j < curTimes.length; j++) if (curTimes[j] <= curTimes[j - 1]) curTimes[j] = +(curTimes[j - 1] + 0.0001).toFixed(4)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Arthur Cintra</title>
  <desc id="d">Desenvolvedor em formação com foco em Inteligência Artificial e Cibersegurança. Franca, SP.</desc>
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.2" fill="#94A3B8" fill-opacity=".14" />
    </pattern>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${C.accent}" stop-opacity=".35" />
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${C.accent2}" stop-opacity=".28" />
      <stop offset="1" stop-color="${C.accent2}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="name" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${C.fg}" />
      <stop offset=".45" stop-color="${C.fg}" />
      <stop offset=".5" stop-color="${C.accent}" />
      <stop offset=".55" stop-color="${C.fg}" />
      <stop offset="1" stop-color="${C.fg}" />
      <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0" dur="5s" repeatCount="indefinite" />
    </linearGradient>
    <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0" />
      <stop offset=".5" stop-color="${C.accent}" stop-opacity=".09" />
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0" />
    </linearGradient>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="18" /></clipPath>
    <style>
      .type { font: 500 ${fs}px ${MONO}; fill: ${C.accent}; }
      .mono { font-family: ${MONO}; }
      .blink { animation: blink 1.1s steps(1) infinite; }
      @keyframes blink { 50% { opacity: 0; } }
      .float { animation: float 6s ease-in-out infinite; }
      .float2 { animation: float 8s ease-in-out infinite reverse; }
      @keyframes float { 50% { transform: translate(30px, 18px); } }
      .rise { animation: rise .9s ease-out both; }
      .rise2 { animation: rise .9s .25s ease-out both; }
      .rise3 { animation: rise .9s .5s ease-out both; }
      @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
      .pulse { animation: pulse 2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
      @keyframes pulse { 50% { opacity: .35; transform: scale(1.6); } }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
    </style>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${C.bg}" />
    <rect width="${W}" height="${H}" fill="url(#dots)" />
    <circle class="float" cx="230" cy="40" r="260" fill="url(#glow)" />
    <circle class="float2" cx="1080" cy="320" r="240" fill="url(#glow2)" />
    <rect width="${W}" height="120" fill="url(#scan)">
      <animate attributeName="y" values="-120;${H}" dur="6s" repeatCount="indefinite" />
    </rect>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${C.line}" />

  <!-- Lado esquerdo: identidade -->
  <g class="rise">
    <text x="64" y="92" class="mono" font-size="20" fill="${C.accent}">~/arthur.cintra</text>
  </g>
  <g class="rise2">
    <text x="60" y="168" font-family="${SANS}" font-size="72" font-weight="700" fill="url(#name)" letter-spacing="-1.5">Arthur Cintra</text>
  </g>
  <g class="rise3">
    <text x="64" y="214" font-family="${SANS}" font-size="22" fill="${C.muted}">Técnico em Desenvolvimento de Sistemas · SENAI</text>
    <circle class="pulse" cx="72" cy="258" r="6" fill="${C.accent}" />
    <circle cx="72" cy="258" r="6" fill="${C.accent}" />
    <text x="88" y="265" class="mono" font-size="18" fill="${C.fg}">Franca, SP · online</text>
  </g>

  <!-- Lado direito: janela de terminal -->
  <g class="rise2">
    <rect x="630" y="70" width="520" height="210" rx="14" fill="${C.surface}" stroke="${C.line}" />
    <path d="M630 84a14 14 0 0 1 14-14h492a14 14 0 0 1 14 14v26H630z" fill="${C.surface2}" />
    <line x1="630" y1="110" x2="1150" y2="110" stroke="${C.line}" />
    <circle cx="656" cy="90" r="6.5" fill="#FF5F57" />
    <circle cx="678" cy="90" r="6.5" fill="#FEBC2E" />
    <circle cx="700" cy="90" r="6.5" fill="#28C840" />
    <text x="722" y="95" class="mono" font-size="15" fill="${C.muted}">arthur@franca: ~</text>
    <text x="656" y="152" class="mono" font-size="20"><tspan fill="${C.accent}">$ </tspan><tspan fill="${C.fg}">whoami</tspan></text>
    <text x="656" y="182" class="mono" font-size="18" fill="${C.muted}">Arthur Cintra de Lacerda</text>
    <text x="640" y="${ty}" class="mono" font-size="${fs}" fill="${C.accent}" text-anchor="start">›</text>
    ${phraseEls.join('')}
    <rect y="${ty - fs + 4}" width="12" height="${fs}" fill="${C.accent}" class="blink">
      <animate attributeName="x" dur="${total}s" repeatCount="indefinite" values="${curVals.join(';')}" keyTimes="${curTimes.join(';')}" />
    </rect>
  </g>
</svg>
`
}

/* ------------------------------------------------------------------ */
/* Título de seção animado: "// texto" com sublinhado que corre       */
/* ------------------------------------------------------------------ */
function sectionTitle(file, label, color = C.accent) {
  const w = 900
  const textW = Math.ceil((label.length + 3) * 22 * 0.6) + 10
  return [
    file,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="54" viewBox="0 0 ${w} 54" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0" />
      <stop offset=".5" stop-color="${color}" />
      <stop offset="1" stop-color="${color}" stop-opacity="0" />
    </linearGradient>
    <style>
      .t { font: 600 22px ${MONO}; }
      .in { animation: in .8s ease-out both; }
      @keyframes in { from { opacity: 0; transform: translateX(-12px); } }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
    </style>
  </defs>
  <g class="in">
    <text x="2" y="30" class="t"><tspan fill="${color}">// </tspan><tspan fill="#C9D1D9">${esc(label)}</tspan></text>
  </g>
  <rect x="2" y="44" width="${w - 4}" height="1" fill="#30363D" />
  <rect y="43" width="160" height="3" rx="1.5" fill="url(#g)">
    <animate attributeName="x" values="-160;${w}" dur="3.5s" repeatCount="indefinite" />
  </rect>
  <rect x="2" y="43" width="${textW}" height="3" rx="1.5" fill="${color}" opacity=".9">
    <animate attributeName="width" values="0;${textW}" dur=".9s" fill="freeze" />
  </rect>
</svg>
`,
  ]
}

/* ------------------------------------------------------------------ */
/* Rodapé: ondas em movimento                                          */
/* ------------------------------------------------------------------ */
function footer() {
  const W = 1200
  const H = 140
  const wave = (amp, off) => {
    const pts = []
    for (let x = 0; x <= W * 2; x += 60) pts.push(`${x},${70 + Math.sin((x + off) / 95) * amp}`)
    return `M0,${H} L${pts.join(' L')} L${W * 2},${H} Z`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rodapé decorativo">
  <title>Obrigado pela visita!</title>
  <style>
    .w1 { animation: slide 9s linear infinite; }
    .w2 { animation: slide 14s linear infinite reverse; }
    @keyframes slide { to { transform: translateX(-${(95 * 2 * Math.PI * 2).toFixed(1)}px); } }
    .txt { font: 600 20px ${MONO}; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>
  <path class="w2" d="${wave(14, 40)}" fill="${C.accent2}" fill-opacity=".18" />
  <path class="w1" d="${wave(18, 0)}" fill="${C.accent}" fill-opacity=".22" />
  <text x="${W / 2}" y="${H - 26}" text-anchor="middle" class="txt"><tspan fill="${C.accent}">$ </tspan><tspan fill="#E6EDF3">echo "obrigado pela visita!"</tspan></text>
</svg>
`
}

const files = [
  ['header.svg', header()],
  sectionTitle('sobre.svg', 'sobre mim'),
  sectionTitle('projetos.svg', 'projetos em destaque'),
  sectionTitle('stack.svg', 'linguagens e ferramentas', C.accent2),
  sectionTitle('github.svg', 'atividade no github'),
  ['footer.svg', footer()],
]
for (const [name, svg] of files) writeFileSync(`assets/${name}`, svg)
console.log('gerados:', files.map((f) => f[0]).join(', '))
