import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#F7F6F3] text-[#111] overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen grid md:grid-cols-2 items-center px-8 md:px-20 gap-16">
        
        {/* pastel glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#E6E3D9] rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E8EFEA] rounded-full blur-3xl opacity-60" />

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-medium leading-tight mb-8">
            Les Bons Bras
          </h1>

          <p className="text-xl text-gray-700 max-w-xl mb-6">
            La plateforme qui met en relation
            des particuliers avec les meilleurs
            professionnels de la rénovation.
          </p>

          <p className="text-md text-gray-600 max-w-xl mb-10">
            Architectes, designers, plombiers, électriciens,
            entrepreneurs — nous vous aidons à trouver
            les bons experts, simplement.
          </p>

          <button className="px-8 py-4 bg-[#111] text-white text-sm tracking-wide uppercase hover:bg-[#333] transition rounded-sm shadow-md">
            Trouver un professionnel
          </button>
        </div>

        {/* Image Hero */}
        <div className="relative h-[70vh] rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/images/resultat.jpg"
            alt="Projet de rénovation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* ================= PROMESSE ================= */}
      <section className="py-32 px-8 md:px-20 bg-white">
        <div className="max-w-4xl space-y-10">
          <p className="text-2xl font-light leading-relaxed">
            Trouver le bon professionnel
            ne devrait pas être un parcours du combattant.
          </p>

          <p className="text-lg text-gray-600">
            Les Bons Bras vous permettent de gagner du temps,
            d’éviter les mauvaises surprises
            et de collaborer avec des experts fiables,
            sélectionnés pour leur sérieux et leur savoir-faire.
          </p>

          <div className="h-px w-24 bg-[#D6CFC4]" />
        </div>
      </section>

      {/* ================= COMMENT ÇA MARCHE ================= */}
      <section className="py-32 px-8 md:px-20 bg-[#F3F4F1]">
        <div className="max-w-6xl grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Décrivez votre projet",
              text: "Expliquez vos besoins, votre budget et vos délais."
            },
            {
              title: "Nous vous connectons",
              text: "Nous identifions les professionnels adaptés à votre projet."
            },
            {
              title: "Vous choisissez",
              text: "Vous échangez librement et sélectionnez le bon partenaire."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="text-sm text-gray-400 mb-2">0{i + 1}</div>
              <h3 className="text-xl font-medium mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TYPES DE PROS ================= */}
      <section className="py-32 px-8 md:px-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="relative h-[60vh] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/chantier.jpg"
              alt="Professionnels de la rénovation"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-serif">
              Un réseau de professionnels qualifiés
            </h2>

            <p className="text-lg text-gray-700">
              Nous collaborons avec des experts indépendants,
              soigneusement sélectionnés.
            </p>

            <ul className="space-y-3 text-gray-600">
              <li>— Architectes & designers d’intérieur</li>
              <li>— Entrepreneurs généraux</li>
              <li>— Plombiers, électriciens, menuisiers</li>
              <li>— Spécialistes en rénovation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="py-32 px-8 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">
              Simple, transparent, sans engagement
            </h2>

            <p className="text-lg text-gray-700">
              Les Bons Bras ne réalisent pas les travaux
              et n’interviennent pas dans les contrats.
            </p>

            <p className="text-gray-600">
              Nous facilitons la mise en relation.
              Vous restez libre à chaque étape.
            </p>
          </div>

          <div className="relative h-[60vh] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/artisanv2.jpg"
              alt="Artisan au travail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-32 px-8 md:px-20 bg-[#111] text-white">
        <div className="max-w-4xl space-y-8">
          <h2 className="text-3xl font-serif">
            Prêt à démarrer votre projet ?
          </h2>

          <p className="text-gray-300 max-w-xl">
            Décrivez vos besoins et recevez
            des mises en relation ciblées.
          </p>

          <form className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <input
              placeholder="Nom"
              className="bg-transparent border-b border-gray-500 py-3 focus:outline-none focus:border-white"
            />
            <input
              placeholder="Email"
              className="bg-transparent border-b border-gray-500 py-3 focus:outline-none focus:border-white"
            />
            <input
              placeholder="Type de projet"
              className="bg-transparent border-b border-gray-500 py-3 focus:outline-none focus:border-white md:col-span-2"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="bg-transparent border-b border-gray-500 py-3 focus:outline-none focus:border-white md:col-span-2"
            />

            <button className="mt-6 px-8 py-4 bg-white text-black text-sm uppercase tracking-wide hover:bg-gray-200 transition rounded-sm">
              Être mis en relation
            </button>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 px-8 md:px-20 bg-black text-gray-400 text-sm">
        <div className="flex justify-between">
          <span>© Les Bons Bras — Plateforme de mise en relation</span>
          <span>Mentions légales</span>
        </div>
      </footer>

    </main>
  );
}
