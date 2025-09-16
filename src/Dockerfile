# src/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app

# Copia somente os manifests para aproveitar cache de deps
COPY package.json package-lock.json* ./

# --- Higienização segura: remove "next/jest" do package.json, se existir ---
# (next/jest é um SUBPATH IMPORT do pacote "next", não um pacote publicado no npm)
RUN node - <<'EOF'
const fs = require('fs');
const f = 'package.json';
const raw = fs.readFileSync(f, 'utf8');
let p;
try {
  p = JSON.parse(raw);
} catch (e) {
  console.error('package.json inválido:', e.message);
  process.exit(1);
}
let changed = false;
['dependencies','devDependencies','peerDependencies','optionalDependencies'].forEach(k=>{
  if (p[k] && Object.prototype.hasOwnProperty.call(p[k], 'next/jest')) {
    delete p[k]['next/jest'];
    changed = true;
  }
});
if (changed) {
  fs.writeFileSync(f, JSON.stringify(p, null, 2));
  console.log('✔ Removido "next/jest" do package.json');
} else {
  console.log('ℹ "next/jest" não encontrado no package.json (ok)');
}
EOF

# Instala dependências
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund

# ================= BUILD =================
FROM deps AS build
WORKDIR /app
COPY . .

# Garante que o CSS global existe no caminho esperado
RUN test -f ./styles/globals.css || (echo '❌ Faltando styles/globals.css em src/styles/'; exit 1)

# Cria public/ se não existir (evita falha no COPY do runner)
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ================= RUNTIME =================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Apenas o necessário para rodar
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=deps  /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm","start"]