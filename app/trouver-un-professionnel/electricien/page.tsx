import Link from "next/link";

export default function ElectricienPage() {
  const electriciens = [
    {
      id: 1,
      nom: "Électricité Pro",
      description: "Expert en installation électrique résidentielle",
      experience: "15 ans",
      ville: "Paris",
      note: 4.8,
    },
    {
      id: 2,
      nom: "Volt & Lumière",
      description: "Spécialiste domotique et éclairage intelligent",
      experience: "10 ans",
      ville: "Lyon",
      note: 4.9,
    },
    {
      id: 3,
      nom: "Énergie Services",
      description: "Installation et dépannage électrique 24/7",
      experience: "20 ans",
      ville: "Marseille",
      note: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/trouver-un-professionnel"
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
          Retour aux services
        </Link>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Électriciens disponibles
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Trouvez le professionnel idéal pour vos travaux électriques
          </p>
        </div>

        {/* Liste des électriciens */}
        <div className="grid gap-6 mb-20">
          {electriciens.map((elec) => (
            <div
              key={elec.id}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {elec.nom}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-amber-700">{elec.note}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">{elec.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {elec.experience} d'expérience
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {elec.ville}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                    Contacter
                  </button>
                  <button className="border-2 border-amber-500 text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all">
                    Voir le profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
