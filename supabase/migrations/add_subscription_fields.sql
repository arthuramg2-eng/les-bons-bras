-- Migration: add subscription fields to pro_profiles
-- Run this in your Supabase SQL Editor

ALTER TABLE pro_profiles
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'bras-actif'
    CHECK (subscription_plan IN ('bras-actif', 'bras-fiable', 'bras-dor')),
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'canceled', 'pending')),
  ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month');
