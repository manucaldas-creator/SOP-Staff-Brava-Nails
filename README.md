# Brava Staff Hub

Internal knowledge base for Brava Nails team. Password protected.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. No environment variables needed (password is in middleware.js)
4. Deploy — Vercel auto-detects Next.js

## Update SOPs

All SOP content lives in `/lib/sops.js`. Edit there, push to GitHub, Vercel auto-deploys.

## Access

Share the Vercel URL with the team via WhatsApp.
Password: ask Manu.

## Stack

- Next.js 14 (App Router)
- Vercel (free tier)
- No database needed — content is in /lib/sops.js
