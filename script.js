// Interactividad ligera: revelar sorpresa y imprimir
const revealBtn = document.getElementById('revealBtn');
const printBtn = document.getElementById('printBtn');

function makeHeart(x, y, dx, dy, size, delay) {
    const el = document.createElement('div');
    el.className = 'heart';
    // use emoji content for a softer look
    el.classList.add('emoji');
    el.innerText = '❤️';
    // place relative to the viewport to avoid containment issues
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.willChange = 'transform, opacity';
    el.style.fontSize = Math.max(12, Math.floor(size)) + 'px';
    el.style.opacity = 0;
    // small random seed rotation so hearts look different
    const seedRot = Math.floor((Math.random() - 0.5) * 40);
    el.style.transform = `rotate(45deg) rotate(${seedRot}deg) scale(0.4)`;
    el.style.zIndex = 9999;
    // variable duration for a more natural dispersion
    const dur = 600 + Math.random() * 900; // ms
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transition = `transform ${dur}ms cubic-bezier(.2,.9,.3,1) ${delay}ms, opacity ${dur}ms ${delay}ms`;
        // use translate3d for smoother GPU-accelerated animation
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(45deg) rotate(${seedRot}deg) scale(1)`;
        el.style.opacity = 1;
    });

    // remove after animation finishes
    setTimeout(() => {
        el.style.transition = 'opacity 400ms';
        el.style.opacity = 0;
        setTimeout(() => el.remove(), 500);
    }, dur + delay + 200);
}

function burstHearts() {
    // Try to originate hearts from the hearth image (hearth.jpg) then floating-heart, else fallback to card center
    const imgEl = document.getElementById('hearthImg');
    const floatEl = document.getElementById('heart');
    let cx, cy;
    if (imgEl) {
        const f = imgEl.getBoundingClientRect();
        cx = f.left + f.width / 2 + (Math.random() - 0.5) * 10;
        cy = f.top + f.height / 2 + (Math.random() - 0.5) * 10;
        // pulse the image for feedback
        imgEl.style.animation = 'hearth-pulse .6s ease';
        setTimeout(() => { imgEl.style.animation = ''; }, 700);
    } else if (floatEl) {
        const f = floatEl.getBoundingClientRect();
        cx = f.left + f.width / 2 + (Math.random() - 0.5) * 20; // small jitter
        cy = f.top + f.height / 2 + (Math.random() - 0.5) * 20;
    } else {
        const rect = document.querySelector('.letter-card').getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 3;
    }

    const count = 36; // exact number requested
    for (let i = 0; i < count; i++) {
        // choose a random target position across the viewport for dispersion
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;
        const dx = targetX - cx + (Math.random() - 0.5) * 40;
        const dy = targetY - cy + (Math.random() - 0.5) * 40;
        const size = 8 + Math.random() * 20;
        const delay = Math.floor(Math.random() * 400);
        makeHeart(cx, cy, dx, dy, size, delay);
    }
    // Light chime using Web Audio
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(660, ctx.currentTime);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02);
        o.connect(g); g.connect(ctx.destination);
        o.start();
        o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
        setTimeout(() => { o.stop(); ctx.close(); }, 1000);
    } catch (e) { /* no audio available — ignore */ }
}

revealBtn.addEventListener('click', () => {
    burstHearts();
    revealBtn.disabled = true;
    revealBtn.textContent = 'Sorpresa revelada';
    revealBtn.classList.add('outline');
});

printBtn.addEventListener('click', () => {
    window.print();
});
