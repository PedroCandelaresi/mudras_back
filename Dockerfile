# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build   # usa "tsc"

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["npm","run","start:prod"]

