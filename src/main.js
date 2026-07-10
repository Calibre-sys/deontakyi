import './style.css'

const $  = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

/* ============================================================
   MEDIA — one place to register documents, screenshots, videos.
   Drop files in /public/... then add items below.
   item = { type?: 'image'|'video'|'pdf', src, poster? }
   (type is inferred from the file extension when omitted)
   Empty items[] → shows a friendly "not uploaded yet" state.
   ============================================================ */
const MEDIA = {
  // documents
  cv: { name: 'Curriculum Vitae — Deon Takyi-Amponsem', items: [{ src: '/Deon-Takyi-Amponsem-CV.pdf' }] },

  // private projects — screenshots / screen recordings (no public URL)
  // rows tagged .row--media grow an inline muted micro-loop built from the first video below.
  'proj-fortel': { name: 'Fortel — demo', items: [
    { src: '/media/fortel-demo.mp4' },
  ] },
  'proj-reschar': { name: 'RescharAI — demo', items: [
    { src: '/media/reschar-demo.mp4' },
  ] },
  'proj-recruit': { name: 'Recruitment AI Agent — demo', items: [
    // { src: '/media/recruit-demo.mp4' },
  ] },
  'proj-soh': { name: 'SoH Order Management — demo', items: [
    { src: '/media/soh-demo.mp4' },
  ] },

  // events & conferences — photo galleries
  'event-energy4me':  { name: 'SPE Energy4me — Outreach', items: [
    { src: '/media/energy4me-2.jpg' },
    { src: '/media/energy4me-1.jpg' },
  ] },
  'event-buildingbytes': { name: 'Building Bytes Pitch Program', items: [
    { src: '/media/buildingbytes-1.jpg' },
    { src: '/media/buildingbytes-2.jpg' },
  ] },
  'event-atc':        { name: 'ATC 2026 — Africa Technology Conference', items: [
    { src: '/media/atc-2026.jpg' },
  ] },
}

/* ── reveal on scroll ───────────────────────────────────── */
function reveals () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { $$('.ro').forEach(e => e.classList.add('in')); return }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  $$('.ro').forEach(e => io.observe(e))
}

/* ── active section in masthead nav ─────────────────────── */
function activeNav () {
  const links = $$('.side__nav a')
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]))
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'))
        map.get(e.target.id)?.classList.add('active')
      }
    })
  }, { rootMargin: '-42% 0px -52% 0px' })
  ;['intro', 'about', 'work', 'path', 'events', 'proof', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s) })
}

/* ── mobile nav ─────────────────────────────────────────── */
function mobileNav () {
  const b = $('#burger')
  const set = (open) => { document.body.classList.toggle('nav-open', open); b?.setAttribute('aria-expanded', String(open)) }
  b?.addEventListener('click', () => set(!document.body.classList.contains('nav-open')))
  $$('.side__nav a').forEach(a => a.addEventListener('click', () => set(false)))
}

/* ── thumbnails: apply data-thumb covers on event tiles ─── */
function thumbs () {
  $$('[data-thumb]').forEach(el => {
    const m = $('.tile__media', el)
    if (m) { m.style.backgroundImage = `url("${el.dataset.thumb}")`; el.classList.add('has-thumb') }
  })
}

