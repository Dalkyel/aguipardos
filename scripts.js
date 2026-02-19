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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.session').forEach(s => {
    const btn = s.querySelector('.session-toggle');
    const scenes = s.querySelector('.scenes');
    if (!btn || !scenes) return;

    btn.onclick = () => {
      s.classList.toggle('open');
      if (s.classList.contains('open')) {
        scenes.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      } else {
        scenes.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    };
  });
});

// Section dropdown functionality
(() => {
  const headers = document.querySelectorAll('.section-header[data-toggle]');

  headers.forEach(header => {
    const targetId = header.getAttribute('data-toggle');
    const content = document.getElementById(targetId);

    if (!content) return;

    header.classList.add('collapsed');
    content.classList.add('collapsed');
    content.style.maxHeight = '0';

    header.addEventListener('click', () => {
      const isCollapsed = header.classList.contains('collapsed');

      if (isCollapsed) {
        header.classList.remove('collapsed');
        content.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        header.classList.add('collapsed');
        content.classList.add('collapsed');
        content.style.maxHeight = '0';
      }
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      headers.forEach(header => {
        const targetId = header.getAttribute('data-toggle');
        const content = document.getElementById(targetId);
        if (content && !content.classList.contains('collapsed')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }, 150);
  });
})();

// Character filter functionality for events.html
(() => {
  const select = document.getElementById('character-select');
  if (!select) return;

  const characterNames = {
    noah: ['Noah', 'Mystra', 'Spelljammer'],
    veldor: ['Veldor', 'Feywild', 'Isha', 'Teodore', 'Astor', 'Ashton'],
    nalare: ['Nalare', 'Amaunator'],
    dalkyel: ['Dalkyel', 'Orken', 'Orion'],
    drakothar: ['Drakothar', 'Parthurnax'],
    grandal: ['Grandal', 'Glutonian']
  };

  const originalContent = new Map();
  const paragraphs = document.querySelectorAll('.scene-text p');

  paragraphs.forEach(p => {
    originalContent.set(p, p.innerHTML);
  });

  function highlightCharacter(character) {
    const scenes = document.querySelectorAll('.scene');

    scenes.forEach(scene => {
      const sceneText = scene.querySelector('.scene-text');
      if (!sceneText) return;

      const original = sceneText.textContent;

      if (character === 'all') {
        scene.style.display = '';
        sceneText.querySelectorAll('p').forEach(p => {
          p.innerHTML = originalContent.get(p);
        });
        return;
      }

      const names = characterNames[character] || [];
      const found = names.some(name => {
        const regex = new RegExp(`\\b${name}\\b`, 'i');
        return regex.test(original);
      });

      if (found) {
        scene.style.display = '';
        sceneText.querySelectorAll('p').forEach(p => {
          let html = originalContent.get(p);
          names.forEach(name => {
            const regex = new RegExp(`(\\b${name}\\b)`, 'gi');
            html = html.replace(regex, '<mark class="char-highlight">$1</mark>');
          });
          p.innerHTML = html;
        });
        
        const session = scene.closest('.session');
        if (session && !session.classList.contains('open')) {
          const btn = session.querySelector('.session-toggle');
          const scenes = session.querySelector('.scenes');
          if (btn && scenes) {
            session.classList.add('open');
            scenes.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
          }
        }
      } else {
        scene.style.display = 'none';
      }
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

      const section = card.closest('.section-content');
      if (section && !section.classList.contains('collapsed')) {
        setTimeout(() => {
          section.style.maxHeight = section.scrollHeight + 'px';
        }, 10);
      }
    });
  });
})();
