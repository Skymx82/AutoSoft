import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">AutoSoft</h1>
          </div>
          <div>
            <Link 
              href="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow">
        {/* Section héro */}
        <div className="bg-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Gérez votre auto-école avec efficacité
            </h2>
            <p className="mt-6 text-xl max-w-3xl">
              AutoSoft est une solution complète pour la gestion d&apos;auto-écoles. Planification, suivi des élèves, gestion financière, tout est centralisé dans une interface simple et intuitive.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 shadow-md"
              >
                Essayer gratuitement
              </Link>
            </div>
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Fonctionnalités principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fonctionnalité 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des élèves</h3>
                <p className="text-gray-600">
                  Suivez les progrès de vos élèves, gérez leurs documents et visualisez leur parcours de formation en un coup d&apos;œil.
                </p>
              </div>
              
              {/* Fonctionnalité 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Planning intelligent</h3>
                <p className="text-gray-600">
                  Organisez les leçons, évitez les conflits d&apos;horaires et optimisez le temps de vos moniteurs avec notre système de planification avancé.
                </p>
              </div>
              
              {/* Fonctionnalité 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion financière</h3>
                <p className="text-gray-600">
                  Suivez les paiements, générez des factures et analysez vos revenus pour une gestion financière simplifiée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AutoSoft</h3>
              <p className="text-gray-300">
                La solution complète pour la gestion de votre auto-école.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-white">
                    Inscription
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                support@autosoft.fr<br />
                01 23 45 67 89
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AutoSoft. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
