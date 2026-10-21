/* ═══════════════════════════════════════════════════════════════
   RosokaKi Solo — JavaScript
   ═══════════════════════════════════════════════════════════════ */

// ── Navbar scroll effect ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Scroll Reveal ─────────────────────────────────────────────────
function initReveal() {
  const targets = document.querySelectorAll(
    '.step-card, .aki-card, .benefit-item, .testi-card, .area-pill, .offer-form, .offer-sidebar'
  );
  targets.forEach(el => el.setAttribute('data-reveal', ''));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid siblings
        const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
        let delay = 0;
        siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}
initReveal();

// ── Live Deal Calculator ──────────────────────────────────────────
const jumlahInput  = document.getElementById('jumlah');
const hargaInput   = document.getElementById('harga');
const dealPreview  = document.getElementById('dealPreview');
const dealAmount   = document.getElementById('dealAmount');

function updateDeal() {
  const kg    = parseFloat(jumlahInput.value) || 0;
  const price = parseFloat(hargaInput.value)  || 0;
  if (kg > 0 && price > 0) {
    const total = kg * price;
    dealAmount.textContent = 'Rp ' + total.toLocaleString('id-ID');
    dealPreview.style.display = 'block';
  } else {
    dealPreview.style.display = 'none';
  }
}

jumlahInput.addEventListener('input', updateDeal);
hargaInput.addEventListener('input', updateDeal);

// ── Form Validation & Submission ──────────────────────────────────
const form       = document.getElementById('offerForm');
const submitBtn  = document.getElementById('submitBtn');

function getError(field, msg) {
  const el = document.getElementById(field + 'Error');
  if (el) el.textContent = msg;
}
function clearErrors() {
  ['nama', 'wa', 'lokasi', 'jumlah', 'harga', 'kondisi'].forEach(f => {
    const el = document.getElementById(f + 'Error');
    if (el) el.textContent = '';
  });
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validate() {
  clearErrors();
  let valid = true;

  const nama   = form.querySelector('#nama');
  const wa     = form.querySelector('#wa');
  const lokasi = form.querySelector('#lokasi');
  const jumlah = form.querySelector('#jumlah');
  const harga  = form.querySelector('#harga');
  const kondisi= form.querySelectorAll('input[name="kondisi"]:checked');

  if (!nama.value.trim()) {
    getError('nama', 'Nama wajib diisi.');
    nama.classList.add('error'); valid = false;
  }
  if (!wa.value.trim()) {
    getError('wa', 'Nomor WhatsApp wajib diisi.');
    wa.classList.add('error'); valid = false;
  } else if (!/^(08|\+62)[0-9]{8,12}$/.test(wa.value.replace(/\s/g, ''))) {
    getError('wa', 'Format nomor tidak valid. Contoh: 08123456789');
    wa.classList.add('error'); valid = false;
  }
  if (!lokasi.value) {
    getError('lokasi', 'Pilih kota / lokasi Anda.');
    lokasi.classList.add('error'); valid = false;
  }
  if (!jumlah.value || parseFloat(jumlah.value) <= 0) {
    getError('jumlah', 'Masukkan estimasi berat aki (kg).');
    jumlah.classList.add('error'); valid = false;
  }
  if (!harga.value || parseFloat(harga.value) <= 0) {
    getError('harga', 'Masukkan harga yang Anda inginkan per kg.');
    harga.classList.add('error'); valid = false;
  }
  if (kondisi.length === 0) {
    getError('kondisi', 'Pilih minimal satu kondisi aki.');
    valid = false;
  }
  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Disable button & show loading
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'inline';

  // Simulate a brief processing delay (in real use: send to backend/email/sheet)
  setTimeout(() => {
    const nama    = form.querySelector('#nama').value.trim();
    const wa      = form.querySelector('#wa').value.trim().replace(/\D/g, '');
    const lokasi  = form.querySelector('#lokasi').value;
    const kg      = form.querySelector('#jumlah').value;
    const harga   = form.querySelector('#harga').value;
    const merek   = form.querySelector('#merek').value.trim();
    const catatan = form.querySelector('#catatan').value.trim();
    const kondisi = [...form.querySelectorAll('input[name="kondisi"]:checked')]
                      .map(c => c.value).join(', ');
    const total   = (parseFloat(kg) * parseFloat(harga)).toLocaleString('id-ID');

    // Fill modal
    document.getElementById('modalNama').textContent = nama;
    document.getElementById('modalWa').textContent   = wa.startsWith('0') ? wa : '0' + wa;

    document.getElementById('modalDetail').innerHTML = `
      📍 <span>Lokasi:</span> ${lokasi}<br>
      ⚖️ <span>Berat:</span> ${kg} kg<br>
      💰 <span>Harga ditawarkan:</span> Rp ${parseInt(harga).toLocaleString('id-ID')}/kg<br>
      📦 <span>Estimasi nilai:</span> Rp ${total}<br>
      🔋 <span>Kondisi:</span> ${kondisi}
      ${merek ? `<br>🏷️ <span>Merek:</span> ${merek}` : ''}
      ${catatan ? `<br>📝 <span>Catatan:</span> ${catatan}` : ''}
    `;

    // Build WhatsApp deep link with pre-filled message
    const waNumber = '6282136538487'; // ← Ganti dengan nomor WA aktif
    const kondisiStr = kondisi;
    const merekStr  = merek ? `Merek: ${merek}\n` : '';
    const catatanStr= catatan ? `Catatan: ${catatan}\n` : '';
    const msg = encodeURIComponent(
      `Halo RosokaKi Solo! 👋\n\n` +
      `Saya ingin mengajukan penawaran aki bekas:\n\n` +
      `Nama: ${nama}\n` +
      `Lokasi: ${lokasi}\n` +
      `Berat aki: ${kg} kg\n` +
      `Kondisi: ${kondisiStr}\n` +
      `${merekStr}` +
      `Harga yang saya inginkan: Rp ${parseInt(harga).toLocaleString('id-ID')}/kg\n` +
      `Estimasi total: Rp ${total}\n` +
      `${catatanStr}\n` +
      `Mohon konfirmasinya, terima kasih! 🙏`
    );
    document.getElementById('modalWaBtn').href = `https://wa.me/${waNumber}?text=${msg}`;

    // Show modal
    document.getElementById('successModal').classList.add('open');

    // Reset button
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display = 'inline';
    submitBtn.querySelector('.btn-loading').style.display = 'none';

    // Reset form
    form.reset();
    dealPreview.style.display = 'none';
  }, 1000);
});

// Close modal
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('open');
});
document.getElementById('successModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('successModal')) {
    document.getElementById('successModal').classList.remove('open');
  }
});

// ── Smooth active nav link highlight ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--c-text)' : '';
  });
}, { passive: true });

// ── Ticker pause on hover ─────────────────────────────────────────
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}
