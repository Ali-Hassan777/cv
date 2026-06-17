/* ============================================================
   script.js — Ali Hassan Galaxy CV
   Professional. Cinematic. Unforgettable.
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════
   1. GALAXY CANVAS — animated star field on hero
   ══════════════════════════════════════════════ */
(function initGalaxy() {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:1;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars, nebulae, shootingStars;

  const COLORS = ['#ffffff','#b8b3f0','#7f77dd','#1d9e75','#a8d8ea'];

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    initParticles();
  }

  function initParticles() {
    /* Stars */
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.12 + 0.03,
      opacity: Math.random() * 0.7 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.02 + 0.005,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    /* Nebula blobs */
    nebulae = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 180 + 80,
      hue: Math.random() > 0.5 ? '127,119,221' : '29,158,117',
      opacity: Math.random() * 0.06 + 0.02,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
    }));

    /* Shooting stars */
    shootingStars = [];
  }

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 5,
      opacity: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      life: 0,
      maxLife: Math.random() * 40 + 30,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Nebulae */
    nebulae.forEach(n => {
      n.x += n.dx; n.y += n.dy;
      if (n.x < -n.r) n.x = W + n.r;
      if (n.x > W + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = H + n.r;
      if (n.y > H + n.r) n.y = -n.r;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `rgba(${n.hue},${n.opacity})`);
      g.addColorStop(1, `rgba(${n.hue},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* Stars */
    stars.forEach(s => {
      s.flicker += s.flickerSpeed;
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.flicker));
      /* Glow */
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      glow.addColorStop(0, s.color.replace(')', `,${alpha})`).replace('rgb','rgba'));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();
      /* Core */
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    /* Shooting stars */
    if (frame % 180 === 0) spawnShootingStar();
    shootingStars = shootingStars.filter(s => s.life < s.maxLife);
    shootingStars.forEach(s => {
      s.life++;
      const progress = s.life / s.maxLife;
      const alpha = Math.sin(progress * Math.PI);
      const sx = s.x + Math.cos(s.angle) * s.speed * s.life;
      const sy = s.y + Math.sin(s.angle) * s.speed * s.life;
      const ex = sx - Math.cos(s.angle) * s.len;
      const ey = sy - Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(ex, ey, sx, sy);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(1, `rgba(255,255,255,${alpha * 0.9})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    });

    frame++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();


/* ══════════════════════════════════════════════
   2. MOUSE PARALLAX — stars react to cursor
   ══════════════════════════════════════════════ */
(function initParallax() {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 18;
    my = (e.clientY / window.innerHeight - 0.5) * 18;
  }, { passive: true });

  const heroContent = hero.querySelector('.hero-content');
  const orbs = hero.querySelectorAll('.orb');

  function tick() {
    if (heroContent) {
      heroContent.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
    }
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.6;
      orb.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ══════════════════════════════════════════════
   3. CINEMATIC TYPEWRITER — hero name
   ══════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('hero-name');
  if (!el) return;

  const text = el.textContent.trim();
  el.textContent = '';
  el.style.cssText += `
    border-right: 3px solid rgba(127,119,221,0.8);
    display: inline-block;
    min-height: 1.2em;
  `;

  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, i === 1 ? 600 : 80 + Math.random() * 40);
    } else {
      el.style.animation = 'cursorBlink 1s step-end infinite';
      const s = document.createElement('style');
      s.textContent = `@keyframes cursorBlink{0%,100%{border-color:rgba(127,119,221,0.8)}50%{border-color:transparent}}`;
      document.head.appendChild(s);
      setTimeout(() => { el.style.borderRight = 'none'; el.style.animation = ''; }, 3200);
    }
  }
  setTimeout(type, 800);
})();


/* ══════════════════════════════════════════════
   4. SCROLL REVEAL — staggered fade-in
   ══════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════
   5. SKILL BARS — animate on scroll
   ══════════════════════════════════════════════ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.width || e.target.style.width;
        e.target.style.width = '0%';
        requestAnimationFrame(() => {
          setTimeout(() => { e.target.style.width = target; }, 150);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => {
    if (f.dataset.width) f.style.width = '0%';
    obs.observe(f);
  });
})();


/* ══════════════════════════════════════════════
   6. GPA COUNTER — counts up cinematically
   ══════════════════════════════════════════════ */
(function initGPACounter() {
  const badge = document.querySelector('.gpa-badge');
  if (!badge) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);

      const numSpan = document.createElement('span');
      badge.innerHTML = '';
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-star';
      badge.appendChild(icon);
      badge.appendChild(document.createTextNode(' GPA '));
      badge.appendChild(numSpan);
      badge.appendChild(document.createTextNode(' / 4.0'));

      const target = 3.0;
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        numSpan.textContent = (ease * target).toFixed(1);
        if (t < 1) requestAnimationFrame(update);
        else numSpan.textContent = target.toFixed(1);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.6 });
  obs.observe(badge);
})();


/* ══════════════════════════════════════════════
   7. ACTIVE NAV — highlights on scroll
   ══════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.hero-nav a, .nav-list__link');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => {
          l.classList.remove('nav-list__link--active');
          l.style.background = '';
          l.style.borderColor = '';
          l.style.color = '';
        });
        const id = entry.target.id;
        links.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('nav-list__link--active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
})();


/* ══════════════════════════════════════════════
   8. SMOOTH SCROLL
   ══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════════════
   9. DARK MODE TOGGLE — with localStorage
   ══════════════════════════════════════════════ */
