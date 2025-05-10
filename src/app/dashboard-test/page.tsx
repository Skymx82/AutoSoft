'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase';
import Link from 'next/link';

export default function DashboardTest() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('DashboardTest: Vérification de l\'authentification...');
        
        // Vérifier la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('DashboardTest: Session:', session);
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          setError('Aucune session trouvée. Vous n\'êtes pas connecté.');
          setLoading(false);
          return;
        }
        
        // Récupérer l'utilisateur
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('DashboardTest: Utilisateur:', user);
        
        if (userError) {
          throw userError;
        }
        
        if (user) {
          // Récupérer les données de l'utilisateur depuis notre table personnalisée
          const { data: userData, error: dbError } = await supabase
            .from('utilisateur')
            .select('*')
            .eq('email', user.email)
            .single();
          
          console.log('DashboardTest: Données utilisateur depuis la table personnalisée:', userData);
          
          if (dbError) {
            console.error('Erreur lors de la récupération des données utilisateur:', dbError);
          }
          
          setUser({
            ...user,
            customData: userData
          });
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('DashboardTest: Erreur lors de la vérification de l\'authentification:', error);
        setError(error.message || 'Une erreur est survenue');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = async () => {
    try {
      console.log('Déconnexion en cours...');
      
      // Déconnexion via l'API Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      console.log('Déconnexion réussie via Supabase');
      
      // Supprimer tous les cookies possibles
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        
        console.log('Suppression du cookie:', name);
        
        // Supprimer le cookie avec différents domaines et chemins pour s'assurer qu'il est bien supprimé
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
      
      // Supprimer spécifiquement le cookie auth_initialized
      document.cookie = 'auth_initialized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      console.log('Tous les cookies ont été supprimés');
      console.log('Cookies restants:', document.cookie);
      console.log('Redirection vers la page de connexion...');
      
      // Forcer un rechargement complet pour s'assurer que tous les états sont réinitialisés
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Chargement...</h1>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Erreur</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <div className="text-center mt-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Test</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations utilisateur</h2>
          
          {user ? (
            <div className="space-y-4">
              <div>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rôle:</strong> {user.customData?.role || 'Non défini'}</p>
                <p><strong>ID École:</strong> {user.customData?.id_ecole || 'Non défini'}</p>
                <p><strong>ID Bureau:</strong> {user.customData?.id_bureau || 'Non défini'}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Métadonnées utilisateur</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Données complètes</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>Aucune information utilisateur disponible.</p>
          )}
        </div>
      </main>
    </div>
  );
}
