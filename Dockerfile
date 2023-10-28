# Utilisation de l'image officielle Node.js
FROM node:18.12.0 AS sources
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
# Copie des autres fichiers de l'application
COPY . .
# Exposition du port sur lequel l'application va s'exécuter (par exemple, 3000 pour Express)
EXPOSE 3000
# Commande pour démarrer l'application
CMD ["yarn", "start"]

FROM sources AS development
# Installation des dépendances de l'application
RUN yarn install --immutable

FROM sources AS production
# Paramètre NODE_ENV sur production
ENV NODE_ENV=production
# Installation des dépendances nécessaires pour la production
RUN yarn workspaces focus --production
