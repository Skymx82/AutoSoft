'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialisation du client Supabase
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Tentative de connexion avec:', { email });

    try {
      // Tentative de connexion avec Supabase Auth
      console.log('Appel à supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Forcer la création de cookie en définissant manuellement un cookie
      // Cela peut aider à déclencher le stockage des cookies de Supabase
      document.cookie = "auth_initialized=true; path=/; max-age=3600";

      console.log('Réponse de signInWithPassword:', { data, error });

      if (error) {
        throw error;
      }

      // Vérifier que la session a bien été créée
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session après connexion:', sessionData);

      // Vérifier les cookies
      console.log('Cookies disponibles après connexion:', document.cookie);

      // Vérification de l'utilisateur dans notre table personnalisée
      console.log('Connexion réussie, récupération des données utilisateur...');
      const { data: userData, error: userError } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Données utilisateur:', { userData, userError });

      if (userError) {
        console.error('Erreur lors de la récupération des données utilisateur:', userError);
      }

      // Tentative de redirection
      console.log('Tentative de redirection vers /dashboard');
      console.log('Session actuelle:', await supabase.auth.getSession());
      console.log('Utilisateur actuel:', await supabase.auth.getUser());
      
      // Vérification du middleware
      console.log('Vérification du middleware et des en-têtes...');
      
      // Utiliser window.location pour forcer un rechargement complet
      // Cela garantit que les cookies sont correctement envoyés au serveur
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">AutoSoft - Connexion</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}
