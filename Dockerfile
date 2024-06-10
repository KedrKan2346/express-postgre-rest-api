FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
ARG API_SERVER_PORT=80
ENV API_SERVER_PORT $API_SERVER_PORT
EXPOSE $API_SERVER_PORT

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base
COPY --from=deps /app/node_modules /app/node_modules

CMD [ "pnpm", "start" ]