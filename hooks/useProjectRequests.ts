"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProjectRequestWithDetails } from "@/lib/supabase/types";

export function useProjectRequests(userId: string | null, role: string | null) {
  const [requests, setRequests] = useState<ProjectRequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!userId || role !== "professionnel") { setLoading(false); return; }
    const supabase = createClient();
    const { data: reqData, error } = await (supabase.from("project_requests") as any)
      .select("*").eq("pro_id", userId).eq("status", "pending").order("created_at", { ascending: false });

    if (error || !reqData) { setLoading(false); return; }

    const enriched: ProjectRequestWithDetails[] = [];
    for (const req of reqData as any[]) {
      const [projectRes, clientRes] = await Promise.all([
        (supabase.from("projects") as any).select("*").eq("id", req.project_id).single(),
        (supabase.from("client_profiles") as any).select("*").eq("user_id", req.client_id).single(),
      ]);
      if (projectRes.data && clientRes.data) {
        enriched.push({ ...req, project: projectRes.data, client: clientRes.data });
      }
    }
    setRequests(enriched);
    setLoading(false);
  }, [userId, role]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  useEffect(() => {
    if (!userId || role !== "professionnel") return;
    const supabase = createClient();
    const channel = supabase.channel("requests-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "project_requests", filter: `pro_id=eq.${userId}` }, () => fetchRequests())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, role, fetchRequests]);

  const respondToRequest = async (requestId: string, projectId: string, accept: boolean) => {
    const supabase = createClient();
    await (supabase.from("project_requests") as any).update({ status: accept ? "accepted" : "declined" }).eq("id", requestId);
    if (accept) {
      await (supabase.from("projects") as any).update({ pro_id: userId, status: "en_cours" }).eq("id", projectId);
    }
    fetchRequests();
  };

  return { requests, loading, respondToRequest, refetch: fetchRequests };
}