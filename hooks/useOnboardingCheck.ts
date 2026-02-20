"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Vérifie si l'entrepreneur a complété son onboarding.
 * Retourne { complete, loading }
 */
export function useOnboardingCheck(userId: string | null, role: string | null) {
  const [complete, setComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || role !== "professionnel") {
      setLoading(false);
      return;
    }

    async function check() {
      const supabase = createClient();
      const { data, error } = await (supabase.from("pro_profiles") as any)
        .select("onboarding_complete")
        .eq("user_id", userId!)
        .single();

      if (error || !data) {
        setComplete(false);
      } else {
        setComplete(data.onboarding_complete ?? false);
      }
      setLoading(false);
    }
    check();
  }, [userId, role]);

  return { complete, loading };
}