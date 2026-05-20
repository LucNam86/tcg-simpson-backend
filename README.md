# TCG Simpson Backend

API REST en Node.js/TypeScript avec une architecture simple en couches.

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

- `type` pour toutes les structures de données
- `Result<T, E>` pour toutes les opérations qui peuvent échouer — jamais de `throw`
- `camelCase` pour tous les noms de fichiers

## Structure

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
│   │   └── user.model.ts          # Schema Mongoose + UserModel
│   └── methods/
│       └── user.methods.ts        # Fonctions MongoDB (findUserByEmail, saveUser...)
│
├── services/
│   └── user.service.ts            # Logique métier (createUser...)
│
├── middleware/
│   └── jwt.middleware.ts          # Signature et vérification des tokens JWT
│
├── routes/
│   └── user.ts                    # Routes Express liées à l'utilisateur
│
└── main.ts                        # Point d'entrée — connexion MongoDB + démarrage Express
```

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
Contient les modèles Mongoose et les fonctions d'accès à MongoDB.

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

## Configuration TypeScript

| Option | Rôle |
|---|---|
| `strict` | Active toutes les vérifications strictes TypeScript |
| `forceConsistentCasingInFileNames` | Évite les bugs de casse entre macOS et Linux |
| `esModuleInterop` | Permet `import x from 'y'` pour les modules CommonJS |
| `paths` | Alias d'imports — `@routes/*`, `@services/*`, `@database/*`, `@middleware/*`, `@shared/*`, `@config/*` |