import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EXTRACTION_SYSTEM_PROMPT = `Tu es un assistant qui extrait des mots-clés de rénovation résidentielle en français québécois.
À partir du message de l'utilisateur, retourne UNIQUEMENT un tableau JSON de 3 à 6 mots-clés pertinents.
Ces mots-clés doivent correspondre à des travaux, pièces, ou types de professionnels.
Exemples: cuisine, salle de bain, plancher, toiture, électricité, plomberie, peinture, thermopompe, isolation, fenêtre, terrasse, sous-sol, agrandissement, béton, foyer.
FORMAT STRICT: ["mot1", "mot2", "mot3"] — aucun texte avant ou après.`;

async function extractKeywords(userMessage: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 100,
    });

    const raw = completion.choices[0].message.content?.trim() ?? "[]";
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((k: string) => k.toLowerCase().trim()).filter(Boolean);
  } catch {
    return [];
  }
}

async function queryProsByKeywords(keywords: string[], limit = 5) {
  const fields =
    "id, user_id, full_name, company_name, specialty, avatar_url, cover_url, rating, total_reviews, service_area, years_experience, hourly_rate, verified, bio, description, keywords";

  if (keywords.length > 0) {
    const { data, error } = await (supabase.from("pro_profiles") as any)
      .select(fields)
      .overlaps("keywords", keywords)
      .order("rating", { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) return data;
  }

  // Fallback: top-rated pros regardless of keywords
  const { data: fallback, error: fbError } = await (supabase.from("pro_profiles") as any)
    .select(fields)
    .order("rating", { ascending: false })
    .limit(limit);

  if (fbError) {
    console.error("Supabase fallback error:", fbError);
    return [];
  }
  return fallback ?? [];
}

export function buildProsContext(pros: any[]): string {
  if (pros.length === 0) return "";

  const prosList = pros
    .map((p, i) => {
      const parts = [`${i + 1}. **${p.full_name}**${p.company_name ? ` — ${p.company_name}` : ""}`];
      if (p.specialty?.length) parts.push(`Spécialité : ${p.specialty.join(", ")}`);
      if (p.service_area) parts.push(`Zone : ${p.service_area}`);
      if (p.years_experience) parts.push(`${p.years_experience} ans d'expérience`);
      if (p.rating > 0) parts.push(`Note : ${p.rating}/5 (${p.total_reviews ?? 0} avis)`);
      if (p.description || p.bio) parts.push(`${(p.description || p.bio).slice(0, 120)}…`);
      return parts.join(" · ");
    })
    .join("\n");

  return `\n\n---
PROFESSIONNELS DISPONIBLES SUR LA PLATEFORME (à recommander au client) :
${prosList}

IMPORTANT : Après tes conseils, ajoute TOUJOURS une section "🔧 **Professionnels recommandés**" en mentionnant ces pros par leur nom et en expliquant brièvement pourquoi ils correspondent à la demande. Encourage le client à consulter leur profil. Ne saute JAMAIS cette section.`;
}

export interface MatchResult {
  pros: any[];
  keywords: string[];
}

export async function matchPros(userMessage: string): Promise<MatchResult> {
  const keywords = await extractKeywords(userMessage);
  const pros = await queryProsByKeywords(keywords);
  return { pros, keywords };
}
