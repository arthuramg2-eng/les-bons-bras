"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectWithDetails } from "@/lib/supabase/types";

export function useProjects(userId: string | null, role: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!userId || !role) return;
    const supabase = createClient();
    const column = role === "client" ? "client_id" : "pro_id";
    const { data, error } = await (supabase.from("projects") as any)
      .select("*").eq(column, userId).order("updated_at", { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  }, [userId, role]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    if (!userId || !role) return;
    const supabase = createClient();
    const column = role === "client" ? "client_id" : "pro_id";
    const channel = supabase.channel("projects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects", filter: `${column}=eq.${userId}` }, () => fetchProjects())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, role, fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

export function useProjectDetails(projectId: string | null) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    if (!projectId) return;
    const supabase = createClient();

    const [projectRes, phasesRes, photosRes, costsRes] = await Promise.all([
      (supabase.from("projects") as any).select("*").eq("id", projectId).single(),
      (supabase.from("project_phases") as any).select("*").eq("project_id", projectId).order("sort_order", { ascending: true }),
      (supabase.from("project_photos") as any).select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      (supabase.from("project_costs") as any).select("*").eq("project_id", projectId).order("date", { ascending: false }),
    ]);

    if (projectRes.data) {
      let proData = null;
      let clientData = null;

      // Fetch pro profile if assigned
      if (projectRes.data.pro_id) {
        const { data } = await (supabase.from("pro_profiles") as any)
          .select("*").eq("user_id", projectRes.data.pro_id).single();
        proData = data;
      }

      // Fetch client profile
      if (projectRes.data.client_id) {
        const { data } = await (supabase.from("client_profiles") as any)
          .select("*").eq("user_id", projectRes.data.client_id).single();
        clientData = data;
      }

      setProject({
        ...projectRes.data,
        phases: phasesRes.data || [],
        photos: photosRes.data || [],
        costs: costsRes.data || [],
        client: clientData || undefined,
        pro: proData || undefined,
      });
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  useEffect(() => {
    if (!projectId) return;
    const supabase = createClient();
    const channel = supabase.channel(`project-${projectId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects", filter: `id=eq.${projectId}` }, () => fetchDetails())
      .on("postgres_changes", { event: "*", schema: "public", table: "project_phases", filter: `project_id=eq.${projectId}` }, () => fetchDetails())
      .on("postgres_changes", { event: "*", schema: "public", table: "project_photos", filter: `project_id=eq.${projectId}` }, () => fetchDetails())
      .on("postgres_changes", { event: "*", schema: "public", table: "project_costs", filter: `project_id=eq.${projectId}` }, () => fetchDetails())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, fetchDetails]);

  return { project, loading, refetch: fetchDetails };
}