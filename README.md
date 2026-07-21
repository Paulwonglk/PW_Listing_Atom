# PW Listing Atom — Milestone 1

Foundation: auth, Listings database, dashboard. Everything downstream
(CRM, content generator, research, reports) will build on this without
re-modeling the data.

## What's in this milestone

- Email magic-link auth (Supabase)
- Listings table with every field from your brief, PSF auto-calculated
- Row-Level Security scoped by team from day one
- Dashboard: active listing count, recent listings, quick actions
- Listing create form + detail page with agent notes
- Apple-inspired UI: white background, black type, rounded cards

## Setup

1. **Create a Supabase project** at supabase.com (free tier is fine to start).
2. In the Supabase SQL editor, run `supabase/schema.sql` — this creates
   `teams`, `agents`, `listings`, `listing_media`, `listing_notes` with RLS.
3. Copy `.env.example` to `.env.local` and fill in your project URL and
   anon key (Supabase dashboard → Settings → API).
4. **First-time agent row**: after you sign in once via the app (which
   creates an `auth.users` row), manually insert a matching row into
   `agents` with the same `id`, or we can add an auto-provisioning
   trigger in the next pass — flag which you'd prefer.
5. Install and run:
   ```
   npm install
   npm run dev
   ```
6. Deploy: push to a GitHub repo, import into Vercel, add the two env
   vars in Vercel's project settings.

## What's deliberately not here yet

- Buyer/Seller CRM, Leads pipeline → Milestone 2
- AI Content Generator wired to listings → Milestone 3
- Photo/video/floorplan upload to Storage → flagged as a fast follow-up
  inside this milestone, not blocking the core flow
- Project Intelligence DB, Research, Reports → later milestones per the roadmap

## Next step

Once you've got this running and poked at it, let me know and I'll
move to Milestone 2 (Buyer CRM, Seller CRM, Leads pipeline) — same
pattern: schema first, then UI.
