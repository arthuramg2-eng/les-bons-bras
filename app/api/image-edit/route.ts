export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { imageUrl, instructions } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL manquante" },
        { status: 400 }
      );
    }

    // Extraire et convertir l'image base64
    const base64Data = imageUrl.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const sharp = require("sharp");
    
    // Redimensionner à 1024x1024
    const resizedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: "cover" })
      .png()
      .toBuffer();

    // Créer un masque NOIR complet pour modifier toute l'image
    const mask = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Noir opaque = zone à modifier
      }
    })
    .png()
    .toBuffer();

    // Utiliser les instructions de l'utilisateur OU un prompt par défaut
    const editPrompt = instructions || 
      "Modern Scandinavian interior design with bright colors, natural light, minimalist furniture, and cozy atmosphere.";

    console.log("Prompt utilisé:", editPrompt);

    // Créer un FormData
    const formData = new FormData();
    formData.append("image", new Blob([resizedImage], { type: "image/png" }), "image.png");
    formData.append("mask", new Blob([mask], { type: "image/png" }), "mask.png");
    formData.append("model", "dall-e-2");
    formData.append("prompt", editPrompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");

    // Appeler l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();

    if (!data.data || !data.data[0]?.url) {
      return NextResponse.json(
        { error: "Réponse invalide de l'API OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      editedImageUrl: data.data[0].url,
      prompt: editPrompt,
    });

  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification", details: error.message },
      { status: 500 }
    );
  }
}