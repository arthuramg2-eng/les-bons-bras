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
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Bouton retour */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors mb-8 group font-light"
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-5xl font-bold text-[#4CAF50]">*</div>
              <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a]">
                Quel type de professionnel recherchez-vous ?
              </h1>
            </div>
            <p className="text-lg text-[#666] max-w-2xl mx-auto font-light leading-relaxed">
              Sélectionnez un type de service et découvrez les professionnels disponibles pour votre projet.
            </p>
          </div>

          {/* Grille de services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/trouver-un-professionnel/${service.slug}`}
                className="group relative bg-white p-8 border-l-4 border-[#4CAF50] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-start">
                  <div className="text-3xl text-[#4CAF50] mb-4 font-bold">
                    *
                  </div>
                  <h3 className="text-2xl font-normal text-[#1a1a1a] mb-2">
                    {service.label}
                  </h3>
                  <p className="text-[#666] mb-6 text-sm font-light">
                    Voir les professionnels disponibles
                  </p>
                  <div className="flex items-center gap-2 text-[#4CAF50] font-light group-hover:gap-3 transition-all">
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
      <footer className="bg-[#1a1a1a] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#4CAF50] text-2xl font-bold">*</span>
                <h3 className="text-2xl font-light">Les Bons Bras</h3>
              </div>
              <p className="text-gray-400 font-light">
                Plateforme de mise en relation avec les meilleurs professionnels de la rénovation
              </p>
            </div>
            <div>
              <h4 className="font-normal mb-4 text-lg">Contact</h4>
              <ul className="space-y-2 text-gray-400 font-light">
                <li>contact@lesbonsbras.com</li>
                <li>+33 1 23 45 67 89</li>
                <li>Paris, France</li>
              </ul>
            </div>
            <div>
              <h4 className="font-normal mb-4 text-lg">Liens utiles</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors font-light">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors font-light">
                    Nous contacter
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="text-gray-400 hover:text-white transition-colors font-light">
                    Conditions générales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 font-light">
            <p>&copy; 2025 Les Bons Bras. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}