# Utilisation de l'image officielle Node.js
FROM node:18.12.0 AS base
# Installer les dépendances pour les modules natifs
RUN apt-get update --allow-insecure-repositories && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Création du répertoire de travail dans le conteneur
WORKDIR /usr/src/app
# Copie des fichiers package.json, .yarnrc.yml, et les dépendances stockées dans .yarn/cache
COPY package.json .yarnrc.yml ./
COPY .yarn ./.yarn/
# Copie des fichiers source TypeScript
COPY . .
# Exposition du port sur lequel l'application va s'exécuter (par exemple, 3000 pour NestJS)
EXPOSE 3000

# Environnement de développement avec toutes les dépendances
FROM base AS development
# Installation de toutes les dépendances (y compris devDependencies)
RUN yarn install --immutable
# Compilation du TypeScript en JavaScript
RUN yarn build
# Commande pour démarrer l'application en mode de développement
CMD ["yarn", "start:dev"]

# Environnement de production avec uniquement les dépendances nécessaires
FROM base AS production
# Paramètre NODE_ENV sur production
ENV NODE_ENV=production
# Installation des dépendances nécessaires pour la production
RUN yarn workspaces focus --production
# Compilation du TypeScript en JavaScript
RUN yarn build
# Commande pour démarrer l'application en mode de production
CMD ["node", "dist/main"]
