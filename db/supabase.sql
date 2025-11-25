create table if not exists public.attendance_records (
  id text primary key,
  date text unique not null,
  clock_in text,
  clock_out text,
  break_start text,
  break_end text,
  total_work_time integer,
  total_break_time integer,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

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
