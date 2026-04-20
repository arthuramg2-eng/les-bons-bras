"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderProps {
  variant?: "default" | "dashboard";
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ variant = "default", userName, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl text-[#2C5F3F] font-bold">*</span>
            <span className="text-xl font-light tracking-tight">Les Bons Bras</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/trouver-un-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
              Trouver un pro
            </Link>
            {variant === "dashboard" ? (
              <>
                <Link href="/chat-renovation" className="text-[#666] hover:text-[#111] font-light transition-colors text-sm">
                  Assistant IA
                </Link>
                {userName && (
                  <div className="flex items-center gap-3 bg-[#F4F0EB] pl-4 pr-2 py-1.5 rounded-full">
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#111] leading-tight">{userName}</p>
                      <p className="text-xs text-[#999] font-light">Espace client</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#2C5F3F] flex items-center justify-center text-white text-sm font-medium">
                      {userName.charAt(0)}
                    </div>
                  </div>
                )}
                {onLogout && (
                  <button onClick={onLogout} className="text-[#999] hover:text-[#666] transition-colors" title="Se deconnecter">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <>
                <Link href="/devenir-professionnel" className="text-[#666] hover:text-[#111] font-light transition-colors">
                  Devenir pro
                </Link>
                <Link href="/#contact" className="px-6 py-2.5 bg-[#2C5F3F] text-white rounded-full text-sm font-medium hover:bg-[#234B32] transition-all">
                  Demarrer un projet
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                <Link href="/trouver-un-professionnel" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-3 text-[#666] font-light hover:text-[#111] transition-colors">
                  Trouver un pro
                </Link>
                {variant === "dashboard" ? (
                  <>
                    <Link href="/chat-renovation" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-3 text-[#666] font-light hover:text-[#111] transition-colors">
                      Assistant IA
                    </Link>
                    {userName && (
                      <div className="flex items-center gap-3 px-2 py-3 border-t border-gray-100 mt-2">
                        <div className="w-10 h-10 rounded-full bg-[#2C5F3F] flex items-center justify-center text-white font-medium">
                          {userName.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-[#111]">{userName}</span>
                      </div>
                    )}
                    {onLogout && (
                      <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-2 py-3 text-red-500 font-light">
                        Se déconnecter
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/devenir-professionnel" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-3 text-[#666] font-light hover:text-[#111] transition-colors">
                      Devenir pro
                    </Link>
                    <Link href="/connexion" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-3 text-[#666] font-light hover:text-[#111] transition-colors">
                      Connexion
                    </Link>
                    <div className="pt-2">
                      <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 bg-[#2C5F3F] text-white rounded-full text-sm font-medium text-center hover:bg-[#234B32] transition-all">
                        Démarrer un projet
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
