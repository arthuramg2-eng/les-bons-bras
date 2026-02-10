import Link from "next/link";

const services = [
  { label: "Plombier", slug: "plombier" },
  { label: "Électricien", slug: "electricien" },
  { label: "Entrepreneur général", slug: "entrepreneur-general" },
  { label: "Designer d'intérieur", slug: "designer-interieur" },
  { label: "Architecte", slug: "architecte" },
  { label: "Paysagiste", slug: "paysagiste" },
];

export default function TrouverUnProfessionnel() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Bouton retour */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 group"
          >
            <svg 
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>

          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Quel type de professionnel recherchez-vous ?
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Sélectionnez un type de service et découvrez les professionnels disponibles pour votre projet.
            </p>
          </div>

          {/* Grille de services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/trouver-un-professionnel/${service.slug}`}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg 
                      className="w-8 h-8 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                    {service.label}
                  </h3>
                  <p className="text-slate-500 mb-4 text-sm">
                    Voir les professionnels disponibles
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                    <span>Explorer</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">VotrePlateforme</h3>
              <p className="text-slate-400">
                Connecter les professionnels et les clients depuis 2025
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>📧 contact@votreplateforme.com</li>
                <li>📞 +33 1 23 45 67 89</li>
                <li>📍 123 Rue Example, Paris, France</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Liens utiles</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Nous contacter
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="text-slate-400 hover:text-white transition-colors">
                    Conditions générales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 VotrePlateforme. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}