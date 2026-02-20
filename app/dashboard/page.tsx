"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const { role, loading, error } = useUserRole();

  useEffect(() => {
    if (loading) return;

    if (error === "Non connecte" || error === "Non connecté") {
      router.push("/connexion");
      return;
    }

    if (role === "client") {
      router.replace("/dashboard/client");
    } else if (role === "professionnel") {
      router.replace("/dashboard/entrepreneur");
    }
  }, [role, loading, error, router]);

  return (
    <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-12 h-12 border-3 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-[#666] font-light text-lg">
          Chargement de votre espace...
        </p>
        {error && error !== "Non connecte" && error !== "Non connecté" && (
          <p className="text-red-500 text-sm font-light mt-4">{error}</p>
        )}
      </motion.div>
    </main>
  );
}