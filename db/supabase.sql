-- 拡張（UUID生成に使う。Supabaseなら通常入ってる）
create extension if not exists "pgcrypto";

create table if not exists public.attendance_records (
  id               uuid primary key default gen_random_uuid(),

  -- 勤務日
  work_date        date not null unique,

  -- 打刻時刻（タイムゾーン込み）
  clock_in         timestamptz,
  clock_out        timestamptz,

  -- 休憩（単発用。将来消してもOK）
  break_start      timestamptz,
  break_end        timestamptz,

  -- 複数休憩セッション
  break_sessions   jsonb not null default '[]'::jsonb,

  -- 集計（分で保持など運用に合わせて）
  total_work_time  integer,
  total_break_time integer,

  created_at       timestamptz not null default timezone('utc', now()),
  updated_at       timestamptz not null default timezone('utc', now()),

  -- 簡易整合性チェック例（任意）
  constraint clock_order_chk
    check (
      clock_in is null
      or clock_out is null
      or clock_in <= clock_out
    )
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists attendance_records_set_updated_at on public.attendance_records;
create trigger attendance_records_set_updated_at
before update on public.attendance_records
for each row execute function public.set_updated_at();

alter table public.attendance_records enable row level security;

-- Dev向け anon 全許可（Aと同じ）
do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname='public'
       and tablename='attendance_records'
       and policyname='Allow anon select'
  ) then
    create policy "Allow anon select"
      on public.attendance_records
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname='public'
       and tablename='attendance_records'
       and policyname='Allow anon insert'
  ) then
    create policy "Allow anon insert"
      on public.attendance_records
      for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
     where schemaname='public'
       and tablename='attendance_records'
       and policyname='Allow anon update'
  ) then
    create policy "Allow anon update"
      on public.attendance_records
      for update using (true) with check (true);
  end if;
end $$;
