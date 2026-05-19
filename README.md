# TCG Simpson Backend

API REST en Node.js/TypeScript suivant les principes du Domain-Driven Design (DDD) fonctionnel.

## Stack

- **Runtime** : Node.js
- **Framework** : Express
- **Base de données** : MongoDB (Mongoose)
- **Validation** : Zod
- **Auth** : JWT
- **Tests** : Jest + Supertest

## Installation

```bash
yarn install
```

## Configuration

Copie le fichier d'exemple et remplis les variables :

```bash
cp .env.example .env
```

## Sécurité — JWT Secret

Génère un secret aléatoire pour signer les tokens JWT :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Colle le résultat dans ton `.env` :

```properties
JWT_SECRET=ton-secret-généré-ici
JWT_ISSUER=tcg-simpson-api
JWT_EXPIRES_IN=15m
```

> ⚠️ Ne commite jamais ton `.env` — vérifie que `.env` est bien dans ton `.gitignore`. Si tu l'as accidentellement commité, retire-le immédiatement :
> ```bash
> git rm --cached .env
> ```

## Lancer le projet

```bash
# Développement
yarn dev

# Production
yarn build
yarn start

# Tests
yarn test
```

## Architecture

Ce projet suit une architecture **DDD fonctionnel** — pas de classes, pas de décorateurs, uniquement des fonctions et des types.

Les dépendances ne vont que dans un sens :

```
shared-kernel ← domain ← application ← infrastructure ← presentation
```

### Conventions

- `type` pour toutes les structures de données
- `interface` uniquement pour les ports (contrats entre couches)
- `make*` pour les factories du domaine
- `make*` pour les factories d'infrastructure
- `Result<T, E>` pour toutes les opérations qui peuvent échouer — jamais de `throw`

## Structure

```
src/
├── shared-kernel/
│   └── Result.ts                         # Type Result<T, E> — ok() et err()
│
├── domain/
│   └── user/
│       ├── User.ts                       # Type User — entité principale
│       ├── UserInputs.ts                 # Type CreateUserInput — données d'entrée
│       ├── Email.ts                      # Branded type Email validé par Zod
│       ├── userFactory.ts                # makeUser() — création avec règles métier
│       └── IUserRepository.ts            # Interface IUserRepository — port du domaine
│
├── application/
│   └── ports/
│       └── TokenService.ts              # Interface TokenService — port applicatif
│
├── infrastructure/
│   ├── config/
│   │   └── env.ts                       # Validation des variables d'env via Zod
│   ├── auth/
│   │   └── JwtTokenService.ts           # makeJwtTokenService() — implémentation JWT
│   └── persistence/
│       └── mongo/
│           └── user/
│               ├── userSchema.ts        # Schema Mongoose + UserModel
│               └── MongoIUserRepository.ts # makeMongoIUserRepository() — implémentation MongoDB
│
├── presentation/
│   └── http/
│       ├── middlewares/
│       │   └── jwtAuth.middleware.ts    # Middleware Express — vérifie le token JWT
│       └── routes/
│           └── user.routes.ts           # Routes Express — câblage HTTP
│
└── main.ts                              # Point d'entrée — connexion MongoDB + démarrage Express
```

## Couches

### shared-kernel
Utilitaires partagés par toutes les couches. Ne dépend de rien.

`Result<T, E>` remplace les exceptions — toute opération qui peut échouer retourne un `Result` plutôt que de `throw`.

```typescript
const result = makeUser(input);
if (!result.ok) console.error(result.error); // string
else console.log(result.value);              // User
```

### domain
Cœur métier pur — aucune dépendance externe (pas d'Express, pas de Mongoose, pas de JWT).

- `User` — entité utilisateur avec ses champs
- `Email` — branded type qui garantit qu'un email a été validé par Zod avant usage
- `makeUser()` — applique les règles métier (ex: maximum 3 decks)
- `IUserRepository` — interface que l'infrastructure doit implémenter

### application
Orchestration des cas d'usage. Définit les contrats que l'infrastructure doit respecter.

- `TokenService` — interface pour signer et vérifier les tokens JWT

### infrastructure
Implémentations concrètes des interfaces du domaine et de l'application.

- `env.ts` — valide les variables d'environnement au démarrage via Zod, `process.exit(1)` si invalide
- `JwtTokenService` — implémente `TokenService` avec `jsonwebtoken`
- `userSchema.ts` — schema Mongoose aligné sur l'entité `User`
- `MongoIUserRepository` — implémente `IUserRepository` avec Mongoose

### presentation
Couche HTTP — Express, routes, middlewares. Ne contient aucune logique métier.

- `jwtAuth.middleware.ts` — extrait et vérifie le token Bearer, expose `req.user`
- `user.routes.ts` — déclare les routes et injecte les dépendances

## Configuration TypeScript

| Option | Rôle |
|---|---|
| `target: ES2020` | Compile vers ES2020 — async/await, optional chaining natifs |
| `module: NodeNext` | Système de modules moderne pour Node.js |
| `moduleResolution: NodeNext` | Résolution des imports moderne |
| `strict` | Active toutes les vérifications strictes TypeScript |
| `forceConsistentCasingInFileNames` | Évite les bugs de casse entre macOS et Linux |
| `esModuleInterop` | Permet `import x from 'y'` pour les modules CommonJS |
| `skipLibCheck` | Ignore les erreurs de types dans node_modules |
| `resolveJsonModule` | Permet d'importer des fichiers `.json` |
| `declaration` | Génère les fichiers `.d.ts` |
| `sourceMap` | Permet de débugger dans le code TypeScript |
| `experimentalDecorators` | Active la syntaxe des décorateurs |
| `emitDecoratorMetadata` | Métadonnées de types au runtime pour les décorateurs |
| `paths` | Alias d'imports — `@domain/*`, `@application/*`, `@shared/*`... |