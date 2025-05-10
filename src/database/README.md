# Base de données AutoSoft

Ce dossier contient tous les scripts SQL et configurations pour la base de données de l'application AutoSoft.

## Structure des dossiers

- **utilisateur/** : Scripts liés à la gestion des utilisateurs
  - `synchronisation_auth_utilisateur.sql` : Triggers pour synchroniser Supabase Auth avec notre table utilisateur

## Comment utiliser ces scripts

1. Connectez-vous à votre projet Supabase
2. Allez dans la section "SQL Editor"
3. Copiez-collez le contenu du script SQL que vous souhaitez exécuter
4. Exécutez le script

## Synchronisation Auth - Utilisateur

Le script `utilisateur/synchronisation_auth_utilisateur.sql` crée des triggers qui maintiennent automatiquement la synchronisation entre les utilisateurs créés dans Supabase Auth (`auth.users`) et notre table personnalisée `utilisateur`.

### Fonctionnalités

- Création automatique d'un enregistrement dans `utilisateur` lorsqu'un utilisateur est créé dans `auth.users`
- Mise à jour automatique de l'enregistrement dans `utilisateur` lorsqu'un utilisateur est modifié dans `auth.users`
- Suppression automatique de l'enregistrement dans `utilisateur` lorsqu'un utilisateur est supprimé dans `auth.users`

### Utilisation

Lors de la création d'un utilisateur via l'API Supabase Auth, incluez les métadonnées suivantes :

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'admin', // ou "directeur", "moniteur", "secretaire", "comptable"
      id_ecole: 1,   // ID de l'auto-école
      id_bureau: 2   // ID du bureau (optionnel)
    }
  }
})
```

Ces métadonnées seront utilisées pour créer l'enregistrement correspondant dans la table `utilisateur`.
