/* ============================================================
   Agenda privada — requiere sesión de Supabase
   ============================================================ */
(function () {
  const S = window.SITE;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const vSinBd = $('#vista-sin-bd'), vLogin = $('#vista-login'), vPanel = $('#vista-panel');
  const btnSalir = $('#btn-salir');
  const tbody = $('#tbody');
  let filtro = 'proximas';

  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const hoyISO = iso(new Date());

  function mostrar(el) {
    [vSinBd, vLogin, vPanel].forEach(v => v.hidden = true);
    el.hidden = false;
  }
  function aviso(el, texto, tipo) { el.className = 'msg is-' + tipo; el.innerHTML = texto; }

  /* ---------- Arranque ---------- */
  if (!DB.activo) { mostrar(vSinBd); return; }

  DB.sesion().then(s => { s ? abrirPanel() : mostrar(vLogin); });

  /* ---------- Login ---------- */
  $('#form-login').addEventListener('submit', async ev => {
    ev.preventDefault();
    const m = $('#login-msg');
    aviso(m, 'Comprobando…', 'info');
    try {
      await DB.login($('#l-email').value.trim(), $('#l-pass').value);
      abrirPanel();
    } catch (e) {
      aviso(m, 'No he podido entrar. Revisa el email y la contraseña.', 'err');
    }
  });

  btnSalir.addEventListener('click', async () => { await DB.logout(); location.reload(); });

  /* ---------- Panel ---------- */
  function abrirPanel() {
    mostrar(vPanel);
    btnSalir.hidden = false;
    $('#m-servicio').innerHTML = '<option value="" disabled selected>Servicio…</option>' +
      S.servicios.map(s => `<option>${s.titulo}</option>`).join('');
    $('#m-fecha').value = hoyISO;
    cargar();
  }

  $$('#filtros .chip[data-f]').forEach(b => b.addEventListener('click', () => {
    $$('#filtros .chip[data-f]').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on');
    filtro = b.dataset.f;
    cargar();
  }));

  $('#chip-nueva').addEventListener('click', () => {
    const box = $('#box-nueva');
    box.hidden = !box.hidden;
    if (!box.hidden) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  function rango() {
    const hoy = new Date();
    if (filtro === 'hoy')    return { desde: hoyISO, hasta: hoyISO };
    if (filtro === 'semana') return { desde: hoyISO, hasta: iso(new Date(hoy.getTime() + 7 * 864e5)) };
    if (filtro === 'todas')  return { desde: '2000-01-01', hasta: '2100-01-01' };
    return { desde: hoyISO, hasta: iso(new Date(hoy.getTime() + 365 * 864e5)) };  // próximas
  }

  const fechaCorta = f => new Date(f + 'T12:00:00')
    .toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

  async function cargar() {
    tbody.innerHTML = '<tr><td colspan="7" class="muted">Cargando…</td></tr>';
    try {
      const citas = await DB.listarCitas(rango());
      if (!citas.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="muted">No hay citas en este periodo.</td></tr>';
        return;
      }
      tbody.innerHTML = citas.map(c => `
        <tr data-id="${c.id}">
          <td>${fechaCorta(c.slot_date)}</td>
          <td><b>${String(c.slot_time).slice(0, 5)}</b></td>
          <td>
            ${escapar(c.nombre)}<br>
            <a class="muted" href="tel:${escapar(c.telefono)}" style="font-size:.82rem">${escapar(c.telefono)}</a>
            ${c.email ? `<br><span class="muted" style="font-size:.78rem">${escapar(c.email)}</span>` : ''}
          </td>
          <td>${escapar(c.servicio)}<br><span class="muted" style="font-size:.75rem">${c.origen === 'consulta' ? 'alta manual' : 'web'}</span></td>
          <td style="max-width:220px" class="muted">${c.notas ? escapar(c.notas) : '—'}</td>
          <td><span class="badge ${c.estado}">${c.estado}</span></td>
          <td style="white-space:nowrap">
            <button class="chip mini" data-a="confirmada">Confirmar</button>
            <button class="chip mini" data-a="cancelada">Anular</button>
            <button class="chip mini" data-a="borrar">Borrar</button>
          </td>
        </tr>`).join('');

      $$('#tbody .chip').forEach(b => b.addEventListener('click', async () => {
        const tr = b.closest('tr'), id = tr.dataset.id, a = b.dataset.a;
        if (a === 'borrar' && !confirm('¿Borrar esta cita definitivamente?')) return;
        b.disabled = true;
        try {
          a === 'borrar' ? await DB.borrarCita(id) : await DB.cambiarEstado(id, a);
          cargar();
        } catch (e) { alert('No se pudo actualizar: ' + e.message); b.disabled = false; }
      }));
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="muted">Error al cargar: ${escapar(e.message)}</td></tr>`;
    }
  }

  /* ---------- Alta manual ---------- */
  $('#form-manual').addEventListener('submit', async ev => {
    ev.preventDefault();
    const m = $('#manual-msg');
    aviso(m, 'Guardando…', 'info');
    try {
      await DB.crearCitaManual({
        nombre:   $('#m-nombre').value.trim(),
        telefono: $('#m-tel').value.trim(),
        email:    $('#m-email').value.trim(),
        servicio: $('#m-servicio').value,
        fecha:    $('#m-fecha').value,
        hora:     $('#m-hora').value,
        notas:    $('#m-notas').value.trim()
      });
      aviso(m, 'Cita guardada.', 'ok');
      ev.target.reset();
      $('#m-fecha').value = hoyISO;
      cargar();
    } catch (e) {
      aviso(m, e.message.includes('duplicate') || e.code === '23505'
        ? 'Ya hay una cita a esa hora.'
        : 'No se pudo guardar: ' + escapar(e.message), 'err');
    }
  });

  function escapar(t) {
    return String(t ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
