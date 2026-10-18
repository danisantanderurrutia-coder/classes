import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  ListChecks,
  Megaphone,
  MapPin,
  Users,
  Download,
  Upload,
  Copy,
  Check,
  Trash2,
  Plus,
  ArrowLeft,
  Lock,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'admin_marketing_v1';

const CHANNELS = [
  { id: 'ebay', label: 'eBay Kleinanzeigen' },
  { id: 'flyer', label: 'Calle: flyer / tear-off' },
  { id: 'tarjeta', label: 'Calle: tarjeta / colegio' },
  { id: 'web', label: 'Web directa' },
  { id: 'referido', label: 'Referido' },
];

const SEGMENTS = [
  { id: 'A', label: 'A · Universidad (internacionales)' },
  { id: 'B', label: 'B · IB (alumno o padres)' },
  { id: 'C', label: 'C · Máster / tesis' },
];

const STATUSES = [
  { id: 'nuevo', label: 'Nuevo', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'contactado', label: 'Contactado', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'diagnostico', label: 'Diagnóstico hecho', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'alumno', label: 'Alumno', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'perdido', label: 'Perdido', color: 'bg-rose-100 text-rose-800 border-rose-300' },
];

const SPOT_TYPES = [
  { id: 'tablon', label: 'Tablón (flyer A4/A5)' },
  { id: 'tear-off', label: 'Tear-off (tiras con QR)' },
  { id: 'colegio', label: 'Colegio / academia (tarjetas)' },
  { id: 'otro', label: 'Otro' },
];

/** Plan de la semana 1: SOLO eBay Kleinanzeigen + calle. */
const WEEK1_TASKS = [
  {
    group: 'eBay Kleinanzeigen',
    items: [
      { id: 'e1', text: 'Publicar anuncio A (Universidad: Mathe & Physik, clase en español o inglés)' },
      { id: 'e2', text: 'Publicar anuncio B (IB Math AA HL & Physik HL)' },
      { id: 'e3', text: 'Añadir fotos (perfil profesional + captura del Galileo Lab) y QR/enlace a la web' },
      { id: 'e4', text: 'Incluir ciudad y universidad en el título (Hannover, LUH…)' },
      { id: 'e5', text: 'Renovar los anuncios cada 2-3 días para mantenerlos arriba' },
      { id: 'e6', text: 'Responder todos los mensajes en menos de 1 hora y ofrecer sesión diagnóstica gratis' },
    ],
  },
  {
    group: 'Calle',
    items: [
      { id: 'c1', text: 'Diseñar e imprimir flyers A5 / posters A4 con QR (un QR distinto por ubicación)' },
      { id: 'c2', text: 'Imprimir tear-off tabs (tiras con contacto/QR)' },
      { id: 'c3', text: 'Pegar en Mensa, Fachschaften y bibliotecas (pedir permiso donde haga falta)' },
      { id: 'c4', text: 'Pegar en residencias (Studentenwerk), copisterías y cafeterías' },
      { id: 'c5', text: 'Dejar tarjetas en colegios internacionales y academias de idiomas' },
      { id: 'c6', text: 'Registrar cada ubicación en la pestaña «Calle»' },
    ],
  },
  {
    group: 'Medición',
    items: [
      { id: 'm1', text: 'Registrar cada contacto en «Leads» con su canal' },
      { id: 'm2', text: 'Revisar al final de la semana: contactos por canal → diagnósticos → alumnos' },
    ],
  },
];

/** Fase posterior: bloqueada hasta que haya casos verificables. */
const LATER_TASKS = [
  { id: 'l1', text: 'Pedir reseña (con permiso) a los primeros alumnos reales' },
  { id: 'l2', text: 'Valorar Google Business Profile cuando existan reseñas' },
  { id: 'l3', text: 'Valorar anuncios de pago y comunidades online' },
  { id: 'l4', text: 'Repetir flyers antes de los períodos de Klausuren (feb-mar y jul-sep)' },
];

