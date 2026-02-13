"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  editedImage?: string;
}

export default function ChatRenovation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis votre assistant rénovation IA. Envoyez-moi une photo de votre pièce et je vous donnerai des conseils personnalisés pour la transformer !"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const transformationStyles = [
    {
      name: "Moderne & épuré",
      prompt: "Modern minimalist interior design. Clean lines, neutral color palette (whites, grays, soft beiges), contemporary furniture, excellent natural and artificial lighting, uncluttered space, refined decor. Keep the room structure but make it look sleek and professional."
    },
    {
      name: "Scandinave cosy",
      prompt: "Scandinavian interior design. Light wood elements, warm textiles, natural light, hygge atmosphere, cozy seating areas, plants, warm white color palette, functional minimalism. Make it feel warm and inviting while maintaining simplicity."
    },
    {
      name: "Industriel chic",
      prompt: "Industrial modern interior design. Exposed brick or concrete elements, metal fixtures, vintage-industrial furniture, exposed lighting, large windows with natural light, earthy color palette. Keep raw materials visible but add contemporary touches."
    },
    {
      name: "Classique moderne",
      prompt: "Contemporary classic interior design. Elegant furniture pieces, refined color palette (cream, navy, gold accents), good lighting, timeless design elements, mix of traditional and modern styles. Sophisticated and balanced aesthetic."
    },
    {
      name: "Luxe minimaliste",
      prompt: "Luxury minimalist interior design. Premium materials, high-end furniture, sophisticated color scheme, excellent lighting design, spacious feel, subtle elegant decor. Make it look like a luxury apartment with minimal, refined style."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input || "Voici ma pièce, que me conseillez-vous ?",
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Préparer les données à envoyer
      const formData = new FormData();
      formData.append("message", userMessage.content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Appel à l'API GPT-4 Vision pour l'analyse
      const response = await fetch("/api/chat-renovation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'analyse");

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Erreur:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = async (originalImage: string, styleIndex?: number) => {
    setIsLoading(true);
    
    try {
      const instructions = styleIndex !== undefined 
        ? transformationStyles[styleIndex].prompt
        : transformationStyles[0].prompt;

      const response = await fetch("/api/image-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: originalImage,
          instructions: instructions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification");
      }

      const data = await response.json();
      const styleName = styleIndex !== undefined ? transformationStyles[styleIndex].name : "personnalisée";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: `✨ Votre pièce transformée en style ${styleName} !\n\nVoici une visualisation de votre espace rénové. Ce projet vous plaît ? Contactez nos professionnels vérifiés pour concrétiser cette transformation !`,
        editedImage: data.editedImageUrl
      }]);

    } catch (error: any) {
      console.error("Erreur:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Désolé, je n'ai pas pu transformer l'image. ${error.message || "Veuillez réessayer."}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white text-[#111] min-h-screen">
      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl text-[#4CAF50] font-bold">*</span>
              <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/trouver-un-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
                Trouver un pro
              </Link>
              <Link href="/devenir-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
                Devenir pro
              </Link>
              <Link href="/#contact" className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-full text-sm font-medium hover:bg-[#45a049] transition-all">
                Démarrer un projet
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= CHAT INTERFACE ================= */}
      <div className="pt-20 min-h-screen bg-[#F8F7F4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              <span className="text-sm font-light text-[#4CAF50]">Assistant IA Rénovation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              Transformez votre <span className="text-[#4CAF50]">intérieur</span> avec l'IA
            </h1>
            <p className="text-lg text-[#666] font-light">
              Uploadez une photo, recevez des conseils et visualisez les transformations
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}

                  <div className={`max-w-2xl ${message.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-[#4CAF50] text-white"
                          : "bg-gray-100 text-[#111]"
                      }`}
                    >
                      {message.image && (
                        <div className="mb-3 rounded-xl overflow-hidden">
                          <img
                            src={message.image}
                            alt="Uploaded"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                      
                      {message.editedImage && (
                        <div className="mb-3 rounded-xl overflow-hidden border-2 border-[#4CAF50]">
                          <img
                            src={message.editedImage}
                            alt="Edited"
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      <p className="font-light leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Boutons pour modifier l'image avec différents styles */}
                    {message.role === "user" && message.image && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-[#666] font-light mb-2">Visualisez votre pièce transformée :</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {transformationStyles.map((style, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleEditImage(message.image!, idx)}
                              disabled={isLoading}
                              className="px-3 py-2 bg-white border-2 border-[#4CAF50] text-[#4CAF50] rounded-lg text-xs font-light hover:bg-[#4CAF50] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {style.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[#666] flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-white">
              {imagePreview && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 rounded-xl object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-[#666] hover:bg-gray-200 transition-all flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Décrivez votre projet ou posez une question..."
                  className="flex-1 bg-gray-100 rounded-xl px-6 py-3 text-[#111] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="w-12 h-12 bg-[#4CAF50] text-white rounded-xl flex items-center justify-center hover:bg-[#45a049] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>

              <p className="text-xs text-[#666] font-light mt-3 text-center">
                💡 Uploadez une photo pour des conseils personnalisés et des visualisations IA
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Analyse d'image IA",
                description: "GPT-4 Vision analyse votre pièce et identifie les opportunités d'amélioration"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Conseils personnalisés",
                description: "Recommandations sur les couleurs, le mobilier et l'aménagement"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
                title: "Transformation visuelle",
                description: "DALL-E 2 modifie votre photo pour visualiser le résultat final"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4CAF50]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center text-[#4CAF50] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-[#111] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#666] font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
