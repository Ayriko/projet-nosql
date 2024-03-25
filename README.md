# Projet Link

## Description

Ce projet a été développé dans le cadre d'un cours de NoSQL. Nous avons créé un réseau social nommé Link, qui vise à fournir une plateforme permettant aux utilisateurs de se connecter, de partager des publications, d'interagir avec celles des autres utilisateurs et de construire leur réseau d'amis.

## Technologies utilisées

- **Frontend**: React
- **Backend**: Express.js
- **Base de données**:
  - MongoDB pour le stockage principal des données.
  - Redis pour le cache des données fréquemment accédées.
  - Neo4j pour la gestion des relations entre utilisateurs, tels que l'ajout d'amis et les likes.
- **Docker**:
  - Les services de MongoDB, Redis et Neo4j sont dockerisés pour faciliter le déploiement et la gestion des bases de données.

## Fonctionnalités

1. **Connexion et Inscription**:
   - Les utilisateurs peuvent créer un compte ou se connecter s'ils en possèdent déjà un.

2. **Publication de posts**:
   - Les utilisateurs peuvent créer des publications sur leur mur.

3. **Interaction avec les publications**:
   - Les utilisateurs peuvent éditer ou supprimer leurs propres publications.
   - Ils peuvent également consulter les publications d'autres utilisateurs.

4. **Réseau social**:
   - Les utilisateurs peuvent ajouter d'autres utilisateurs en tant qu'amis.
   - La fonctionnalité de like est disponible pour les publications.

## Installation et exécution

1. Cloner ce dépôt sur votre machine locale.

````
git clone https://github.com/Ayriko/projet-nosql
cd projet-nosql/link/
````
2. Assurez-vous que Node.js est installé sur votre système.
3. Assurez-vous que Docker est installé sur votre système.
4. Lancez Docker et assurez-vous qu'il fonctionne correctement.
5. Lancez les services Dockerisés pour MongoDB, Redis et Neo4j.
    ```
    cd docker && docker-compose up 
    ```
6. Installez les dépendances en exécutant `npm install`.
    ```
    npm install
    ```
7. Lancez le serveur backend en exécutant `npm start` dans le dossier `server`.
    ```
    npx tsx server/index.ts
    ```
8. Lancez l'application frontend.
    ```
    npm run dev 
    ```
9. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:5173`.

## Contributions
Les contributions à ce projet sont les bienvenues. N'hésitez pas à ouvrir une pull request pour proposer des améliorations.

## Auteurs
Ce projet a été réalisé par Raphael Menard  , Aymeric Moiska   et Marie Lise Renzema dans le cadre du cours de NoSQL.
