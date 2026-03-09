# Recouvra+ API

API REST de gestion du recouvrement développée avec Express.js, MongoDB et JWT.

## 🚀 Installation

### Prérequis
- Node.js 22+
- MongoDB (local ou Atlas)

### Étapes

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd recouvra-api

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env selon votre configuration

# 4. Démarrer le serveur
npm run dev
```

## ⚙️ Variables d'environnement

| Variable | Description | Valeur par défaut |
|---|---|---|
| `PORT` | Port du serveur | `5000` |
| `MONGO_URI` | URI MongoDB | `mongodb://localhost:27017/recouvra` |
| `JWT_SECRET` | Clé secrète JWT | — |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |

## 📚 Documentation API

Swagger UI disponible à : **http://localhost:5000/api/docs**

## 🔑 Authentification

Toutes les routes (sauf `/api/auth/register` et `/api/auth/login`) nécessitent un token JWT.

Ajouter le header : `Authorization: Bearer <token>`

## 👥 Rôles

| Rôle | Permissions |
|---|---|
| `agent` | Lecture clients/factures, créer actions/paiements |
| `manager` | Tout agent + créer/modifier clients et factures |
| `admin` | Accès complet + gestion des utilisateurs |

## 📋 Endpoints

### Auth
| Méthode | Route | Description | Accès |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Public |
| POST | `/api/auth/login` | Connexion | Public |
| GET | `/api/auth/me` | Mon profil | Tous |
| GET | `/api/auth/users` | Liste utilisateurs | Admin |
| PATCH | `/api/auth/users/:id/role` | Modifier rôle | Admin |
| DELETE | `/api/auth/users/:id` | Supprimer utilisateur | Admin |

### Clients
| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/clients` | Liste clients | Tous |
| GET | `/api/clients/:id` | Détail client | Tous |
| POST | `/api/clients` | Créer client | Manager, Admin |
| PUT | `/api/clients/:id` | Modifier client | Manager, Admin |
| DELETE | `/api/clients/:id` | Supprimer client | Admin |

### Factures
| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/invoices` | Liste factures | Tous |
| GET | `/api/invoices/:id` | Détail facture | Tous |
| POST | `/api/invoices` | Créer facture | Manager, Admin |
| PUT | `/api/invoices/:id` | Modifier facture | Manager, Admin |
| DELETE | `/api/invoices/:id` | Supprimer facture | Admin |

### Paiements
| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/payments` | Liste paiements | Tous |
| POST | `/api/payments` | Enregistrer paiement | Tous |
| DELETE | `/api/payments/:id` | Supprimer paiement | Manager, Admin |

### Actions de recouvrement
| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/recovery` | Liste actions | Tous |
| GET | `/api/recovery/:id` | Détail action | Tous |
| POST | `/api/recovery` | Créer action | Tous |
| PUT | `/api/recovery/:id` | Modifier action | Tous |
| DELETE | `/api/recovery/:id` | Supprimer action | Manager, Admin |

### Statistiques
| Méthode | Route | Description | Accès |
|---|---|---|---|
| GET | `/api/stats` | Dashboard stats | Manager, Admin |

## 🧪 Tests

```bash
npm test
```

Tests couverts :
- Inscription / Connexion / Auth
- CRUD Factures
- Enregistrement de paiements et mise à jour du statut

## 🏗️ Architecture

```
src/
├── config/       # DB, Swagger
├── models/       # Mongoose schemas
├── routes/       # Express routes + Swagger JSDoc
├── controllers/  # Business logic
├── middlewares/  # Auth, validation, error handler
└── validators/   # Joi schemas
tests/            # Jest + Supertest
```

## 🛠️ Technologies

- **Node.js 22** + **Express.js** — Framework API
- **MongoDB** + **Mongoose** — Base de données
- **JWT** + **bcryptjs** — Authentification
- **Joi** — Validation des données
- **Swagger** — Documentation API
- **Jest** + **Supertest** — Tests unitaires
