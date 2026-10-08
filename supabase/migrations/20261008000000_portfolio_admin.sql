create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  category text not null check (length(trim(category)) between 1 and 120),
  description text not null check (length(trim(description)) between 1 and 600),
  full_description text not null default '',
  technologies text[] not null default '{}',
  github_url text not null default '',
  live_demo_url text not null default '',
  image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'in_progress')),
  status_label text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint projects_github_url_protocol check (github_url = '' or github_url ~ '^https?://'),
  constraint projects_demo_url_protocol check (live_demo_url = '' or live_demo_url ~ '^https?://'),
  constraint projects_image_url_protocol check (image_url = '' or image_url ~ '^https?://')
);

create unique index if not exists projects_title_lower_unique
  on public.projects (lower(title));
create index if not exists projects_public_order_idx
  on public.projects (sort_order, created_at)
  where status in ('published', 'in_progress');

create table if not exists public.site_content (
  id text primary key check (id = 'about'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.contact_links (
  id uuid primary key default gen_random_uuid(),
  label text not null check (length(trim(label)) between 1 and 60),
  value text not null check (length(trim(value)) between 1 and 320),
  kind text not null check (kind in ('email', 'url')),
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint contact_link_value_valid check (
    (kind = 'email' and value ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
    or (kind = 'url' and value ~ '^https?://')
  )
);
create index if not exists contact_links_public_order_idx
  on public.contact_links (sort_order, created_at)
  where enabled;
create unique index if not exists contact_links_kind_value_unique
  on public.contact_links (kind, lower(value));

create or replace function public.set_portfolio_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_portfolio_updated_at();
drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_portfolio_updated_at();
drop trigger if exists contact_links_set_updated_at on public.contact_links;
create trigger contact_links_set_updated_at
  before update on public.contact_links
  for each row execute function public.set_portfolio_updated_at();

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_links enable row level security;

revoke all on public.admin_profiles from anon, authenticated;
grant select on public.admin_profiles to authenticated;
drop policy if exists "Admins can read their own profile" on public.admin_profiles;
create policy "Admins can read their own profile"
  on public.admin_profiles for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
drop policy if exists "Public can read visible projects" on public.projects;
create policy "Public can read visible projects"
  on public.projects for select to anon, authenticated
  using (status in ('published', 'in_progress') or (select public.is_portfolio_admin()));
drop policy if exists "Only admins can insert projects" on public.projects;
create policy "Only admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can update projects" on public.projects;
create policy "Only admins can update projects"
  on public.projects for update to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can delete projects" on public.projects;
create policy "Only admins can delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_portfolio_admin()));

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
drop policy if exists "Public can read about content" on public.site_content;
create policy "Public can read about content"
  on public.site_content for select to anon, authenticated
  using (id = 'about' or (select public.is_portfolio_admin()));
drop policy if exists "Only admins can insert site content" on public.site_content;
create policy "Only admins can insert site content"
  on public.site_content for insert to authenticated
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can update site content" on public.site_content;
create policy "Only admins can update site content"
  on public.site_content for update to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can delete site content" on public.site_content;
create policy "Only admins can delete site content"
  on public.site_content for delete to authenticated
  using ((select public.is_portfolio_admin()));

revoke all on public.contact_links from anon, authenticated;
grant select on public.contact_links to anon, authenticated;
grant insert, update, delete on public.contact_links to authenticated;
drop policy if exists "Public can read enabled contact links" on public.contact_links;
create policy "Public can read enabled contact links"
  on public.contact_links for select to anon, authenticated
  using (enabled or (select public.is_portfolio_admin()));
drop policy if exists "Only admins can insert contact links" on public.contact_links;
create policy "Only admins can insert contact links"
  on public.contact_links for insert to authenticated
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can update contact links" on public.contact_links;
create policy "Only admins can update contact links"
  on public.contact_links for update to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));
drop policy if exists "Only admins can delete contact links" on public.contact_links;
create policy "Only admins can delete contact links"
  on public.contact_links for delete to authenticated
  using ((select public.is_portfolio_admin()));

insert into public.projects
  (title, category, description, technologies, github_url, live_demo_url, status, status_label, featured, sort_order)
values
  ('CodeMarket', 'Software discovery & distribution',
   'A software catalog and distribution platform with searchable listings, software details and versions, user accounts, purchases, and an admin area. The current project is an actively developed MVP.',
   array['React','TypeScript','TanStack Start','Supabase','Tailwind CSS'],
   'https://github.com/Thalex35/codeMarket','https://code-market-web.vercel.app',
   'in_progress','Current project · active development',true,0),
  ('TaskMate', 'Student productivity · team project',
   'A homework and deadline manager built with a team during a web design bootcamp. Students can organize assignments by subject, set deadlines and priorities, track progress, and manage their study workload.',
   array['React','Supabase','React Router','Vite'],
   'https://github.com/Thalex35/Taskmate-app','https://taskmate-app.vercel.app',
   'published','',true,1),
  ('Dany Beat', 'Beat catalog & producer platform',
   'A platform for discovering and previewing instrumentals, with search and catalog filters, licensing details, user features, and direct WhatsApp inquiries. Online checkout is not enabled.',
   array['React','TypeScript','TanStack Start','Supabase','Tailwind CSS'],
   'https://github.com/Thalex35/Dany-beat','https://dany-beat.vercel.app',
   'published','',true,2),
  ('E-commerce Demo', 'Clothing store · website demo',
   'A French-language clothing-store demo with product details, stock-aware cart actions, and favorites. Payment methods are presented as future work; the demo does not process real payments.',
   array['React','TypeScript','TanStack Start','Supabase','Tailwind CSS'],
   'https://github.com/Thalex35/E-commerce-Demo','https://ecommercedemo-theta.vercel.app',
   'published','',false,3),
  ('Karibe Hotel', 'Hotel website',
   'A responsive hotel website presenting rooms and amenities, with a reservation-request interface. The booking form is a frontend demo and does not create a real reservation.',
   array['React','TypeScript','Vite','Tailwind CSS'],
   'https://github.com/Thalex35/karibe-hotel','https://karibe-hotel.vercel.app',
   'published','',false,4),
  ('La Table du Caius', 'Restaurant website',
   'A static restaurant website with a menu, gallery, events, contact information, and a reservation form that simulates a confirmation rather than sending a booking.',
   array['React','TypeScript','Vite','Tailwind CSS'],
   'https://github.com/Thalex35/la-table-de-caius','https://la-table-de-caius.vercel.app',
   'published','',false,5),
  ('TeacherHub', 'Teacher & academic management',
   'A teacher-facing management app for organizing classes and students, planning lessons, managing curriculum and attendance, and recording assignments, evaluations, and grades.',
   array['React','TypeScript','TanStack Start','Supabase','Tailwind CSS'],
   'https://github.com/Thalex35/TeacherHub','',
   'published','',false,6),
  ('Children Management App', 'Children''s department management',
   'An internal management system for the MICEVA Children''s Department, with authenticated child records and guardian contacts, profile-completeness checks, committee and administration records, calendar activities, and reports.',
   array['React','TypeScript','TanStack Start','Supabase','Tailwind CSS'],
   'https://github.com/Thalex35/miceva-children-connect-main','',
   'published','',false,7),
  ('Nexora', 'Personal life management',
   'A private personal workspace that brings daily planning and review together with tasks, routines, goals, projects, finance, learning, notes, achievements, life history, and analytics.',
   array['React','TypeScript','TanStack Start','Drizzle ORM','PostgreSQL','Supabase Auth','Tailwind CSS'],
   'https://github.com/Thalex35/Nexora','https://nexora-lmg.vercel.app',
   'published','',false,8)
on conflict (lower(title)) do nothing;

insert into public.site_content (id, content)
values (
  'about',
  '{
    "headline":"Developer, student & Christian.",
    "introduction":"A little about who I am, what I’m learning, and what matters to me.",
    "profile_name":"Theodore Louisjuste",
    "image_url":"",
    "image_alt":"Portrait of Theodore Louisjuste",
    "paragraphs":[
      "I’m Theodore Louisjuste, also known as Theed. I’m a Computer Science student at UoPeople and a Business Management student at UEspoir, based in Aquin Sud, Haiti.",
      "I enjoy building useful software and turning ideas into clear, thoughtful interfaces. Each project gives me a chance to solve a problem, learn something new, and improve how I build for the people using it.",
      "My current focus is frontend development. I work mainly with React, JavaScript, HTML, and CSS, and use Vite in my projects. I’m continuing to build experience through hands-on work and study.",
      "My Christian faith is important to me and guides me to approach people and my work with integrity and care. I’m early in my journey, learning steadily and building one project at a time."
    ],
    "stats":[
      {"value":"9","label":"Projects showcased"},
      {"value":"2","label":"Degrees in progress"},
      {"value":"HTI","label":"Based in Haiti"}
    ],
    "interests":["Web development","Anime","Church services","Business","Learning English","Problem solving"]
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.contact_links (label, value, kind, sort_order)
values
  ('Email','louisjuste.theodore.jr@gmail.com','email',0),
  ('GitHub','https://github.com/Thalex35','url',1),
  ('LinkedIn','https://www.linkedin.com/in/theodore-louisjuste-763412407/','url',2)
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');
drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()))
  with check (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
