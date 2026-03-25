    function showSection(id, btn) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.getElementById('sec-' + id).classList.add('active');
      btn.classList.add('active');

      if (id === 'pre1930') setTimeout(renderAgro, 50);
      if (id === 'infame') setTimeout(renderIsi, 50);
      if (id === 'peronismo') setTimeout(renderPeron, 50);
      if (id === 'dictadura') setTimeout(renderDeuda, 50);
      if (id === 'crisis2001') setTimeout(renderInf, 50);
      if (id === 'macri') setTimeout(renderMacri, 50);
      if (id === 'milei') setTimeout(renderMilei, 50);
      if (id === 'campania') setTimeout(buildMapCampania, 80);

      setTimeout(() => updateFloatingToc(id), 10);
      // Removed automatic per-section trivia to avoid clutter; user can trigger via button if implemented
      setTimeout(() => {
        const tlIdx = typeof TL_EVENTS !== 'undefined' ? TL_EVENTS.findIndex(e => e.section === id) : -1;
        if (tlIdx >= 0) setTlActive(tlIdx);
      }, 10);

      // Close mobile menu if open
      if (window.innerWidth <= 900) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
          toggleOffcanvasMenu();
        }
      }
    }

    function showTab(section, tab, btn) {
      const sec = document.getElementById('sec-' + section);
      sec.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      sec.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(section + '-' + tab).classList.add('active');
      btn.classList.add('active');

      if (section === 'pre1930' && tab === 'eco') setTimeout(renderAgro, 50);
      if (section === 'infame' && tab === 'eco') setTimeout(renderIsi, 50);
      if (section === 'peronismo' && tab === 'eco') setTimeout(renderPeron, 50);
      if (section === 'dictadura' && tab === 'eco') setTimeout(renderDeuda, 50);
      if (section === 'crisis2001' && tab === 'eco') setTimeout(renderInf, 50);
      if (section === 'macri' && tab === 'eco') setTimeout(renderMacri, 50);
      if (section === 'milei' && tab === 'eco') setTimeout(renderMilei, 50);
    }

    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      
      const icon = document.querySelector('.theme-icon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';

      destroyCharts();
      const activeSec = document.querySelector('.section.active');
      if (activeSec) {
        const id = activeSec.id.replace('sec-', '');
        if (id === 'pre1930') renderAgro();
        if (id === 'infame') renderIsi();
        if (id === 'peronismo') renderPeron();
        if (id === 'dictadura') renderDeuda();
        if (id === 'crisis2001') renderInf();
        if (id === 'macri') renderMacri();
        if (id === 'milei') renderMilei();
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function toggleFocus() {
      document.body.classList.toggle('focus-mode');
      const isFocus = document.body.classList.contains('focus-mode');
      // Sidebar transition and main content width are handled in CSS via .focus-mode
    }

    function toggleTimeline() {
      const bar = document.getElementById('timeline-bar');
      const btn = document.getElementById('tl-toggle');
      const isVisible = bar.classList.toggle('visible');
      btn.classList.toggle('active', isVisible);
      document.getElementById('main').classList.toggle('has-timeline', isVisible);
      if (isVisible) syncTimelineScroll();
    }

    function toggleOffcanvasMenu() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('offcanvas-overlay');
      const isOpen = sidebar.classList.toggle('open');
      overlay.classList.toggle('visible', isOpen);
      document.getElementById('menu-toggle').setAttribute('aria-expanded', isOpen);
    }

    // ── CHART HELPERS ──
    const chartInstances = {};
    function getChartColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        grid: isDark ? '#2e2b26' : '#ddd6c8', tick: isDark ? '#5a5650' : '#7a7268',
        legend: isDark ? '#8a8278' : '#4a4540', gold: '#c9a84c', red: '#b34040', blue: '#4a7cb5', green: '#4a9b6a'
      };
    }
    function destroyCharts() { Object.keys(chartInstances).forEach(k => { if (chartInstances[k]) { chartInstances[k].destroy(); chartInstances[k] = null; } }); }
    function baseOptions(c) {
      return {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.legend, font: { size: 11, family: "'Source Serif 4', serif" } } } },
        scales: { x: { ticks: { color: c.tick, font: { size: 10 } }, grid: { color: c.grid } }, y: { ticks: { color: c.tick, font: { size: 10 } }, grid: { color: c.grid } } }
      };
    }

    function renderDeuda() {
      if (chartInstances.deuda) return;
      const c = getChartColors();
      const ctx = document.getElementById('chartDeuda').getContext('2d');
      chartInstances.deuda = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1975', '1976', '1979', '1981', '1983'],
          datasets: [{ label: 'Deuda externa (miles de M USD)', data: [8, 10, 19, 35, 45], backgroundColor: 'rgba(179,64,64,0.72)', borderColor: c.red, borderWidth: 1 }]
        },
        options: baseOptions(c)
      });
    }

    function renderInf() {
      if (chartInstances.inf) return;
      const c = getChartColors();
      const ctx = document.getElementById('chartInf').getContext('2d');
      chartInstances.inf = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1998', '1999', '2000', '2001', '2002', '2003'],
          datasets: [{ label: 'Inflación anual (%)', data: [0.7, -1.8, -0.7, -1.5, 41, 3.7], borderColor: c.gold, backgroundColor: 'rgba(201,168,76,0.08)', tension: 0.3, pointBackgroundColor: c.gold, borderWidth: 2 }]
        },
        options: baseOptions(c)
      });
    }

    function renderMacri() {
      if (chartInstances.macri) return;
      const c = getChartColors();
      const ctx = document.getElementById('chartMacri').getContext('2d');
      chartInstances.macri = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2015', '2016', '2017', '2018', '2019'],
          datasets: [
            { label: 'Deuda externa (miles de M USD)', data: [158, 192, 235, 277, 277], borderColor: c.red, tension: 0.3, pointBackgroundColor: c.red, borderWidth: 2, yAxisID: 'y' },
            { label: 'Pobreza (%)', data: [35, 30, 28, 32, 35], borderColor: c.blue, tension: 0.3, pointBackgroundColor: c.blue, borderWidth: 2, yAxisID: 'y2', borderDash: [5, 3] }
          ]
        },
        options: { ...baseOptions(c), scales: { x: { ticks: { color: c.tick }, grid: { color: c.grid } }, y: { type: 'linear', position: 'left', ticks: { color: c.tick } }, y2: { type: 'linear', position: 'right', ticks: { color: c.tick }, grid: { drawOnChartArea: false } } } }
      });
    }

    function renderMilei() {
      if (chartInstances.milei) return;
      const c = getChartColors();
      const ctx = document.getElementById('chartMilei').getContext('2d');
      chartInstances.milei = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Nov 23', 'Dic 23', 'Ene 24', 'Feb 24', 'Mar 24', 'Abr 24', 'May 24', 'Jun 24', 'Sep 24', 'Dic 24', 'Mar 25', 'Jun 25', 'Oct 25'],
          datasets: [{ label: 'Inflación mensual (%)', data: [12.8, 25.5, 20.6, 13.2, 11.0, 8.8, 4.2, 4.6, 3.5, 2.7, 3.7, 3.3, 2.3], borderColor: c.gold, backgroundColor: 'rgba(201,168,76,0.1)', tension: 0.4, pointBackgroundColor: c.gold, borderWidth: 2.5, fill: true }]
        },
        options: baseOptions(c)
      });
    }

    function renderAgro() {
      if (chartInstances.agro) return;
      const c = getChartColors();
      const ctx = document.getElementById('chart-agro').getContext('2d');
      chartInstances.agro = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1880', '1890', '1900', '1910', '1914', '1920', '1929'],
          datasets: [{ label: 'Exportaciones (M de pesos oro)', data: [58, 100, 154, 389, 400, 1044, 953], borderColor: c.gold, backgroundColor: 'rgba(201,168,76,0.1)', tension: 0.3, pointBackgroundColor: c.gold, borderWidth: 2, fill: true }]
        },
        options: baseOptions(c)
      });
    }

    function renderIsi() {
      if (chartInstances.isi) return;
      const c = getChartColors();
      const ctx = document.getElementById('chart-isi').getContext('2d');
      chartInstances.isi = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1935', '1941', '1946'],
          datasets: [{ label: 'Establecimientos Industriales', data: [40500, 58000, 86000], backgroundColor: 'rgba(74,124,181,0.7)', borderColor: c.blue, borderWidth: 1 }]
        },
        options: baseOptions(c)
      });
    }

    function renderPeron() {
      if (chartInstances.peron) return;
      const c = getChartColors();
      const ctx = document.getElementById('chart-peron').getContext('2d');
      chartInstances.peron = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1946', '1948', '1950', '1952', '1954'],
          datasets: [{ label: 'Participación Asalariados en PBI (%)', data: [38.7, 43.1, 46.5, 49.8, 50.8], borderColor: c.green, backgroundColor: 'rgba(74,155,106,0.1)', tension: 0.3, pointBackgroundColor: c.green, borderWidth: 2, fill: true }]
        },
        options: { ...baseOptions(c), scales: { y: { min: 35, max: 55, ticks: { color: c.tick }, grid: { color: c.grid } }, x: { ticks: { color: c.tick }, grid: { color: c.grid } } } }
      });
    }

    function toggleChartDataset(chartName, dsIndex, btn) {
      const chart = chartInstances[chartName];
      if (!chart) return;
      const ds = chart.data.datasets[dsIndex];
      ds.hidden = !ds.hidden;
      chart.update();
      btn.classList.toggle('active', ds.hidden);
    }

    // ── FEAT 1: BUSCADOR GLOBAL ──
    const SEARCH_INDEX = [];
    
    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function buildSearchIndex() {
      document.querySelectorAll('.section').forEach(sec => {
        const id = sec.id.replace('sec-', '');
        const title = sec.querySelector('.section-title')?.textContent || id;
        sec.querySelectorAll('.prose p, .tl-desc, .tl-event, .callout p, .debate-side p, .myth p').forEach(el => {
          const text = el.textContent.trim();
          if (text.length > 30) {
            const isMyth = el.closest('.myth') !== null;
            let mythTitle = "";
            if (isMyth) mythTitle = el.parentElement.querySelector('h3').textContent;
            SEARCH_INDEX.push({ 
              sectionId: id, 
              sectionTitle: title, 
              text, 
              type: isMyth ? 'myth' : 'content', 
              mythTitle: mythTitle,
              searchKey: removeAccents(text.toLowerCase()) + " " + removeAccents(mythTitle.toLowerCase()) 
            });
          }
        });
      });
    }

    function openSearch() { if (!SEARCH_INDEX.length) buildSearchIndex(); document.getElementById('search-overlay').classList.add('open'); setTimeout(() => document.getElementById('search-input').focus(), 50); }
    function closeSearch() { document.getElementById('search-overlay').classList.remove('open'); document.getElementById('search-input').value = ''; }
    
    function runSearch(q) {
      const container = document.getElementById('search-results');
      if (!q.trim()) { container.innerHTML = '<div class="search-empty">Escribí para buscar...</div>'; return; }
      
      const normalizedQ = removeAccents(q.toLowerCase());
      const terms = normalizedQ.split(/\s+/).filter(Boolean);
      
      // 1. Search in BIOS
      const bioMatches = Object.entries(BIOS).filter(([k, v]) => 
        terms.every(t => removeAccents(v.name.toLowerCase()).includes(t) || removeAccents(k.toLowerCase()).includes(t))
      );

      // 2. Search in Sections
      const results = SEARCH_INDEX.filter(item => terms.every(t => item.searchKey.includes(t)));
      
      let html = '';
      
      const mythMatches = results.filter(r => r.type === 'myth');
      const contentMatches = results.filter(r => r.type !== 'myth');
      
      if (bioMatches.length > 0) {
        html += '<div class="search-category-label">Personajes</div>';
        html += bioMatches.map(([k, v]) => `
          <div class="search-result-item bio-result" onclick="openBio('${k}');closeSearch()">
            <div class="sri-section">Biografía</div>
            <div class="sri-text"><strong>${v.name}</strong> (${v.dates})</div>
          </div>
        `).join('');
      }
      
      if (mythMatches.length > 0) {
        html += '<div class="search-category-label">Mitos Desmentidos</div>';
        html += mythMatches.slice(0, 10).map(r => `
          <div class="search-result-item" style="border-left-color: var(--red);" onclick="goToSection('${r.sectionId}');closeSearch()">
            <div class="sri-section" style="color:var(--red); font-weight:600;">${r.mythTitle}</div>
            <div class="sri-text">${r.text.slice(0, 160)}...</div>
          </div>
        `).join('');
      }

      if (contentMatches.length > 0) {
        html += '<div class="search-category-label">Contenido Histórico</div>';
        html += contentMatches.slice(0, 15).map(r => `
          <div class="search-result-item" onclick="goToSection('${r.sectionId}');closeSearch()">
            <div class="sri-section">${r.sectionTitle}</div>
            <div class="sri-text">${r.text.slice(0, 150)}...</div>
          </div>
        `).join('');
      }

      if (!html) html = `<div class="search-empty">No se encontraron resultados para "${q}"</div>`;
      container.innerHTML = html;
    }
    function goToSection(id) { const btn = [...document.querySelectorAll('.nav-item')].find(b => b.getAttribute('onclick')?.includes("'" + id + "'")); if (btn) btn.click(); else { document.querySelectorAll('.section').forEach(s => s.classList.remove('active')); document.getElementById('sec-' + id)?.classList.add('active'); } }

    // ── FEAT 4: COMPARADOR EXTERNO ──
    const COMP_DATA = {
      inflacion_hiper: { title: 'Hiperinflación 1989', desc: 'Alfonsín adelantó el mando por la crisis.', type: 'bar', labels: ['1985', '1986', '1987', '1988', '1989'], datasets: [{ label: 'Inflación (%)', data: [385, 82, 175, 388, 3080], backgroundColor: 'rgba(179,64,64,0.7)', borderColor: '#b34040', borderWidth: 1 }] },
      deuda_dictadura: { title: 'Deuda externa — Dictadura', desc: 'Crecimiento exponencial de la deuda.', type: 'bar', labels: ['1975', '1976', '1979', '1981', '1983'], datasets: [{ label: 'Deuda (M USD)', data: [8, 10, 19, 35, 45], backgroundColor: 'rgba(179,64,64,0.72)', borderColor: '#b34040', borderWidth: 1 }] },
      pobreza_macri: { title: 'Pobreza vs Deuda — Macri', desc: 'Aumento de pobreza y toma récord de crédito.', type: 'line', labels: ['2015', '2016', '2017', '2018', '2019'], datasets: [{ label: 'Pobreza (%)', data: [29, 30.3, 25.7, 32, 35.5], borderColor: '#f1c40f', tension: 0.1 }, { label: 'Deuda FMI (Mm USD)', data: [0, 0, 0, 28, 44], borderColor: '#3498db', tension: 0.1 }] },
      inflacion_milei: { title: 'Inflación Mensual — Milei', desc: 'Devaluación inicial y posterior desinflación.', type: 'bar', labels: ['Nov 23', 'Dic 23', 'Ene 24', 'Jun 24', 'Dic 24'], datasets: [{ label: 'IPC Mensual (%)', data: [12.8, 25.5, 20.6, 4.6, 2.5], backgroundColor: 'rgba(155,89,182,0.7)', borderColor: '#9b59b6', borderWidth: 1 }] },
      inflacion_2001: { title: 'Deflación a Inflación — 2001/02', desc: 'El quiebre de la Convertibilidad.', type: 'bar', labels: ['1999', '2000', '2001', '2002', '2003'], datasets: [{ label: 'Inflación/Deflación (%)', data: [-1.2, -0.9, -1.1, 41, 3.7], backgroundColor: 'rgba(46,204,113,0.7)', borderColor: '#2ecc71', borderWidth: 1 }] }
    };
    const compCharts = {};
    function openComparador() { document.getElementById('comparador-overlay').classList.add('open'); }
    function closeComparador() { document.getElementById('comparador-overlay').classList.remove('open'); }
    function renderComparadorPanel(side) {
      const sel = document.getElementById('comp-sel-' + side).value;
      const d = COMP_DATA[sel]; if (!d) return;
      document.getElementById('comp-title-' + side).textContent = d.title;
      document.getElementById('comp-desc-' + side).textContent = d.desc;
      if (compCharts[side]) compCharts[side].destroy();
      const c = getChartColors();
      const ctx = document.getElementById('comp-chart-' + side).getContext('2d');
      compCharts[side] = new Chart(ctx, { type: d.type, data: { labels: d.labels, datasets: d.datasets }, options: baseOptions(c) });
    }

    // ── FEAT 5: GLOSARIO TOOLTIPS ──
    const GLOSARIO = {
      latifundio: { term: 'Latifundio', def: 'Gran propiedad rural en manos de pocos dueños.' },
      convertibilidad: { term: 'Convertibilidad', def: 'Plan de Cavallo (1991): fijó el cambio en 1 peso = 1 dólar.' },
      corralito: { term: 'Corralito', def: 'Medida de dic 2001 que restringió los retiros bancarios.' },
      cepo: { term: 'Ceso cambiario', def: 'Restricción al acceso libre al mercado de divisas.' },
      'stop-and-go': { term: 'Stop-and-Go', def: 'Ciclo recurrente de crecimiento y crisis de balanza de pagos.' },
      'índice de abuelidad': { term: 'Índice de Abuelidad', def: 'Método genético para identificar nietos apropiados con 99.9% de certeza.' },
      clientelismo: { term: 'Clientelismo', def: 'Sistema de intercambio político: favores estatales por lealtad electoral. Característico de la política argentina.' },
      isi: { term: 'Sustitución de Importaciones (ISI)', def: 'Política de industrialización que reemplaza importaciones con producción doméstica. Impulsada en Argentina desde 1930.' },
      'deficit-cuasifiscal': { term: 'Déficit Cuasifiscal', def: 'Pérdidas operacionales del BCRA por actividades no convencionales (ej. controles cambiarios).' },
      'balanza-pagos': { term: 'Balanza de Pagos', def: 'Registro contable de transacciones comerciales y financieras con el exterior.' },
      hegemonia: { term: 'Hegemonía', def: 'Dominación de un poder (político, económico, cultural) sobre otros.' },
      bipartidismo: { term: 'Bipartidismo', def: 'Sistema político dominado por dos grandes fuerzas (ej. Peronismo vs. Radicalismo).' }
    };
    const tooltip = document.getElementById('tooltip');
    document.addEventListener('mouseover', e => {
      const el = e.target.closest('[data-term]'); if (!el) { tooltip.classList.remove('visible'); return; }
      const g = GLOSARIO[el.getAttribute('data-term')]; if (!g) return;
      document.getElementById('tt-term').textContent = g.term;
      document.getElementById('tt-def').textContent = g.def;
      const r = el.getBoundingClientRect();
      const tooltipWidth = 280;
      let leftPos = r.left + (r.width / 2) - (tooltipWidth / 2);
      if (leftPos < 10) leftPos = 10;
      if (leftPos + tooltipWidth > window.innerWidth - 10) leftPos = window.innerWidth - tooltipWidth - 10;
      
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = (r.bottom + window.scrollY + 8) + 'px';
      tooltip.classList.add('visible');
    });
    document.addEventListener('mouseout', e => { if (!e.target.closest('[data-term]')) tooltip.classList.remove('visible'); });

    // ── FEAT 6: MAPA HISTÓRICO SVG ──
    function buildMapCampania() {
      const svg = document.getElementById('svg-campania');
      if (!svg || svg.children.length > 0) return;
      const W = 680, H = 340;
      const bg = `<rect width="${W}" height="${H}" fill="var(--surface2)"/>`;
      const land = `<path d="M200,10 L420,10 L460,40 L470,90 L450,130 L460,170 L440,220 L420,270 L380,310 L340,330 L300,328 L260,310 L230,280 L210,240 L195,200 L185,160 L180,120 L185,80 Z" fill="#1e2218" stroke="var(--border)" stroke-width="1.5"/>`;
      const bsas = `<path d="M270,140 L370,140 L390,180 L370,220 L310,240 L265,220 L250,180 Z" fill="rgba(201,168,76,0.07)" stroke="var(--gold-dim)" stroke-width="0.8" stroke-dasharray="3,2"/>`;
      const f1833 = `<polyline points="230,160 200,160 230,145 260,155 290,160 320,158 350,162" fill="none" stroke="#4a9b6a" stroke-width="2.5"/><text x="235" y="138" fill="#4a9b6a" font-size="9">Frontera 1833</text>`;
      const f1876 = `<polyline points="225,170 260,175 295,172 330,178 360,180" fill="none" stroke="#c9a84c" stroke-width="2.5"/><text x="228" y="168" fill="#c9a84c" font-size="9">Zanja de Alsina 1876</text>`;
      const f1879 = `<polyline points="210,200 250,210 290,218 330,220 360,215 385,220" fill="none" stroke="#b34040" stroke-width="3"/><text x="215" y="232" fill="#b34040" font-size="9">Campaña Roca 1879-85</text>`;
      const pueblosHtml = [{ x: 240, y: 110, l: 'Ranqueles' }, { x: 310, y: 90, l: 'Mapuches' }, { x: 380, y: 130, l: 'Tehuelches' }].map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#6b9bc7" opacity="0.7"/><text x="${p.x + 8}" y="${p.y + 4}" fill="#6b9bc7" font-size="9">${p.l}</text>`).join('');
      const patagonia = `<path d="M210,240 L300,240 L340,280 L310,320 L265,320 L230,290 Z" fill="rgba(74,124,181,0.08)" stroke="rgba(74,124,181,0.3)" stroke-width="0.8"/><text x="245" y="285" fill="#4a7cb5" font-size="10" font-style="italic">Patagonia</text>`;
      const title = `<text x="16" y="24" fill="var(--gold)" font-size="11" font-weight="bold">Argentina 1833–1885</text>`;
      svg.innerHTML = bg + land + bsas + patagonia + f1833 + f1876 + f1879 + pueblosHtml + title;
    }

    const BIOS = {
      roca: {
        name: 'Julio Argentino Roca', dates: '1843 – 1914', img: 'img_presidentes/roca.webp',
        facts: [['Cargo', 'Presidente (1880-1886; 1898-1904)'], ['Partido', 'PAN'], ['Hito', 'Campaña del Desierto y consolidación del Estado'], ['Apodo', '"El Zorro"']],
        bio: '<p>Militar y político tucumano, figura central de la Generación del \'80 y arquitecto de la Argentina moderna. Como Ministro de Guerra de Avellaneda, lideró la Campaña del Desierto, extendiendo la soberanía estatal sobre la Patagonia a costa de las naciones indígenas. Su lema "Paz y Administración" definió un período de enorme crecimiento económico basado en la exportación agropecuaria y la inmigración europea, pero bajo un sistema político restrictivo y fraudulento.</p>'
      },
      yrigoyen: {
        name: 'Hipólito Yrigoyen', dates: '1852 – 1933', img: 'img_presidentes/yrigoyen.jpg',
        facts: [['Cargo', 'Presidente (1916-1922; 1928-1930)'], ['Partido', 'UCR'], ['Hito', 'Primer presidente electo por voto universal masculino (Ley Sáenz Peña)'], ['Apodo', '"El Peludo"']],
        bio: '<p>Líder de masas y fundador de la tradición popular de la Unión Cívica Radical. Tras décadas de lucha revolucionaria contra el "Régimen" conservador, llegó al poder en 1916. Su gestión incorporó a las clases medias a la vida política, defendió la soberanía energética (creación de YPF) y apoyó la Reforma Universitaria. Fue derrocado por el primer golpe militar de la historia argentina en 1930, muriendo años después en la pobreza y el reconocimiento popular.</p>'
      },
      peron: {
        name: 'Juan Domingo Perón', dates: '1895 – 1974', img: 'img_presidentes/peron.jpg',
        facts: [['Cargo', 'Presidente (1946-52; 1952-55; 1973-74)'], ['Partido', 'Justicialista'], ['Hito', 'Justicia Social y voto femenino'], ['Esposas', 'Evita, Isabel Perón']],
        bio: '<p>Militar y político que transformó la estructura social argentina. Desde la Secretaría de Trabajo impulsó derechos laborales inéditos que le valieron el apoyo incondicional de la clase obrera. Sus dos primeras presidencias se caracterizaron por la industrialización, la redistribución del ingreso y la constitucionalización de los derechos sociales. Tras 18 años de exilio tras un golpe cruento en 1955, regresó para una tercera presidencia en 1973, intentando una unidad nacional que quedó trunca por su muerte al año siguiente.</p>'
      },
      evita: {
        name: 'Eva Perón ("Evita")', dates: '1919 – 1952',
        facts: [['Rol', 'Primera Dama y Líder Espiritual'], ['Hito', 'Sufragio Femenino (1947) y ayuda social masiva'], ['Fundación', 'Fundación Eva Perón'], ['Muerte', 'Cáncer a los 33 años']],
        bio: '<p>Actriz que se convirtió en la figura política femenina más influyente de la historia latinoamericana. Como esposa de Perón, actuó como puente directo entre el gobierno y los "descamisados". Su labor en la Fundación Eva Perón y su lucha por el voto femenino la consagraron como un ícono de la justicia social. Su renuncia forzada a la vicepresidencia y su temprana muerte por cáncer la elevaron a la categoría de mito popular y bandera de los movimientos sociales argentinos.</p>'
      },
      videla: {
        name: 'Jorge Rafael Videla', dates: '1925 – 2013',
        facts: [['Cargo', 'Dictador (1976-1981)'], ['Régimen', 'Proceso de Reorganización Nacional'], ['Responsabilidad', 'Plan sistemático de desaparición de personas'], ['Final', 'Murió en prisión común en 2013']],
        bio: '<p>General que encabezó el golpe de Estado de 1976 e instauró la dictadura más sangrienta de la historia argentina. Bajo su mando, el Estado implementó un plan sistemático de secuestro, tortura, asesinato y desaparición de miles de ciudadanos, además del robo de bebés nacidos en cautiverio. Fue condenado a cadena perpetua en el Juicio a las Juntas de 1985, indultado por Menem y finalmente reencarcelado tras la nulidad de las leyes de impunidad.</p>'
      },
      kirchner: {
        name: 'Néstor Kirchner', dates: '1950 – 2010',
        facts: [['Cargo', 'Presidente (2003-2007)'], ['Partido', 'Frente para la Victoria (PJ)'], ['Hito', 'Recuperación post-2001 y anulación Leyes de Impunidad'], ['Origen', 'Gobernador de Santa Cruz (1991-2003)']],
        bio: '<p>Abogado de Santa Cruz que asumió la presidencia con apenas el 22% de los votos tras la huida de Menem del ballotage. Lideró la recuperación económica tras la crisis de 2001 con tasas de crecimiento "chinas", pagó la deuda al FMI y convirtió los Derechos Humanos en política de Estado, impulsando la anulación de las leyes de Obediencia Debida y Punto Final. Su estilo de confrontación política y su prematura muerte en 2010 marcaron profundamente el mapa político del siglo XXI.</p>'
      },
      cfk: {
        name: 'Cristina Fernández de Kirchner', dates: '1953 – presente',
        facts: [['Cargo', 'Presidenta (2007-2015); Vicepresidenta (2019-2023)'], ['Hito', 'Primera mujer electa y reelecta presidenta'], ['Logros', 'Asignación Universal por Hijo, Matrimonio Igualitario'], ['Actualidad', 'Referente central del peronismo contemporáneo']],
        bio: '<p>Abogada y política, fue la primera mujer en ser electa, reelecta y completar dos mandatos presidenciales en Argentina. Su gestión profundizó el modelo de intervención estatal, consumo interno y desendeudamiento iniciado por su esposo Néstor Kirchner. Enfrentó fuertes conflictos con el sector agropecuario (la "125") y los grandes medios de comunicación. Su liderazgo polarizante y sus políticas de inclusión social la mantienen como la figura más relevante y divisiva de la política argentina actual.</p>'
      },
      abuelas: {
        name: 'Abuelas de Plaza de Mayo', dates: '1977 – presente',
        facts: [['Misión', 'Localización y restitución de nietos robados'], ['Logro', '133 nietos recuperados (a 2024)'], ['Aporte', 'Índice de Abuelidad y Banco Nacional de Datos Genéticos'], ['Líder', 'Estela de Carlotto']],
        bio: '<p>Organización de Derechos Humanos nacida durante la última dictadura militar con el objetivo de encontrar a los niños nacidos en cautiverio o secuestrados junto a sus padres desparecidos. Han desarrollado una labor pionera a nivel mundial al integrar la ciencia genética con la búsqueda jurídica, logrando que el "Derecho a la Identidad" sea incorporado a la Convención Internacional sobre los Derechos del Niño.</p>'
      },
      namuncura: {
        name: 'Manuel Namuncurá', dates: '1811 – 1908',
        facts: [['Rol', 'Último gran cacique de la Confederación Mapuche-Pampa'], ['Lugar', 'Puelmapu (Pampas)'], ['Final', 'Deportado y fallecido en el exilio interno en Roma (Río Negro)']],
        bio: '<p>Hijo y sucesor de Calfucurá, heredó el mando de la nación mapuche en el momento más crítico. Debió enfrentar la ofensiva final de la Campaña del Desierto comandada por Julio A. Roca. A pesar de intentar negociaciones diplomáticas para preservar la autonomía de su pueblo, fue forzado a la rendición en 1884. Su figura simboliza la resistencia final y el ocaso de la autonomía soberana indígena frente al Estado nacional en consolidación.</p>'
      },
      sayhueque: {
        name: 'Valentín Sayhueque', dates: '~1820 – 1903',
        facts: [['Tribu', 'Manzaneros (Norte de la Patagonia)'], ['Apodo', '"El Rey de las Manzanas"'], ['Relación', 'Mantuvo una larga alianza con el gobierno argentino hasta 1878']],
        bio: '<p>Cacique de enorme prestigio que gobernó el "País de las Manzanas" en el actual Neuquén. Se consideraba a sí mismo un "argentino" y mantuvo relaciones diplomáticas y comerciales pacíficas con el gobierno nacional durante décadas. Sin embargo, el cambio de paradigma hacia la conquista total lo convirtió en blanco militar. Tras años de persecución por la cordillera, se rindió en 1885 con miles de sus seguidores, marcando el fin de la última resistencia organizada en la Patagonia.</p>'
      },

      macri: {
        name: 'Mauricio Macri', dates: '1959 – presente', img: 'img_presidentes/macri.jpg',
        facts: [['Cargo', 'Presidente (2015-2019)'], ['Partido', 'PRO / Cambiemos / Juntos por el Cambio'], ['Origen', 'Empresario; ex Jefe de Gobierno CABA (2007-2015)'], ['Hito', 'Primer no peronista/radical en ganar por voto popular en un siglo']],
        bio: '<p>Empresario e hijo de una de las familias más ricas de Argentina (Grupo Macri), llegó al poder in 2015 encabezando la coalición «Cambiemos», articulando el descontento de las clases medias con el kirchnerismo mediante una promesa de modernización institucional y «lluvia de inversiones». Su victoria fue históricamente inédita: fue el primer candidato no peronista ni puramente radical en acceder a la presidencia por voto popular desde Alvear in 1922.</p><p>Su gestión abrió el cepo cambiario, pagó a los «fondos buitre» (holdouts del default de 2001) y eliminó las retenciones agropecuarias. Sin embargo, una violenta corrida cambiaria in 2018 destruyó el peso, y Macri debió recurrir al préstamo más grande de la historia del FMI (USD 57.000 millones). Entregó el gobierno con inflación del 53%, pobreza del 35% y una deuda que había crecido un 163%.</p>'
      },
      alberto: {
        name: 'Alberto Fernández', dates: '1959 – presente', img: 'img_presidentes/alberto.jpg',
        facts: [['Cargo', 'Presidente (2019-2023)'], ['Partido', 'Frente de Todos (PJ)'], ['Ocupación previa', 'Abogado y docente universitario; jefe de gabinete de Néstor Kirchner'], ['Fin de mandato', 'Inflación del 211% anual; peor in 33 años']],
        bio: '<p>Abogado y ex jefe de gabinete de Néstor Kirchner, Alberto Fernández fue elegido presidente in 2019 como la cara «moderada» del peronismo reunificado, mientras Cristina Fernández aceptaba la vicepresidencia in un movimiento estratégico inédito. Se presentó como el candidato capaz de «sanar La Grieta», pero su gobierno quedó rápidamente atrapado entre la herencia de la deuda macrista y la irrupción del COVID-19 in marzo de 2020.</p><p>Argentina impuso el ASPO, uno de los confinamientos más largo del mundo, hundiendo el PBI un 9,9%. Los escándalos del <em>Olivosgate</em> y el Vacunatorio VIP destruyeron su autoridad moral. Las disputas públicas entre Alberto y Cristina paralizaron la toma de decisiones. El gobierno terminó con una inflación del 211% anual —la más alta desde la hiperinflación de 1989—, sellando la derrota peronista ante Javier Milei in el ballotage de noviembre de 2023.</p>'
      },
      milei: {
        name: 'Javier Milei', dates: '1970 – presente', img: 'img_presidentes/milei.jpg',
        facts: [['Cargo', 'Presidente (2023-presente)'], ['Partido', 'La Libertad Avanza (LLA)'], ['Ideología', 'Anarcocapitalismo / Liberalismo libertario'], ['Apodo', '"El Loco", "El Peluca"']],
        bio: '<p>Economista y conductor televisivo, Milei irrumpió in la política argentina capitalizando el hartazgo histórico acumulado tras décadas de inflación, corrupción y promesas incumplidas. Autodenominado «anarcocapitalista», propugnaba la eliminación del Banco Central, la dolarización y el desmantelamiento del Estado de Bienestar. Ganó la presidencia in noviembre de 2023 con el 55,6% de los votos in el ballotage, convirtiéndose in el primer mandatario libertario del mundo in ejercicio.</p><p>Implementó el mayor ajuste fiscal de la historia moderna argentina: devaluó el peso un 118% in su primer día, paralizó la obra pública, licuó jubilaciones y despidió a miles de empleados estatales. Logró revertir el déficit fiscal in tiempo récord y bajar la inflación del 25,5% mensual (diciembre 2023) al 2,3% (octubre 2025). El costo social fue enorme: la pobreza alcanzó el 52,9% in el primer semestre de 2024, antes de comenzar a retroceder. En octubre de 2025 triunfó legislativamente con el 41% de los votos.</p>'
      },
      peronismo: {
        name: 'El Peronismo', dates: '1945 – presente',
        facts: [['Fundador', 'Juan Domingo Perón (1895-1974)'], ['Fecha de origen', '17 de octubre de 1945 (el «Día de la Lealtad»)'], ['Nombre formal', 'Partido Justicialista (PJ)'], ['Adjetivo taquigráfico', 'Kirchnerismo, Menemismo, Massismo (corrientes internas)']],
        bio: '<p>El peronismo es el fenómeno político más importante, complejo y duradero de la historia argentina. Nació el 17 de octubre de 1945, cuando una movilización masiva de trabajadores (los «descamisados») forzó la liberación de Perón, quien llevaba detenido apenas 10 días. Desde su origen, se definió por la incorporación de la clase obrera y los sectores populares como protagonistas del Estado.</p><p>La doctrina original («Justicia Social, Soberanía Política e Independencia Económica») combinó elementos del laborismo europeo, el nacionalismo latinoamericano y el catolicismo social. Sus contradicciones internas son enormes: ha alojado desde la derecha fascistizante de los años 70 (Triple A) hasta la izquierda marxista de Montoneros, pasando por el neoliberalismo de Menem in los 90 y el neo-estatismo de los Kirchner in los 2000.</p><p>El peronismo nunca ha perdido una elección sin que haya mediado un golpe de Estado o una crisis económica terminal. Su base electoral in el conurbano bonaerense y entre los sindicatos lo ha mantenido como la fuerza política dominante de Argentina durante 80 años, pese a todas sus transformaciones ideológicas.</p>'
      },
      thatcher: {
        name: 'Margaret Thatcher', dates: '1925 – 2013',
        facts: [['Cargo', 'Primera Ministra del Reino Unido (1979-1990)'], ['Partido', 'Partido Conservador'], ['Apodo', '"La Dama de Hierro"'], ['Rol in Argentina', 'Ordenó la reconquista de las Islas Malvinas in 1982']],
        bio: '<p>Primera mujer in dirigir un gobierno in Europa Occidental, Thatcher fue la figura dominante de la política británica durante los años 80. Su ideología —el «thatcherismo»— combinó el monetarismo de Milton Friedman con el conservadurismo social: reducción drástica del Estado, privatizaciones masivas, derrota de los sindicatos y apertura de mercados.</p><p>Su vínculo con Argentina es indisoluble de la Guerra de Malvinas (1982). Cuando la Junta Militar argentina invadió las islas in abril de 1982, Thatcher ordenó el envío de la flota británica para recuperarlas, ignorando las presiones diplomáticas. La victoria militar fortaleció su posición política doméstica (ganó las elecciones de 1983 con una mayoría aplastante) y resultó in la derrota definitiva de la Junta argentina, acelerando el fin de la dictadura. Para Argentina, las Malvinas representan una causa nacional irrenunciable; para Thatcher, fue el símbolo de la «restauración» del poderío británico.</p>'
      },
      alfonsin: {
        name: 'Raúl Alfonsín', dates: '1927 – 2009', img: 'img_presidentes/alfonsin.jpg',
        facts: [['Cargo', 'Presidente (1983-1989)'], ['Partido', 'Unión Cívica Radical (UCR)'], ['Hito', 'Restauración democrática y Juicio a las Juntas'], ['Apodo', '"El Padre de la Democracia"']],
        bio: '<p>Abogado y político radical que se convirtió in el símbolo de la recuperación democrática argentina in 1983. Su campaña, basada in el rezo del Preámbulo de la Constitución, derrotó al peronismo por primera vez in elecciones libres. Su gobierno enfrentó el desafío histórico de juzgar a las Juntas Militares mientras el poder militar aún estaba latente.</p><p>Creó la CONADEP e impulsó el Juicio a las Juntas de 1985, un hito mundial. Sin embargo, su gestión fue desgastada por trece paros generales de la CGT, tres levantamientos militares "carapintadas" y una hiperinflación devastadora in 1989 que lo obligó a entregar el mando meses antes de término. A pesar de los vaivenes económicos, su legado como garante de la paz civil y los derechos humanos lo posiciona como una de las figuras más respetadas de la historia contemporánea.</p>'
      },
      menem: {
        name: 'Carlos Saúl Menem', dates: '1930 – 2021', img: 'img_presidentes/menem.jpg',
        facts: [['Cargo', 'Presidente (1989-1999)'], ['Partido', 'Partido Justicialista (PJ)'], ['Hito', 'Ley de Convertibilidad y privatizaciones masivas'], ['Contexto', 'Neoliberalismo, "Relaciones Carnales" con EE.UU.']],
        bio: '<p>Gobernador de La Rioja que llegó a la presidencia in medio de la hiperinflación de 1989. Aunque realizó una campaña con retórica peronista tradicional ("Salariazo" y "Revolución Productiva"), una vez in el poder aplicó un giro neoliberal radical: privatizó casi todas las empresas estatales (YPF, ENTEL, Aerolíneas), desreguló la economía y estableció la Convertibilidad (1 peso = 1 dólar).</p><p>Su gobierno logró estabilidad de precios y un boom de consumo que le permitió ser reelegido in 1995 tras reformar la Constitución. Sin embargo, este modelo profundizó el desempleo, la desindustrialización y el endeudamiento externo. Su gestión también estuvo marcada por escándalos de corrupción y los atentados a la Embajada de Israel y la AMIA. Es la figura que define la década de los 90 in Argentina.</p>'
      },
      cavallo: {
        name: 'Domingo Cavallo', dates: '1946 – presente',
        facts: [['Cargo', 'Ministro de Economía (1991-1996 y 2001)'], ['Hito', 'Creador de la Convertibilidad y el "Corralito"'], ['Formación', 'Doctor in Economía (Harvard)'], ['Rol', 'Arquitecto del modelo económico de los 90']],
        bio: '<p>Economista de prestigio internacional que implementó el Plan de Convertibilidad in 1991, logrando frenar in seco la hiperinflación y estabilizar la economía argentina durante casi una década. Fue el ministro estrella de Menem hasta 1996. Su esquema permitió una modernización tecnológica rápida pero ató la política monetaria a la reserva de dólares.</p><p>Regresó al cargo in 2001 bajo el gobierno de De la Rúa como "salvador" de la crisis. Ante la fuga masiva de depósitos, impuso el *Corralito* in diciembre de 2001, prohibiendo a los ciudadanos retirar sus ahorros in efectivo. Esta medida detonó el estallido social y su renuncia masiva. Es una de las figuras más técnicamente respetadas y socialmente controvertidas de la economía argentina.</p>'
      },
      walsh: {
        name: 'Rodolfo Walsh', dates: '1927 – 1977',
        facts: [['Oficio', 'Periodista, escritor y militante'], ['Obra cumbre', '"Operación Masacre" (1957)'], ['Hito', '"Carta Abierta de un Escritor a la Junta Militar"'], ['Situación', 'Desaparecido (25 de marzo de 1977)']],
        bio: '<p>Fundador del periodismo de investigación in Argentina. Con <em>Operación Masacre</em>, Walsh denunció los fusilamientos clandestinos de civiles peronistas in 1956, desafiando a la Revolución Libertadora. Fue un intelectual comprometido que se integró a la organización Montoneros como oficial de inteligencia y responsable de la agencia de noticias ANCLA.</p><p>El 24 de marzo de 1977, al cumplirse un año del golpe militar, escribió su obra testamento: la "Carta Abierta de un Escritor a la Junta Militar", donde denunció no solo los crímenes de lesa humanidad sino el plan económico de miseria planificada. Al día siguiente fue emboscado por un grupo de tareas in Buenos Aires; resistió con una pistola pequeña y fue secuestrado. Permanece desaparecido.</p>'
      },
      strassera: {
        name: 'Julio César Strassera', dates: '1933 – 2015',
        facts: [['Cargo', 'Fiscal del Juicio a las Juntas (1985)'], ['Frase célebre', '"Señores jueces: Nunca Más"'], ['Contexto', 'Lideró la acusación civil contra los comandantes de la dictadura'], ['Legado', 'Símbolo del coraje judicial civil']],
        bio: '<p>Abogado de carrera judicial que asumió la responsabilidad histórica de ser el fiscal acusador in el Juicio a las Juntas de 1985. Junto a su adjunto Luis Moreno Ocampo y un equipo de jóvenes investigadores, construyó la prueba para demostrar que el terrorismo de Estado había sido un plan sistemático y no un conjunto de "excesos" individuales.</p><p>Su alegato final es una de las piezas retóricas más importantes de la historia argentina y del derecho internacional. Al cerrar su acusación, pronunció las palabras que se convertirían in el lema fundacional de la nueva democracia: <em>"Señores jueces: nunca más"</em>. Tras el juicio, continuó su defensa de los derechos humanos y se opuso firmemente a las leyes de impunidad y los indultos.</p>'
      },
      sabato: {
        name: 'Ernesto Sabato', dates: '11 de junio de 1911 – 2011',
        facts: [['Oficio', 'Escritor y físico'], ['Cargo', 'Presidente de la CONADEP (1983-1984)'], ['Obra cumbre', '"Sobre héroes y tumbas", "El túnel"'], ['Hito DD.HH.', 'Entregó el informe "Nunca Más" a Alfonsín']],
        bio: '<p>Uno de los grandes escritores argentinos del siglo XX, Sabato abandonó una prometedora carrera in la física nuclear por la literatura. Tras el retorno democrático in 1983, Raúl Alfonsín le encomendó la presidencia de la CONADEP (Comisión Nacional sobre la Desaparición de Personas). Bajo su liderazgo, la comisión realizó una tarea ciclópea: recolectar miles de testimonios que probaron el plan sistemático de exterminio de la dictadura.</p><p>El informe resultante, el *Nunca Más*, se convirtió in el libro más importante de la transición democrática y in la base probatoria del Juicio a las Juntas. Sabato, con su autoridad moral e intelectual, fue el puente entre una sociedad que empezaba a conocer el horror y la necesidad de justicia institucional. Su frase "La historia no es mecánica; es un misterio que se va construyendo" resume su visión del compromiso civil.</p>'
      },
      etchecolatz: {
        name: 'Miguel Etchecolatz', dates: '1929 – 2022',
        facts: [['Cargo', 'Director de Investigaciones de la Policía Bonaerense (1976-1979)'], ['Contexto', 'Mano derecha del general Ramón Camps'], ['Responsabilidad', 'Noche de los Lápices y múltiples centros clandestinos'], ['Condena', 'Varias cadenas perpetuas por crímenes de lesa humanidad']],
        bio: '<p>Comisario general de la Policía de la Provincia de Buenos Aires que personificó la crueldad operativa del terrorismo de Estado. Bajo su mando directo operó el llamado "Circuito Camps", una red de centros clandestinos de detención donde se cometieron miles de torturas y asesinatos. Fue el responsable máximo del operativo de la *Noche de los Lápices*.</p><p>A diferencia de otros represores, Etchecolatz mostró siempre un abierto desprecio por el tribunal y las víctimas, reivindicando sus crímenes hasta el final. En 2006, durante el primer juicio tras la anulación de las leyes de impunidad, fue condenado a reclusión perpetua. Su nombre también quedó ligado a la desaparición traumática de Jorge Julio López, el testigo clave que desapareció poco antes de escucharse la sentencia contra él.</p>'
      },
      julio_lopez: {
        name: 'Jorge Julio López', dates: '1929 – Desaparecido (2006)',
        facts: [['Oficio', 'Albañil y militante peronista'], ['Situación 1', 'Desaparecido durante la dictadura (1976-1979)'], ['Situación 2', 'Desaparecido in democracia (18 de sept. 2006)'], ['Hito', 'Testigo clave contra Etchecolatz']],
        bio: '<p>Militante de base del peronismo que sobrevivió a la desaparición y tortura in varios centros clandestinos durante la dictadura militar. Treinta años después, López brindó un testimonio detallado y valiente que fue fundamental para lograr la condena del represor Miguel Etchecolatz por genocidio.</p><p>El 18 de septiembre de 2006, el día que debía asistir a los alegatos finales del juicio in La Plata, López desapareció por segunda vez. Su desaparición in plena democracia conmocionó al país y desnudó la pervivencia de grupos de tareas o "mano de obra desocupada" de las fuerzas de seguridad que intentaban amedrentar a los testigos de los juicios de lesa humanidad. A pesar de las intensas búsquedas y reclamos sociales, López continúa desaparecido, siendo una de las heridas más profundas de la democracia argentina.</p>'
      },
      mary_king: {
        name: 'Mary-Claire King', dates: '1946 – presente',
        facts: [['Oficio', 'Genetista estadounidense'], ['Hito', 'Desarrollo del "Índice de Abuelidad" (1984)'], ['Aporte', 'Primera prueba genética para identificar nietos robados'], ['Otros logros', 'Identificó el gen BRCA1 del cáncer de mama']],
        bio: '<p>Reconocida genetista de la Universidad de Washington que puso la ciencia al servicio de la justicia in Argentina. Invitada por las Abuelas de Plaza de Mayo y la AAAS, aceptó el desafío de encontrar un método científico para demostrar el parentesco entre las abuelas y sus nietos in ausencia de los padres desaparecidos.</p><p>Su trabajo derivó in la creación del "Índice de Abuelidad", una fórmula probabilística basada in marcadores genéticos que permitió establecer el vínculo biológico con una certeza superior al 99%. Este avance fue revolucionario: por primera vez, la ciencia proveía una prueba irrefutable contra el robo de identidad estatal. King trabajó codo a codo con las Abuelas, participando in la identificación de los primeros nietos restituidos. Su labor es un pilar de la genética forense mundial.</p>'
      },
      pinedo: {
        name: 'Federico Pinedo (abuelo)', dates: '1895 – 1971',
        facts: [['Cargo', 'Ministro de Economía in la Década Infame (1933-35, 1940-41)'], ['Partido', 'Partido Social Independiente / Concordancia'], ['Hito', 'Creador del Banco Central y el impuesto a los réditos'], ['Legado', 'Primer plan de reactivación industrial (Plan Pinedo)']],
        bio: '<p>Político y economista conservador de gran influencia intelectual durante la Década Infame. Aunque provenía de una élite liberal, fue el arquitecto del Estado interventor moderno in Argentina frente al colapso del comercio mundial tras la crisis de 1929. Diseñó la creación del Banco Central (1935) y de las juntas reguladoras de granos y carnes.</p><p>Su "Plan de Reactivación Económica" de 1940 fue el primer proyecto serio de industrialización por sustitución de importaciones impulsado desde el Estado, aunque fue rechazado por el Congreso. Pinedo representó la lucidez de una élite que entendía que el viejo modelo agroexportador había muerto y que el Estado debía regular la economía para salvar el capitalismo nacional. Es el abuelo del dirigente político contemporáneo homónimo.</p>'
      },
      mena: {
        name: 'Máximo Mena', dates: '1942 – 1969',
        facts: [['Oficio', 'Obrero automotriz (IKA-Renault)'], ['Gremio', 'SMATA'], ['Hito', 'Primera víctima fatal del Cordobazo (29 mayo 1969)'], ['Consecuencia', 'Su muerte detonó la furia popular generalizada']],
        bio: '<p>Obrero metalúrgico cordobés cuya muerte se convirtió in el catalizador del Cordobazo. Trabajaba in la planta de IKA-Renault y era delegado gremial de SMATA. Durante las primeras horas de la movilización del 29 de mayo de 1969, mientras las columnas obreras avanzaban hacia el centro de la ciudad de Córdoba, Mena fue asesinado por un disparo de la policía de la provincia.</p><p>La noticia de su asesinato se esparció rápidamente por las barricadas y las fábricas, transformando lo que era una protesta gremial in un levantamiento popular imparable. La imagen de sus compañeros cargando su cuerpo se convirtió in un símbolo de la resistencia contra la dictadura de Onganía. Su muerte marcó el punto de no retorno de aquella jornada histórica que hirió de muerte al régimen militar.</p>'
      },

      // ── FIGURAS ADICIONALES ──
      saenz_pena: {
        name: 'Roque Sáenz Peña', dates: '1851 – 1914',
        facts: [['Cargo', 'Presidente (1910-1914)'], ['Partido', 'Partido Autonomista Nacional (PAN)'], ['Origen', 'Élite terrateniente bonaerense'], ['Legado', 'Ley 8.871 (1912): voto secreto, obligatorio y universal masculino']],
        bio: '<p>Abogado y político conservador que paradójicamente promovió la reforma política más radical de la oligarquía argentina: la ley que lleva su nombre. Hijo de un ex presidente, se destacó antes como diplomático y luego como ministro. Fue elegido presidente en 1910 en el último proceso fraudulento clásico del régimen conservador.</p><p>Su motivación para impulsar la reforma electoral fue compleja: parte genuina convicción republicana (<em>"Quiera el pueblo votar"</em>, dijo), parte cálculo estratégico de una élite que buscaba institucionalizar el sistema antes de ser desbordada por la presión social. La Ley 8.871, sancionada en 1912, introdujo el cuarto oscuro, el padrón único militar y el voto obligatorio masculino. Sáenz Peña no vivió para ver su resultado: murió en 1914, y la primera elección bajo su ley fue en 1916, ganada por Yrigoyen —el hombre que su élite había intentado marginar durante décadas.</p>'
      },
      deodoro_roca: {
        name: 'Deodoro Roca', dates: '1890 – 1942',
        facts: [['Rol', 'Abogado, intelectual y activista político'], ['Hito', 'Redactor del Manifiesto Liminar (21 de junio de 1918)'], ['Universidad', 'Universidad Nacional de Córdoba'], ['Legado', 'Voz principal de la Reforma Universitaria latinoamericana']],
        bio: '<p>Abogado cordobés y pensador radical, Deodoro Roca fue el redactor del histórico <em>Manifiesto Liminar</em> del 21 de junio de 1918, el documento fundacional de la Reforma Universitaria. Con una prosa inflamada y visionaria, el manifiesto apelaba a los «hombres libres de Sud América» para denunciar que las universidades se habían convertido en refugio de la mediocridad y el dogmatismo.</p><p>Roca no fue solo un reformador universitario: fue un intelectual comprometido con las causas sociales de su tiempo, antifascista declarado y defensor de los republicanos españoles. Después de 1918 continuó siendo una figura incómoda para el sistema, perseguido y marginado. Su obra recién fue reconocida plenamente en las décadas posteriores a su muerte. Es hoy considerado uno de los grandes pensadores de la tradición democrática latinoamericana del siglo XX.</p>'
      },
      calfucura: {
        name: 'Calfucurá', dates: '~1790 – 1873',
        facts: [['Pueblo', 'Mapuche (linaje Vorogano)'], ['Apodo', '"El Rey de las Pampas"'], ['Aliado histórico', 'Juan Manuel de Rosas (tratados de paz 1833-52)'], ['Muerte', 'Natural, nunca fue vencido militarmente']],
        bio: '<p>El líder indígena más poderoso de la historia argentina post-colonial. Nacido en Chile, Calfucurá cruzó los Andes y unificó bajo su mando a decenas de parcialidades mapuches y pampas en vastas regiones de la actual provincia de Buenos Aires, La Pampa y Neuquén. Desde su capital en Salinas Grandes, construyó una verdadera confederación interétnica que durante cuatro décadas fijó los límites reales del poder del Estado argentino.</p><p>Durante el gobierno de Juan Manuel de Rosas mantuvo una alianza estratégica basada en el intercambio de ganado, sal y regalos. Tras la caída de Rosas en 1852, resistió militarmente al nuevo Estado liberal. Sus «malones» eran expediciones coordinadas de centenares de guerreros que llegaban hasta los suburbios de Buenos Aires. Murió de forma natural en 1873, sin haber sido jamás derrotado. Fue su hijo Manuel Namuncurá quien heredó el mando y debió enfrentar la Campaña del Desierto de Roca.</p>'
      },
      avellaneda: {
        name: 'Nicolás Avellaneda', dates: '1836 – 1885', img: 'img_presidentes/Avellaneda-.jpg',
        facts: [['Cargo', 'Presidente (1874-1880)'], ['Partido', 'Partido Autonomista Nacional (PAN)'], ['Origen', 'Tucumán'], ['Legado', 'Presidencia que autorizó la Campaña del Desierto']],
        bio: '<p>Abogado e intelectual tucumano que gobernó Argentina en uno de sus períodos más dramáticos. Bajo su mandato se trazaron las líneas estratégicas que culminarían en la Campaña del Desierto: primero la Zanja de Alsina como estrategia defensiva, y tras la muerte del ministro Alsina en 1877, la designación de Julio Roca al frente del ejército con un enfoque ofensivo total.</p><p>Avellaneda fue también el articulador de la federalización de Buenos Aires (1880), la medida que definió la estructura política argentina moderna al separar la capital de la provincia y dar sede definitiva al gobierno nacional. A pesar de que la Campaña del Desierto se completó en gran parte bajo Roca, fue Avellaneda quien la planificó y dio su impulso inicial. Su figura representa el puente entre el régimen conservador porteño del siglo XIX y la Generación del \'80.</p>'
      },
      galtieri: {
        name: 'Leopoldo Fortunato Galtieri', dates: '1926 – 2003',
        facts: [['Cargo', 'Presidente de facto (1981-1982)'], ['Régimen', 'Proceso de Reorganización Nacional (3ª Junta)'], ['Decisión fatal', 'Ordenó la invasión de las Islas Malvinas (2 de abril de 1982)'], ['Condena', 'Condenado por la guerra de Malvinas y crímenes de lesa humanidad']],
        bio: '<p>General del Ejército que llegó al poder mediante un golpe interno dentro de la propia dictadura (desplazando a Viola) en diciembre de 1981. Militar alineado con la estrategia anticomunista de Reagan, Galtieri apostó a la invasión de las Islas Malvinas como maniobra de distracción política: la dictadura perdía legitimidad por las violaciones a los derechos humanos y la crisis económica, y calculó que recuperar las islas generaría un apoyo masivo de la población.</p><p>El 2 de abril de 1982 ordenó la invasión. La apuesta inicial fue exitosa en lo emocional: miles de argentinos se congregaron en Plaza de Mayo aclamando a la Junta. Pero la respuesta militar británica fue devastadora. La rendición argentina el 14 de junio de 1982 fue el golpe de gracia final para la dictadura: Galtieri renunció días después. La derrota aceleró la transición democrática. Fue condenado por tribunales civiles tanto por la aventura bélica como por delitos de lesa humanidad cometidos durante la dictadura.</p>'
      },
      massera: {
        name: 'Emilio Eduardo Massera', dates: '1925 – 2010',
        facts: [['Cargo', 'Jefe de la Armada y miembro de la Primera Junta Militar (1976-1978)'], ['Régimen', 'Proceso de Reorganización Nacional'], ['Centro clandestino', 'ESMA (Escuela de Mecánica de la Armada) bajo su mando'], ['Condena', 'Cadena perpetua en el Juicio a las Juntas (1985)']],
        bio: '<p>Almirante jefe de la Armada Argentina y uno de los tres miembros de la Primera Junta Militar del golpe de 1976 (junto a Videla y el brigadier Agosti). Massera fue el comandante bajo cuya responsabilidad directa operó la ESMA (Escuela de Mecánica de la Armada), el mayor centro clandestino de detención y tortura del país, donde fueron secuestradas, torturadas y asesinadas más de 5.000 personas.</p><p>A diferencia de Videla, Massera era un político ambicioso que soñaba con una carrera presidencial propia. Tras dejar la junta en 1978 intentó construir una imagen pública como estadista. Fue juzgado y condenado a cadena perpetua en el histórico Juicio a las Juntas de 1985. Beneficiado por el indulto de Menem en 1990, fue nuevamente procesado en los años 2000 por los crímenes específicos en la ESMA y pasó sus últimos años bajo arresto domiciliario por razones de salud.</p>'
      },
      aramburu: {
        name: 'Pedro Eugenio Aramburu', dates: '1903 – 1970',
        facts: [['Cargo', 'Presidente de facto (1955-1958)'], ['Hito', 'Derrocó a Perón en la "Revolución Libertadora" de 1955'], ['Muerte', 'Secuestrado y ejecutado por Montoneros (1970)'], ['Contexto', 'Ordenó el fusilamiento de peronistas en los basurales de José León Suárez']],
        bio: '<p>General que lideró junto a Isaac Rojas la <em>Revolución Libertadora</em> de septiembre de 1955, el golpe que derrocó a Juan Perón. Su gobierno se caracterizó por la proscripción del peronismo, la prohibición de mencionar el nombre de Perón y el fusilamiento sumario de civiles y militares peronistas en basurales de José León Suárez (1956) —un episodio documentado por Rodolfo Walsh en <em>Operación Masacre</em>.</p><p>Paradójicamente para la historia, Aramburu fue la primera víctima de la guerrilla peronista: secuestrado y ejecutado por Montoneros en mayo de 1970, en lo que el grupo definió como «ajusticiamiento» por los fusilamientos de 1956. Su muerte marcó el inicio de una espiral de violencia política que se extendería hasta los años 80. Su figura es controvertida: para los antiperonistas, un restaurador del orden republicano; para el peronismo, símbolo de la represión oligárquica.</p>'
      },
      lanusse: {
        name: 'Alejandro Agustín Lanusse', dates: '1918 – 1996',
        facts: [['Cargo', 'Presidente de facto (1971-1973)'], ['Hito', 'Negoció el regreso de Perón del exilio y convocó a elecciones libres'], ['Contexto', '\"Revolución Argentina\" en crisis por el Cordobazo y la guerrilla'], ['Cita célebre', '"A Perón le falta coraje para volver"']],
        bio: '<p>General que asumió el poder en 1971, en el momento de mayor crisis de la dictadura de la denominada «Revolución Argentina», sacudida por el Cordobazo (1969) y el crecimiento de la guerrilla. Con pragmatismo, Lanusse reconoció la imposibilidad de sostener el sistema político sin incorporar al peronismo y abrió negociaciones directas con Perón desde el exilio en Madrid.</p><p>Convocó al Gran Acuerdo Nacional (GAN) e impulsó la reforma electoral que permitiría el regreso de la democracia. Levantó la proscripción del peronismo y convocó a elecciones para 1973. Sin embargo, exigió que los candidatos residieran en Argentina antes de cierta fecha —sabiendo que Perón no cumpliría ese plazo—, lo que derivó en la candidatura presidencial del delegado peronista <em>Héctor Cámpora</em>. Los comicios de 1973 con el triunfo de Cámpora pusieron fin formal al ciclo de dictaduras de la Revolución Argentina.</p>'
      },
      campora: {
        name: 'Héctor Cámpora', dates: '1909 – 1980', img: 'img_presidentes/campora.png',
        facts: [['Cargo', 'Presidente (25 mayo – 13 julio 1973)'], ['Partido', 'Partido Justicialista / FREJULI'], ['Apodo', '"El Tío"'], ['Mandato', '49 días, el más breve de forma voluntaria en la historia argentina']],
        bio: '<p>Odontólogo y político peronista que fue el «hombre de paja» elegido por Perón para ganar las elecciones de 1973, ya que la dictadura de Lanusse había impedido legalmente la candidatura del propio Perón. Su campaña se resumió en el eslogan <em>«Cámpora al gobierno, Perón al poder»</em>, que reflejaba fielmente su rol subordinado.</p><p>Asumió el 25 de mayo de 1973 con un gobierno que duró solo 49 días. Su mandato fue marcado desde el primer día por la masacre de Ezeiza: cuando Perón regresó al país el 20 de junio, francotiradores de la derecha peronista dispararon sobre la multitud de izquierda que lo esperaba, dejando decenas de muertos. Cámpora renunció el 13 de julio para convocar nuevas elecciones en las que Perón pudiera participar directamente. Su breve gestión liberó a presos políticos y reabrió relaciones diplomáticas con Cuba y la URSS.</p>'
      },
      isabelita: {
        name: 'María Estela Martínez de Perón ("Isabelita")', dates: '1931 – presente', img: 'img_presidentes/isabelita.webp',
        facts: [['Cargo', 'Presidenta (1974-1976)'], ['Partido', 'Partido Justicialista'], ['Rol previo', 'Tercera esposa y Vice de Perón'], ['Hito', 'Primera mujer presidenta de Argentina y del mundo moderno']],
        bio: '<p>Bailarina cabaretera que conoció a Perón en Panamá en 1956 durante su exilio. Se convirtió en su compañera y asistente personal, y fue presentada como su candidata a vicepresidenta en la fórmula electoral de 1973. Cuando Perón murió el 1 de julio de 1974, Isabelita asumió la presidencia, convirtiéndose en la primera mujer presidenta de Argentina y la primera del mundo en llegar al cargo por sucesión constitucional.</p><p>Su gobierno fue un desastre: carente de experiencia política, delegó el poder real en el ministro José López Rega ("El Brujo"), jefe de la Triple A (organización paraestatal de exterminio) y promotor de un esoterismo político delirante. La economía cayó en hiperinflación (335% en 1975), los atentados guerrilleros y parapoliciales se multiplicaron. El 24 de marzo de 1976, un golpe militar la derrocó. Fue detenida y luego exiliada a España, donde vive actualmente.</p>'
      },
      lopez_rega: {
        name: 'José López Rega ("El Brujo")', dates: '1916 – 1989',
        facts: [['Cargo', 'Ministro de Bienestar Social (1973-1975)'], ['Apodo', '"El Brujo"'], ['Organización', 'Fundador y jefe de la Triple A (Alianza Anticomunista Argentina)'], ['Ideología', 'Fascismo, esoterismo, extrema derecha peronista']],
        bio: '<p>Suboficial de la policía y astrólogo aficionado que se convirtió en el custodio personal de Perón durante el exilio en Madrid y luego en el hombre más poderoso del gobierno peronista. Fue el autor intelectual de la masacre de Ezeiza (1973) y el organizador de la Triple A (Alianza Anticomunista Argentina), red de exterminio que asesinó a cientos de militantes de izquierda, intelectuales y periodistas antes incluso del golpe de 1976.</p><p>Durante el gobierno de Isabelita, López Rega concentró un poder extraordinario como Ministro de Bienestar Social mientras la presidenta dependía de su consejo. Su ideología combinaba el fascismo, el esoterismo y el antisemitismo. En julio de 1975 fue forzado a renunciar y huir al extranjero tras una huelga general de la CGT —un hecho inédito— que cuestionó su manejo del gobierno. Murió en prisión en 1989, procesado por los crímenes de la Triple A.</p>'
      },
      ongania: {
        name: 'Juan Carlos Onganía', dates: '1914 – 1995',
        facts: [['Cargo', 'Presidente de facto (1966-1970)'], ['Régimen', 'Revolución Argentina'], ['Hito', 'La "Noche de los Bastones Largos" (29 julio 1966)'], ['Caída', 'Derrocado tras el Cordobazo de 1969 y el secuestro de Aramburu']],
        bio: '<p>General católico ultraconservador que encabezó el golpe de 1966 que instauró la «Revolución Argentina», una dictadura que se autoproclamó sin plazos y con vocación refundacional. Su gobierno impuso una agenda moralista (clausuró cabarets, prohibió el uso de minifalda en lugares públicos) y represora: el 29 de julio de 1966, la «Noche de los Bastones Largos», la policía atacó brutalmente a estudiantes y profesores en facultades de la UBA que resistían la intervención universitaria.</p><p>El Cordobazo de mayo de 1969 —levantamiento obrero-estudiantil masivo que paralizó Córdoba durante días— fue el golpe fatal a su autoridad. La clase media industrial cordobesa demostró que el modelo autoritario era ingobernable. Onganía fue removido por sus propios colegas militares en junio de 1970, tras el secuestro de Aramburu por Montoneros. Su régimen fue el antecedente directo de la violencia política de los años 70.</p>'
      },
      frondizi: {
        name: 'Arturo Frondizi', dates: '1908 – 1995', img: 'img_presidentes/Arturo-Frondizi-1-copia.jpg',
        facts: [['Cargo', 'Presidente (1958-1962)'], ['Partido', 'Unión Cívica Radical Intransigente (UCRI)'], ['Contexto', 'Ganó con votos peronistas proscriptos; derrocado por militares'], ['Hito económico', 'Desarrollismo: industria petroquímica y automotriz']],
        bio: '<p>Intelectual radical de la corriente «intransigente» que llegó al poder en 1958 en acuerdo secreto con Perón (quien desde el exilio ordenó a sus seguidores votar por Frondizi a cambio de promesas de legalización). Su gobierno apostó al «desarrollismo»: atraer inversión extranjera para industrializar el país, especialmente en petróleo (YPFB), petroquímica y automotriz.</p><p>Su mandato fue una pesadilla de presiones institucionales: los militares lo amenazaron con golpes cada vez que tomaba medidas que consideraban cercanas al peronismo o al comunismo (firmó 35 planteos militares). Anuló las elecciones provinciales de 1962 cuando ganaron los peronistas, pero para entonces ya era tarde: fue derrocado por los propios militares en marzo de 1962 y confinado en la isla Martín García. Su breve gestión dejó una base industrial moderna que fue uno de los fundamentos del posterior desarrollo argentino.</p>'
      },
      illia: {
        name: 'Arturo Umberto Illia', dates: '1900 – 1983', img: 'img_presidentes/illia.jpg',
        facts: [['Cargo', 'Presidente (1963-1966)'], ['Partido', 'Unión Cívica Radical del Pueblo (UCRP)'], ['Apodo', '"El Tortuga" (por los medios opositores)'], ['Derrocado por', 'Golpe de Onganía (1966)']],
        bio: '<p>Médico rural de Cruz del Eje (Córdoba) que llegó a la presidencia en 1963 con solo el 25,1% de los votos válidos —el peronismo seguía proscripto—. Su gobierno fue honesto, austero y apegado a las formas republicanas. Anuló los contratos petroleros de Frondizi con empresas extranjeras como medida de soberanía. Estableció la gratuidad de los medicamentos y la regulación de la industria farmacéutica.</p><p>Los grandes medios —especialmente la revista <em>Primera Plana</em>, aliada a los intereses militares y empresariales— lo caricaturizaron como «El Tortuga», lento e ineficaz. Esta campaña mediática preparó el terreno para el golpe de junio de 1966 que lo derrocó. Su figura fue reivindicada póstumanente como la de uno de los presidentes más honestos y democráticos de la historia argentina. Murió de forma natural en 1983, pocos meses antes de que la democracia se restaurara.</p>'
      },
      dela_rua: {
        name: 'Fernando de la Rúa', dates: '1937 – 2019', img: 'img_presidentes/de la rua.jpg',
        facts: [['Cargo', 'Presidente (1999-2001)'], ['Partido', 'Unión Cívica Radical / Alianza'], ['Renuncia', '20 de diciembre de 2001, en helicóptero desde la Casa Rosada'], ['Contexto', 'Crisis del 2001; 39 muertos en la represión del 19-20 de diciembre']],
        bio: '<p>Abogado y político radical que ganó las elecciones de 1999 encabezando «La Alianza» (UCR + FREPASO), capitalizando el agotamiento del menemismo. Prometió transparencia institucional y continuó la política económica de Menem —la Convertibilidad— confiando en que podía hacerla sostenible mediante ajuste fiscal.</p><p>Su gobierno colapsó rápidamente. La Argentina ya estaba en recesión desde 1998. Los sucesivos ministros de economía no pudieron detener la fuga de capitales. En diciembre de 2001, el ministro Cavallo (nuevamente convocado) impuso el <em>Corralito</em> —prohibición de retiros bancarios—, desencadenando el estallido social del 19 y 20 de diciembre: 39 muertos en represión, saqueos y cacerolazos. De la Rúa renunció y escapó en helicóptero desde la Casa Rosada. En los días siguientes pasaron cinco presidentes por el cargo. Su figura es sinónimo del derrumbe de 2001.</p>'
      },
      duhalde: {
        name: 'Eduardo Duhalde', dates: '1941 – 2024', img: 'img_presidentes/duhalde.jpg',
        facts: [['Cargo', 'Presidente (2002-2003; interino por Asamblea Legislativa)'], ['Partido', 'Partido Justicialista (PJ)'], ['Hito', 'Aplicó la devaluación y pesificación que puso fin a la Convertibilidad'], ['Rol posterior', 'Fue quien ungió a Néstor Kirchner como candidato presidencial']],
        bio: '<p>Político bonaerense peronista, ex gobernador de la provincia de Buenos Aires, que fue designado presidente interino por la Asamblea Legislativa en enero de 2002, en medio del caos de los cinco presidentes de la semana de diciembre 2001. Tomó la decisión más traumática y estructural del período: el fin de la convertibilidad (el 1 a 1) y la devaluación del peso.</p><p>La «pesificación asimétrica» que instrumentó licuó los depósitos en dólares de miles de ahorristas a una tasa desfavorable, generando masiva protesta judicial y ciudadana («el corralón»). Sin embargo, la devaluación restableció la competitividad exportadora y sentó las bases para el crecimiento posterior. En agosto de 2002, la represión policial de una protesta en el Puente Pueyrredón costó la vida de dos militantes piqueteros (Kosteki y Santillán), forzando su acelerado llamado a elecciones. Fue Duhalde quien eligió a Néstor Kirchner como candidato del PJ, creyendo poder controlarlo; Kirchner se independizó rápidamente.</p>'
      },
      lavagna: {
        name: 'Roberto Lavagna', dates: '1942 – presente',
        facts: [['Cargo', 'Ministro de Economía (2002-2005, bajo Duhalde y Kirchner)'], ['Corriente', 'Heterodoxia pragmática / Neo-desarrollismo'], ['Logro', 'Reestructuración de la deuda con quita histórica del 65% (2005)'], ['Posición', 'Candidato presidencial en 2019 (Consenso Federal)']],
        bio: '<p>Economista e intelectual de centroizquierda, Lavagna fue el artífice técnico de la recuperación económica post-2001. Nombrado por Duhalde y ratificado por Kirchner, diseñó el esquema de estabilización macroeconómica que combinó el nuevo tipo de cambio competitivo con control de capitales y renegociación de contratos con empresas privatizadas. Bajo su gestión, el PBI volvió a crecer a tasas chinas del 8-9% anual.</p><p>Su gran logro histórico fue la reestructuración de la deuda externa en default (2005): logró que el 76% de los bonistas privados internacionales aceptara una quita del 65% del valor nominal —la quita más grande de la historia financiera global hasta ese momento. Lavagna fue el negociador de esa quita, enfrentando en su solitaria gestión la presión de los grandes bancos de inversión de Wall Street y el FMI. Kirchner lo reemplazó en 2005 por Felisa Miceli tras una creciente diferencia política. Su figura suele ser rescatada por sectores peronistas «moderados» como modelo de gestión económica exitosa.</p>'
      },
      massa: {
        name: 'Sergio Massa', dates: '1972 – presente',
        facts: [['Cargo', 'Ministro de Economía (2022-2023) y candidato presidencial (2023)'], ['Partido', 'Unión por la Patria / Frente de Todos'], ['Apodo', '"El Toro"'], ['Derrota', 'Perdió el ballotage de 2023 ante Milei con 44,3% de los votos']],
        bio: '<p>Político peronista de larga trayectoria (fue jefe de gabinete de Cristina Kirchner y presidente de la Cámara de Diputados), Massa fue el «bombero» convocado por Alberto Fernández en agosto de 2022 para contener una escalada cambiaria e inflacionaria que amenazaba con espiralizar antes de las elecciones. Asumió como «superministro» con poderes concentrados en Economía, Agricultura y Producción.</p><p>Su gestión fue un equilibrio permanente entre el ajuste necesario para cumplir metas con el FMI y la distribución de beneficios para sostener la coalición electoral. Aplicó tras las PASO de agosto de 2023 una devaluación del 20% que disparó los precios. Se presentó como candidato presidencial con el agregado de ser ministro en ejercicio —sin renunciar—, algo inédito en la historia argentina. Perdió el ballotage de noviembre de 2023 ante Javier Milei con el 44,3% de los votos, la mayor derrota electoral peronista en décadas.</p>'
      },
      carlotto: {
        name: 'Estela de Carlotto', dates: '1930 – presente',
        facts: [['Rol', 'Presidenta de Abuelas de Plaza de Mayo desde 1989'], ['Hito personal', 'Encontró a su nieto Ignacio (Guido Carlotto) en 2014, 36 años después'], ['Premio', 'Premio Konex de Platino, Felix Houphouët-Boigny de UNESCO'], ['Hija', 'Laura Carlotto, desaparecida en 1977 (embarazada)']],
        bio: '<p>Maestra jubilada bonaerense que se convirtió en la cara más visible de las Abuelas de Plaza de Mayo y en un símbolo global de la lucha por la memoria, la verdad y la justicia. Su hija Laura fue secuestrada en 1977 embarazada, y dio a luz en cautiverio antes de ser asesinada. Estela buscó durante 36 años a ese nieto, cuya identidad ignoraba.</p><p>En 2014, en uno de los momentos más emocionantes de la historia reciente argentina, su nieto Ignacio Hurban se identificó voluntariamente al reconocer inconsistencias en su historia familiar. Tenía 36 años. La noticia conmovió a la sociedad entera. Carlotto continuó en su rol al frente de las Abuelas a pesar de encontrar a su nieto, declarando que no descansaría hasta recuperar a todos. Su figura encarna la persistencia y la dignidad frente al crimen de Estado más atroz de la historia argentina.</p>'
      },
      torres: {
        name: 'Elpidio Torres', dates: '1929 – 2003',
        facts: [['Rol', 'Secretario General del SMATA (sindicato mecánico)'], ['Corriente', 'Sindicalismo peronista'], ['Hito', 'Co-lider del Cordobazo (1969)'], ['Contraste', 'A diferencia de Tosco, era peronista; juntos simbolizaron la unidad obrera']],
        bio: '<p>Dirigente sindical peronista, secretario general del SMATA (Sindicato de Mecánicos y Afines del Transporte Automotor) de Córdoba, que junto al clasista Agustín Tosco lideró el levantamiento del Cordobazo en mayo de 1969. La alianza entre Torres (peronista) y Tosco (clasista, marxista) fue en sí misma un símbolo histórico: trascendió las divisiones ideológicas del movimiento obrero para enfrentar en conjunto a la dictadura de Onganía.</p><p>A diferencia de Tosco, Torres no fue perseguido con la misma intensidad tras la dictadura de 1976, probablemente por su alineamiento con el peronismo ortodoxo. Su figura es menos conocida que la de Tosco en la narrativa de la izquierda, pero igualmente central en la historia del movimiento obrero argentino. El Cordobazo habría sido imposible sin la participación masiva de los trabajadores del SMATA que él conducía.</p>'
      },
      caputo: {
        name: 'Luis Caputo', dates: '1964 – presente',
        facts: [['Cargo', 'Ministro de Economía de Milei (2023-presente)'], ['Cargo previo', 'Ministro de Finanzas y presidente del BCRA bajo Macri (2016-2018)'], ['Apodo', '"Toto"'], ['Rol', 'Arquitecto del ajuste fiscal y el Programa de Estabilización 2023-2024']],
        bio: '<p>Financista e inversor de Wall Street que tiene la peculiaridad de haber sido el arquitecto económico del fin del gobierno de Macri (como presidente del BCRA durante la crisis de 2018) y luego del gobierno de Milei. Bajo Macri instrumentó las políticas de las «Lebac» y la «bicicleta financiera» que derivaron en la corrida cambiaria de 2018. Su designación por Milei generó polémica: ¿cómo podía ser ministro de un gobierno libertario el mismo economista que bajo Macri gestionó el mayor endeudamiento con el FMI de la historia?</p><p>Bajo Milei diseñó el programa de estabilización basado en tres pilares: devaluación inicial abrupta (118%), «déficit cero» innegociable y un esquema de minidevaluaciones (crawling peg). En tiempo récord redujo la inflación del 25,5% mensual (diciembre 2023) a un dígito. Sus críticos señalan que el ajuste se hizo fundamentalmente sobre jubilados y empleados públicos, no sobre la «casta» política que Milei prometió atacar.</p>'
      }
    };

    const BIBLIOGRAPHY = {
      roca: ['Félix Luna, <i>"Soy Roca"</i>', 'Natalio Botana, <i>"El orden conservador"</i>'],
      yrigoyen: ['Félix Luna, <i>"Yrigoyen"</i>', 'David Rock, <i>"El Radicalismo Argentino"</i>'],
      peron: ['Félix Luna, <i>"El 45"</i>', 'Tulio Halperin Donghi, <i>"La democracia de masas"</i>'],
      evita: ['Marysa Navarro, <i>"Evita"</i>', 'Loris Zanatta, <i>"Eva Perón. Una biografía política"</i>'],
      videla: ['Pilar Calveiro, <i>"Poder y desaparición"</i>', 'Marcos Novaro, <i>"Historia de la Argentina 1955-2010"</i>'],
      alfonsin: ['Pablo Gerchunoff, <i>"El eslabón perdido"</i>', 'Juan Carlos Torre, <i>"Diario de una ilusión"</i>'],
      menem: ['Marcos Novaro, <i>"Historia de la Argentina 1955-2010"</i>', 'Domingo Cavallo, <i>"El peso de la verdad"</i>'],
      default: ['Tulio Halperin Donghi, <i>"Historia contemporánea de Argentina"</i>', 'Loris Zanatta, <i>"Historia de América Latina"</i>']
    };

    function openBio(key) {
      const b = BIOS[key];
      if (!b) return;
      document.getElementById('bm-name').textContent = b.name;
      document.getElementById('bm-dates').textContent = b.dates;
      
      let factsHtml = b.facts.map(([k, v]) =>
        `<div class="bio-fact-row"><span class="bio-fact-key">${k}</span><span class="bio-fact-val">${v}</span></div>`
      ).join('');

      const sources = b.sources || BIBLIOGRAPHY[key] || BIBLIOGRAPHY.default;
      factsHtml += `
        <div class="bio-sources" style="margin-top:16px; padding-top:12px; border-top:1px dashed var(--border);">
          <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;font-weight:bold;">📚 Fuentes Recomendadas</div>
          <ul style="margin:0;padding-left:16px;color:var(--text-muted);font-size:13px;line-height:1.4;">
            ${sources.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      `;

      if (b.img) {
        factsHtml = `
          <div style="display:flex; gap:20px; align-items: flex-start; margin-bottom: 20px;">
            <img src="${b.img}" style="width:120px; height:150px; object-fit:cover; border-radius:8px; border:1px solid var(--border-light); background:var(--surface2);" alt="${b.name}">
            <div style="flex:1;">${factsHtml}</div>
          </div>
        `;
      }

      document.getElementById('bm-facts').innerHTML = factsHtml;
      document.getElementById('bm-bio').innerHTML = b.bio;
      document.getElementById('bio-modal').classList.add('open');
    }
    function closeBioModal() { document.getElementById('bio-modal').classList.remove('open'); }

    function autoLinkBios() {
      const container = document.body;
      const termCounts = {}; // Track links per term
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = p.tagName.toLowerCase();
          if (['script', 'style', 'nav', 'button', 'h1', 'h2', 'h3', 'a'].includes(tag)) return NodeFilter.FILTER_REJECT;
          // Exclusive check for sidebar and other UI elements
          if (p.closest('#sidebar') || p.closest('.bio-modal') || p.closest('.navbar') || p.closest('.bio-card') || p.closest('.timeline-bar')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      const entries = Object.entries(BIOS).map(([k, v]) => ({ k, t: v.name }));
      const extra = [
        { k: 'peron', t: 'Juan Domingo Perón' }, { k: 'peron', t: 'Perón' },
        { k: 'evita', t: 'Eva Perón' }, { k: 'evita', t: 'Evita' },
        { k: 'alfonsin', t: 'Raúl Alfonsín' }, { k: 'alfonsin', t: 'Alfonsín' },
        { k: 'menem', t: 'Carlos Menem' }, { k: 'menem', t: 'Menem' },
        { k: 'cavallo', t: 'Domingo Cavallo' }, { k: 'cavallo', t: 'Cavallo' },
        { k: 'milei', t: 'Javier Milei' }, { k: 'milei', t: 'Milei' },
        { k: 'macri', t: 'Mauricio Macri' }, { k: 'macri', t: 'Macri' },
        { k: 'videla', t: 'Jorge Rafael Videla' }, { k: 'videla', t: 'Videla' },
        { k: 'roca', t: 'Julio Argentino Roca' }, { k: 'roca', t: 'Julio A. Roca' }, { k: 'roca', t: 'Roca' },
        { k: 'yrigoyen', t: 'Hipólito Yrigoyen' }, { k: 'yrigoyen', t: 'Yrigoyen' },
        { k: 'kirchner', t: 'Néstor Kirchner' }, { k: 'kirchner', t: 'Néstor' },
        { k: 'cfk', t: 'Cristina Fernández de Kirchner' }, { k: 'cfk', t: 'Cristina Kirchner' }, { k: 'cfk', t: 'Cristina' },
        { k: 'peronismo', t: 'Peronismo' }, { k: 'peronismo', t: 'peronismo' },
        { k: 'thatcher', t: 'Margaret Thatcher' }, { k: 'thatcher', t: 'Thatcher' }
      ];
      const terms = [...entries.map(e => ({ k: e.k, t: e.t })), ...extra].sort((a, b) => b.t.length - a.t.length);

      nodes.forEach(node => {
        let text = node.nodeValue;
        let hasMatch = false;
        const found = [];

        terms.forEach((term, idx) => {
          // Only link if we haven't reached the limit for this key
          if ((termCounts[term.k] || 0) >= 2) return; 

          const regex = new RegExp(`\\b${term.t}\\b`, 'g');
          if (regex.test(text)) {
            text = text.replace(regex, (match) => {
              if ((termCounts[term.k] || 0) >= 2) return match; // Double check during replacement
              hasMatch = true;
              termCounts[term.k] = (termCounts[term.k] || 0) + 1;
              const pid = `##BIO_${idx}_${found.length}##`;
              found.push({ id: pid, content: `<span class="inline-bio-link" onclick="openBio('${term.k}')">${match}</span>` });
              return pid;
            });
          }
        });

        if (hasMatch) {
          found.forEach(f => { text = text.replace(f.id, f.content); });
          const frag = document.createRange().createContextualFragment(text);
          node.parentNode.replaceChild(frag, node);
        }
      });
    }

    function autoLinkGlosario() {
      const container = document.body;
      const termCounts = {}; // Limit repeats for glossary terms too to avoid clutter (max 2)
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = p.tagName.toLowerCase();
          // Exclude script, style, ui elements, and existing spans/strongs to prevent double wrapping
          if (['script', 'style', 'nav', 'button', 'h1', 'h2', 'h3', 'a', 'span', 'strong', 'mark'].includes(tag)) return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute('data-term')) return NodeFilter.FILTER_REJECT;
          if (p.closest('#sidebar') || p.closest('.bio-modal') || p.closest('.navbar') || p.closest('.bio-card') || p.closest('.timeline-bar')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      const terms = [
        { k: 'latifundio', t: 'latifundio' }, { k: 'latifundio', t: 'Latifundio' },
        { k: 'convertibilidad', t: 'Convertibilidad' },
        { k: 'corralito', t: 'Corralito' },
        { k: 'cepo', t: 'Cepo cambiario' }, { k: 'cepo', t: 'cepo cambiario' }, { k: 'cepo', t: 'cepo' },
        { k: 'stop-and-go', t: 'stop-and-go' }, { k: 'stop-and-go', t: 'Stop-and-Go' },
        { k: 'índice de abuelidad', t: 'Índice de Abuelidad' },
        { k: 'clientelismo', t: 'Clientelismo' }, { k: 'clientelismo', t: 'clientelismo' },
        { k: 'isi', t: 'Sustitución de Importaciones' }, { k: 'isi', t: 'ISI' },
        { k: 'deficit-cuasifiscal', t: 'déficit cuasifiscal' }, { k: 'deficit-cuasifiscal', t: 'Déficit Cuasifiscal' },
        { k: 'balanza-pagos', t: 'balanza de pagos' }, { k: 'balanza-pagos', t: 'Balanza de Pagos' }, { k: 'hegemonia', t: 'hegemonía' }, { k: 'hegemonia', t: 'Hegemonía' },
        { k: 'bipartidismo', t: 'bipartidismo' }, { k: 'bipartidismo', t: 'Bipartidismo' }
      ].sort((a, b) => b.t.length - a.t.length);

      nodes.forEach(node => {
        let text = node.nodeValue;
        let hasMatch = false;
        const found = [];

        terms.forEach((term, idx) => {
          if ((termCounts[term.k] || 0) >= 3) return; // allows up to 3 occurrences per section/document for glossary
          
          const regex = new RegExp(`\\b${term.t}\\b`, 'g');
          if (regex.test(text)) {
            text = text.replace(regex, (match) => {
              if ((termCounts[term.k] || 0) >= 3) return match;
              hasMatch = true;
              termCounts[term.k] = (termCounts[term.k] || 0) + 1;
              const pid = `##GLOS_${idx}_${found.length}##`;
              found.push({ id: pid, content: `<strong data-term="${term.k}" style="cursor:help;color:var(--text);border-bottom:1px dotted var(--text-muted);">${match}</strong>` });
              return pid;
            });
          }
        });

        if (hasMatch) {
          found.forEach(f => { text = text.replace(f.id, f.content); });
          const frag = document.createRange().createContextualFragment(text);
          node.parentNode.replaceChild(frag, node);
        }
      });
    }

    // ── FEAT 7: LÍNEA DE TIEMPO HORIZONTAL ──
    const TL_EVENTS = [
      { year: '1879', label: 'Campaña\nDesierto', section: 'campania' },
      { year: '1912', label: 'Ley Sáenz\nPeña', section: 'saenzpena' },
      { year: '1918', label: 'Reforma\nUniversitaria', section: 'reforma1918' },
      { year: '1930', label: 'Primer\nGolpe', section: 'infame', world: true },
      { year: '1943', label: 'Peronismo\nnace', section: 'peronismo' },
      { year: '1955', label: 'Golpe\nantiperón', section: 'inestabilidad', world: true },
      { year: '1969', label: 'Cordobazo', section: 'cordobazo' },
      { year: '1973', label: 'Regreso\nPerón', section: 'inestabilidad' },
      { year: '1976', label: 'Dictadura', section: 'dictadura', world: true },
      { year: '1982', label: 'Malvinas', section: 'malvinas' },
      { year: '1983', label: 'Democracia', section: 'crisis2001' },
      { year: '1985', label: 'Juicio\nJuntas', section: 'juiciojuntas' },
      { year: '1989', label: 'Hiperinf.', section: 'crisis2001' },
      { year: '2001', label: 'Crisis\n2001', section: 'crisis2001', world: true },
      { year: '2003', label: 'Kirchner', section: 'kirchner' },
      { year: '2007', label: 'CFK', section: 'cfk' },
      { year: '2015', label: 'Macri', section: 'macri' },
      { year: '2019', label: 'Alberto\nF.', section: 'alberto' },
      { year: '2023', label: 'Milei', section: 'milei' },
    ];

    function buildTimeline() {
      const track = document.getElementById('tl-track');
      track.innerHTML = TL_EVENTS.map((e, i) =>
        `<div class="tl-node${e.world ? ' tl-world-event' : ''}" id="tln-${i}" onclick="goToSection('${e.section}');setTlActive(${i})">
        <div class="tl-node-dot"></div>
        <div class="tl-node-year">${e.year}</div>
        <div class="tl-node-label">${e.label.replace('\n', '<br>')}</div>
      </div>`
      ).join('');
    }

    function setTlActive(idx) {
      document.querySelectorAll('.tl-node').forEach((n, i) => n.classList.toggle('active', i === idx));
      const activeNode = document.getElementById(`tln-${idx}`);
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    let tlVisible = false;
    function toggleTimeline() {
      const bar = document.getElementById('timeline-bar');
      const btn = document.getElementById('tl-toggle');
      const isVisible = bar.classList.toggle('visible');
      btn.classList.toggle('active', isVisible);
      document.getElementById('main').classList.toggle('has-timeline', isVisible);
      
      if (isVisible && !document.getElementById('tl-track').children.length) buildTimeline();
      if (isVisible) syncTimelineScroll();
    }

    function goToSection(id) {
      if (document.body.classList.contains('focus-mode')) {
        const target = document.getElementById('sec-' + id);
        if (target) {
          const yOffset = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: yOffset, behavior: 'smooth' });
        }
        return;
      }

      const btn = Array.from(document.querySelectorAll('.nav-item')).find(b => b.getAttribute('onclick')?.includes(`'${id}'`));
      if (btn) showSection(id, btn);
      else {
        // Fallback for cases where button might not be found
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById('sec-' + id);
        if (target) {
          target.classList.add('active');
          window.scrollTo(0, 0);
        }
      }
    }

    // ── FEAT 3: ÍNDICE FLOTANTE DINÁMICO ──
    const TOC_MAP = {
      campania: ['Política', 'Territorio', 'Historiografía', 'Mapa Histórico', 'Figuras Clave'],
      saenzpena: ['Política', 'Mecanismos', 'Historiografía'],
      reforma1918: ['El Movimiento', 'Principios', 'Historiografía'],
      pre1930: ['Política', 'Economía', 'Historiografía'],
      infame: ['Política', 'Economía', 'Historiografía'],
      peronismo: ['Política', 'Economía', 'Historiografía'],
      inestabilidad: ['Política', 'Economía', 'Historiografía'],
      dictadura: ['Política', 'Economía', 'Historiografía'],
      cordobazo: ['El Levantamiento', 'Impacto', 'Historiografía'],
      nochelapices: ['Los Hechos', 'Víctimas', 'Legado'],
      abuelas: ['Historia', 'Método Científico', 'Logros'],
      malvinas: ['La Guerra', 'Política', 'Historiografía'],
      juiciojuntas: ['El Proceso', 'Sentencias', 'Legado'],
      crisis2001: ['Política', 'Economía', 'Historiografía'],
      kirchner: ['Política', 'Economía', 'Historiografía'],
      cfk: ['Política', 'Economía', 'Historiografía'],
      macri: ['Política', 'Economía', 'Historiografía'],
      alberto: ['Política', 'Economía', 'Historiografía'],
      milei: ['Política', 'Economía', 'Historiografía'],
      mitos: ['Mitos y Realidades', 'Constantes Históricas'],
      personajes: ['Presidentes', 'Movimientos', 'Internacional', 'Militares y DDHH'],
    };

    function updateFloatingToc(sectionId) {
      const toc = document.getElementById('floating-toc');
      const items = TOC_MAP[sectionId];
      if (!items || items.length < 2) { toc.classList.remove('visible'); return; }
      const sec = document.getElementById('sec-' + sectionId);
      const tabs = sec ? sec.querySelectorAll('.tab-btn') : [];
      document.getElementById('ftoc-items').innerHTML = items.map((label, i) =>
        `<div class="ftoc-item${i === 0 ? ' active' : ''}" onclick="clickFtocItem('${sectionId}',${i},this)">${label}</div>`
      ).join('');
      toc.classList.add('visible');
    }

    function clickFtocItem(sectionId, idx, el) {
      const sec = document.getElementById('sec-' + sectionId);
      const tabs = sec?.querySelectorAll('.tab-btn');
      if (tabs && tabs[idx]) tabs[idx].click();
      document.querySelectorAll('.ftoc-item').forEach((f, i) => f.classList.toggle('active', i === idx));
    }

    // ── FEAT 9: MODO LECTURA ──
    let lastActiveSectionFocus = null;

    function toggleFocus() {
      // Asegurarnos de que el timeline exista incluso si el evento DOMContentLoaded falló
      if (!document.getElementById('tl-track').children.length) {
         if (typeof buildTimeline === 'function') buildTimeline();
      }

      const isEntering = !document.body.classList.contains('focus-mode');
      
      if (isEntering) {
         const activeSec = document.querySelector('.section.active');
         if (activeSec) lastActiveSectionFocus = activeSec.id;
      }
      
      document.body.classList.toggle('focus-mode');
      const on = document.body.classList.contains('focus-mode');
      
      if (on && lastActiveSectionFocus) {
         setTimeout(() => {
            const target = document.getElementById(lastActiveSectionFocus);
            if (target) {
               target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
         }, 10);
      } else if (!on) {
         let currentVisibleId = lastActiveSectionFocus;
         const tlActiveNode = document.querySelector('.tl-node.active');
         if (tlActiveNode) {
            const idx = parseInt(tlActiveNode.id.replace('tln-',''));
            if (!isNaN(idx) && TL_EVENTS[idx]) {
               currentVisibleId = 'sec-' + TL_EVENTS[idx].section;
            }
         }
         
         const secId = currentVisibleId ? currentVisibleId.replace('sec-', '') : null;
         if (secId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            
            const target = document.getElementById('sec-' + secId);
            if (target) target.classList.add('active');
            
            const btn = Array.from(document.querySelectorAll('.nav-item')).find(b => b.getAttribute('onclick')?.includes(`'${secId}'`));
            if (btn) btn.classList.add('active');
            
            window.scrollTo(0,0);
         }
      }
    }

    // ── FEAT 10: MOBILE MENU ──
    function toggleOffcanvasMenu() {
      const menu = document.getElementById('sidebar');
      const overlay = document.getElementById('offcanvas-overlay');
      const btn = document.getElementById('menu-toggle');
      if (!menu || !overlay || !btn) return;
      
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open', !isOpen);
      overlay.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }

    // ── FEAT 11: TRIVIA INTERACTIVA ──
    const TRIVIA_DATA = {
      campania: [
        { q: "¿Qué presidente autorizó el despliegue militar de la Campaña del Desierto?", opts: ["Juan Manuel de Rosas", "Nicolás Avellaneda", "Julio A. Roca"], correct: 1, explain: "Avellaneda era el presidente en 1879. Roca era su Ministro de Guerra que ejecutó la orden." },
        { q: "¿Cómo se llamó la línea defensiva anterior a la ofensiva de Roca?", opts: ["Línea Sur", "Zanja de Alsina", "Fuerte Argentino"], correct: 1, explain: "La Zanja de Alsina era una trinchera diseñada para evitar el paso del ganado robado en los malones." }
      ],
      saenzpena: [
        { q: "¿En qué consistió principalmente la Ley Sáenz Peña?", opts: ["Voto femenino", "El fin de las presidencias constitucionales", "Voto universal masculino, secreto y obligatorio"], correct: 2, explain: "Fue sancionada en 1912 y desarmó el mecanismo del fraude patriótico." },
        { q: "¿Qué candidato fue el primer gran beneficiado por esta ley?", opts: ["Roque Sáenz Peña", "Hipólito Yrigoyen", "Julio A. Roca"], correct: 1, explain: "Yrigoyen, de la UCR, capitalizó el voto libre y ganó en 1916." }
      ],
      reforma1918: [
        { q: "¿Qué reclamo clave exigían los estudiantes de Córdoba?", opts: ["La privatización universitaria", "Autonomía y cogobierno", "Eliminar los exámenes finales"], correct: 1, explain: "Querían democracia interna (cogobierno) e independencia del poder eclesiástico y estatal." },
        { q: "¿Qué famoso manifiesto dio inicio doctrinario al movimiento?", opts: ["El Manifiesto Liminar", "La Carta Abierta de Córdoba", "Bases Universitarias"], correct: 0, explain: "El Manifiesto Liminar, redactado por Deodoro Roca, se dirigió 'a los hombres libres de Sud América'." }
      ],
      pre1930: [
        { q: "¿Cómo se denominó al modelo económico entre 1880 y 1930?", opts: ["Modelo ISI", "Modelo Extractivista Mixto", "Modelo Agroexportador"], correct: 2, explain: "Argentina se integró al mundo vendiendo carnes y cereales y comprando manufacturas." },
        { q: "¿Cuál fue el principal socio comercial argentino de esa época?", opts: ["Estados Unidos", "Gran Bretaña", "España"], correct: 1, explain: "El Imperio Británico dominaba los ferrocarriles y compraba casi toda la producción." },
        { q: "¿Qué partido político llegó por primera vez al poder en 1916 mediante el voto secreto?", opts: ["Partido Autonomista Nacional", "Unión Cívica Radical", "Partido Socialista"], correct: 1, explain: "La UCR con Hipólito Yrigoyen lideró el primer gobierno democrático de masas gracias a la Ley Sáenz Peña." }
      ],
      infame: [
        { q: "¿Qué es el Pacto Roca-Runciman?", opts: ["Un acuerdo para no limitar compras a Inglaterra y entregar los transportes", "Un tratado de paz con Gran Bretaña por la Antártida", "Un plan de fomento a la industria nacional"], correct: 0, explain: "Se le llamó 'estatuto legal del coloniaje' por las fuertes concesiones a los británicos." },
        { q: "¿Qué significa las siglas ISI, modelo nacido en esta época?", opts: ["Impuesto a los Servicios Industriales", "Industrialización por Sustitución de Importaciones", "Inversión Soberana Independiente"], correct: 1, explain: "Surgió como respuesta de emergencia porque la crisis de 1929 impidió seguir importando bienes." },
        { q: "¿Qué nombre le dio el historiador José Luis Torres a este período inaugurado por el golpe militar?", opts: ["La Revolución Restauradora", "El Modelo Agroexportador", "La Década Infame"], correct: 2, explain: "La llamó así para denunciar la entrega patrimonial, el fraude patriótico sistemático y la corrupción estatal." }
      ],
      peronismo: [
        { q: "¿Qué hecho se conmemora el 17 de octubre de 1945?", opts: ["El nacimiento de Eva Perón", "La liberación de Perón por movilización obrera", "La primera elección ganada por el PJ"], correct: 1, explain: "Miles de trabajadores marcharon a Plaza de Mayo para exigir la libertad del entonces Secretario de Trabajo." },
        { q: "¿A qué porcentaje se acercó la participación asalariada en el PBI (fifty-fifty)?", opts: ["50%", "30%", "70%"], correct: 0, explain: "Para 1954 alcanzó casi el 50%, un nivel de distribución de riqueza inédito." },
        { q: "¿Qué ampliación histórica de derechos civiles se concretó bajo este gobierno en 1947?", opts: ["La abolición del trabajo esclavo", "El voto femenino universal", "El matrimonio civil"], correct: 1, explain: "Impulsado activamente por Eva Perón, permitió que millones de mujeres votaran por primera vez en 1951." }
      ],
      inestabilidad: [
        { q: "¿Qué característica política definió el período 1955-1973?", opts: ["Estabilidad democrática", "Proscripción del peronismo y tutela militar", "Guerras civiles entre provincias"], correct: 1, explain: "El peronismo fue ilegalizado, provocando un empate hegemónico." },
        { q: "¿Qué presidente radical intentó desarrollar la industria petroquímica (Desarrollismo)?", opts: ["Arturo Frondizi", "Arturo Illia", "De la Rúa"], correct: 0, explain: "Frondizi abrió la economía a inversiones directas, aunque su gobierno terminó en otro golpe militar." }
      ],
      dictadura: [
        { q: "¿Qué fue el Proceso de Reorganización Nacional?", opts: ["Un plan de vivienda del 76", "El régimen dictatorial iniciado en 1976", "Un pacto entre Perón y Balbín"], correct: 1, explain: "Fue la dictadura más brutal, que implementó el terrorismo de Estado." },
        { q: "¿Quién lideró la Primera Junta Militar?", opts: ["Aramburu, Rojas, Lonardi", "Galtieri, Anaya, Lami Dozo", "Videla, Massera, Agosti"], correct: 2, explain: "Eran los comandantes del Ejército, Armada y Fuerza Aérea respectivamente." }
      ],
      crisis2001: [
        { q: "¿Cómo se llamó la prohibición de retirar dinero en bancos en 2001?", opts: ["El Corralito", "El Cepo", "Pesificación asimétrica"], correct: 0, explain: "Implementada por el ministro Cavallo y el presidente De la Rúa, detonó el estallido." },
        { q: "¿Qué paridad monetaria rigió en los años 90 hasta la crisis?", opts: ["1 Peso = 1 Dólar (Convertibilidad)", "1 Peso = 10 Dólares", "Tipo de cambio flotante"], correct: 0, explain: "La Convertibilidad eliminó la hiperinflación pero generó un fuerte endeudamiento." }
      ],
      macri: [
        { q: "¿A qué organismo internacional acudió Macri pidiendo un rescate en 2018?", opts: ["Banco Mundial", "FMI", "Club de París"], correct: 1, explain: "Pidió el préstamo stand-by más grande de la historia del FMI." }
      ]
    };

    // ── SCROLL SYNC TIMELINE ──
    function syncTimelineScroll() {
      const sections = document.querySelectorAll('.section');
      const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('sec-', '');
            const tlIdx = typeof TL_EVENTS !== 'undefined' ? TL_EVENTS.findIndex(e => e.section === id) : -1;
            if (tlIdx >= 0) setTlActive(tlIdx);
          }
        });
      }, observerOptions);

      sections.forEach(s => observer.observe(s));
    }

    // ── GLOBAL TRIVIA ──
    const GLOBAL_TRIVIA_DATA = [
      { q: "¿En qué año se sancionó la Ley Sáenz Peña de voto universal y secreto?", opts: ["1880", "1912", "1916", "1930"], correct: 1, explain: "La Ley 8.871 fue impulsada por Roque Sáenz Peña para transparentar el sistema democrático." },
      { q: "¿Quién fue el primer presidente en ser derrocado por un golpe militar en Argentina?", opts: ["Perón", "Yrigoyen", "Frondizi", "Illia"], correct: 1, explain: "Hipólito Yrigoyen fue derrocado el 6 de septiembre de 1930, iniciando el ciclo de intervenciones militares.", image: "img_presidentes/yrigoyen.jpg" },
      { q: "¿Cuál fue el objetivo central del Plan de Convertibilidad (1991)?", opts: ["Fomentar exportaciones", "Frenar la hiperinflación", "Industrializar Tierra del Fuego"], correct: 1, explain: "Domingo Cavallo fijó por ley la paridad 1 a 1 entre el peso y el dólar para estabilizar precios.", image: "14.jpg" },
      { q: "¿Qué hito de derechos civiles se aprobó en 2010?", opts: ["Voto Femenino", "Matrimonio Igualitario", "Ley de Cupo Laboral Trans"], correct: 1, explain: "Argentina fue el primer país de América Latina en legalizar el matrimonio entre personas del mismo sexo." },
      { q: "¿Cuál es la principal característica macroeconómica del gobierno de Javier Milei (2024)?", opts: ["Crecimiento de obra pública", "Déficit Cero / Superávit Fiscal", "Aumento de subsidios energéticos"], correct: 1, explain: "El eje central de su gestión es el equilibrio fiscal total para eliminar la inflación por emisión.", image: "img_presidentes/milei.jpg" },
      { q: "¿Qué presidente fundó Yacimientos Petrolíferos Fiscales (YPF)?", opts: ["Roca", "Yrigoyen", "Alvear", "Perón"], correct: 1, explain: "Bajo la segunda presidencia de Yrigoyen se impulsó la soberanía energética con la creación de YPF." },
      { q: "¿Quién lideró la Campaña del Desierto entre 1879 y 1885?", opts: ["Juan Manuel de Rosas", "Julio A. Roca", "Bartolomé Mitre"], correct: 1, explain: "Julio A. Roca comandó la ofensiva final para expandir la frontera estatal.", image: "img_presidentes/roca.webp" },
      { q: "¿Qué organización de DDHH utiliza el 'Índice de Abuelidad'?", opts: ["Madres de Plaza de Mayo", "Abuelas de Plaza de Mayo", "CELS"], correct: 1, explain: "Abuelas de Plaza de Mayo utiliza la genética para identificar a los nietos robados durante la dictadura." }
    ];

    let globalTriviaState = { 
      currentQ: 0, 
      score: 0, 
      shuffledQuestions: [] 
    };

    function startGlobalTrivia() {
      globalTriviaState.currentQ = 0;
      globalTriviaState.score = 0;
      globalTriviaState.shuffledQuestions = shuffleArray([...GLOBAL_TRIVIA_DATA]);
      renderGlobalTrivia();
    }

    function renderGlobalTrivia() {
      const gContainer = document.getElementById('trivia-global-container');
      if (!gContainer) return;

      if (!globalTriviaState.shuffledQuestions.length) {
        startGlobalTrivia();
        return;
      }

      if (globalTriviaState.currentQ >= globalTriviaState.shuffledQuestions.length) {
        gContainer.innerHTML = `
          <div class="trivia-results">
            <div class="tr-score">Puntaje Final: ${globalTriviaState.score} / ${globalTriviaState.shuffledQuestions.length}</div>
            <p style="color:var(--text-muted); margin-bottom:20px;">${globalTriviaState.score > (globalTriviaState.shuffledQuestions.length/2) ? "¡Excelente nivel de análisis histórico!" : "Buen intento, te sugerimos repasar algunas secciones."}</p>
            <button class="trivia-btn" onclick="startGlobalTrivia()">Reiniciar Evaluación</button>
          </div>
        `;
        return;
      }

      const q = globalTriviaState.shuffledQuestions[globalTriviaState.currentQ];
      
      let mediaHtml = '';
      if (q.image) {
        mediaHtml = `<div class="trivia-media"><img src="${q.image}" alt="Imagen de referencia"></div>`;
      } else if (q.video) {
        mediaHtml = `<div class="trivia-media"><video src="${q.video}" controls></video></div>`;
      }

      const optsHtml = q.opts.map((o, i) => `
        <button class="trivia-opt" onclick="answerGlobalTrivia(${i}, this)">${o}</button>
      `).join('');

      gContainer.innerHTML = `
        <div class="trivia-header">Pregunta ${globalTriviaState.currentQ + 1} de ${globalTriviaState.shuffledQuestions.length}</div>
        ${mediaHtml}
        <div class="trivia-q">${q.q}</div>
        <div class="trivia-opts">${optsHtml}</div>
        <div class="trivia-feedback" id="global-feedback"></div>
      `;
    }

    function answerGlobalTrivia(idx, btn) {
      const q = globalTriviaState.shuffledQuestions[globalTriviaState.currentQ];
      const feedback = document.getElementById('global-feedback');
      const isCorrect = idx === q.correct;
      
      const btns = btn.parentElement.querySelectorAll('.trivia-opt');
      btns.forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct) b.classList.add('correct');
        else if (i === idx) b.classList.add('incorrect');
      });

      if (isCorrect) globalTriviaState.score++;
      
      feedback.innerHTML = `
        <div style="font-weight:bold; color: ${isCorrect ? '#4a9b6a' : '#b34040'}; margin-bottom: 8px;">
          ${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
        </div>
        <div style="font-size:13px; color:var(--text-muted); line-height:1.4; margin-bottom:15px;">${q.explain}</div>
        <button class="trivia-btn" onclick="globalTriviaState.currentQ++; renderGlobalTrivia()">Siguiente</button>
      `;
      feedback.classList.add('show');
    }

    // ── IMAGE ZOOM (LIGHTBOX) ──
    function openImageZoom(src) {
      const overlay = document.getElementById('image-zoom-overlay');
      const img = document.getElementById('zoomed-image');
      img.src = src;
      overlay.classList.add('visible');
    }

    function closeImageZoom() {
      const overlay = document.getElementById('image-zoom-overlay');
      overlay.classList.remove('visible');
    }

    // ── SECTION TRIVIA ──
    let sectionTriviaState = {};

    function startSectionTrivia(sectionId) {
      if (!TRIVIA_DATA[sectionId]) return;
      sectionTriviaState[sectionId] = {
        currentQ: 0,
        score: 0,
        questions: shuffleArray([...TRIVIA_DATA[sectionId]])
      };
      renderSectionTrivia(sectionId);
    }

    function renderSectionTrivia(sectionId) {
      const gContainer = document.getElementById(`trivia-sec-${sectionId}`);
      if (!gContainer) return;
      
      const state = sectionTriviaState[sectionId];
      if (!state) return;

      if (state.currentQ >= state.questions.length) {
        gContainer.innerHTML = `
          <div class="trivia-results">
            <div class="tr-score">Puntaje Final: ${state.score} / ${state.questions.length}</div>
            <p style="color:var(--text-muted); margin-bottom:20px;">${state.score === state.questions.length ? "¡Perfecto!" : "Repasa la sección e inténtalo de nuevo."}</p>
            <button class="trivia-btn" onclick="startSectionTrivia('${sectionId}')">Reintentar</button>
          </div>
        `;
        return;
      }

      const q = state.questions[state.currentQ];
      const optsHtml = q.opts.map((o, i) => `
        <button class="trivia-opt" onclick="answerSectionTrivia('${sectionId}', ${i}, this)">${o}</button>
      `).join('');

      gContainer.innerHTML = `
        <div class="trivia-header">Pregunta ${state.currentQ + 1} de ${state.questions.length}</div>
        <div class="trivia-q">${q.q}</div>
        <div class="trivia-opts">${optsHtml}</div>
        <div class="trivia-feedback" id="feedback-${sectionId}"></div>
      `;
    }

    function answerSectionTrivia(sectionId, idx, btn) {
      const state = sectionTriviaState[sectionId];
      const q = state.questions[state.currentQ];
      const feedback = document.getElementById(`feedback-${sectionId}`);
      const isCorrect = idx === q.correct;
      
      const btns = btn.parentElement.querySelectorAll('.trivia-opt');
      btns.forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct) b.classList.add('correct');
        else if (i === idx) b.classList.add('incorrect');
      });

      if (isCorrect) state.score++;
      
      feedback.innerHTML = `
        <div style="font-weight:bold; color: ${isCorrect ? '#4a9b6a' : '#b34040'}; margin-bottom: 8px;">
          ${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
        </div>
        <div style="font-size:13px; color:var(--text-muted); line-height:1.4; margin-bottom:15px;">${q.explain}</div>
        <button class="trivia-btn" onclick="sectionTriviaState['${sectionId}'].currentQ++; renderSectionTrivia('${sectionId}')">Siguiente</button>
      `;
      feedback.classList.add('show');
    }

    window.addEventListener('scroll', () => {
      // Small debounce could be added here if needed
      if (document.getElementById('timeline-bar').classList.contains('visible')) {
        // Option 1: Intersection Observer handles it automatically via syncTimelineScroll()
      }
    });

    window.addEventListener('DOMContentLoaded', function () {
      buildTimeline(); // Asegurar que el timeline exista incluso si no se abre la sidebar
      
      const firstBtn = document.querySelector('.nav-item');
      if (firstBtn) firstBtn.classList.add('active');
      updateFloatingToc('campania');
      autoLinkBios();
      autoLinkGlosario();
      syncTimelineScroll();

      // Renderizar Trivias Clásicas Automáticamente
      startSectionTrivia('pre1930');
      startSectionTrivia('infame');
      startSectionTrivia('peronismo');

      // Image Loaded & Zoom Handler
      document.querySelectorAll('.section-img, .inline-img').forEach(img => {
        if (img.complete) img.classList.add('loaded');
        else img.addEventListener('load', () => img.classList.add('loaded'));
        
        // Add zoom functionality on click
        img.addEventListener('click', () => {
          if(!img.classList.contains('bio-img')) { // exclude bio modal imgs if needed
              openImageZoom(img.src);
          }
        });
      });
    });
