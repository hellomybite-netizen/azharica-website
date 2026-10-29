const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const togglePanel = (button, panel, otherButton, otherPanel) => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
  if (otherButton && otherButton.getAttribute('aria-expanded') === 'true') {
    otherButton.setAttribute('aria-expanded', 'false');
    otherPanel.hidden = true;
  }
};

const searchToggle = qs('.search-toggle');
const searchPanel = qs('#search-panel');
const menuToggle = qs('.menu-toggle');
const mobileMenu = qs('#mobile-menu');

searchToggle.addEventListener('click', () => {
  togglePanel(searchToggle, searchPanel, menuToggle, mobileMenu);
  if (!searchPanel.hidden) setTimeout(() => qs('#site-search').focus(), 0);
});

menuToggle.addEventListener('click', () => togglePanel(menuToggle, mobileMenu, searchToggle, searchPanel));
qsa('#mobile-menu a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const destinations = [
  { terms: ['kurikulum', 'dual', 'pathway', 'al-azhar', 'insan cendekia'], id: 'program', label: 'Membuka bagian Dual Pathway…' },
  { terms: ['sqils', 'steam', 'coding', 'robotika', 'sains'], id: 'sqils', label: 'Membuka bagian SQILS…' },
  { terms: ['asrama', 'pesantren', 'santri', 'cinta', 'kehidupan'], id: 'kehidupan', label: 'Membuka kehidupan santri…' },
  { terms: ['ppdb', 'daftar', 'penerimaan', 'admisi', 'kunjungan'], href: 'ppdb.html', label: 'Membuka halaman PPDB…' },
  { terms: ['tentang', 'azharica', 'sekolah'], id: 'tentang', label: 'Membuka tentang Azharica…' }
];

const runSearch = () => {
  const input = qs('#site-search');
  const feedback = qs('#search-feedback');
  const term = input.value.trim().toLowerCase();
  if (!term) { feedback.textContent = 'Ketik topik yang ingin dicari.'; return; }
  const destination = destinations.find(item => item.terms.some(keyword => term.includes(keyword) || keyword.includes(term)));
  if (!destination) { feedback.textContent = 'Coba kata: kurikulum, SQILS, asrama, atau PPDB.'; return; }
  feedback.textContent = destination.label;
  setTimeout(() => {
    searchPanel.hidden = true;
    searchToggle.setAttribute('aria-expanded', 'false');
    if (destination.href) {
      window.location.href = destination.href;
      return;
    }
    document.getElementById(destination.id).scrollIntoView({ behavior: 'smooth' });
  }, 250);
};

qs('#search-button').addEventListener('click', runSearch);
qs('#site-search').addEventListener('keydown', event => { if (event.key === 'Enter') runSearch(); });

const tabCopy = {
  integrasi: ['Ilmu yang terhubung', 'Konsep Qur’ani hadir sebagai cara pandang ketika santri mempelajari sains, teknologi, rekayasa, seni, dan matematika.'],
  eksplorasi: ['Rasa ingin tahu yang dirawat', 'Santri belajar melalui pertanyaan, observasi, eksperimen, dan diskusi yang membuat konsep terasa dekat dengan kehidupan.'],
  karya: ['Pemahaman yang diwujudkan', 'Pengetahuan tidak berhenti di catatan. Santri mengolahnya menjadi proyek, solusi, dan karya yang dapat dipresentasikan.']
};

qsa('[role="tab"]').forEach(tab => tab.addEventListener('click', () => {
  qsa('[role="tab"]').forEach(item => item.setAttribute('aria-selected', 'false'));
  tab.setAttribute('aria-selected', 'true');
  const [title, text] = tabCopy[tab.dataset.tab];
  qs('#tab-panel').innerHTML = `<strong>${title}</strong><p>${text}</p>`;
}));

qsa('.accordion-item button').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.accordion-item');
  const willOpen = button.getAttribute('aria-expanded') !== 'true';
  qsa('.accordion-item').forEach(other => {
    other.classList.remove('open');
    qs('button', other).setAttribute('aria-expanded', 'false');
  });
  if (willOpen) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
}, { threshold: 0.16 });
qsa('.reveal').forEach(element => observer.observe(element));
