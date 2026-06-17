/* ============================================================
   script.js — Ali Hassan CV  |  All features, zero libraries
   ============================================================ */

/* ── 1. SKILL BARS — animate on scroll ── */
const skillFills = document.querySelectorAll('.skill-bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.style.width;   // e.g. "80%"
      fill.style.width = '0%';
      setTimeout(() => { fill.style.width = target; }, 100);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* ── 2. SCROLL REVEAL — sections fade + slide up ── */
const style = document.createElement('style');
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

document.querySelectorAll('section, .timeline-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.07}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 3. ACTIVE NAV LINK — updates on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list__link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('nav-list__link--active'));
      const active = document.querySelector(`.nav-list__link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-list__link--active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));


/* ── 4. TYPEWRITER — hero title effect ── */
const titleEl = document.querySelector('.header__title');
if (titleEl) {
  const text = titleEl.textContent.trim();
  titleEl.textContent = '';
  titleEl.style.borderRight = '2px solid rgba(127,119,221,0.8)';
  titleEl.style.display = 'inline-block';
  titleEl.style.minWidth = '2px';

  let i = 0;
  const type = () => {
    if (i < text.length) {
      titleEl.textContent += text[i++];
      setTimeout(type, 80);
    } else {
      // Remove cursor blink after done
      setTimeout(() => { titleEl.style.borderRight = 'none'; }, 1200);
    }
  };
  setTimeout(type, 400);
}


/* ── 5. COUNTER ANIMATION — GPA number counts up ── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(1);
  };
  requestAnimationFrame(update);
}

const gpaBadge = document.querySelector('.gpa-badge');
if (gpaBadge) {
  const gpaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = document.createElement('span');
        numEl.textContent = '0.0';
        gpaBadge.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-star';
        gpaBadge.appendChild(icon);
        gpaBadge.appendChild(document.createTextNode(' GPA '));
        gpaBadge.appendChild(numEl);
        gpaBadge.appendChild(document.createTextNode(' / 4.0'));
        animateCounter(numEl, 3.0, 1200);
        gpaObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  gpaObserver.observe(gpaBadge);
}


/* ── 6. SMOOTH SCROLL — for nav links ── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 7. DARK MODE TOGGLE ── */
const toggle = document.createElement('button');
toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
toggle.title = 'Toggle dark mode';
toggle.style.cssText = `
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: #1a1a2e; color: #fff;
  border: 1px solid rgba(127,119,221,0.4);
  font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
`;
toggle.addEventListener('mouseenter', () => toggle.style.transform = 'scale(1.1)');
toggle.addEventListener('mouseleave', () => toggle.style.transform = 'scale(1)');
document.body.appendChild(toggle);

const darkStyle = document.createElement('style');
darkStyle.id = 'dark-mode-style';
darkStyle.textContent = `
  body.dark { background-color: #0f0f1a !important; color: #ccc !important; }
  body.dark section { background: #1a1a2e !important; border-color: rgba(255,255,255,0.07) !important; box-shadow: none !important; }
  body.dark section h2 { border-bottom-color: rgba(255,255,255,0.08) !important; }
  body.dark .timeline-org { color: #ddd !important; }
  body.dark section p, body.dark section li { color: #aaa !important; }
  body.dark .skill-bar-track { background: #2a2a3e !important; }
  body.dark .lang-row { border-bottom-color: rgba(255,255,255,0.07) !important; color: #bbb !important; }
  body.dark .contact-item { border-bottom-color: rgba(255,255,255,0.06) !important; color: #aaa !important; }
  body.dark .dot.off { background: #3a3a5c !important; }
  body.dark .timeline-dot { border-color: #0f0f1a !important; }
  body.dark .skill-bar-label { color: #aaa !important; }
  body.dark .gpa-badge { background: rgba(127,119,221,0.15) !important; }
`;
document.head.appendChild(darkStyle);

let isDark = false;
toggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  toggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  toggle.style.background = isDark ? '#7f77dd' : '#1a1a2e';
  localStorage.setItem('cvDarkMode', isDark);
});

// Remember preference
if (localStorage.getItem('cvDarkMode') === 'true') toggle.click();


/* ── 8. SCROLL-TO-TOP BUTTON ── */
const topBtn = document.createElement('button');
topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
topBtn.title = 'Back to top';
topBtn.style.cssText = `
  position: fixed; bottom: 5rem; right: 1.5rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: #7f77dd; color: #fff;
  border: none; font-size: 1rem; cursor: pointer;
  display: none; align-items: center; justify-content: center;
  z-index: 9999;
  transition: opacity 0.3s, transform 0.2s;
  box-shadow: 0 4px 15px rgba(127,119,221,0.35);
`;
topBtn.addEventListener('mouseenter', () => topBtn.style.transform = 'scale(1.1)');
topBtn.addEventListener('mouseleave', () => topBtn.style.transform = 'scale(1)');
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    topBtn.style.display = 'flex';
  } else {
    topBtn.style.display = 'none';
  }
}, { passive: true });


/* ── 9. BADGE HOVER LIFT ── */
document.querySelectorAll('.badge').forEach(badge => {
  badge.style.transition = 'transform 0.2s, box-shadow 0.2s';
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'translateY(-2px)';
    badge.style.boxShadow = '0 4px 12px rgba(127,119,221,0.25)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'translateY(0)';
    badge.style.boxShadow = 'none';
  });
});


/* ── 10. AVAILABLE PILL — random "ping" effect ── */
const pill = document.querySelector('.available-pill');
if (pill) {
  setInterval(() => {
    pill.style.boxShadow = '0 0 0 4px rgba(29,158,117,0.15)';
    setTimeout(() => { pill.style.boxShadow = 'none'; }, 600);
  }, 3000);
}
