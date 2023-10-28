# Utilisation de l'image officielle Node.js
FROM node:14

# Création du répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installation des dépendances de l'application
RUN npm install

# Copie des autres fichiers de l'application
COPY . .

# Exposition du port sur lequel l'application va s'exécuter (par exemple, 3000 pour Express)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["yarn", "start"]
