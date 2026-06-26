# TCG Simpson Backend

API REST en Node.js/TypeScript pour TCG Simpson, un jeu de cartes à collectionner : gestion des comptes utilisateurs, des collections de cartes, de l'ouverture de boosters et de la construction de decks. Architecture simple en couches.

## Stack

- **Runtime** : Node.js
- **Framework** : Express
- **Base de données** : MongoDB (Mongoose)
- **Validation** : Zod
- **Auth** : JWT (jsonwebtoken)
- **Hash** : bcrypt
- **Tests** : Jest + Supertest

## Installation

```bash
npm install
```

## Configuration

Copie le fichier d'exemple et remplis les variables :

```bash
cp .env.example .env
```

Le projet a besoin d'une instance MongoDB accessible (locale ou MongoDB Atlas) pour la variable `DATABASE_URL`.

## Sécurité — JWT Secret

Génère un secret aléatoire pour signer les tokens JWT :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Colle le résultat dans ton `.env` :

```properties
PORT=3000
DATABASE_URL=mongodb://localhost:27017/tcg-simpson
JWT_SECRET=ton-secret-généré-ici
JWT_EXPIRES_IN=7d
```

> ⚠️ Ne commite jamais ton `.env` — vérifie que `.env` est bien dans ton `.gitignore`. Si tu l'as accidentellement commité, retire-le immédiatement :
> ```bash
> git rm --cached .env
> ```

## Lancer le projet

```bash
# Développement
npm run dev

# Production
npm run build
npm run start

# Tests
npm run test
```

## Architecture

Ce projet suit une architecture simple en couches. Les dépendances vont dans un seul sens :

```
routes → services → database
```

### Conventions

- `type` pour toutes les structures de données, avec **Zod comme source de vérité** : chaque schéma Zod génère le type TypeScript correspondant via `z.infer`, pour garantir que la validation runtime et le typage statique ne divergent jamais
- `Result<T, E>` pour toutes les opérations qui peuvent échouer — jamais de `throw`
- `camelCase` pour tous les noms de fichiers

## Structure

Chaque entité métier (utilisateur, carte, booster, deck, affinité, famille, série) suit la même décomposition en quatre fichiers. Exemple complet sur `user`, pattern identique pour les autres :

```
src/
├── shared/
│   └── Result.ts                  # Type Result<T, E> — ok() et err()
│
├── config/
│   └── env.ts                     # Validation des variables d'env via Zod
│
├── database/
│   ├── models/
│   │   ├── user.model.ts          # Schema Mongoose + UserModel
│   │   └── ...                    # card, booster, deck, affinity, family, serie
│   └── methods/
│       ├── user.methods.ts        # Fonctions MongoDB (findUserByEmail, saveUser...)
│       └── ...                    # même pattern pour les autres entités
│
├── services/
│   ├── user.service.ts            # Logique métier (createUser...)
│   └── ...                        # card, booster, deck, affinity, family, serie
│
├── middleware/
│   └── jwt.middleware.ts          # Signature et vérification des tokens JWT
│
├── routes/
│   ├── user.ts                    # Routes Express liées à l'utilisateur
│   └── ...                        # une route par entité
│
└── main.ts                        # Point d'entrée — connexion MongoDB + démarrage Express
```

*(Arborescence simplifiée pour la lisibilité — adapte les noms exacts si besoin.)*

## Couches

### shared
Utilitaires partagés par toutes les couches. Ne dépend de rien.

`Result<T, E>` remplace les exceptions — toute opération qui peut échouer retourne un `Result` plutôt que de `throw`.

```typescript
const result = await createUser(input);
if (!result.ok) console.error(result.error); // string
else console.log(result.value);              // { id: string }
```

### config
Valide les variables d'environnement au démarrage via Zod. Si une variable est manquante ou invalide, le serveur s'arrête immédiatement avec un message d'erreur clair.

### database
Contient les modèles Mongoose et les fonctions d'accès à MongoDB, pour chaque entité.

- `models/` — schémas Mongoose
- `methods/` — fonctions qui appellent MongoDB directement (`findUserByEmail`, `saveUser`...)

### services
Contient la logique métier. Les services appellent les méthodes MongoDB et coordonnent les opérations.

```typescript
// Exemple : createUser dans user.service.ts
const existing = await findUserByEmail(input.email);
if (existing.ok && existing.value) return err('EMAIL_TAKEN');

const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
const saved = await saveUser({ ...user, passwordHash });
```

### middleware

#### JWT
Le middleware JWT gère l'authentification via des tokens Bearer.

`signToken(payload)` — génère un token JWT signé, utilisé lors de l'inscription et de la connexion :
```typescript
const token = signToken({ id: user.id });
res.json({ token });
```

`jwtMiddleware` — vérifie le token sur les routes protégées. Si le token est absent ou invalide, retourne une erreur `401`. Si valide, expose `req.user` avec le payload décodé :
```typescript
// Route publique — pas de middleware
router.post('/register', async (req, res) => { ... });

// Route protégée — jwtMiddleware en second argument
router.get('/me', jwtMiddleware, async (req, res) => {
  const userId = (req as any).user.id;
  // ...
});
```

Le token doit être envoyé dans le header `Authorization` :
```
Authorization: Bearer <token>
```

### routes
Déclare les routes Express. Valide les données entrantes avec Zod, appelle le service correspondant, et retourne la réponse HTTP.

Les routes ne contiennent aucune logique métier — elles délèguent tout aux services.

## Gestion des erreurs

Toutes les opérations qui peuvent échouer retournent un `Result<T, E>` :

```typescript
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Dans les routes, les erreurs sont mappées vers les codes HTTP appropriés :

```typescript
const result = await createUser(body.data);
if (!result.ok) {
  if (result.error === 'EMAIL_TAKEN') return res.status(409).json({ error: result.error });
  return res.status(400).json({ error: result.error });
}
```

## Tests

Suite de tests Jest + Supertest, organisée par couche :

- **Tests unitaires** sur les méthodes d'accès à la base (`database/methods`) et sur la logique métier (`services`)
- **Tests d'intégration** sur les routes Express via Supertest, couvrant les cas de succès et d'erreur (validation Zod, conflits, auth)
- Base de données isolée à chaque run grâce à **mongodb-memory-server** : aucune dépendance à une instance MongoDB externe, aucun mock de la couche données

```bash
npm run test
```

## Configuration TypeScript

| Option | Rôle |
|---|---|
| `strict` | Active toutes les vérifications strictes TypeScript |
| `forceConsistentCasingInFileNames` | Évite les bugs de casse entre macOS et Linux |
| `esModuleInterop` | Permet `import x from 'y'` pour les modules CommonJS |
| `paths` | Alias d'imports — `@routes/*`, `@services/*`, `@database/*`, `@middleware/*`, `@shared/*`, `@config/*` |