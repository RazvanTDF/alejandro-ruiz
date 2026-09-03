/* ============================================================
   Capa de datos — Supabase (opcional)
   Si SITE.supabase.url / anonKey están vacíos, DB.activo = false
   y el sitio funciona en "modo WhatsApp".
   ============================================================ */

window.DB = (function () {
  const cfg = (window.SITE && window.SITE.supabase) || {};
  const activo = !!(cfg.url && cfg.anonKey && window.supabase);
  const client = activo ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  /* --- Público: horas ya ocupadas de un día (sin datos personales) --- */
  async function horasOcupadas(fechaISO) {
    if (!activo) return [];
    const { data, error } = await client.rpc('horas_ocupadas', {
      p_desde: fechaISO,
      p_hasta: fechaISO
    });
    if (error) throw error;
    return (data || []).map(r => String(r.slot_time).slice(0, 5));
  }

  /* --- Público: crear solicitud de cita --- */
  async function solicitarCita(c) {
    if (!activo) throw new Error('sin-bd');
    const { data, error } = await client.rpc('solicitar_cita', {
      p_nombre:    c.nombre,
      p_telefono:  c.telefono,
      p_email:     c.email || null,
      p_servicio:  c.servicio,
      p_fecha:     c.fecha,
      p_hora:      c.hora,
      p_notas:     c.notas || null,
      p_consent:   !!c.consent
    });
    if (error) throw error;
    return data;
  }

  /* --- Privado (requiere sesión iniciada) --- */
  async function login(email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  async function logout()   { await client.auth.signOut(); }
  async function sesion()   { const { data } = await client.auth.getSession(); return data.session; }

  async function listarCitas({ desde, hasta }) {
    const { data, error } = await client
      .from('citas')
      .select('*')
      .gte('slot_date', desde)
      .lte('slot_date', hasta)
      .order('slot_date', { ascending: true })
      .order('slot_time', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function cambiarEstado(id, estado) {
    const { error } = await client.from('citas').update({ estado }).eq('id', id);
    if (error) throw error;
  }

  async function borrarCita(id) {
    const { error } = await client.from('citas').delete().eq('id', id);
    if (error) throw error;
  }

  async function crearCitaManual(c) {
    const { error } = await client.from('citas').insert({
      nombre: c.nombre, telefono: c.telefono, email: c.email || null,
      servicio: c.servicio, slot_date: c.fecha, slot_time: c.hora,
      notas: c.notas || null, estado: 'confirmada', origen: 'consulta', consent: true
    });
    if (error) throw error;
  }

  return {
    activo, client,
    horasOcupadas, solicitarCita,
    login, logout, sesion,
    listarCitas, cambiarEstado, borrarCita, crearCitaManual
  };
})();
