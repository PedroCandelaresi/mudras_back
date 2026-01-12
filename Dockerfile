# ---- deps (dev) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# ---- runtime (prod) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# instala solo dependencias de prod (y opcionalmente sin scripts)
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# copiar build como usuario node
COPY --from=build --chown=node:node /app/dist ./dist
# si necesitás archivos extra en runtime, copiálos también con --chown

# correr como no-root
USER node

EXPOSE 4000
CMD ["node","dist/main.js"]