(function initDarkMode() {
  const btn = document.getElementById('btn-dark');
  if (!btn) return;

  let dark = localStorage.getItem('cvDark') === 'true';

  function apply() {
    document.body.classList.toggle('dark', dark);
    btn.innerHTML = dark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    btn.style.background = dark ? '#7f77dd' : '#1a1a2e';
    localStorage.setItem('cvDark', dark);
  }

  apply();
  btn.addEventListener('click', () => { dark = !dark; apply(); });
})();


/* ══════════════════════════════════════════════
   10. SCROLL-TO-TOP BUTTON
   ══════════════════════════════════════════════ */
(function initScrollTop() {
  const btn = document.getElementById('btn-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════════
   11. CURSOR COMET TRAIL
   ══════════════════════════════════════════════ */
(function initCometTrail() {
  const isMobile = window.matchMedia('(max-width:768px)').matches;
  if (isMobile) return;

  const particles = [];
  const MAX = 18;

  const style = document.createElement('style');
  style.textContent = `
    .comet-particle {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transition: opacity 0.4s ease;
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < MAX; i++) {
    const p = document.createElement('div');
    p.className = 'comet-particle';
    const size = (1 - i / MAX) * 10 + 2;
    const hue = i % 3 === 0 ? '#7f77dd' : i % 3 === 1 ? '#b8b3f0' : '#1d9e75';
    p.style.cssText = `
      width:${size}px;height:${size}px;
      background:${hue};
      opacity:0;
    `;
    document.body.appendChild(p);
    particles.push({ el: p, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    particles[0].x = mouseX;
    particles[0].y = mouseY;
    particles[0].el.style.opacity = '0.9';
  }, { passive: true });

  function animateTrail() {
    for (let i = 1; i < MAX; i++) {
      particles[i].x += (particles[i-1].x - particles[i].x) * 0.35;
      particles[i].y += (particles[i-1].y - particles[i].y) * 0.35;
      particles[i].el.style.left = (particles[i].x - parseFloat(particles[i].el.style.width) / 2) + 'px';
      particles[i].el.style.top  = (particles[i].y - parseFloat(particles[i].el.style.height) / 2) + 'px';
      particles[i].el.style.opacity = String((1 - i / MAX) * 0.7);
    }
    particles[0].el.style.left = (particles[0].x - 5) + 'px';
    particles[0].el.style.top  = (particles[0].y - 5) + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();


/* ══════════════════════════════════════════════
   12. MAGNETIC BUTTONS — nav pills snap to cursor
   ══════════════════════════════════════════════ */
(function initMagneticButtons() {
  const isMobile = window.matchMedia('(max-width:768px)').matches;
  if (isMobile) return;

  document.querySelectorAll('.hero-nav a, .badge, .soft-badge').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* ══════════════════════════════════════════════
   13. SECTION HOVER RIPPLE
   ══════════════════════════════════════════════ */
(function initRipple() {
  document.querySelectorAll('section').forEach(sec => {
    sec.style.position = 'relative';
    sec.style.overflow = 'hidden';

    sec.addEventListener('click', e => {
      const rect = sec.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        left:${x}px;top:${y}px;
        width:0;height:0;
        border-radius:50%;
        background:rgba(127,119,221,0.12);
        transform:translate(-50%,-50%);
        animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;z-index:0;
      `;
      sec.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rs = document.createElement('style');
  rs.textContent = `
    @keyframes rippleAnim {
      to { width:400px;height:400px;opacity:0; }
    }
  `;
  document.head.appendChild(rs);
})();


/* ══════════════════════════════════════════════
   14. PAGE LOAD ENTRANCE — cinematic fade in
   ══════════════════════════════════════════════ */
(function initEntrance() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';
  window.addEventListener('load', () => {
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
  });
})();


/* ══════════════════════════════════════════════
   15. AVAILABLE PILL — ping ring animation
   ══════════════════════════════════════════════ */
(function initPillPing() {
  const pill = document.querySelector('.available-pill');
  if (!pill) return;

  pill.style.transition = 'box-shadow 0.4s ease';
  setInterval(() => {
    pill.style.boxShadow = '0 0 0 6px rgba(29,158,117,0.15)';
    setTimeout(() => { pill.style.boxShadow = '0 0 0 0px rgba(29,158,117,0)'; }, 600);
  }, 2800);
})();


/* ══════════════════════════════════════════════
   16. CONTACT ITEMS — slide-in on hover
   ══════════════════════════════════════════════ */
(function initContactHover() {
  document.querySelectorAll('.contact-item').forEach(item => {
    item.style.transition = 'transform 0.25s ease, background 0.25s ease';
    item.style.borderRadius = '8px';
    item.style.padding = '9px 8px';
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(6px)';
      item.style.background = 'rgba(127,119,221,0.05)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.background = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   17. CONSOLE EASTER EGG
   ══════════════════════════════════════════════ */
(function consoleEasterEgg() {
  const art = `
%c
  ██╗  ██╗ █████╗ ███████╗███████╗ █████╗ ███╗  ██╗
  ██║  ██║██╔══██╗██╔════╝██╔════╝██╔══██╗████╗ ██║
  ███████║███████║███████╗███████╗███████║██╔██╗██║
  ██╔══██║██╔══██║╚════██║╚════██║██╔══██║██║╚████║
  ██║  ██║██║  ██║███████║███████║██║  ██║██║ ╚███║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚══╝
`;
  console.log(art, 'color:#7f77dd;font-family:monospace;font-size:10px');
  console.log('%c👋 Hi recruiter! This CV was hand-coded with love.', 'color:#1d9e75;font-size:14px;font-weight:bold');
  console.log('%c📧 alihassan76118@gmail.com', 'color:#b8b3f0;font-size:13px');
  console.log('%c🚀 Open to opportunities in software development', 'color:#888;font-size:12px');
})();
