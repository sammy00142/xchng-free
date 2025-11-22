# --------------------------------------------------------
# 1️⃣ Builder Stage — install deps, build app
# --------------------------------------------------------
  FROM node:18-alpine AS builder

  # Set working directory
  WORKDIR /app
  
  # Ensure npm logs are cleaner & avoid prompts
  ENV CI=true
  ENV NODE_ENV=development
  
  # Copy package files first (for better Docker caching)
  COPY package*.json ./
  
  # Install dependencies with safety flags
  # --legacy-peer-deps avoids dependency tree errors
  # --force if there are conflicts we can’t resolve automatically
  RUN npm install --legacy-peer-deps || npm install --force
  
  # Copy all project files
  COPY . .
  
  # Build the Next.js app
  RUN npm run build
  
  # --------------------------------------------------------
  # 2️⃣ Runner Stage — smaller production image
  # --------------------------------------------------------
  FROM node:18-alpine AS runner
  
  # Create and set working directory
  WORKDIR /app
  
  # Set env variables
  ENV NODE_ENV=production
  ENV PORT=3000
  ENV NEXT_TELEMETRY_DISABLED=1
  
  # Copy only necessary files from builder
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package*.json ./
  
  # Use non-root user for security
  RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
  USER nextjs
  
  # Expose port
  EXPOSE 3000
  
  # Default start command
  CMD ["npm", "start"]
  