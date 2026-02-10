import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white text-[#1a1a1a] overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen grid md:grid-cols-2 items-center px-8 md:px-20 gap-16 py-20">
        
        {/* green accent glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#4CAF50] rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4CAF50] rounded-full blur-3xl opacity-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-6xl font-bold text-[#4CAF50]">*</div>
            <h1 className="text-5xl md:text-6xl font-sans font-light tracking-tight">
              Les Bons Bras
            </h1>
          </div>

          <p className="text-xl text-[#1a1a1a] max-w-xl mb-6 font-light leading-relaxed">
            La plateforme qui met en relation
            des particuliers avec les meilleurs
            professionnels de la rénovation.
          </p>

          <p className="text-base text-[#666] max-w-xl mb-10 leading-relaxed">
            Architectes, designers, plombiers, électriciens,
            entrepreneurs — nous vous aidons à trouver
            les bons experts, simplement.
          </p>

          <Link
            href="/trouver-un-professionnel"
            className="px-10 py-4 bg-[#4CAF50] text-white text-sm font-medium tracking-wider uppercase hover:bg-[#45a049] transition-all duration-300 inline-block"
          >
            Trouver un professionnel
          </Link>
        </div>

        {/* Image Hero */}
        <div className="relative h-[70vh] overflow-hidden">
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
      <section className="py-32 px-8 md:px-20 bg-[#f8f8f8]">
        <div className="max-w-4xl space-y-10">
          <p className="text-3xl font-light leading-relaxed text-[#1a1a1a]">
            Trouver le bon professionnel
            ne devrait pas être un parcours du combattant.
          </p>

          <p className="text-lg text-[#666] leading-relaxed">
            Les Bons Bras vous permettent de gagner du temps,
            d'éviter les mauvaises surprises
            et de collaborer avec des experts fiables,
            sélectionnés pour leur sérieux et leur savoir-faire.
          </p>

          <div className="h-0.5 w-16 bg-[#4CAF50]" />
        </div>
      </section>

      {/* ================= COMMENT ÇA MARCHE ================= */}
      <section className="py-32 px-8 md:px-20 bg-white">
        <h2 className="text-3xl font-light mb-16 text-center">Comment ça marche</h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
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
              className="bg-white p-8 border-l-4 border-[#4CAF50] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl font-light text-[#4CAF50] mb-4">0{i + 1}</div>
              <h3 className="text-xl font-normal mb-4 text-[#1a1a1a]">{item.title}</h3>
              <p className="text-[#666] leading-relaxed font-light">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TYPES DE PROS ================= */}
      <section className="py-32 px-8 md:px-20 bg-[#f8f8f8]">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">

          <div className="relative h-[60vh] overflow-hidden">
            <Image
              src="/images/chantier.jpg"
              alt="Professionnels de la rénovation"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-light text-[#1a1a1a]">
              Un réseau de professionnels qualifiés
            </h2>

            <p className="text-lg text-[#666] font-light leading-relaxed">
              Nous collaborons avec des experts indépendants,
              soigneusement sélectionnés.
            </p>

            <ul className="space-y-4 text-[#666]">
              <li className="flex items-start gap-3">
                <span className="text-[#4CAF50] text-xl">*</span>
                <span>Architectes & designers d'intérieur</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4CAF50] text-xl">*</span>
                <span>Entrepreneurs généraux</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4CAF50] text-xl">*</span>
                <span>Plombiers, électriciens, menuisiers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#4CAF50] text-xl">*</span>
                <span>Spécialistes en rénovation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= VALEURS ================= */}
      <section className="py-32 px-8 md:px-20 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-light text-[#1a1a1a]">
            Notre approche
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Confiance", icon: "*" },
              { label: "Transparence", icon: "*" },
              { label: "Qualité", icon: "*" },
              { label: "Équité", icon: "*" }
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="text-4xl text-[#4CAF50] font-bold">{item.icon}</div>
                <p className="text-[#1a1a1a] font-light">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="py-32 px-8 md:px-20 bg-[#f8f8f8]">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl font-light text-[#1a1a1a]">
              Simple, transparent, sans engagement
            </h2>

            <p className="text-lg text-[#666] font-light leading-relaxed">
              Les Bons Bras ne réalisent pas les travaux
              et n'interviennent pas dans les contrats.
            </p>

            <p className="text-[#666] font-light leading-relaxed">
              Nous facilitons la mise en relation.
              Vous restez libre à chaque étape.
            </p>
          </div>

          <div className="relative h-[60vh] overflow-hidden">
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
      <section className="py-32 px-8 md:px-20 bg-[#4CAF50] text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-light">
            Prêt à démarrer votre projet ?
          </h2>

          <p className="text-white/90 max-w-xl font-light text-lg">
            Décrivez vos besoins et recevez
            des mises en relation ciblées.
          </p>

          <form className="grid md:grid-cols-2 gap-6 max-w-3xl mt-12">
            <input
              placeholder="Nom"
              className="bg-transparent border-b-2 border-white/50 py-4 focus:outline-none focus:border-white placeholder:text-white/70 text-white"
            />
            <input
              placeholder="Email"
              className="bg-transparent border-b-2 border-white/50 py-4 focus:outline-none focus:border-white placeholder:text-white/70 text-white"
            />
            <input
              placeholder="Type de projet"
              className="bg-transparent border-b-2 border-white/50 py-4 focus:outline-none focus:border-white md:col-span-2 placeholder:text-white/70 text-white"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="bg-transparent border-b-2 border-white/50 py-4 focus:outline-none focus:border-white md:col-span-2 placeholder:text-white/70 text-white resize-none"
            />

            <button className="mt-6 px-10 py-4 bg-white text-[#4CAF50] text-sm uppercase tracking-wider font-medium hover:bg-gray-100 transition-all duration-300">
              Être mis en relation
            </button>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 px-8 md:px-20 bg-[#1a1a1a] text-gray-400 text-sm">
        <div className="flex justify-between items-center font-light">
          <div className="flex items-center gap-2">
            <span className="text-[#4CAF50] text-xl">*</span>
            <span>© Les Bons Bras — Plateforme de mise en relation</span>
          </div>
          <Link href="/mentions-legales" className="hover:text-white transition">
            Mentions légales
          </Link>
        </div>
      </footer>

    </main>
  );
}