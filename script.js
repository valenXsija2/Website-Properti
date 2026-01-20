// Theme toggle, form submit (configurable), and gallery lightbox
(function(){
  const FORM_ENDPOINT = '';// <-- Set to your Formspree endpoint (e.g. https://formspree.io/f/xxxxx)

  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if(stored==='dark') document.documentElement.setAttribute('data-theme','dark');
  function updateIcon(){
    if(!toggle) return;
    const isDark = document.documentElement.getAttribute('data-theme')==='dark';
    toggle.textContent = isDark? '☀️' : '🌙';
  }
  if(toggle){
    toggle.addEventListener('click',()=>{
      const current = document.documentElement.getAttribute('data-theme');
      const next = current==='dark' ? '' : 'dark';
      if(next) document.documentElement.setAttribute('data-theme',next); else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', next||'light');
      updateIcon();
    });
  }
  updateIcon();

  // footer year
  const y = new Date().getFullYear();
  const el = document.getElementById('year'); if(el) el.textContent = y;

  // contact handler with optional external endpoint
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const data = new FormData(form);
      if(FORM_ENDPOINT){
        try{
          const res = await fetch(FORM_ENDPOINT, {method:'POST', body: data});
          if(res.ok){
            alert('Terima kasih! Pesan Anda sudah terkirim.');
            form.reset();
          } else {
            alert('Gagal mengirim. Silakan coba lagi.');
          }
        }catch(err){
          console.error(err);
          alert('Terjadi kesalahan saat mengirim.');
        }
      } else {
        const payload = Object.fromEntries(data.entries());
        console.log('Contact submit (demo)', payload);
        alert('Terima kasih! Pesan Anda sudah terkirim (demo).');
        form.reset();
      }
    });
  }

  // Gallery lightbox behavior
  const lightbox = document.getElementById('lightbox');
  if(lightbox){
    const imgEl = lightbox.querySelector('.lightbox-img');
    const capEl = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    function open(src, caption){
      imgEl.src = src; imgEl.alt = caption||''; capEl.textContent = caption||'';
      lightbox.setAttribute('aria-hidden','false');
    }
    function close(){
      lightbox.setAttribute('aria-hidden','true'); imgEl.src=''; capEl.textContent='';
    }
    document.querySelectorAll('.gallery-item img').forEach(img=>{
      img.addEventListener('click', ()=> open(img.src, img.alt || ''));
    });
    closeBtn && closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e=>{ if(e.target===lightbox) close(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  }

  // Mobile nav toggle
(() => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const header = document.querySelector('.site-header');

  if (navToggle && nav && header) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      
      // Sinkronkan background header
      header.classList.toggle('header-active', isOpen);
      
      // Update aksesibilitas & animasi X
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Menutup menu jika klik di luar area header
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        nav.classList.remove('open');
        header.classList.remove('header-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
})();