/* ── viewer: documents, image galleries, video ──────────── */
function viewer () {
  const v = $('#viewer'), stage = $('#viewerStage'), nameEl = $('#viewerName')
  const dl = $('#viewerDownload'), gal = $('#viewerGal'), count = $('#galCount')
  let items = [], idx = 0, lastFocus = null

  const typeOf = (it) => it.type || (/\.pdf($|\?)/i.test(it.src) ? 'pdf'
    : /\.(mp4|webm|mov|m4v)($|\?)/i.test(it.src) ? 'video' : 'image')

  const render = () => {
    const it = items[idx]
    const t = typeOf(it)
    stage.innerHTML =
      t === 'pdf'   ? `<iframe src="${it.src}#view=FitH" title="document"></iframe>`
    : t === 'video' ? `<video src="${it.src}" ${it.poster ? `poster="${it.poster}"` : ''} controls playsinline></video>`
    :                 `<img src="${it.src}" alt="" />`
    dl.href = it.src
    dl.style.display = t === 'video' ? 'none' : ''   // no download for demo videos
    const many = items.length > 1
    gal.hidden = !many
    if (many) count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
  }
  const go = (d) => { idx = (idx + d + items.length) % items.length; render() }

  const open = (payload) => {
    lastFocus = document.activeElement
    nameEl.textContent = payload.name || payload.label || 'Media'
    items = payload.items || []
    idx = 0
    if (!items.length) {
      gal.hidden = true; dl.style.display = 'none'
      stage.innerHTML = `<div class="viewer__empty">
        <svg viewBox="0 0 24 24" width="38" height="38"><path d="M4 16l4.5-4.5 3 3L16 10l4 4M4 5h16v14H4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9" cy="9" r="1.4" fill="currentColor"/></svg>
        <b>${payload.label || 'This'} — nothing uploaded yet</b>
        <p>Add photos or a video to <code>/public/media/</code>, then list them under this key in <code>src/main.js → MEDIA</code>.</p>
      </div>`
    } else {
      dl.style.display = ''
      render()
    }
    v.classList.add('open'); v.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    $('.viewer__btn--x', v)?.focus()
  }
  const close = () => {
    v.classList.remove('open'); v.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''; stage.innerHTML = ''; items = []
    lastFocus?.focus()
  }

  // triggers: data-media (registry) and data-evidence (legacy: cv / placeholder)
  $$('[data-media]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault()
    const m = MEDIA[el.dataset.media] || {}
    open({ name: m.name || el.dataset.label, label: el.dataset.label || m.name, items: m.items })
  }))
  $$('[data-evidence]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault()
    const key = el.dataset.evidence
    if (key === 'placeholder') open({ label: el.dataset.label, items: el.dataset.src ? [{ src: el.dataset.src }] : [] })
    else if (MEDIA[key]) open(MEDIA[key])
  }))

  $('#galPrev')?.addEventListener('click', () => go(-1))
  $('#galNext')?.addEventListener('click', () => go(1))
  $$('[data-close]', v).forEach(el => el.addEventListener('click', close))
  addEventListener('keydown', (e) => {
    if (!v.classList.contains('open')) return
    if (e.key === 'Escape') close()
    if (items.length > 1 && e.key === 'ArrowLeft') go(-1)
    if (items.length > 1 && e.key === 'ArrowRight') go(1)
  })
}

/* ── inline micro-loops: quiet, muted, never bypassed ─────
   A .thumb[data-thumb="KEY"] grows a small looping preview from the
   first video registered under MEDIA[KEY]. No video yet → "demo soon"
   placeholder (the row still opens the modal's empty state).
   Plays on row-hover (desktop) or ~60% in-view (touch), one at a time.
   prefers-reduced-motion → never autoplays; shows a static ▸ still.   */
function microLoops () {
  const isVid = (s) => /\.(mp4|webm|mov|m4v)($|\?)/i.test(s)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let current = null

  const play = (t) => {
    if (reduce) return
    const v = $('video', t); if (!v) return
    if (current && current !== v) { current.pause(); current.closest('.thumb')?.classList.remove('is-playing') }
    v.play().then(() => t.classList.add('is-playing')).catch(() => {})
    current = v
  }
  const stop = (t) => {
    const v = $('video', t); if (!v) return
    v.pause(); t.classList.remove('is-playing')
    if (current === v) current = null
  }

  const live = []
  $$('.thumb[data-thumb]').forEach(t => {
    const key = t.dataset.thumb
    const clip = (MEDIA[key]?.items || []).find(it => isVid(it.src))
    if (!clip) { t.classList.add('thumb--empty'); t.innerHTML = '<span class="mono">demo<br>soon</span>'; return }
    const file = clip.src.split('/').pop()
    t.innerHTML =
      `<video muted loop playsinline preload="metadata" src="${clip.src}#t=0.1"></video>` +
      `<span class="thumb__file mono">${file}</span>` +
      `<span class="thumb__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>` +
      `<span class="thumb__tc mono">▸ demo</span>` +
      `<span class="thumb__live mono">live</span>`
    const host = t.closest('.card') || t.closest('.row')
    host?.addEventListener('mouseenter', () => play(t))
    host?.addEventListener('mouseleave', () => stop(t))
    live.push(t)
  })

  // touch / no-hover: in-view autoplay, one at a time
  if (live.length && matchMedia('(hover: none)').matches && !reduce) {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { (e.isIntersecting && e.intersectionRatio > 0.6) ? play(e.target) : stop(e.target) })
    }, { threshold: [0, 0.6, 1] })
    live.forEach(t => io.observe(t))
  }
}

/* ── work: view-more reveal ─────────────────────────────── */
function viewMore () {
  const btn = $('#workMore'), list = $('#workCards')
  if (!btn || !list) return
  btn.addEventListener('click', () => {
    list.classList.remove('is-collapsed')
    btn.setAttribute('aria-expanded', 'true')
    btn.hidden = true
    // force the revealed cards to animate in (they were display:none, so the
    // reveal observer never fired on them)
    $$('.card--more.ro', list).forEach(el => el.classList.add('in'))
  })
}

reveals(); activeNav(); mobileNav(); thumbs(); viewer(); microLoops(); viewMore()
