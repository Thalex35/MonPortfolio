# Theed.dev portfolio

Responsive React/Vite portfolio with editable Projects, About, and Contact content. Public pages keep their local starter content until a Supabase project is configured; after setup, published content is loaded from Supabase.

## Local development

```sh
npm install
npm run dev
npm run lint
npm run build
```

Create a local `.env.local` from `.env.example` and set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

The legacy `VITE_SUPABASE_ANON_KEY` is also accepted as a fallback. These are public browser credentials. Never put a Supabase service-role or secret key in this application or its environment.

## Supabase setup

1. Create or choose the Supabase project for this portfolio. Apply the migrations in `supabase/migrations/` using `supabase db push` from this project directory. They create and seed the portfolio tables, RLS policies, and the public `portfolio-media` Storage bucket.
2. In **Authentication → Providers → Email**, keep public sign-ups disabled. Create/invite the one owner account from the Supabase Dashboard. Enable email confirmation or set a strong password according to your account policy.
3. In **Authentication → Users**, copy the owner account's UUID. In the SQL Editor, grant admin authorization to only that account:

   ```sql
   insert into public.admin_profiles (user_id, role)
   values ('PASTE-THE-OWNER-AUTH-USER-UUID-HERE', 'admin');
   ```

   `admin_profiles` has no client INSERT/UPDATE/DELETE grants or policies. Do not add any other user to this table. Admin authorization is based on this database-owned row, not a frontend email comparison.
4. Copy the Project URL and publishable key from **Project Settings → API** into local `.env.local`, and set the same variables in the portfolio's deployment environment. The legacy anon key is also accepted as `VITE_SUPABASE_ANON_KEY`. Never use the service-role key.
5. Add your local and deployed origins to **Authentication → URL Configuration → Redirect URLs** (for example `http://localhost:5173/**` and `https://your-domain.example/**`).
6. Start the app and open `/admin/login`. Sign in with the provisioned owner account. The project editor supports JPG, PNG, WebP, and AVIF uploads up to 5 MB.

If this Supabase project is shared with other applications, review existing `storage.objects` policies before applying the migration. Storage policies are permissive when combined, so remove/limit any existing broad policy that would allow writes to every bucket. The policies in this migration restrict access to the `portfolio-media` bucket and authorized admin profile.

## Data and permissions

The migration seeds the current nine project cards without changing their descriptions, technologies, links, or CodeMarket's in-development status. It also seeds the current About copy and Contact email, GitHub, and LinkedIn values. The migration uses conflict-safe inserts so existing content is not overwritten when the script is re-run.

- Anonymous visitors can read published and in-progress projects, the About record, enabled contact links, and public media. Draft projects and disabled links are not public.
- Authenticated visitors without the provisioned admin profile cannot write portfolio rows or media. RLS enforces that restriction in the database.
- Admin sessions use Supabase Auth's persistent browser session and token refresh. No user registration or privileged key is shipped to the browser.
- Contact form delivery remains configured independently through the existing `VITE_FORMSPREE_ENDPOINT`.

To verify write protection, sign in as a different authenticated account that has no `admin_profiles` row and attempt to insert/update/delete a `projects` row or upload to `portfolio-media`; each request must be rejected by RLS. Public reads of non-draft project cards should still succeed.

## Admin routes

- `/admin/login` — email/password sign in for the provisioned owner account
- `/admin` — content summary
- `/admin/projects` — create, edit, delete, feature, publish/draft, and reorder projects
- `/admin/about` — edit About copy, statistics, interests, and upload/replace the portrait
- `/admin/contact` — manage public email and social links
- `/admin/account` — view the signed-in account and change its password

When Supabase variables are absent, `/admin` shows setup instructions and public routes use their existing portfolio content; this fallback is for first-time setup only, not a substitute for database authorization.
