import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Mapping IDs DB → mots-clés de détection ─── */
const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'plombier': [
    'plombier', 'plomberie', 'tuyau', 'robinet', 'chauffe-eau',
    'égout', 'drain', 'salle de bain', 'sdb', 'lavabo', 'toilette', 'fuite', 'eau chaude', 'douche'
  ],
  'electricien': [
    'électricien', 'électricité', 'électrique', 'panneau', 'circuit', 'prise',
    'luminaire', 'éclairage', 'lumière', 'disjoncteur', 'filage', 'câblage', 'tableau électrique', 'domotique'
  ],
  'architecte': [
    'architecte', 'architecture', 'plans', 'permis', 'conception',
    'agrandissement', 'structure', 'design architectural', 'extension', 'construction'
  ],
  'designer': [
    'designer', 'design intérieur', 'décoration', 'déco', 'aménagement',
    'couleurs', 'matériaux', 'ambiance', 'intérieur', 'style', 'mobilier', 'meuble'
  ],
  'entrepreneur_general': [
    'entrepreneur', 'rénovation complète', 'général', 'chantier',
    'rénovation majeure', 'sous-sol', 'cuisine', 'plancher', 'mur', 'cloison', 'coordonner', 'complet', 'majeur', 'rénover'
  ],
  'paysagiste': [
    'paysagiste', 'paysagement', 'jardin', 'terrasse', 'gazon',
    'arbres', 'haie', 'extérieur', 'cour', 'aménagement extérieur', 'patio', 'clôture', 'terrain'
  ],
};

function detectSpecialties(message: string): string[] {
  const lower = message.toLowerCase();
  const matched = Object.entries(SPECIALTY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([specialty]) => specialty);
  // Si rien de détecté mais le message parle de travaux, suggérer entrepreneur général
  if (matched.length === 0 && /travaux|projet|rénov|transform|refaire|changer|modifier/.test(lower)) {
    matched.push('entrepreneur_general');
  }
  return matched;
}

async function fetchRelevantPros(specialties: string[], limit = 4) {
  const fields = "id, user_id, full_name, company_name, specialty, avatar_url, cover_url, rating, total_reviews, service_area, years_experience, hourly_rate, verified, bio, description";

  // Si des spécialités détectées, chercher les pros correspondants
  if (specialties.length > 0) {
    const { data, error } = await (supabase.from("pro_profiles") as any)
      .select(fields)
      .eq("verified", true)
      .overlaps("specialty", specialties)
      .order("rating", { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) return data;
  }

  // Fallback : retourner les pros les mieux notés toutes catégories
  const { data: fallback, error: fbError } = await (supabase.from("pro_profiles") as any)
    .select(fields)
    .eq("verified", true)
    .order("rating", { ascending: false })
    .limit(limit);

  if (fbError) {
    console.error("Erreur Supabase:", fbError);
    return [];
  }
  return fallback || [];
}

function buildProsContext(pros: any[]): string {
  if (pros.length === 0) return "";

  const prosList = pros
    .map((p, i) => {
      const parts = [`${i + 1}. **${p.full_name}** — ${p.company_name}`];
      if (p.service_area) parts.push(`Zone : ${p.service_area}`);
      if (p.years_experience) parts.push(`${p.years_experience} ans d'expérience`);
      if (p.rating > 0) parts.push(`Note : ${p.rating}/5 (${p.total_reviews} avis)`);
      if (p.hourly_rate) parts.push(`Tarif : ${p.hourly_rate}$/h`);
      return parts.join(" · ");
    })
    .join("\n");

  return `

---
PROFESSIONNELS DISPONIBLES SUR NOTRE PLATEFORME (à recommander au client) :
${prosList}

IMPORTANT : À la fin de ta réponse, après ton plan/conseils, ajoute TOUJOURS une section "🔧 **Professionnels recommandés**" où tu mentionnes ces pros par leur nom et entreprise en expliquant brièvement pourquoi ils pourraient aider pour ce projet. Encourage le client à consulter leur profil. Ne saute JAMAIS cette section.`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    // Détecter les spécialités pertinentes et chercher les pros
    const specialties = detectSpecialties(message);
    const pros = await fetchRelevantPros(specialties);
    const prosContext = buildProsContext(pros);

    if (!image) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en rénovation et design d'intérieur sur la plateforme "Les Bons Bras" au Québec. Tu donnes des conseils pratiques, personnalisés et créatifs pour améliorer les espaces.

Ton style de réponse :
- Enthousiaste et encourageant
- Concret avec des suggestions précises
- Structure tes réponses clairement avec un plan d'action numéroté
- Mentionne les couleurs, matériaux, et styles possibles
- Donne des estimations de budget en dollars canadiens si pertinent
- Sois concis (max 400 mots)

Si on te demande de modifier une image, explique que l'utilisateur doit d'abord uploader une photo.
${prosContext}`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.8,
        max_tokens: 700,
      });

      return NextResponse.json({
        message: completion.choices[0].message.content,
        recommendedPros: pros,
      });
    }

    // Convertir l'image en base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const imageUrl = `data:${image.type};base64,${base64Image}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en rénovation et design d'intérieur avec 15 ans d'expérience sur la plateforme "Les Bons Bras" au Québec. Tu analyses des photos de pièces et donnes des conseils détaillés.

Ton analyse doit inclure :
1. **État actuel** : Description de la pièce (style, couleurs, mobilier, luminosité)
2. **Points forts** : Ce qui fonctionne bien
3. **Améliorations suggérées** :
   - Couleurs et peinture
   - Mobilier et agencement
   - Éclairage
   - Décoration
   - Optimisation de l'espace
4. **Estimation budget** : Fourchette approximative en dollars canadiens

Style de réponse :
- Professionnel mais accessible
- Enthousiaste et inspirant
- Concret avec des marques/références si pertinent
- Structure claire avec émojis pour la lisibilité
- Maximum 400 mots

À la fin, propose de transformer l'image avec l'IA pour visualiser les changements.
${prosContext}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message || "Analysez cette pièce et donnez-moi vos meilleurs conseils de rénovation."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 900,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
      recommendedPros: pros,
    });

  } catch (error: any) {
    console.error("Erreur API:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de l'analyse",
        details: error.message
      },
      { status: 500 }
    );
  }
}
