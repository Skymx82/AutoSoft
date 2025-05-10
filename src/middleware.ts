import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  console.log('Middleware exécuté pour:', request.url);
  
  // Création de la réponse par défaut
  const response = NextResponse.next();
  
  // Vérification des cookies d'authentification
  const cookies = request.cookies.getAll();
  
  // Supabase stocke le token d'authentification dans un cookie au format 'sb-[project-ref]-auth-token'
  const supabaseAuthCookie = cookies.find(c => c.name.includes('sb-') && c.name.includes('-auth-token'));
  const authInitializedCookie = cookies.find(c => c.name === 'auth_initialized');
  
  // Pour débogage
  console.log('Cookies disponibles:', cookies.map(c => c.name));
  console.log('Cookie Supabase Auth trouvé:', !!supabaseAuthCookie);
  console.log('Cookie auth_initialized trouvé:', !!authInitializedCookie);
  
  // Vérifier si l'utilisateur est authentifié en utilisant le cookie auth_initialized
  // Ce cookie est créé par notre client Supabase personnalisé lors de la connexion
  const isAuthenticated = !!authInitializedCookie && authInitializedCookie.value === 'true';
  
  console.log('Cookie auth_initialized:', authInitializedCookie ? authInitializedCookie.value : 'non trouvé');
  console.log('Utilisateur authentifié:', isAuthenticated);

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = ['/', '/login', '/register', '/forgot-password'];
  const isPublicPage = publicPages.includes(request.nextUrl.pathname);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée
  if (!isAuthenticated && !isPublicPage) {
    console.log('Redirection vers login: utilisateur non authentifié');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur est déjà authentifié et tente d'accéder à une page publique, le rediriger vers le dashboard
  if (isAuthenticated && isPublicPage) {
    console.log('Redirection vers dashboard: utilisateur authentifié');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Ajouter un en-tête pour indiquer le statut d'authentification
  response.headers.set('x-auth-status', isAuthenticated ? 'authenticated' : 'unauthenticated');
  console.log('En-tête d\'authentification ajouté:', isAuthenticated ? 'authenticated' : 'unauthenticated');

  return response;
}

// Configuration du middleware pour qu'il s'applique à toutes les routes sauf les ressources statiques
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
