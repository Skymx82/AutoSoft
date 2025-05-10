-- Script de test pour créer une auto-école et un bureau
-- À exécuter dans l'éditeur SQL de Supabase

-- Création d'une auto-école de test
INSERT INTO public.auto_ecole (
  id_ecole,  -- On spécifie explicitement l'ID pour correspondre à celui utilisé dans l'inscription
  nom,
  adresse,
  siret,
  num_agrement,
  presentation
) VALUES (
  1,  -- ID utilisé dans la page d'inscription
  'Auto-École Exemple',
  '123 Avenue de la République, 75011 Paris',
  '12345678901234',
  'E1234567890',
  'Auto-école moderne proposant des formations de qualité pour tous types de permis.'
);

-- Création d'un bureau de test
INSERT INTO public.bureau (
  id_bureau,  -- On spécifie explicitement l'ID pour correspondre à celui utilisé dans l'inscription
  nom,
  adresse,
  telephone,
  id_ecole
) VALUES (
  1,  -- ID utilisé dans la page d'inscription
  'Bureau Principal',
  '123 Avenue de la République, 75011 Paris',
  '01 23 45 67 89',
  1  -- Référence à l'auto-école créée ci-dessus
);

-- Vérification que les données ont bien été insérées
SELECT * FROM public.auto_ecole;
SELECT * FROM public.bureau;

-- Instructions d'utilisation :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans la section "SQL Editor"
-- 3. Copiez-collez le contenu de ce script
-- 4. Exécutez le script
-- 5. Vous devriez voir les résultats des requêtes SELECT montrant les données insérées
-- 6. Vous pouvez maintenant tester l'inscription avec id_ecole=1 et id_bureau=1
