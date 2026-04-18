import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { matchPros, buildProsContext } from "@/lib/matchPros";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    // Extraire les mots-clés via OpenAI et matcher les pros via Supabase keywords[]
    const { pros, keywords } = await matchPros(message);
    const prosContext = buildProsContext(pros);

    if (!image) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
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
${prosContext}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.8,
        max_tokens: 700,
      });

      return NextResponse.json({
        message: completion.choices[0].message.content,
        recommendedPros: pros,
        matchedKeywords: keywords,
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
${prosContext}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message || "Analysez cette pièce et donnez-moi vos meilleurs conseils de rénovation.",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
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
      matchedKeywords: keywords,
    });
  } catch (error: any) {
    console.error("Erreur API:", error);

    return NextResponse.json(
      { error: "Erreur lors de l'analyse", details: error.message },
      { status: 500 }
    );
  }
}
