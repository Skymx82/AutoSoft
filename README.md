# AutoSoft - Logiciel de Gestion d'Auto-École

AutoSoft est une application SaaS multi-tenant conçue pour la gestion complète d'auto-écoles. Développée avec Next.js et Supabase, elle permet de gérer les élèves, les moniteurs, le planning, la comptabilité et bien plus encore.

## Caractéristiques

- **Architecture multi-tenant** : Isolation des données par auto-école avec possibilité de navigation entre bureaux
- **Gestion des élèves** : Suivi des progrès, documents, et parcours de formation
- **Planning intelligent** : Organisation des leçons et optimisation du temps des moniteurs
- **Gestion financière** : Suivi des paiements, facturation et analyse des revenus
- **Tableau de bord** : Visualisation des statistiques clés et notes importantes
- **Authentification sécurisée** : Gestion des utilisateurs avec différents rôles (admin, directeur, moniteur, etc.)

## Prérequis

- Node.js (version 18 ou supérieure)
- Compte Supabase (pour la base de données PostgreSQL)

## Configuration

1. Clonez ce dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   ```

4. Configurez votre base de données Supabase en important le schéma SQL fourni dans `/database_schema.sql`

5. Configurez les politiques RLS (Row Level Security) dans Supabase pour l'isolation des données multi-tenant

## Démarrage

Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
src/
├── app/                # Pages de l'application (Next.js App Router)
│   ├── dashboard/      # Tableau de bord et fonctionnalités principales
│   ├── login/          # Page de connexion
│   └── page.tsx        # Page d'accueil
├── lib/                # Bibliothèques et utilitaires
│   └── supabase.ts     # Configuration de Supabase
└── middleware.ts       # Middleware pour l'authentification et l'isolation multi-tenant
```

## Architecture multi-tenant

AutoSoft utilise une architecture multi-tenant basée sur Row Level Security (RLS) dans PostgreSQL :

- Chaque table contient une colonne `id_ecole` qui sert d'identifiant de tenant
- Les tables incluent également une colonne `id_bureau` pour permettre l'affichage par bureau
- Le middleware Next.js vérifie l'authentification et ajoute l'ID du tenant aux en-têtes des requêtes
- Les politiques RLS dans Supabase assurent que chaque utilisateur n'accède qu'aux données de son auto-école

## Déploiement

Cette application peut être déployée sur n'importe quelle plateforme supportant Next.js, comme Vercel, Netlify ou un serveur personnalisé.
# autosoft
