
<div align="center">

<img src="src/assets/images/logo.png" alt="HGASYS Logo" width="80" />

#  HGASYS — Gestion de Système Administratif

### Application web de gestion administrative complète pour entreprise automobile

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MUI Icons](https://img.shields.io/badge/MUI_Icons-5.x-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://hgasys.netlify.app/)

 **[ Voir la Démo en Ligne](https://hgasys.netlify.app/)**

---

*Concession • Garage • Importateur*

</div>

---

##  Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture du Projet](#-architecture-du-projet)
- [Installation et Lancement](#-installation-et-lancement)
- [Comptes de Démonstration](#-comptes-de-démonstration)
- [Rôles et Permissions](#-rôles-et-permissions)
- [Modules Fonctionnels](#-modules-fonctionnels)
- [Gestion des Données](#-gestion-des-données)
- [Flow de l'Application](#-flow-de-lapplication)
- [Captures d'écran](#-captures-décran)
- [Roadmap](#-roadmap)
- [Contribution](#-contribution)
- [Auteur](#-auteur)
- [Licence](#-licence)

---

# Présentation

**HGASYS** est une application web **mono-page (SPA)** de gestion administrative développée en **React.js**, pensée pour les entreprises du secteur automobile : concessions, garages et importateurs.

Elle centralise la gestion de :

| | Module |
|---|--------|
|  | **Utilisateurs** — comptes et rôles d'accès |
|  | **Ressources Humaines** — employés, fiches, documents |
|  | **Parc Automobile** — véhicules, stock, statuts |
|  | **Clients** — fiches clients et historique |
| | **Ventes & Paiements** — transactions et suivi |
|  | **Dashboard** — KPIs et graphiques analytiques |

> ** Important :** Ce projet est **100% frontend**. Il n'y a pas de serveur backend. Toutes les données sont simulées via un fichier `mockData.js` et persistées en **localStorage**. L'application fonctionne entièrement dans le navigateur.

--- 

#  Fonctionnalités

| Module | Description |
|--------|------------|
|  **Authentification** | Inscription, connexion, déconnexion — session gérée via `localStorage` |
|  **Dashboard** | KPIs en temps réel (véhicules, ventes, revenus, clients, employés), graphiques |
|  **Utilisateurs** | CRUD complet, attribution de rôles (Admin / Manager / Employé) |
|  **Employés RH** | CRUD, upload photo en base64, gestion de documents (contrat, CV) |
|  **Véhicules** | CRUD, filtres (marque, statut, année), recherche, gestion du stock |
|  **Clients** | CRUD, historique d'achats, liaison automatique avec les ventes |
|  **Ventes** | Création de vente (client + véhicule + vendeur), suivi, historique |
|  **Paiements** | Suivi des paiements : Payé, En attente, Partiel |
|  **Notifications** | Simulation : nouvelles ventes, nouveaux utilisateurs, badge compteur |

---

# 🛠 Stack Technique

| Technologie | Rôle dans le projet |
|-------------|-------------------|
| **React 18** | Bibliothèque UI — composants, hooks, rendu |
| **Vite 5** | Outil de build et serveur de développement rapide |
| **React Router v6** | Routage SPA et protection des routes par rôle |
| **Context API** | Gestion d'état global (authentification utilisateur) |
| **Tailwind CSS 3** | Framework CSS utilitaire pour le style et le responsive |
| **CSS personnalisé** | Styles avancés pour les pages auth et la sidebar |
| **MUI Icons** | Bibliothèque d'icônes Material Design |
| **localStorage** | Persistance des données côté client (session, données) |
| **mockData.js** | Données fictives JSON simulant une API |
| **Base64** | Encodage des images uploadées pour stockage local |

---

# Architecture du Projet

```
hgasys/
├── public/
│   └── index.html
│
├── src/
│   ├── App.css                          # Styles globaux de l'application
│   ├── App.jsx                          # Composant racine avec le Router
│   ├── index.css                        # Reset CSS et imports Tailwind
│   ├── main.jsx                         # Point d'entrée Vite + ReactDOM
│   │
│   ├── assets/
│   │   ├── hero.png                     # Image hero (page d'accueil)
│   │   ├── react.svg                    # Logo React (par défaut Vite)
│   │   ├── vite.svg                     # Logo Vite (par défaut)
│   │   └── images/
│   │       └── logo.png                 # ✅ Logo officiel HGASYS
│   │
│   ├── components/
│   │   ├── Layout.jsx                   # Layout global (Sidebar + Topbar + contenu)
│   │   ├── Sidebar.jsx                  # Menu latéral — navigation par rôle
│   │   └── Topbar.jsx                   # Barre supérieure — profil + notifications
│   │
│   ├── context/
│   │   └── AuthContext.jsx              # Context React — login, register, session, rôle
│   │
│   ├── data/
│   │   └── mockData.js                  # Données fictives JSON (utilisateurs, véhicules, etc.)
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx                # Page de connexion (split-screen)
│   │   │   └── Register.jsx             # Page d'inscription (split-screen inversé)
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx            # Tableau de bord — KPIs + graphiques
│   │   │
│   │   ├── users/
│   │   │   └── Users.jsx                # Gestion des utilisateurs (Admin only)
│   │   │
│   │   ├── employees/
│   │   │   └── Employees.jsx            # Gestion RH — employés + documents
│   │   │
│   │   ├── vehicles/
│   │   │   └── Vehicles.jsx             # Gestion du parc automobile
│   │   │
│   │   ├── clients/
│   │   │   └── Clients.jsx              # Gestion des clients
│   │   │
│   │   └── sales/
│   │       └── Sales.jsx                # Gestion des ventes
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx                # Routes de l'app + protection par rôle
│   │
│   ├── services/
│   │   ├── authService.js               # Service auth — login/register via localStorage
│   │   ├── userService.js               # Service CRUD — utilisateurs
│   │   ├── employeeService.js           # Service CRUD — employés
│   │   ├── clientService.js             # Service CRUD — clients
│   │   ├── vehicleService.js            # Service CRUD — véhicules
│   │   └── saleService.js               # Service CRUD — ventes
│   │
│   ├── styles/
│   │   ├── auth.css                     # Styles pages Login + Register
│   │   └── sidebar.css                  # Styles sidebar (optionnel)
│   │
│   └── utils/
│       └── roles.js                     # Définition des rôles + matrice de permissions
│
├── .gitignore
├── tailwind.config.js                   # Configuration Tailwind CSS
├── postcss.config.js                    # Configuration PostCSS
├── vite.config.js                       # Configuration Vite
├── package.json                         # Dépendances et scripts
└── README.md                            #  Ce fichier
```

###  Rôle de chaque dossier

| Dossier | Responsabilité |
|---------|---------------|
| `assets/` | Images statiques (logo, hero, icônes par défaut) |
| `components/` | Composants partagés du layout : Sidebar, Topbar, Layout wrapper |
| `context/` | État global React via Context API (authentification + session) |
| `data/` | Fichier `mockData.js` contenant toutes les données fictives JSON |
| `pages/` | Pages de l'application, organisées en sous-dossiers par module |
| `routes/` | Configuration du routage React Router + garde d'accès par rôle |
| `services/` | Couche de logique métier : CRUD via localStorage avec Promises |
| `styles/` | Feuilles CSS personnalisées (auth pages, sidebar) |
| `utils/` | Fonctions utilitaires : rôles, permissions, constantes |

---

#  Installation et Lancement

### Prérequis

Assurez-vous d'avoir installé :

| Outil | Version minimum |
|-------|----------------|
| **Node.js** | 16.x ou supérieur |
| **npm** | 8.x ou supérieur (inclus avec Node) |
| **Git** | Dernière version |

### Installation pas à pas

**1️⃣ Cloner le dépôt**

```bash
git clone https://github.com/lennysmicky/HGASYS_DESIGN.git
```

**2️⃣ Accéder au dossier du projet**

```bash
cd hgasys
```

**3️⃣ Installer toutes les dépendances**

```bash
npm install
```

**4️⃣ Lancer le serveur de développement**

```bash
npm run dev
```

**5️⃣ Ouvrir dans le navigateur**

```
http://localhost:5173
```

> L'application est prête ! Utilisez un des [comptes de démonstration](#-comptes-de-démonstration) pour vous connecter.

###  Scripts disponibles

| Commande | Description |
|----------|------------|
| `npm run dev` | Démarre le serveur de développement Vite sur `localhost:5173` |
| `npm run build` | Génère le build de production dans le dossier `dist/` |
| `npm run preview` | Prévisualise le build de production localement |

###  Recréer le projet depuis zéro

Si vous souhaitez recréer le projet avec les mêmes dépendances :

```bash
# Créer un nouveau projet React avec Vite
npm create vite@latest hgasys -- --template react
cd hgasys

# Installer React Router
npm install react-router-dom

# Installer Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Installer MUI Icons + dépendances
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled

# Lancer le projet
npm run dev
```

---

#  Comptes de Démonstration

Trois comptes sont pré-configurés dans l'application pour tester chaque niveau d'accès.
Ils sont accessibles **directement depuis la page de connexion** en cliquant sur les boutons démo.

<div align="center">

| | Rôle | Email | Mot de passe |
|---|------|-------|-------------|
|  | **Administrateur** | `admin@hgasys.com` | `admin123` |
|  | **Manager** | `manager@hgasys.com` | `manager123` |
|  | **Employé (Vendeur)** | `vendeur@hgasys.com` | `vendeur123` |

</div>

### Que peut faire chaque compte ?

** Admin (`admin@hgasys.com`)** — Accès **total**
> Peut tout voir, tout créer, tout modifier et tout supprimer. Gère les utilisateurs et attribue les rôles. C'est le super-utilisateur du système.

** Manager (`manager@hgasys.com`)** — Gestion **opérationnelle**
> Gère les employés, les clients, les véhicules et les ventes. Ne peut pas gérer les comptes utilisateurs ni accéder aux paramètres système.

** Employé (`vendeur@hgasys.com`)** — Accès **limité**
> Peut consulter les véhicules disponibles, gérer ses clients et créer des ventes. N'a pas accès au module RH, aux rapports ni à la gestion des utilisateurs.

---

#  Rôles et Permissions

Le système d'accès est basé sur **3 rôles** définis dans `src/utils/roles.js`. Chaque rôle détermine quels modules et actions sont accessibles.

### Matrice complète des permissions

| Module |  Admin | Manager |  Employé |
|--------|:--------:|:-----------:|:-----------:|
| **Dashboard** | ✅ Complet | ✅ Complet | ✅ Simplifié |
| **Utilisateurs** | ✅ CRUD + Rôles | ❌ | ❌ |
| **Employés RH** | ✅ CRUD + Docs | ✅ CRUD + Docs | ❌ |
| **Véhicules** | ✅ CRUD | ✅ CRUD | 👁 Lecture seule |
| **Clients** | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| **Ventes** | ✅ Toutes | ✅ Toutes | ✅ Ses ventes |
| **Paiements** | ✅ Suivi | ✅ Suivi | ❌ |
| **Notifications** | ✅ | ✅ | ✅ |

### Comment ça fonctionne techniquement

```
src/utils/roles.js          →  Définit les permissions par rôle
src/context/AuthContext.jsx  →  Fournit le rôle de l'utilisateur connecté
src/routes/AppRoutes.jsx     →  Protège les routes selon le rôle
src/components/Sidebar.jsx   →  Affiche uniquement les liens autorisés
```

Le composant `Sidebar.jsx` filtre les liens du menu selon le rôle :

```jsx
const filteredMenu = menuItems.filter((item) =>
  hasAccess(user?.role, item.key)
);
```

Les routes dans `AppRoutes.jsx` sont protégées : si un utilisateur tente d'accéder à une page non autorisée, il est redirigé vers le Dashboard.

---

#  Modules Fonctionnels

###  Dashboard — `src/pages/dashboard/Dashboard.jsx`

Vue d'ensemble de l'activité de l'entreprise.

| Élément | Description |
|---------|------------|
| Cartes KPI | Nombre de véhicules, ventes mensuelles, revenus, clients actifs, employés |
| Graphiques | Évolution des ventes sur les derniers mois |
| Activité récente | Dernières actions effectuées dans le système |
| Adaptation par rôle | L'Admin voit tout, l'Employé voit une version simplifiée |

---

###  Gestion des Utilisateurs — `src/pages/users/Users.jsx`

> **Accès réservé : Admin uniquement**

| Fonctionnalité | Détail |
|---------------|--------|
| Liste | Tableau des utilisateurs avec recherche |
| Création | Formulaire : nom, email, mot de passe, rôle |
| Modification | Éditer les informations et le rôle |
| Suppression | Supprimer un compte utilisateur |
| Rôles | Attribution Admin / Manager / Employé |

---

###  Gestion RH (Employés) — `src/pages/employees/Employees.jsx`

> **Accès : Admin et Manager**

| Fonctionnalité | Détail |
|---------------|--------|
| Fiche employé | Nom, poste, salaire, téléphone, email, adresse |
| Photo | Upload d'image de profil (stockée en base64) |
| Documents | Gestion de fichiers : contrat, CV, pièce d'identité |
| Historique | Suivi des modifications de la fiche |
| CRUD | Ajouter, modifier, supprimer un employé |

---

###  Gestion des Véhicules — `src/pages/vehicles/Vehicles.jsx`

| Fonctionnalité | Détail |
|---------------|--------|
| Catalogue | Marque, modèle, année, prix, image, kilométrage |
| Statuts | Disponible, Réservé, Vendu |
| Filtres | Par marque, année, statut, tranche de prix |
| Recherche | Recherche textuelle dans le catalogue |
| CRUD | Admin et Manager : complet / Employé : lecture seule |

---

###  Gestion des Clients — `src/pages/clients/Clients.jsx`

| Fonctionnalité | Détail |
|---------------|--------|
| Fiche client | Nom, téléphone, email, adresse |
| Historique | Liste des achats du client |
| Liaison ventes | Association automatique client ↔ vente |
| CRUD | Accessible à tous les rôles connectés |

---

###  Gestion des Ventes — `src/pages/sales/Sales.jsx`

| Fonctionnalité | Détail |
|---------------|--------|
| Création | Sélection : client + véhicule + vendeur |
| Montant | Calcul automatique basé sur le prix du véhicule |
| Statut véhicule | Passe automatiquement de "Disponible" à "Vendu" |
| Historique | Liste des ventes avec filtres (date, statut) |
| Paiement | Suivi : Payé, En attente, Partiel |

---

# Gestion des Données

### Source des données

Toutes les données de l'application proviennent du fichier :

```
src/data/mockData.js
```

Ce fichier contient des **données JSON fictives** pour chaque module :

| Clé | Contenu |
|-----|---------|
| `users` | Liste des comptes utilisateurs avec rôles |
| `employees` | Fiches employés RH |
| `vehicles` | Catalogue de véhicules |
| `clients` | Liste des clients |
| `sales` | Historique des ventes |

### Persistance

| Mécanisme | Utilisation |
|-----------|-----------|
| **`mockData.js`** | Données initiales au premier chargement |
| **`localStorage`** | Persistance entre les sessions navigateur |
| **`base64`** | Stockage local des images uploadées |

### Cycle de vie des données

```
1. Premier lancement  →  mockData.js charge les données initiales
2. L'utilisateur agit →  Les services (CRUD) modifient localStorage
3. Rechargement page  →  Les données sont lues depuis localStorage
4. Données absentes   →  Fallback sur mockData.js
```

>  Pour réinitialiser les données, videz le `localStorage` du navigateur (DevTools → Application → Storage → Clear).

### Les Services

Chaque module a son propre service dans `src/services/` :

```
authService.js      →  login(), register(), logout(), getSession()
userService.js      →  getAll(), getById(), create(), update(), delete()
employeeService.js  →  getAll(), getById(), create(), update(), delete()
clientService.js    →  getAll(), getById(), create(), update(), delete()
vehicleService.js   →  getAll(), getById(), create(), update(), delete()
saleService.js      →  getAll(), getById(), create(), update(), delete()
```

Chaque service utilise des **Promises** pour simuler le comportement asynchrone d'une vraie API :

```javascript
// Exemple simplifié d'un service
export const getAll = () => {
  return new Promise((resolve) => {
    const data = JSON.parse(localStorage.getItem('vehicles')) || mockData.vehicles;
    setTimeout(() => resolve(data), 300); // Simule un délai réseau
  });
};
```

---

# Flow de l'Application

### Parcours utilisateur

```
┌──────────────────────────────────────────────────────────────┐
│                      HGASYS — Flow Utilisateur               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   L'utilisateur arrive sur l'application                     │
│                    │                                         │
│                    ▼                                         │
│           ┌────────────────┐                                 │
│           │  Session active │                                │
│           │  (localStorage) │                                │
│           └───────┬────────┘                                 │
│                   │                                          │
│          ┌────────┴────────┐                                 │
│          │                 │                                 │
│        ✅ Oui            ❌ Non                              │
│          │                 │                                 │
│          ▼                 ▼                                 │
│   ┌────────────┐   ┌──────────────┐                         │
│   │  Dashboard  │   │  Login page  │                         │
│   │  (accueil)  │   │  ou Register │                         │
│   └─────┬──────┘   └──────┬───────┘                         │
│         │                  │                                 │
│         │                  ▼                                 │
│         │          ┌───────────────┐                         │
│         │          │ Saisie email  │                         │
│         │          │ + mot de passe│                         │
│         │          └──────┬───────┘                          │
│         │                 │                                  │
│         │                 ▼                                  │
│         │          ┌──────────────┐                          │
│         │          │ Vérification │                          │
│         │          │ credentials  │                          │
│         │          └──────┬──────┘                           │
│         │                 │                                  │
│         │          ┌──────┴──────┐                           │
│         │          │             │                           │
│         │        ✅ OK        ❌ Erreur                      │
│         │          │             │                           │
│         │          ▼             ▼                           │
│         │   ┌────────────┐  Message                         │
│         │   │  Stockage   │  d'erreur                       │
│         │   │  session    │  affiché                         │
│         │   │  localStorage│                                │
│         │   └─────┬──────┘                                  │
│         │         │                                         │
│         ◀─────────┘                                         │
│         │                                                   │
│         ▼                                                   │
│   ┌──────────────────────────────────────┐                  │
│   │          Layout Principal             │                  │
│   │  ┌───────────┬──────────────────┐    │                  │
│   │  │           │     Topbar       │    │                  │
│   │  │  Sidebar  │  (profil, notif) │    │                  │
│   │  │           ├──────────────────┤    │                  │
│   │  │  Menu     │                  │    │                  │
│   │  │  filtré   │    Contenu de    │    │                  │
│   │  │  selon    │    la page       │    │                  │
│   │  │  le rôle  │    active        │    │                  │
│   │  │           │                  │    │                  │
│   │  └───────────┴──────────────────┘    │                  │
│   └──────────────────────────────────────┘                  │
│                                                              │
│   Navigation filtrée par rôle :                              │
│                                                              │
│    Admin    → Dashboard, Utilisateurs, Employés,           │
│                 Véhicules, Clients, Ventes                   │
│                                                              │
│    Manager → Dashboard, Employés, Véhicules,              │
│                 Clients, Ventes                              │
│                                                              │
│    Employé → Dashboard, Clients,                          │
│                 Véhicules (lecture), Ventes                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Architecture des données

```
┌────────────────┐      ┌─────────────────┐      ┌────────────────┐
│  Interface      │      │   Services       │      │  Stockage       │
│  Utilisateur    │─────▶│   (JS Promises)  │─────▶│                │
│                │◀─────│                 │◀─────│  localStorage  │
│  (Composants   │      │  authService     │      │  +             │
│   React)       │      │  userService     │      │  mockData.js   │
│                │      │  vehicleService  │      │  (fallback)    │
└───────┬────────┘      │  clientService   │      └────────────────┘
        │               │  saleService     │
        │               │  employeeService │
        ▼               └────────┬────────┘
┌────────────────┐               │
│  Context API    │◀──────────────┘
│  (AuthContext)  │
│                │
│  - user        │
│  - role        │
│  - login()     │
│  - register()  │
│  - logout()    │
└────────────────┘
```

---

# Captures d'écran

###  Page de Connexion

> Design **split-screen** : branding à gauche, formulaire à droite.
> Dégradé bleu `#1976D2 → #1565C0 → #0d47a1`.
> Boutons de comptes démo pour connexion rapide.

###  Page d'Inscription

> Layout inversé : formulaire à gauche, branding à droite.
> Validation en temps réel des critères du mot de passe.
> Indicateurs visuels vert/gris pour chaque règle.

###  Dashboard

> Cartes KPI avec icônes et couleurs distinctes.
> Graphique des ventes mensuelles.
> Section d'activité récente.

###  Sidebar

> Menu déroulant avec icônes Material Design.
> Collapse/expand via la flèche `◀` / `▶`.
> Dégradé bleu avec barre blanche sur le lien actif.
> Tooltips au survol en mode réduit.

---

#  Roadmap

| Phase | Description | Statut |
|-------|------------|--------|
| **Phase 1** | Setup projet — Vite + React + Tailwind + Router | ✅ Terminé |
| **Phase 2** | Authentification — Login, Register, Context, Rôles | ✅ Terminé |
| **Phase 3** | Layout — Sidebar, Topbar, Routes protégées | ✅ Terminé |
| **Phase 4** | Dashboard — KPIs, graphiques, activité récente | ✅ Terminé |
| **Phase 5** | Modules CRUD — Véhicules, Clients, Ventes, Utilisateurs | ✅ Terminé |
| **Phase 6** | Module RH — Employés, Documents, Upload base64 | ✅ Terminé |
| **Phase 7** | UI/UX — Design auth pages, sidebar, responsive | ✅ Terminé |
| **Phase 8** | Tests et corrections | ✅ Terminé  |
| **Phase 9** | Déploiement Netlify | ✅ Terminé |

---

#  Contribution

Les contributions sont les bienvenues ! Voici comment participer :

```bash
# 1. Forker le projet sur GitHub

# 2. Cloner votre fork
git clone https://github.com/lennysmicky/HGASYS_DESIGN.git
cd hgasys

# 3. Créer une branche pour votre fonctionnalité
git checkout -b feature/ma-nouvelle-feature

# 4. Développer et commiter
git add .
git commit -m "feat: ajout de ma nouvelle fonctionnalité"

# 5. Pusher votre branche
git push origin feature/ma-nouvelle-feature

# 6. Ouvrir une Pull Request sur GitHub
```

### Conventions de commit

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `style:` | Changement de style (CSS, UI) |
| `refactor:` | Refactoring de code |
| `docs:` | Mise à jour de la documentation |

---

# Auteur

Développé par **[Votre Nom]**

- GitHub : [@lennysmicky](https://github.com/lennysmicky/HGASYS_DESIGN)
- LinkedIn : [Ingénieur Réseaux & Cybersécurité | Full Stack Web/Mobile](https://www.linkedin.com/in/kossi-michael-zodjekpo)

---

#  Licence

Ce projet est distribué sous licence **MIT**.

Vous êtes libre de l'utiliser, le modifier et le distribuer.

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

---

###  Développé avec ❤️ pour HGASYS

**React** · **Vite** · **Tailwind CSS** · **MUI Icons**

[ Voir la Démo](https://hgasys.netlify.app/) · [ Documentation](#-table-des-matières) · [ Signaler un Bug](https://github.com/lennysmicky/HGASYS_DESIGN/issues)

**Si ce projet vous a été utile, n'hésitez pas à mettre une étoile !**

</div>