const TEMPLATES = [
  {
    id: 'adA',
    title: 'eBay · Anuncio A (Universidad)',
    text: `Titel: Nachhilfe Mathe & Physik Uni (Hannover, LUH…) – Unterricht auf Spanisch oder Englisch

Du hast bald eine Klausur in Höhere Mathematik, Lineare Algebra oder Mechanik? Ich bin Geophysiker und Ingenieur (Double M.Sc.) und biete Einzelunterricht an.
⚠️ Der Unterricht findet auf Englisch oder Spanisch statt, nicht auf Deutsch.
Altklausuren, Punkte-Strategie, Python-Anwendungen. Ab 55 €/h, 8h-Paket 390 €. Erstes Diagnosegespräch kostenlos. Offizielle Rechnung (§ 19 UStG).
Online oder vor Ort in Hannover.

EN/ES: Classes are taught in English or Spanish, not German. / Las clases son en español o inglés, no en alemán. First diagnostic session free / Primera sesión diagnóstica gratis.
Link/QR: [web]`,
  },
  {
    id: 'adB',
    title: 'eBay · Anuncio B (IB)',
    text: `Titel: IB Mathe AA HL & Physik HL Nachhilfe – Englisch oder Spanisch

IA-Betreuung, Paper 1/2/3 Training, Syllabus-Check. Unterricht ausschließlich auf Englisch oder Spanisch. Ab 50 €/h, 8h-Paket 360 €. Kostenloses Erstgespräch.

EN/ES: IA guidance, Paper 1/2/3 drills. Classes in English or Spanish. / Guía para el IA, práctica de Paper 1/2/3. Clases en español o inglés. Primera sesión gratis.
Link/QR: [web]`,
  },
  {
    id: 'flyer',
    title: 'Flyer A5 / tear-off',
    text: `Klausur in Mathe oder Physik?
Nachhilfe 1:1 – Unterricht auf Spanisch / English (nicht auf Deutsch)
Clases 1-a-1 en español · 1-on-1 classes in English
Geophysicist, Double M.Sc. · Altklausuren · Python
Erste Stunde kostenlos / Primera sesión diagnóstica gratis ▸ [QR]`,
  },
  {
    id: 'short',
    title: 'Anuncio corto',
    text: 'Nachhilfe Mathe/Physik auf Spanisch oder Englisch – 1. Stunde gratis',
  },
  {
    id: 'pitchEs',
    title: 'Pitch web · ES',
    text: `Mentoría de Mates y Física para tu Klausur, en español o inglés.

Clases 1-a-1 con un ingeniero y geofísico para estudiantes de universidades alemanas e IB. Entiendes el porqué y llegas al examen con método. Las clases son en español o inglés.

¿Por qué tomar clases conmigo?
1. Clases en tu idioma: explico en español o inglés, para que te concentres en la materia y no en traducir.
2. Conozco el contexto: ingeniero y geofísico (doble M.Sc.) con experiencia en el nivel que piden las universidades alemanas.
3. Intuición primero: cada concepto se explica con un fenómeno real y lo compruebas en el Galileo Lab interactivo.
4. Preparación con Altklausuren: practicamos con exámenes anteriores, estructura de respuesta y puntos parciales.
5. Ciencia aplicada: del cálculo a Python (NumPy/SciPy).
6. Claro y profesional: precios desde 50 €/h, paquetes de 8 h y factura oficial (§ 19 UStG).

Empieza con una sesión diagnóstica gratuita de 20 minutos: me cuentas tu módulo, tu fecha de examen y dónde te atascas, y te propongo un plan.`,
  },
  {
    id: 'pitchEn',
    title: 'Pitch web · EN',
    text: `STEM mentoring for your German university exams, taught in English or Spanish.

1-on-1 classes with an engineer and geophysicist for university and IB students. Classes are taught in English or Spanish, not German. Altklausur drills, intuition-first teaching, Python for real-world insight, official invoice.

Book a free 20-minute diagnostic session.`,
  },
];

const EMPTY_DATA = {
  tasks: {},
  leads: [],
  spots: [],
  baseUrl: '',
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '–');

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_DATA, baseUrl: window.location.origin + window.location.pathname };
    return { ...EMPTY_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_DATA };
  }
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500';
const btnPrimary =
  'px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2';
const btnGhost =
  'px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5';

const Card = ({ title, children, right }) => (
  <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
    {(title || right) && (
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {right}
      </div>
    )}
    {children}
  </section>
);

