(() => {
  const approvedSummary = "Guest-focused hospitality professional with hands-on experience in restaurant reception, reservations, table coordination and food-and-beverage service. Skilled in welcoming guests, responding to enquiries, supporting efficient service operations and maintaining positive guest experiences. A dependable team member committed to service quality, continuous learning and professional growth.";
  const storageKey = "jenisha-personal-profile-v1";

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch (_) { return {}; }
  }

  function writeSaved(value) {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  function formatRange(start, end) {
    const cleanStart = (start || "").trim();
    const cleanEnd = (end || "").trim();
    if (!cleanStart && !cleanEnd) return "Dates to confirm";
    if (cleanStart && !cleanEnd) return cleanStart;
    if (!cleanStart && cleanEnd) return cleanEnd;
    return `${cleanStart} – ${cleanEnd}`;
  }

  function renderReferences(saved) {
    const headings = [...document.querySelectorAll('.section-title')];
    const heading = headings.find(el => el.textContent.trim().toLowerCase() === 'references');
    if (!heading) return;
    const section = heading.closest('.section');
    const refs = saved.references || [];
    const existing = section.querySelector('.summary');
    if (!refs.length) {
      if (existing) existing.textContent = 'Available upon request.';
      return;
    }
    if (existing) existing.remove();
    section.querySelectorAll('.reference-card').forEach(el => el.remove());
    refs.forEach(ref => {
      const card = document.createElement('div');
      card.className = 'reference-card';
      card.innerHTML = `<strong>${ref.name || ''}</strong><br>${ref.position || ''}${ref.company ? ` · ${ref.company}` : ''}${ref.phone ? `<br>${ref.phone}` : ''}${ref.email ? `<br>${ref.email}` : ''}`;
      section.appendChild(card);
    });
  }

  function injectEditor(saved) {
    const editor = document.querySelector('.editor');
    const controls = editor?.querySelector('.editor-controls');
    if (!editor || !controls || document.getElementById('extraCvEditor')) return;

    const exp = saved.experience || [];
    const refs = saved.references || [
      { name: 'Sunil Kumar Bhusal', position: 'CEO', company: 'Premier Hotel School', phone: '+977 9851068269', email: 'sunilbhusalemail@gmail.com' },
      { name: 'Nigam Khanal', position: 'Operation Manager', company: 'Premier Hotel School', phone: '+977 9802737214', email: '' }
    ];

    const block = document.createElement('div');
    block.id = 'extraCvEditor';
    block.className = 'extra-editor-block';
    block.innerHTML = `
      <h3>Job dates</h3>
      <div class="field"><label>Hostess position</label><div class="date-grid"><input id="hostessStart" placeholder="Start, e.g. Feb 2021"><input id="hostessEnd" placeholder="End, e.g. Present"></div></div>
      <div class="field"><label>Management Trainee (OJT)</label><div class="date-grid"><input id="ojtStart" placeholder="Start month/year"><input id="ojtEnd" placeholder="End month/year"></div></div>
      <h3>References</h3>
      <div class="field"><label>Reference 1 name</label><input id="ref1Name"></div>
      <div class="field"><label>Position / company</label><input id="ref1Role"></div>
      <div class="field"><label>Phone</label><input id="ref1Phone"></div>
      <div class="field"><label>Email</label><input id="ref1Email"></div>
      <div class="field"><label>Reference 2 name</label><input id="ref2Name"></div>
      <div class="field"><label>Position / company</label><input id="ref2Role"></div>
      <div class="field"><label>Phone</label><input id="ref2Phone"></div>
      <p class="save-note">These fields save automatically and appear in the CV and PDF.</p>`;
    controls.before(block);

    const splitDate = value => {
      const parts = String(value || '').split(/\s+[–-]\s+/);
      return [parts[0] || '', parts.slice(1).join(' – ') || ''];
    };
    const [hostStart, hostEnd] = splitDate(exp[0]?.date || 'Feb 2021 – Present');
    const [ojtStart, ojtEnd] = splitDate(exp[1]?.date || '');

    const fields = {
      hostessStart: hostStart, hostessEnd: hostEnd,
      ojtStart, ojtEnd,
      ref1Name: refs[0]?.name || '',
      ref1Role: [refs[0]?.position, refs[0]?.company].filter(Boolean).join(' · '),
      ref1Phone: refs[0]?.phone || '', ref1Email: refs[0]?.email || '',
      ref2Name: refs[1]?.name || '',
      ref2Role: [refs[1]?.position, refs[1]?.company].filter(Boolean).join(' · '),
      ref2Phone: refs[1]?.phone || ''
    };
    Object.entries(fields).forEach(([id, value]) => { document.getElementById(id).value = value; });

    block.addEventListener('input', () => {
      const current = readSaved();
      current.experience = current.experience || exp;
      if (current.experience[0]) current.experience[0].date = formatRange(document.getElementById('hostessStart').value, document.getElementById('hostessEnd').value);
      if (current.experience[1]) current.experience[1].date = formatRange(document.getElementById('ojtStart').value, document.getElementById('ojtEnd').value);
      const parseRole = value => {
        const parts = value.split('·').map(v => v.trim());
        return { position: parts[0] || '', company: parts.slice(1).join(' · ') || '' };
      };
      const r1 = parseRole(document.getElementById('ref1Role').value);
      const r2 = parseRole(document.getElementById('ref2Role').value);
      current.references = [
        { name: document.getElementById('ref1Name').value.trim(), ...r1, phone: document.getElementById('ref1Phone').value.trim(), email: document.getElementById('ref1Email').value.trim() },
        { name: document.getElementById('ref2Name').value.trim(), ...r2, phone: document.getElementById('ref2Phone').value.trim(), email: '' }
      ].filter(ref => ref.name || ref.position || ref.phone || ref.email);
      writeSaved(current);

      const dateEls = document.querySelectorAll('#experienceList .date');
      if (dateEls[0]) dateEls[0].textContent = current.experience[0]?.date || '';
      if (dateEls[1]) dateEls[1].textContent = current.experience[1]?.date || '';
      renderReferences(current);
    });
  }

  function applyFixes() {
    const output = document.getElementById("summaryOutput");
    const input = document.getElementById("summaryInput");
    if (output) output.textContent = approvedSummary;
    if (input) input.value = approvedSummary;

    const saved = readSaved();
    saved.summary = approvedSummary;
    writeSaved(saved);

    const hint = document.querySelector('label[for="photoInput"]')?.closest('.field')?.nextElementSibling;
    if (hint?.classList.contains('hint')) {
      hint.textContent = "Upload a passport-style portrait. The full rectangular photo area is preserved without cutting the face or shoulders.";
    }

    injectEditor(saved);
    renderReferences(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(applyFixes, 50));
  } else {
    setTimeout(applyFixes, 50);
  }
})();