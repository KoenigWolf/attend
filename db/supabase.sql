create table if not exists public.attendance_records (
  id text primary key,
  date text unique not null,
  clock_in text,
  clock_out text,
  break_start text,
  break_end text,
  break_sessions jsonb default '[]'::jsonb,
  total_work_time integer,
  total_break_time integer,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- For existing tables, ensure the break_sessions column exists
alter table public.attendance_records
  add column if not exists break_sessions jsonb default '[]'::jsonb;

create or replace function public.attendance_records_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists attendance_records_set_updated_at on public.attendance_records;
create trigger attendance_records_set_updated_at
before update on public.attendance_records
for each row execute function public.attendance_records_updated_at();

alter table public.attendance_records enable row level security;

-- Development-friendly RLS policies (anon key). Adjust or tighten for production.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'attendance_records'
      and policyname = 'Allow anon select'
  ) then
    create policy "Allow anon select"
      on public.attendance_records
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'attendance_records'
      and policyname = 'Allow anon insert'
  ) then
    create policy "Allow anon insert"
      on public.attendance_records
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'attendance_records'
      and policyname = 'Allow anon update'
  ) then
    create policy "Allow anon update"
      on public.attendance_records
      for update
      using (true)
      with check (true);
  end if;
end
$$;
