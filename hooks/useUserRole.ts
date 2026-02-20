"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ClientProfile, ProProfile } from "@/lib/supabase/types";

type UserRole = "client" | "professionnel";

interface UserRoleState {
  role: UserRole | null;
  profile: ClientProfile | ProProfile | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

export function useUserRole() {
  const [state, setState] = useState<UserRoleState>({
    role: null, profile: null, userId: null, loading: true, error: null,
  });

  useEffect(() => {
    async function detectRole() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setState(s => ({ ...s, loading: false, error: "Non connecte" }));
          return;
        }

        const metaRole = user.user_metadata?.role as UserRole | undefined;

        const { data: clientProfile } = await (supabase.from("client_profiles") as any)
          .select("*").eq("user_id", user.id).single();

        if (clientProfile) {
          setState({ role: "client", profile: clientProfile, userId: user.id, loading: false, error: null });
          return;
        }

        const { data: proProfile } = await (supabase.from("pro_profiles") as any)
          .select("*").eq("user_id", user.id).single();

        if (proProfile) {
          setState({ role: "professionnel", profile: proProfile, userId: user.id, loading: false, error: null });
          return;
        }

        if (metaRole) {
          setState({ role: metaRole, profile: null, userId: user.id, loading: false, error: null });
          return;
        }

        setState(s => ({ ...s, userId: user.id, loading: false, error: "Profil introuvable" }));
      } catch (err: any) {
        setState(s => ({ ...s, loading: false, error: err.message || "Erreur inconnue" }));
      }
    }
    detectRole();
  }, []);

  return state;
}
