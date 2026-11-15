// Layout dos clones do app Manure AI (o CRM que o cliente usa): menu lateral igual ao Sidebar.vue e página igual ao AuthenticatedLayout.vue.
// Escritório de exemplo: Ferraz & Lima Advocacia, trabalhista. Pessoas e números fictícios.

// Dentro da apresentação (iframe), app.css aumenta os textos miúdos para quem assiste
if (window.parent !== window) document.documentElement.classList.add('embed')

const APP_USER = 'Camila Ferraz'
const APP_COMPANY = 'Ferraz & Lima Advocacia'

const APP_MENU = [
  { name: 'Início', icon: 'pi pi-home' },
  {
    name: 'Comercial',
    icon: 'pi pi-briefcase',
    children: [
      { name: 'Conversas', icon: 'pi pi-comments', badge: 4 },
      { key: 'leads', name: 'Leads', icon: 'pi pi-filter', href: 'crm.html' },
      { name: 'Tarefas', icon: 'pi pi-check-square' },
      { key: 'metricas', name: 'Métricas', icon: 'pi pi-chart-line', href: 'metricas.html' }
    ]
  },
  { name: 'Marketing', icon: 'pi pi-megaphone', closed: true },
  { name: 'Galeria de mídia', icon: 'pi pi-images' },
  { name: 'Configurações', icon: 'pi pi-cog', closed: true }
]

const initials = name =>
  name
    .replace(/^(Dra?\.)\s/, '')
    .split(' ')
    .filter(Boolean)
    .map((part, i, all) => (i === 0 || i === all.length - 1 ? part[0] : ''))
    .join('')
    .toUpperCase()

function appLayout(active) {
  const badge = n => (n ? `<span class="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-green-600 text-white text-[11px] font-bold flex items-center justify-center">${n}</span>` : '')
  const item = (it, { child = false, parentActive = false, open = false } = {}) => {
    const on = it.key === active
    const cls = parentActive ? 'text-primary-500 font-bold hover:bg-slate-100' : on ? 'bg-primary-500 font-bold' : child ? 'text-slate-500 hover:bg-slate-100' : 'hover:bg-slate-100'
    const chevron = it.children || it.closed ? `<i class="pi text-xs ${open ? 'pi-chevron-up' : 'pi-chevron-down'}"></i>` : ''
    return `<a ${it.href ? `href="${it.href}"` : ''} class="flex items-center justify-between space-x-3 p-4 rounded-xl transition-all text-sm font-semibold w-full cursor-pointer ${cls}">
      <div class="flex items-center gap-2"><i class="${it.icon} text-lg"></i><span>${it.name}</span></div>${badge(it.badge)}${chevron}</a>`
  }
  const nav = APP_MENU.map(entry => {
    if (!entry.children) return item(entry)
    const parentActive = entry.children.some(c => c.key === active)
    return `<div class="flex flex-col space-y-1">${item(entry, { parentActive, open: true })}<div class="pl-4 space-y-1 mt-1">${entry.children.map(c => item(c, { child: true })).join('')}</div></div>`
  }).join('')

  document.getElementById('app-sidebar').outerHTML = `
    <aside class="w-72 shrink-0 bg-white border-r flex flex-col p-6 space-y-8 overflow-y-auto no-scrollbar">
      <div class="flex items-center w-full justify-between"><img src="img/erp-logo.svg" alt="Logo" class="h-8 ps-4 mt-4" /></div>
      <nav class="flex-1 space-y-1">${nav}</nav>
      <div class="border-t pt-4 mt-auto">
        <button type="button" class="flex w-full items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-slate-100">
          <span class="w-9 h-9 shrink-0 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">${initials(APP_USER)}</span>
          <span class="flex flex-1 flex-col min-w-0"><span class="text-sm font-semibold truncate">${APP_USER}</span><span class="text-xs text-slate-500 truncate">${APP_COMPANY}</span></span>
          <i class="pi pi-sort text-xs text-slate-400"></i>
        </button>
      </div>
    </aside>`
}

let appToastTimer
function appToast(msg, icon = 'pi pi-check-circle') {
  let t = document.getElementById('app-toast')
  if (!t) {
    t = document.createElement('div')
    t.id = 'app-toast'
    document.body.appendChild(t)
  }
  t.className = 'p-toast'
  t.innerHTML = `<i class="${icon} mt-0.5"></i><div class="font-semibold">${msg}</div>`
  t.hidden = false
  clearTimeout(appToastTimer)
  appToastTimer = setTimeout(() => (t.hidden = true), 2400)
}

// Dentro da apresentação, as setas continuam passando os slides
document.addEventListener('keydown', e => {
  if (window.parent === window || e.defaultPrevented) return
  if (e.target.closest?.('input, textarea, select')) return
  if (['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(e.key)) {
    e.preventDefault()
    parent.postMessage({ deckKey: e.key }, '*')
  }
})
