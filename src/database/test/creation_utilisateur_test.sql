-- Script de test pour créer un utilisateur de test directement dans la base de données
-- À exécuter dans l'éditeur SQL de Supabase après avoir exécuté donnees_test.sql

-- Création d'un utilisateur directement dans auth.users
-- Note: Cette méthode contourne l'API Supabase Auth et crée directement un utilisateur
-- avec un mot de passe hashé dans la base de données

-- 1. D'abord, on crée l'utilisateur dans auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(), -- Génère un UUID aléatoire
  'test@example.com',
  -- Mot de passe hashé pour 'password123'
  crypt('password123', gen_salt('bf')),
  now(), -- Email déjà confirmé
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "id_ecole": 1, "id_bureau": 1}',
  now(),
  now()
) RETURNING id;

-- Note: Le trigger que nous avons créé va automatiquement insérer cet utilisateur
-- dans la table public.utilisateur grâce à notre fonction synchroniser_auth_utilisateur

-- Vérification que l'utilisateur a bien été créé
SELECT * FROM auth.users WHERE email = 'test@example.com';
SELECT * FROM public.utilisateur WHERE email = 'test@example.com';

-- Instructions d'utilisation :
-- 1. Exécutez d'abord donnees_test.sql pour créer l'auto-école et le bureau
-- 2. Exécutez ensuite ce script pour créer un utilisateur de test
-- 3. Vous pourrez vous connecter avec les identifiants suivants :
--    Email: test@example.com
--    Mot de passe: password123
