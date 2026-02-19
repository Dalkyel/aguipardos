// Portrait Modal functionality for index.html
(() => {
  const modal = document.getElementById('portraitModal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal-backdrop');
  const closeBtn = modal.querySelector('.modal-close');
  const titleEl = document.getElementById('portraitTitle');
  const imgEl = document.getElementById('portraitImg');

  const PORTRAITS = {
    veldor: {
      title: 'Veldor',
      src: 'Veldor.PNG',
      alt: 'Retrato de Veldor'
    },
    noah: {
      title: 'Noah',
      src: 'Noah.PNG',
      alt: 'Retrato de Noah'
    },
    nalare: {
      title: 'Nalare',
      src: 'Nalare.PNG',
      alt: 'Retrato de Nalare'
    },
    dalkyel: {
      title: 'Dalkyel',
      src: 'Dalkyel.png',
      alt: 'Retrato de Dalkyel'
    },
    drakothar: {
      title: 'Drakothar',
      src: 'Drakothar.png',
      alt: 'Retrato de Drakothar'
    },
    grandal: {
      title: 'Grandal Glutonian',
      src: 'Grandal.png',
      alt: 'Retrato de Grandal Glutonian'
    }
  };

  let lastFocus = null;

  function openPortrait(key){
    const p = PORTRAITS[key];
    if (!p) return;

    lastFocus = document.activeElement;

    titleEl.textContent = p.title;
    imgEl.src = p.src;
    imgEl.alt = p.alt;

    modal.showModal();
    modal.classList.add('open');

    closeBtn.focus({ preventScroll: true });
  }

  function closePortrait(){
    modal.close();
    modal.classList.remove('open');

    imgEl.src = '';
    imgEl.alt = '';

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
    lastFocus = null;
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.portrait-btn');
    if (btn) {
      const key = btn.getAttribute('data-portrait');
      openPortrait(key);
      return;
    }
    if (modal.classList.contains('open')) {
      const wantsClose = e.target === backdrop || e.target.closest('[data-close="1"]') || e.target === closeBtn;
      if (wantsClose) closePortrait();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePortrait();
    }
  });

  imgEl.addEventListener('error', () => {
    titleEl.textContent = 'Retrato (no disponible)';
  });

})();

// Session toggle functionality for events.html
(() => {
  const sessions = Array.from(document.querySelectorAll('.session[id]'));
  const byId = new Map(sessions.map(s => [s.id, s]));

  function setOpen(session, open) {
    session.classList.toggle('open', open);
    const btn = session.querySelector('button.session-toggle');
    const scenes = session.querySelector('.scenes');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (scenes) {
      if (open) scenes.removeAttribute('hidden');
      else scenes.setAttribute('hidden', '');
    }
  }

  function toggleSession(session) {
    const isOpen = session.classList.contains('open');
    setOpen(session, !isOpen);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button.session-toggle');
    if (!btn) return;
    const id = btn.getAttribute('data-target');
    const session = id ? byId.get(id) : btn.closest('.session');
    if (session) toggleSession(session);
  });

  function openFromHash() {
    const id = (location.hash || '').replace('#', '');
    if (!id) return;
    const session = byId.get(id);
    if (session) {
      setOpen(session, true);
      session.scrollIntoView({ block: 'start' });
    }
  }

  sessions.forEach(s => setOpen(s, false));
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

// Section dropdown functionality
(() => {
  const headers = document.querySelectorAll('.section-header[data-toggle]');
  
  headers.forEach(header => {
    const targetId = header.getAttribute('data-toggle');
    const content = document.getElementById(targetId);
    
    if (!content) return;
    
    // Start collapsed
    header.classList.add('collapsed');
    content.classList.add('collapsed');
    content.style.maxHeight = '0';
    
    header.addEventListener('click', () => {
      const isCollapsed = header.classList.contains('collapsed');
      
      if (isCollapsed) {
        // Expand
        header.classList.remove('collapsed');
        content.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        // Collapse
        header.classList.add('collapsed');
        content.classList.add('collapsed');
        content.style.maxHeight = '0';
      }
    });
    
    // Update max-height on window resize
    window.addEventListener('resize', () => {
      if (!content.classList.contains('collapsed')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
})();

// Character filter functionality for events.html
(() => {
  const select = document.getElementById('character-select');
  if (!select) return;

  const characterNames = {
    noah: ['Noah'],
    veldor: ['Veldor'],
    nalare: ['Nalare'],
    dalkyel: ['Dalkyel'],
    drakothar: ['Drakothar', 'Parthurnax'],
    grandal: ['Grandal', 'Glutonian']
  };

  function highlightCharacter(character) {
    const scenes = document.querySelectorAll('.scene-text');
    
    scenes.forEach(scene => {
      const paragraphs = scene.querySelectorAll('p');
      
      paragraphs.forEach(p => {
        const originalText = p.textContent;
        
        if (character === 'all') {
          p.innerHTML = originalText;
          return;
        }
        
        const names = characterNames[character] || [];
        let html = originalText;
        
        names.forEach(name => {
          const regex = new RegExp(`(\\b${name}\\b)`, 'gi');
          html = html.replace(regex, '<mark class="char-highlight">$1</mark>');
        });
        
        p.innerHTML = html;
      });
    });
  }

  select.addEventListener('change', (e) => {
    highlightCharacter(e.target.value);
  });
})();

// Character card toggle functionality for index.html
(() => {
  const cards = document.querySelectorAll('.char-card[id]');
  
  cards.forEach(card => {
    const btn = card.querySelector('.char-toggle');
    const bodyId = btn?.getAttribute('aria-controls');
    const body = bodyId ? document.getElementById(bodyId) : null;
    
    if (!btn || !body) return;
    
    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      
      if (isOpen) {
        card.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        body.setAttribute('hidden', '');
      } else {
        card.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        body.removeAttribute('hidden');
      }
      
      // Update parent section max-height
      const section = card.closest('.section-content');
      if (section && !section.classList.contains('collapsed')) {
        setTimeout(() => {
          section.style.maxHeight = section.scrollHeight + 'px';
        }, 10);
      }
    });
  });
})();
