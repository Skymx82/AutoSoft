-- Script pour supprimer l'utilisateur de test
-- À exécuter dans l'éditeur SQL de Supabase

-- Vérifier si l'utilisateur existe
SELECT * FROM auth.users WHERE email = 'test@example.com';

-- Supprimer l'utilisateur de la table auth.users
-- Le trigger synchronisation_apres_suppression_utilisateur supprimera automatiquement
-- l'entrée correspondante dans la table public.utilisateur
DELETE FROM auth.users WHERE email = 'test@example.com';

-- Vérifier que l'utilisateur a bien été supprimé
SELECT * FROM auth.users WHERE email = 'test@example.com';
SELECT * FROM public.utilisateur WHERE email = 'test@example.com';

-- Si pour une raison quelconque l'utilisateur existe encore dans public.utilisateur
-- mais pas dans auth.users, vous pouvez le supprimer manuellement
DELETE FROM public.utilisateur WHERE email = 'test@example.com';

-- Instructions d'utilisation :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans la section "SQL Editor"
-- 3. Copiez-collez le contenu de ce script
-- 4. Exécutez le script
-- 5. Vérifiez que l'utilisateur a bien été supprimé des deux tables
