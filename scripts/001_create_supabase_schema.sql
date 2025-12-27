-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

-- Create chat_sessions table
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  last_modified timestamptz default now(),
  created_at timestamptz default now(),
  is_shared boolean default false,
  share_code text unique
);

-- Create chat_messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'model')),
  text text not null,
  timestamp bigint not null,
  attachments jsonb,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Chat sessions policies
create policy "chat_sessions_select_own"
  on public.chat_sessions for select
  using (auth.uid() = user_id or is_shared = true);

create policy "chat_sessions_insert_own"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "chat_sessions_update_own"
  on public.chat_sessions for update
  using (auth.uid() = user_id);

create policy "chat_sessions_delete_own"
  on public.chat_sessions for delete
  using (auth.uid() = user_id);

-- Chat messages policies
create policy "chat_messages_select_own"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and (chat_sessions.user_id = auth.uid() or chat_sessions.is_shared = true)
    )
  );

create policy "chat_messages_insert_own"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "chat_messages_update_own"
  on public.chat_messages for update
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "chat_messages_delete_own"
  on public.chat_messages for delete
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index if not exists idx_chat_sessions_share_code on public.chat_sessions(share_code);
create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);

-- Create trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (
    new.id,
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
