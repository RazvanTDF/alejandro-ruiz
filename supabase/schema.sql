-- ============================================================
--  Agenda de citas — Alejandro Ruiz
--  Pega este archivo entero en: Supabase > SQL Editor > Run
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Tabla ----------
create table if not exists public.citas (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre     text not null,
  telefono   text not null,
  email      text,
  servicio   text not null,
  slot_date  date not null,
  slot_time  time not null,
  notas      text,
  estado     text not null default 'pendiente'
             check (estado in ('pendiente','confirmada','cancelada')),
  origen     text not null default 'web'
             check (origen in ('web','consulta')),
  consent    boolean not null default false
);

-- Una sola cita por franja (las anuladas liberan la hora)
create unique index if not exists citas_franja_unica
  on public.citas (slot_date, slot_time)
  where estado <> 'cancelada';

create index if not exists citas_fecha_idx on public.citas (slot_date);

-- ---------- Seguridad a nivel de fila ----------
alter table public.citas enable row level security;

-- El público NO tiene ninguna política => no puede leer ni escribir
-- directamente en la tabla. Solo actúa a través de las funciones de abajo.

-- El profesional, una vez identificado, gestiona todo:
drop policy if exists "profesional gestiona citas" on public.citas;
create policy "profesional gestiona citas"
  on public.citas for all
  to authenticated
  using (true) with check (true);

-- ============================================================
--  Función pública 1: horas ya ocupadas (sin datos personales)
-- ============================================================
create or replace function public.horas_ocupadas(p_desde date, p_hasta date)
returns table (slot_date date, slot_time time)
language sql
security definer
set search_path = public
as $$
  select c.slot_date, c.slot_time
  from public.citas c
  where c.estado <> 'cancelada'
    and c.slot_date between p_desde and p_hasta
    and p_hasta - p_desde <= 62;   -- evita consultas masivas
$$;

-- ============================================================
--  Función pública 2: solicitar cita
-- ============================================================
create or replace function public.solicitar_cita(
  p_nombre   text,
  p_telefono text,
  p_email    text,
  p_servicio text,
  p_fecha    date,
  p_hora     time,
  p_notas    text,
  p_consent  boolean
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_pendientes int;
begin
  -- Validaciones básicas
  if p_consent is not true then
    return json_build_object('ok', false, 'mensaje', 'Falta aceptar la política de privacidad.');
  end if;
  if coalesce(length(trim(p_nombre)),0) < 2 or coalesce(length(trim(p_telefono)),0) < 6 then
    return json_build_object('ok', false, 'mensaje', 'Nombre o teléfono no válidos.');
  end if;
  if p_fecha < current_date or p_fecha > current_date + interval '120 days' then
    return json_build_object('ok', false, 'mensaje', 'La fecha solicitada no es válida.');
  end if;
  if length(coalesce(p_notas,'')) > 500 or length(p_nombre) > 80 or length(p_telefono) > 25 then
    return json_build_object('ok', false, 'mensaje', 'Alguno de los campos es demasiado largo.');
  end if;

  -- Límite simple anti-spam: máximo 3 solicitudes pendientes por teléfono
  select count(*) into v_pendientes
  from public.citas
  where telefono = trim(p_telefono) and estado = 'pendiente';
  if v_pendientes >= 3 then
    return json_build_object('ok', false,
      'mensaje', 'Ya tienes varias solicitudes pendientes. Te contactaré en breve.');
  end if;

  insert into public.citas (nombre, telefono, email, servicio, slot_date, slot_time, notas, consent, origen)
  values (trim(p_nombre), trim(p_telefono), nullif(trim(coalesce(p_email,'')),''),
          p_servicio, p_fecha, p_hora, nullif(trim(coalesce(p_notas,'')),''), true, 'web')
  returning id into v_id;

  return json_build_object('ok', true, 'id', v_id);

exception
  when unique_violation then
    return json_build_object('ok', false,
      'mensaje', 'Esa hora acaba de ocuparse. Elige otra, por favor.');
end;
$$;

-- ---------- Permisos ----------
revoke all on function public.horas_ocupadas(date, date) from public;
revoke all on function public.solicitar_cita(text,text,text,text,date,time,text,boolean) from public;

grant execute on function public.horas_ocupadas(date, date) to anon, authenticated;
grant execute on function public.solicitar_cita(text,text,text,text,date,time,text,boolean) to anon, authenticated;

-- ============================================================
--  Después de ejecutar esto:
--  1. Authentication > Users > Add user  → crea el usuario de
--     Alejandro con email y contraseña (es quien entra en agenda.html).
--  2. Authentication > Providers > Email → desactiva "Enable signup"
--     para que nadie más pueda registrarse.
--  3. Copia Project URL y la clave "anon public" en js/config.js.
-- ============================================================