const Kpi = ({ label, value, hint }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-3xl font-extrabold text-slate-900 mt-1">{value}</div>
    {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
  </div>
);

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.prompt('Copia el texto:', text);
    }
  };
  return (
    <button onClick={copy} className={btnGhost}>
      {done ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copiado' : 'Copiar'}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

function Dashboard({ data }) {
  const { leads, spots, tasks } = data;
  const stats = useMemo(() => {
    const total = leads.length;
    const diag = leads.filter((l) => ['diagnostico', 'alumno'].includes(l.status)).length;
    const alumnos = leads.filter((l) => l.status === 'alumno');
    const revenue = alumnos.reduce((s, l) => s + (Number(l.value) || 0), 0);
    const byChannel = CHANNELS.map((c) => {
      const ls = leads.filter((l) => l.channel === c.id);
      return {
        ...c,
        total: ls.length,
        diag: ls.filter((l) => ['diagnostico', 'alumno'].includes(l.status)).length,
        alumnos: ls.filter((l) => l.status === 'alumno').length,
      };
    });
    return { total, diag, alumnos: alumnos.length, revenue, byChannel };
  }, [leads]);

  const week1Ids = WEEK1_TASKS.flatMap((g) => g.items.map((i) => i.id));
  const done = week1Ids.filter((id) => tasks[id]).length;
  const flyers = spots.reduce((s, x) => s + (Number(x.qty) || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Leads" value={stats.total} hint="contactos registrados" />
        <Kpi label="Diagnósticos" value={stats.diag} hint={`${pct(stats.diag, stats.total)} de los leads`} />
        <Kpi label="Alumnos" value={stats.alumnos} hint={`${pct(stats.alumnos, stats.diag)} de los diagnósticos`} />
        <Kpi label="Ingresos" value={`${stats.revenue} €`} hint="suma de los alumnos" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card title="Resultados por canal">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-mono text-slate-500 uppercase">
                    <th className="py-2 pr-3">Canal</th>
                    <th className="py-2 pr-3">Leads</th>
                    <th className="py-2 pr-3">Diagnósticos</th>
                    <th className="py-2 pr-3">Alumnos</th>
                    <th className="py-2">Conversión</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byChannel.map((c) => (
                    <tr key={c.id} className="border-t border-slate-100">
                      <td className="py-2 pr-3 font-semibold text-slate-800">{c.label}</td>
                      <td className="py-2 pr-3">{c.total}</td>
                      <td className="py-2 pr-3">{c.diag}</td>
                      <td className="py-2 pr-3">{c.alumnos}</td>
                      <td className="py-2 text-slate-500">{pct(c.alumnos, c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Semana 1">
            <div className="text-3xl font-extrabold text-slate-900">
              {done}/{week1Ids.length}
            </div>
            <div className="h-2 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${(done / week1Ids.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Tareas completadas (solo eBay + calle).</p>
          </Card>
          <Card title="Calle">
            <div className="text-3xl font-extrabold text-slate-900">{flyers}</div>
            <p className="text-xs text-slate-500">
              piezas repartidas en {spots.length} ubicaciones
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Plan({ data, update }) {
  const toggle = (id) => update({ tasks: { ...data.tasks, [id]: !data.tasks[id] } });
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-sky-900">
        <strong>Regla de la semana 1:</strong> solo <strong>eBay Kleinanzeigen</strong> y <strong>calle</strong>. Las clases son en inglés o español; los títulos y avisos pueden ir en alemán. Sin casos verificables: no se usan tasas de aprobación ni testimonios.
      </div>

      {WEEK1_TASKS.map((g) => (
        <Card key={g.group} title={g.group}>
          <ul className="space-y-2">
            {g.items.map((t) => (
              <li key={t.id}>
                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-600"
                    checked={!!data.tasks[t.id]}
                    onChange={() => toggle(t.id)}
                  />
                  <span className={data.tasks[t.id] ? 'line-through text-slate-400' : 'text-slate-800'}>
                    {t.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Card
        title="Después de la semana 1 (bloqueado)"
        right={
          <span className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <Lock className="w-3.5 h-3.5" /> solo si hay tracción y tú lo decides
          </span>
        }
      >
        <ul className="space-y-2 opacity-60">
          {LATER_TASKS.map((t) => (
            <li key={t.id} className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" disabled className="mt-1 h-4 w-4" />
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Templates() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {TEMPLATES.map((t) => (
        <Card key={t.id} title={t.title} right={<CopyButton text={t.text} />}>
          <pre className="whitespace-pre-wrap text-xs text-slate-700 font-sans leading-relaxed">{t.text}</pre>
        </Card>
      ))}
    </div>
  );
}

function Spots({ data, update }) {
  const [form, setForm] = useState({ name: '', type: 'tablon', qty: 10, date: today(), notes: '' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const add = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const tag = slug(form.name) || uid();
    update({ spots: [{ id: uid(), tag, ...form, qty: Number(form.qty) || 0 }, ...data.spots] });
    setForm({ name: '', type: 'tablon', qty: 10, date: today(), notes: '' });
  };
  const remove = (id) => update({ spots: data.spots.filter((s) => s.id !== id) });
  const leadsFor = (id) => data.leads.filter((l) => l.spotId === id).length;
  const link = (tag) => `${data.baseUrl || window.location.origin}?src=${tag}`;

  return (
    <div className="space-y-5">
      <Card title="Nueva ubicación">
        <form onSubmit={add} className="grid md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lugar</label>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Mensa LUH Welfengarten" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
            <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {SPOT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad</label>
            <input type="number" min="0" className={inputCls} value={form.qty} onChange={(e) => set('qty', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
            <input type="date" className={inputCls} value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <button type="submit" className={btnPrimary}>
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
          <div className="md:col-span-6">
            <input className={inputCls} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notas (permiso, persona de contacto…)" />
          </div>
        </form>
      </Card>

      <Card title="URL base para los QR">
        <input
          className={inputCls}
          value={data.baseUrl}
          onChange={(e) => update({ baseUrl: e.target.value })}
          placeholder="https://tu-sitio.github.io/Classes/"
        />
        <p className="text-xs text-slate-500 mt-1.5">
          Cada ubicación genera un enlace con <code>?src=etiqueta</code> para crear un QR distinto y saber qué punto funciona. El panel no cuenta visitas por sí solo: registra el lead en «Leads» indicando la ubicación.
        </p>
      </Card>

      <Card title={`Ubicaciones (${data.spots.length})`}>
        {data.spots.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay ubicaciones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-mono text-slate-500 uppercase">
                  <th className="py-2 pr-3">Lugar</th>
                  <th className="py-2 pr-3">Tipo</th>
                  <th className="py-2 pr-3">Cant.</th>
                  <th className="py-2 pr-3">Fecha</th>
                  <th className="py-2 pr-3">Leads</th>
                  <th className="py-2 pr-3">Enlace QR</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.spots.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-3">
                      <div className="font-semibold text-slate-800">{s.name}</div>
                      {s.notes && <div className="text-xs text-slate-500">{s.notes}</div>}
                    </td>
                    <td className="py-2 pr-3">{SPOT_TYPES.find((t) => t.id === s.type)?.label}</td>
                    <td className="py-2 pr-3">{s.qty}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.date}</td>
                    <td className="py-2 pr-3">{leadsFor(s.id)}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <CopyButton text={link(s.tag)} />
                        <a
                          className="text-xs text-sky-700 underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(link(s.tag))}`}
                        >
                          Ver QR
                        </a>
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      <button onClick={() => remove(s.id)} className="text-rose-600 hover:text-rose-800" aria-label="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Leads({ data, update }) {
  const blank = { name: '', contact: '', channel: 'ebay', spotId: '', segment: 'A', notes: '', value: '' };
  const [form, setForm] = useState(blank);
  const [filter, setFilter] = useState('all');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const add = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    update({
      leads: [{ id: uid(), createdAt: today(), status: 'nuevo', ...form }, ...data.leads],
    });
    setForm(blank);
  };
  const patch = (id, p) => update({ leads: data.leads.map((l) => (l.id === id ? { ...l, ...p } : l)) });
  const remove = (id) => update({ leads: data.leads.filter((l) => l.id !== id) });
  const shown = filter === 'all' ? data.leads : data.leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-5">
      <Card title="Nuevo lead">
        <form onSubmit={add} className="grid md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Contacto (WhatsApp / email)</label>
            <input className={inputCls} value={form.contact} onChange={(e) => set('contact', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Canal</label>
            <select className={inputCls} value={form.channel} onChange={(e) => set('channel', e.target.value)}>
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Segmento</label>
            <select className={inputCls} value={form.segment} onChange={(e) => set('segment', e.target.value)}>
              {SEGMENTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          {(form.channel === 'flyer' || form.channel === 'tarjeta') && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ubicación (calle)</label>
              <select className={inputCls} value={form.spotId} onChange={(e) => set('spotId', e.target.value)}>
                <option value="">— sin especificar —</option>
                {data.spots.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notas</label>
            <input className={inputCls} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Módulo, fecha de examen…" />
          </div>
          <button type="submit" className={btnPrimary}>
            <Plus className="w-3.5 h-3.5" /> Añadir lead
          </button>
        </form>
      </Card>

      <Card
        title={`Leads (${shown.length})`}
        right={
          <select className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        }
      >
        {shown.length === 0 ? (
          <p className="text-sm text-slate-500">No hay leads en esta vista.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-mono text-slate-500 uppercase">
                  <th className="py-2 pr-3">Lead</th>
                  <th className="py-2 pr-3">Canal</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3">Valor (€)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => {
                  const st = STATUSES.find((s) => s.id === l.status);
                  const spot = data.spots.find((s) => s.id === l.spotId);
                  return (
                    <tr key={l.id} className="border-t border-slate-100 align-top">
                      <td className="py-2 pr-3">
                        <div className="font-semibold text-slate-800">
                          {l.name} <span className="text-xs font-mono text-slate-400">· {l.segment}</span>
                        </div>
                        <div className="text-xs text-slate-500">{l.contact}</div>
                        {l.notes && <div className="text-xs text-slate-500">{l.notes}</div>}
                        <div className="text-[11px] text-slate-400">{l.createdAt}</div>
                      </td>
                      <td className="py-2 pr-3">
                        {CHANNELS.find((c) => c.id === l.channel)?.label}
                        {spot && <div className="text-xs text-slate-500">{spot.name}</div>}
                      </td>
                      <td className="py-2 pr-3">
                        <select
                          className={`px-2 py-1 rounded-lg border text-xs font-semibold ${st?.color}`}
                          value={l.status}
                          onChange={(e) => patch(l.id, { status: e.target.value })}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="0"
                          className="w-24 px-2 py-1 rounded-lg border border-slate-300 text-sm"
                          value={l.value}
                          onChange={(e) => patch(l.id, { value: e.target.value })}
                          placeholder="0"
                        />
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={() => remove(l.id)} className="text-rose-600 hover:text-rose-800" aria-label="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'plan', label: 'Plan', icon: ListChecks },
  { id: 'templates', label: 'Anuncios', icon: Megaphone },
  { id: 'spots', label: 'Calle', icon: MapPin },
  { id: 'leads', label: 'Leads', icon: Users },
];

export default function Admin() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState('dashboard');
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `marketing-admin-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (window.confirm('Esto reemplazará los datos actuales. ¿Continuar?')) {
          setData({ ...EMPTY_DATA, ...parsed });
        }
      } catch {
        window.alert('Archivo no válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold">
              [Φ]
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">Panel de administrador · Marketing</h1>
              <p className="text-xs font-mono text-slate-500">Captación de alumnos · eBay Kleinanzeigen + calle</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportJson} className={btnGhost}>
              <Download className="w-3.5 h-3.5" /> Exportar
            </button>
            <button onClick={() => fileRef.current?.click()} className={btnGhost}>
              <Upload className="w-3.5 h-3.5" /> Importar
            </button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importJson} />
            <a href="#/" className={btnPrimary}>
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al sitio
            </a>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard data={data} />}
        {tab === 'plan' && <Plan data={data} update={update} />}
        {tab === 'templates' && <Templates />}
        {tab === 'spots' && <Spots data={data} update={update} />}
        {tab === 'leads' && <Leads data={data} update={update} />}
        <p className="text-[11px] text-slate-400 mt-8">
          Los datos se guardan solo en este navegador (localStorage). Exporta una copia de seguridad con regularidad. Esta página no tiene autenticación: no guardes datos sensibles de los alumnos más allá de lo necesario.
        </p>
      </main>
    </div>
  );
}
