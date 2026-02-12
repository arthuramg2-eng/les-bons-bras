import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    if (!image) {
      // Si pas d'image, répondre normalement avec GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en rénovation et design d'intérieur. Tu donnes des conseils pratiques, personnalisés et créatifs pour améliorer les espaces. 
            
Ton style de réponse :
- Enthousiaste et encourageant
- Concret avec des suggestions précises
- Structure tes réponses clairement
- Mentionne les couleurs, matériaux, et styles possibles
- Donne des estimations de budget si pertinent
- Sois concis (max 300 mots)

Si on te demande de modifier une image, explique que l'utilisateur doit d'abord uploader une photo.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      return NextResponse.json({
        message: completion.choices[0].message.content,
      });
    }

    // Convertir l'image en base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const imageUrl = `data:${image.type};base64,${base64Image}`;

    // Analyser l'image avec GPT-4 Vision
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en rénovation et design d'intérieur avec 15 ans d'expérience. Tu analyses des photos de pièces et donnes des conseils détaillés.

Ton analyse doit inclure :
1. **État actuel** : Description de la pièce (style, couleurs, mobilier, luminosité)
2. **Points forts** : Ce qui fonctionne bien
3. **Améliorations suggérées** : 
   - Couleurs et peinture
   - Mobilier et agencement
   - Éclairage
   - Décoration
   - Optimisation de l'espace
4. **Estimation budget** : Fourchette approximative pour les travaux suggérés

Style de réponse :
- Professionnel mais accessible
- Enthousiaste et inspirant
- Concret avec des marques/références si pertinent
- Structure claire avec émojis pour la lisibilité
- Maximum 400 mots

À la fin, propose de transformer l'image avec l'IA pour visualiser les changements.`
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
      max_tokens: 800,
      temperature: 0.7,
    });

    const analysisResult = completion.choices[0].message.content;

    return NextResponse.json({
      message: analysisResult,
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