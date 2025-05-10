import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Types pour notre base de données
export type Database = {
  public: {
    Tables: {
      auto_ecole: {
        Row: {
          id_ecole: number;
          id_bureau: number | null;
          nom: string;
          adresse: string;
          siret: string | null;
          num_agrement: string | null;
          logo: string | null;
          presentation: string | null;
          coordonnees_bancaires: string | null;
          reseaux_sociaux: any | null;
        };
        Insert: {
          id_ecole?: number;
          id_bureau?: number | null;
          nom: string;
          adresse: string;
          siret?: string | null;
          num_agrement?: string | null;
          logo?: string | null;
          presentation?: string | null;
          coordonnees_bancaires?: string | null;
          reseaux_sociaux?: any | null;
        };
        Update: {
          id_ecole?: number;
          id_bureau?: number | null;
          nom?: string;
          adresse?: string;
          siret?: string | null;
          num_agrement?: string | null;
          logo?: string | null;
          presentation?: string | null;
          coordonnees_bancaires?: string | null;
          reseaux_sociaux?: any | null;
        };
      };
      bureau: {
        Row: {
          id_bureau: number;
          nom: string;
          adresse: string;
          telephone: string | null;
          id_ecole: number;
        };
        Insert: {
          id_bureau?: number;
          nom: string;
          adresse: string;
          telephone?: string | null;
          id_ecole: number;
        };
        Update: {
          id_bureau?: number;
          nom?: string;
          adresse?: string;
          telephone?: string | null;
          id_ecole?: number;
        };
      };
      utilisateur: {
        Row: {
          id_utilisateur: string;
          id_bureau: number | null;
          id_ecole: number;
          email: string;
          role: string;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id_utilisateur: string;
          id_bureau?: number | null;
          id_ecole: number;
          email: string;
          role: string;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id_utilisateur?: string;
          id_bureau?: number | null;
          id_ecole?: number;
          email?: string;
          role?: string;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      // Ajoutez d'autres tables selon vos besoins
    };
  };
};

// Création du client Supabase pour le côté client
export const createClient = (): ReturnType<typeof supabaseCreateClient<Database>> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Configurer l'authentification pour stocker les sessions dans les cookies
      storageKey: 'auth-storage',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Forcer l'utilisation des cookies pour stocker la session
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') {
            return null;
          }
          
          // Essayer de récupérer depuis localStorage d'abord
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            return itemStr;
          }
          
          // Ensuite essayer de récupérer depuis les cookies
          const cookies = document.cookie.split(';');
          for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === key) {
              return cookieValue;
            }
          }
          
          return null;
        },
        setItem: (key, value) => {
          if (typeof window === 'undefined') {
            return;
          }
          
          // Stocker dans localStorage
          localStorage.setItem(key, value);
          
          // Stocker aussi dans un cookie
          const date = new Date();
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 jours
          document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/; secure`;
          
          // Stocker aussi le cookie auth_initialized pour le middleware
          document.cookie = `auth_initialized=true; expires=${date.toUTCString()}; path=/; secure`;
        },
        removeItem: (key) => {
          if (typeof window === 'undefined') {
            return;
          }
          
          // Supprimer de localStorage
          localStorage.removeItem(key);
          
          // Supprimer du cookie
          document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `auth_initialized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      }
    }
  });
};
