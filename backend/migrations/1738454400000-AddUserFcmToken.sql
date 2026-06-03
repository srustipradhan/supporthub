-- Migration: AddUserFcmToken
-- Adds nullable fcmToken column to users table for Firebase Cloud Messaging

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fcmToken" character varying;
