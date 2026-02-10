import Link from "next/link";

export default function ArchitectePage() {
  const architectes = [
    {
      id: 1,
      nom: "Atelier Moderne",
      description: "Conception architecturale contemporaine et rénovation haut de gamme",
      experience: "18 ans",
      ville: "Paris",
      note: 4.9,
    },
    {
      id: 2,
      nom: "Studio Créatif",
      description: "Architecture résidentielle et design d'espaces sur mesure",
      experience: "12 ans",
      ville: "Lyon",
      note: 4.8,
    },
    {
      id: 3,
      nom: "Vision Architecture",
      description: "Spécialiste en rénovation patrimoniale et extension moderne",
      experience: "22 ans",
      ville: "Bordeaux",
      note: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/trouver-un-professionnel"
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
          Retour aux services
        </Link>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="text-6xl text-[#4CAF50] font-bold">*</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-4">
            Architectes disponibles
          </h1>
          <p className="text-lg text-[#666] max-w-2xl mx-auto font-light leading-relaxed">
            Trouvez l'architecte idéal pour concevoir et réaliser votre projet
          </p>
        </div>

        {/* Liste des architectes */}
        <div className="grid gap-6 mb-20">
          {architectes.map((arch) => (
            <div
              key={arch.id}
              className="bg-white p-8 border-l-4 border-[#4CAF50] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-normal text-[#1a1a1a]">
                      {arch.nom}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#4CAF50]/10 px-3 py-1">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-normal text-[#4CAF50]">{arch.note}</span>
                    </div>
                  </div>
                  <p className="text-[#666] mb-4 font-light leading-relaxed">{arch.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-[#666] font-light">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {arch.experience} d'expérience
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {arch.ville}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="bg-[#4CAF50] text-white px-8 py-3 font-light tracking-wide hover:bg-[#45a049] transition-all duration-300">
                    Contacter
                  </button>
                  <button className="border-2 border-[#4CAF50] text-[#4CAF50] px-8 py-3 font-light tracking-wide hover:bg-[#4CAF50]/5 transition-all duration-300">
                    Voir le profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="bg-[#f8f8f8] p-12 text-center">
          <h2 className="text-3xl font-light text-[#1a1a1a] mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-[#666] mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            Décrivez-nous votre projet et nous vous mettrons en relation avec les professionnels les plus adaptés.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-10 py-4 bg-[#4CAF50] text-white text-sm font-light tracking-wider uppercase hover:bg-[#45a049] transition-all duration-300"
          >
            Décrire mon projet
          </Link>
        </div>
      </div>
    </div>
  );
}