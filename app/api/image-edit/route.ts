import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, instructions } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL manquante" },
        { status: 400 }
      );
    }

    // Télécharger l'image depuis l'URL base64
    const base64Data = imageUrl.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Créer un masque transparent (modification complète de l'image)
    // Pour DALL-E 2 Edit, on a besoin d'une image PNG avec transparence
    // Ici on crée un masque blanc complet pour modifier toute l'image
    const sharp = require("sharp");
    
    // Redimensionner l'image à 1024x1024 (requis par DALL-E 2)
    const resizedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: "cover" })
      .png()
      .toBuffer();

    // Créer un masque blanc complet (alpha = 255 partout)
    const mask = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Sauvegarder temporairement les fichiers
    const fs = require("fs");
    const path = require("path");
    const tmpDir = "/tmp";
    
    const imagePath = path.join(tmpDir, `image-${Date.now()}.png`);
    const maskPath = path.join(tmpDir, `mask-${Date.now()}.png`);

    fs.writeFileSync(imagePath, resizedImage);
    fs.writeFileSync(maskPath, mask);

    // Préparer le prompt de modification
    const editPrompt = instructions || 
      "Transform this interior into a modern, bright Scandinavian style with light colors, natural materials, and excellent lighting. Keep the room structure but improve furniture, colors, and decoration.";

    // Appeler DALL-E 2 Edit
    const response = await openai.images.edit({
      image: fs.createReadStream(imagePath),
      mask: fs.createReadStream(maskPath),
      prompt: editPrompt,
      n: 1,
      size: "1024x1024",
    });

    // Nettoyer les fichiers temporaires
    fs.unlinkSync(imagePath);
    fs.unlinkSync(maskPath);

    // Vérifier que la réponse contient bien les données
    if (!response.data || !response.data[0]?.url) {
      return NextResponse.json(
        { error: "Réponse invalide de l'API OpenAI" },
        { status: 500 }
      );
    }

    const editedImageUrl = response.data[0].url;

    return NextResponse.json({
      editedImageUrl,
      prompt: editPrompt,
    });

  } catch (error: any) {
    console.error("Erreur lors de l'édition d'image:", error);
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la modification de l'image",
        details: error.message 
      },
      { status: 500 }
    );
  }
}