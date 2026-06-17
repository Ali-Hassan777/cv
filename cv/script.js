'use strict';

/**
 * UTILITIES
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Universal Error Handler
function safeExecute(fn, name) {
    try {
        fn();
    } catch (e) {
        console.error(`[CV Init Error] ${name}:`, e);
    }
}

/* ══════════════════════════════════════════════
   1. GALAXY CANVAS (Optimized)
   ══════════════════════════════════════════════ */
safeExecute(() => {
    if (prefersReducedMotion) return;
    
    const hero = document.querySelector('.page-hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;`;
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;
    let stars = [], nebulae = [], shootingStars = [];
    const COLORS = ['#ffffff','#b8b3f0','#7f77dd','#1d9e75'];

    function resize() {
        W = canvas.width = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
        // Re-initialize particles on resize
        stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.1 + 0.02
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            s.y -= s.speed;
            if (s.y < 0) s.y = H;
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}, 'Galaxy');


/* ══════════════════════════════════════════════
   2. PERFORMANCE-SAFE ANIMATIONS
   ══════════════════════════════════════════════ */

// 5. SKILL BARS (Refined for smoothness)
safeExecute(() => {
    const fills = document.querySelectorAll('.skill-bar-fill');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fill = e.target;
                fill.style.transition = 'width 2s cubic-bezier(0.16, 1, 0.3, 1)';
                fill.style.width = fill.dataset.width || '80%';
                obs.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });
    
    fills.forEach(f => obs.observe(f));
}, 'SkillBars');

// 11. CURSOR COMET TRAIL (Disabled on touch devices)
safeExecute(() => {
    if ('ontouchstart' in window || prefersReducedMotion) return;

    const MAX = 12; // Reduced particle count for performance
    const particles = Array.from({ length: MAX }, () => {
        const p = document.createElement('div');
        p.className = 'comet-particle';
        p.style.cssText = `position:fixed;width:8px;height:8px;background:#7f77dd;border-radius:50%;pointer-events:none;z-index:9999;opacity:0;`;
        document.body.appendChild(p);
        return { el: p, x: 0, y: 0 };
    });

    document.addEventListener('mousemove', e => {
        particles[0].x = e.clientX;
        particles[0].y = e.clientY;
    });

    function animate() {
        for (let i = MAX - 1; i > 0; i--) {
            particles[i].x += (particles[i - 1].x - particles[i].x) * 0.3;
            particles[i].y += (particles[i - 1].y - particles[i].y) * 0.3;
            particles[i].el.style.left = `${particles[i].x}px`;
            particles[i].el.style.top = `${particles[i].y}px`;
            particles[i].el.style.opacity = (1 - i / MAX) * 0.5;
        }
        requestAnimationFrame(animate);
    }
    animate();
}, 'CometTrail');


/* ══════════════════════════════════════════════
   3. ESSENTIAL FUNCTIONALITY (Keep these)
   ══════════════════════════════════════════════ */

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Entrance Fade-in
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 1s ease';
    document.body.style.opacity = '1';
});

// Console Easter Egg
console.log('%c🚀 CV Loaded Successfully. Built by Ali Hassan.', 'color:#7f77dd; font-weight:bold;');
