'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase';
import Link from 'next/link';

// Composants pour le tableau de bord
const StatsCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <span className="text-blue-600 text-xl">{icon}</span>
      </div>
    </div>
  </div>
);

const ImportantNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [priority, setPriority] = useState('medium');

  // Initialisation du client Supabase
  const supabase = createClient();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('date_notif', { ascending: false })
          .limit(5);

        if (error) throw error;
        setNotes(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase.from('notifications').insert([
        {
          type_notif: 'note',
          message_notif: newNote,
          priorite: priority,
        },
      ]);

      if (error) throw error;

      // Rafraîchir la liste des notes
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('date_notif', { ascending: false })
        .limit(5);

      setNotes(data || []);
      setNewNote('');
      setPriority('medium');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('code_notif', id);

      if (error) throw error;

      // Mettre à jour la liste des notes
      setNotes(notes.filter(note => note.code_notif !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Notes importantes</h3>
      
      <form onSubmit={addNote} className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une note..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter
          </button>
        </div>
      </form>
      
      {loading ? (
        <p>Chargement des notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">Aucune note pour le moment.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.code_notif} className="border-b border-gray-200 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(note.priorite)} mb-1`}>
                    {note.priorite === 'high' ? 'Haute' : note.priorite === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  <p>{note.message_notif}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.date_notif).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteNote(note.code_notif)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StatsChart = ({ data, chartType = 'bar' }: { data: any; chartType?: 'bar' | 'line' }) => {
  // Composant simplifié pour la visualisation des statistiques
  // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme Chart.js
  
  const maxValue = Math.max(...data.datasets[0].data);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
      
      <div className="mt-4">
        <div className="flex items-end space-x-2 h-40">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {chartType === 'bar' ? (
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ) : (
                  <div className="relative w-full">
                    <div className="absolute bottom-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1"></div>
                    {index < data.labels.length - 1 && (
                      <div 
                        className="absolute bottom-1 h-px bg-blue-500"
                        style={{ 
                          width: '100%',
                          transform: `rotate(${Math.atan2(
                            (data.datasets[0].data[index + 1] - value) / maxValue * 100,
                            100 / data.labels.length
                          )}rad)`,
                          transformOrigin: 'left bottom'
                        }}
                      ></div>
                    )}
                  </div>
                )}
                <span className="text-xs mt-1">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalMoniteurs: 0,
    totalHeuresMois: 0,
    tauxReussite: 0,
  });
  
  // Initialisation du client Supabase
  const supabase = createClient();
  
  useEffect(() => {
    console.log('Tentative de récupération des données utilisateur...');
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Données de l\'utilisateur authentifié:', user);
        
        if (user) {
          // Récupérer les données de l'utilisateur depuis notre table personnalisée
          const { data: userData, error: userError } = await supabase
            .from('utilisateur')
            .select('*')
            .eq('email', user.email)
            .single();
            
          console.log('Données de l\'utilisateur depuis la table personnalisée:', { userData, userError });
          
          setUserData({
            email: user.email || '',
            role: user.user_metadata?.role || userData?.role || 'utilisateur',
            idEcole: user.user_metadata?.id_ecole || userData?.id_ecole || null,
            idBureau: user.user_metadata?.id_bureau || userData?.id_bureau || null,
          });
          
          console.log('État userData mis à jour:', {
            email: user.email || '',
            role: user.user_metadata?.role || userData?.role || 'utilisateur',
            idEcole: user.user_metadata?.id_ecole || userData?.id_ecole || null,
            idBureau: user.user_metadata?.id_bureau || userData?.id_bureau || null,
          });
        } else {
          console.log('Aucun utilisateur connecté');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    const fetchStats = async () => {
      try {
        console.log('Tentative de récupération des statistiques...');
        // Nombre total d'élèves
        const { count: totalEleves } = await supabase
          .from('eleves')
          .select('*', { count: 'exact', head: true });
          
        console.log('Nombre total d\'élèves:', totalEleves);
        
        // Nombre total de moniteurs
        const { count: totalMoniteurs } = await supabase
          .from('enseignants')
          .select('*', { count: 'exact', head: true });
          
        // Calcul des heures de conduite pour le mois en cours
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        
        const { data: planningData } = await supabase
          .from('planning')
          .select('heure_debut, heure_fin')
          .gte('date', firstDayOfMonth)
          .lte('date', lastDayOfMonth);
          
        let totalHeuresMois = 0;
        if (planningData) {
          planningData.forEach((item) => {
            const debut = new Date(`2000-01-01T${item.heure_debut}`);
            const fin = new Date(`2000-01-01T${item.heure_fin}`);
            const diffMs = fin.getTime() - debut.getTime();
            const diffHrs = diffMs / (1000 * 60 * 60);
            totalHeuresMois += diffHrs;
          });
        }
        
        // Taux de réussite aux examens
        const { data: examensData } = await supabase
          .from('examen_resultats')
          .select('resultat');
          
        let tauxReussite = 0;
        if (examensData && examensData.length > 0) {
          const reussites = examensData.filter((exam) => exam.resultat === 'Réussite').length;
          tauxReussite = Math.round((reussites / examensData.length) * 100);
        }
        
        setStats({
          totalEleves: totalEleves || 0,
          totalMoniteurs: totalMoniteurs || 0,
          totalHeuresMois: Math.round(totalHeuresMois * 10) / 10,
          tauxReussite,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };
    
    fetchUserData();
    fetchStats();
  }, []);
  
  // Données pour les graphiques
  const monthlyHoursData = {
    title: 'Heures de conduite par mois',
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Heures',
        data: [65, 78, 90, 85, 92, 88, 95, 80, 85, 90, 95, 100],
      },
    ],
  };
  
  const examSuccessData = {
    title: 'Taux de réussite par mois',
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Taux de réussite (%)',
        data: [65, 70, 75, 72, 78, 80],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">AutoSoft</h1>
            {userData?.idBureau && (
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Bureau: {userData.idBureau}
              </span>
            )}
          </div>
          <div className="flex items-center">
            {userData && (
              <div className="mr-4 text-sm text-gray-600">
                {userData.email} ({userData.role})
              </div>
            )}
            <button 
              onClick={async () => {
                console.log('Déconnexion en cours...');
                
                // Déconnexion via l'API Supabase
                const { error } = await supabase.auth.signOut();
                
                if (error) {
                  console.error('Erreur lors de la déconnexion:', error);
                  return;
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
              }}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Menu latéral et contenu principal */}
      <div className="flex">
        {/* Menu latéral */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/dashboard/eleves" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Élèves
                </Link>
              </li>
              <li>
                <Link href="/dashboard/moniteurs" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Moniteurs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/planning" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Planning
                </Link>
              </li>
              <li>
                <Link href="/dashboard/comptabilite" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Comptabilité
                </Link>
              </li>
              <li>
                <Link href="/dashboard/examens" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Examens
                </Link>
              </li>
              <li>
                <Link href="/dashboard/parametres" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Paramètres
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
          
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard title="Total Élèves" value={stats.totalEleves} icon="👨‍🎓" />
            <StatsCard title="Moniteurs" value={stats.totalMoniteurs} icon="👨‍🏫" />
            <StatsCard title="Heures ce mois" value={`${stats.totalHeuresMois}h`} icon="🕒" />
            <StatsCard title="Taux de réussite" value={`${stats.tauxReussite}%`} icon="🎯" />
          </div>
          
          {/* Graphiques et notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StatsChart data={monthlyHoursData} chartType="bar" />
              <StatsChart data={examSuccessData} chartType="line" />
            </div>
            <ImportantNotes />
          </div>
        </main>
      </div>
    </div>
  );
}
