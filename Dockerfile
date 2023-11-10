# Install dependencies only when needed
FROM node:16-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
# RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
RUN npm ci

ENV NEXT_TELEMETRY_DISABLED 1

# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

# Build arguments
ARG NEXT_PUBLIC_POSTGRESQL_URI="postgresql://postgres:5W6fPlrHiIQVtUiX@db.cxtffvugljqljkahbmyp.supabase.co:5432/postgres"
ARG NEXT_PUBLIC_SUPABASE_URL="https://cxtffvugljqljkahbmyp.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dGZmdnVnbGpxbGprYWhibXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyMzYxMzgsImV4cCI6MjAxMTgxMjEzOH0.mh5l0L3aVtF5jUfXeUcThsiMje35ZsnoO9cZ4ZLex4s"
ARG NEXT_SUPABASE_STORAGE_URL="https://juvxtsyifhdynkicgqhn.supabase.co/storage/v1"
ARG NEXTAUTH_URL="https://resultsanalysis.fly.dev"
ARG NEXTAUTH_SECRET="whrthOkq5pop7JZzC6PlgpS+JW8ZqJubjoxaSwZwbZ4="

# RUN yarn build

# If using npm comment out above and use below instead
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

USER nextjs

# CMD ["yarn", "start"]

# If using npm comment out above and use below instead
CMD ["npm", "run", "start"]
