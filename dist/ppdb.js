const form = document.getElementById('ppdb-interest-form');
const statusText = document.getElementById('form-status');

const cleanPhone = value => value.replace(/[\s()-]/g, '');
const validPhone = value => /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/.test(cleanPhone(value));

const showError = (field, message) => {
  field.classList.add('field-error');
  if (!statusText.textContent) statusText.textContent = message;
};

form.addEventListener('input', event => {
  event.target.classList.remove('field-error');
  statusText.textContent = '';
  statusText.classList.remove('success');
});

form.addEventListener('submit', event => {
  event.preventDefault();
  statusText.textContent = '';
  statusText.classList.remove('success');
  [...form.querySelectorAll('.field-error')].forEach(field => field.classList.remove('field-error'));

  const data = new FormData(form);
  const requiredFields = [...form.querySelectorAll('[required]')];
  let firstInvalid = null;

  requiredFields.forEach(field => {
    const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    if (empty) {
      if (!firstInvalid) firstInvalid = field;
      showError(field, 'Mohon lengkapi semua kolom bertanda * dan persetujuan kontak.');
    }
  });

  const phone = form.elements.phone;
  if (phone.value && !validPhone(phone.value)) {
    if (!firstInvalid) firstInvalid = phone;
    showError(phone, 'Periksa kembali nomor WhatsApp. Gunakan format 08… atau +62…');
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const subject = `Konsultasi PPDB Azharica — ${data.get('studentName')}`;
  const body = [
    'Assalamu’alaikum, Tim PPDB Azharica.',
    '',
    'Saya ingin mendapatkan informasi awal PPDB dengan data berikut:',
    `Nama orang tua/wali: ${data.get('parentName')}`,
    `Nomor WhatsApp: ${data.get('phone')}`,
    `Nama panggilan Ananda: ${data.get('studentName')}`,
    `Kelas saat ini: ${data.get('currentGrade')}`,
    `Domisili: ${data.get('city')}`,
    `Topik konsultasi: ${data.get('interest')}`,
    `Pesan tambahan: ${data.get('message') || '-'}`,
    '',
    'Mohon informasi langkah selanjutnya. Terima kasih.',
    'Wassalamu’alaikum.'
  ].join('\n');

  statusText.textContent = 'Pesan siap. Membuka aplikasi email Anda…';
  statusText.classList.add('success');
  window.location.href = `mailto:azharicaofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    form.elements.interest.value = link.dataset.interest;
    setTimeout(() => form.elements.parentName.focus(), 250);
  });
});
