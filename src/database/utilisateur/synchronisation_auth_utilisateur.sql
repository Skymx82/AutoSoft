-- Synchronisation entre Supabase Auth et la table utilisateur
-- Ce script crée un trigger qui, lorsqu'un utilisateur est créé dans auth.users,
-- crée automatiquement un enregistrement correspondant dans la table public.utilisateur

-- Fonction qui s'exécute après la création d'un utilisateur dans auth.users
CREATE OR REPLACE FUNCTION public.synchroniser_auth_utilisateur()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer un nouvel enregistrement dans la table utilisateur
  INSERT INTO public.utilisateur (
    id_utilisateur,  -- Utiliser l'UUID de auth.users comme ID
    email,           -- Utiliser l'email de auth.users
    password,        -- Champ obligatoire dans notre table, mais géré par Supabase Auth
    role,            -- Rôle par défaut (à personnaliser)
    id_ecole,        -- ID de l'auto-école (à personnaliser)
    id_bureau        -- ID du bureau (optionnel)
  ) VALUES (
    NEW.id::text,    -- Convertir l'UUID en texte pour éviter les problèmes de type
    NEW.email,
    'géré_par_supabase_auth',  -- Nous n'avons pas besoin de stocker le mot de passe ici
    COALESCE(NEW.raw_user_meta_data->>'role', 'utilisateur'),  -- Récupérer le rôle des métadonnées ou utiliser 'utilisateur' par défaut
    (NEW.raw_user_meta_data->>'id_ecole')::integer,  -- Récupérer l'ID de l'auto-école des métadonnées
    NULLIF((NEW.raw_user_meta_data->>'id_bureau')::integer, 0)  -- Récupérer l'ID du bureau des métadonnées, NULL si 0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après l'insertion d'un nouvel utilisateur dans auth.users
CREATE OR REPLACE TRIGGER synchronisation_apres_creation_utilisateur
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.synchroniser_auth_utilisateur();

-- Fonction qui s'exécute après la mise à jour d'un utilisateur dans auth.users
CREATE OR REPLACE FUNCTION public.synchroniser_maj_utilisateur()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour l'enregistrement correspondant dans la table utilisateur
  UPDATE public.utilisateur
  SET 
    email = NEW.email,
    role = COALESCE(NEW.raw_user_meta_data->>'role', role),  -- Conserver le rôle existant si pas dans les métadonnées
    id_ecole = COALESCE((NEW.raw_user_meta_data->>'id_ecole')::integer, id_ecole),  -- Conserver l'ID existant si pas dans les métadonnées
    id_bureau = COALESCE(NULLIF((NEW.raw_user_meta_data->>'id_bureau')::integer, 0), id_bureau),  -- Conserver l'ID existant si pas dans les métadonnées
    updated_at = NOW()
  WHERE id_utilisateur = NEW.id::text;  -- Convertir l'UUID en texte pour éviter les problèmes de type
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après la mise à jour d'un utilisateur dans auth.users
CREATE OR REPLACE TRIGGER synchronisation_apres_maj_utilisateur
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.synchroniser_maj_utilisateur();

-- Fonction qui s'exécute après la suppression d'un utilisateur dans auth.users
CREATE OR REPLACE FUNCTION public.synchroniser_suppression_utilisateur()
RETURNS TRIGGER AS $$
BEGIN
  -- Supprimer l'enregistrement correspondant dans la table utilisateur
  DELETE FROM public.utilisateur
  WHERE id_utilisateur = OLD.id::text;  -- Convertir l'UUID en texte pour éviter les problèmes de type
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après la suppression d'un utilisateur dans auth.users
CREATE OR REPLACE TRIGGER synchronisation_apres_suppression_utilisateur
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.synchroniser_suppression_utilisateur();

-- Instructions d'utilisation :
-- 1. Exécutez ce script dans l'éditeur SQL de Supabase
-- 2. Lors de la création d'un utilisateur via Supabase Auth, incluez les métadonnées suivantes :
--    {
--      "role": "admin", // ou "directeur", "moniteur", "secretaire", "comptable"
--      "id_ecole": 1,   // ID de l'auto-école
--      "id_bureau": 2   // ID du bureau (optionnel)
--    }
-- 3. Ces métadonnées seront utilisées pour créer l'enregistrement correspondant dans la table utilisateur
