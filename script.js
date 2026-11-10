/* ==========================================================================
   THE CONSTELLATION OF US — INTERACTIVE SCRIPT
   For Mahathi: Particle Starfield, Responsive 7-Star Constellation & Modals
   ========================================================================== */

(() => {
  "use strict";

  /* --------------------------------------------------------------------------
     1. EXACT CONTENT FOR THE 7 STARS
     -------------------------------------------------------------------------- */
  const CONSTELLATION_STARS = [
    {
      id: 1,
      roman: "I",
      title: "The Beginning",
      imageUrl: "photo1.jpg",
      message:
        "When we first started dating, I made sure to do all the little things right. I want you to know that I still love you exactly as much as I did on day one. But I know my actions haven't reflected that lately. I am sorry for letting college and routine make me lazy.",
      // Desktop & Mobile coordinates in viewport percentages (x%, y%)
      // Carefully positioned around the centered title so they never overlap
      desktopPos: { x: 15, y: 26 },
      mobilePos: { x: 20, y: 17 },
    },
    {
      id: 2,
      roman: "II",
      title: "The Small Things",
      imageUrl: "photo2.jpg",
      message:
        "My biggest flaw lately has been lethargy—getting too comfortable and taking you for granted. I am so sorry for dropping the ball on the small things. My resolution is to bring back the effort you deserve, every single day.",
      desktopPos: { x: 34, y: 16 },
      mobilePos: { x: 50, y: 12 },
    },
    {
      id: 3,
      roman: "III",
      title: "Having Your Back",
      imageUrl: "photo3.jpg",
      message:
        "I am 1000% sorry for what happened with your friend. You trusted me with a cover story, and I completely failed to protect your peace because I was careless and forgot. I promise to be sharper, to pay attention, and to always, always be in your corner.",
      desktopPos: { x: 66, y: 16 },
      mobilePos: { x: 80, y: 18 },
    },
    {
      id: 4,
      roman: "IV",
      title: "Being There",
      imageUrl: "photo4.jpg",
      message:
        "I know it hurts when you need me and I get pulled away by unavoidable work from my parents. It makes you feel like you aren't a priority. I can't always control the work, but I promise to communicate better so you never feel abandoned or second place.",
      desktopPos: { x: 85, y: 29 },
      mobilePos: { x: 82, y: 69 },
    },
    {
      id: 5,
      roman: "V",
      title: "Your Comfort",
      imageUrl: "photo5.jpg",
      message:
        "When you told me you were in pain from your periods recently, I gave a lazy, dismissive response. I am so deeply sorry. You deserved the comfort and attention I used to give you. I promise to never ignore your pain or brush off your hard days again.",
      desktopPos: { x: 77, y: 74 },
      mobilePos: { x: 62, y: 82 },
    },
    {
      id: 6,
      roman: "VI",
      title: "The Birthday Wish",
      imageUrl: "photo6.jpg",
      message:
        "Happy Belated Birthday, my love. I am sorry this is late, and I am sorry things have been bumpy. But celebrating you is my favorite thing to do. You are incredible, patient, and beautiful.",
      desktopPos: { x: 50, y: 82 },
      mobilePos: { x: 37, y: 83 },
    },
    {
      id: 7,
      roman: "VII",
      title: "The Future",
      imageUrl: "photo7.jpg",
      message:
        "I know I have messed up, but I am entirely committed to fixing it. I am shaking off the lethargy. I am choosing you, the small things, and our happiness. I love you, Mahathi. Here is to a better me, and a beautiful year ahead for you.",
      desktopPos: { x: 22, y: 73 },
      mobilePos: { x: 17, y: 70 },
    },
  ];

  /* --------------------------------------------------------------------------
     2. STATE & DOM REFERENCES
     -------------------------------------------------------------------------- */
  const visitedStars = new Set();
  let activeStarIndex = 0;

  const nodesContainer = document.getElementById("constellation-nodes");
  const svgLayer = document.getElementById("constellation-svg");
  const progressCountEl = document.getElementById("progress-count");
  const whisperTextEl = document.getElementById("whisper-text");

  // Modal Elements
  const modalOverlay = document.getElementById("star-modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalStarIndex = document.getElementById("modal-star-index");
  const modalStarTitle = document.getElementById("modal-star-title");
  const modalStarImage = document.getElementById("modal-star-image");
  const modalStarBody = document.getElementById("modal-star-body");
  const modalPrevBtn = document.getElementById("modal-prev-btn");
  const modalNextBtn = document.getElementById("modal-next-btn");
  const modalDots = document.getElementById("modal-dots");

  const starButtonEls = [];
  const litLineEls = [];

  /* --------------------------------------------------------------------------
     3. BUILD THE 7 CLICKABLE CONSTELLATION STARS & SVG LINES
     -------------------------------------------------------------------------- */
  function isMobileLayout() {
    return window.innerWidth <= 768;
  }

  function getStarPosition(star) {
    return isMobileLayout() ? star.mobilePos : star.desktopPos;
  }

  function initConstellationDOM() {
    nodesContainer.innerHTML = "";
    modalDots.innerHTML = "";
    starButtonEls.length = 0;

    CONSTELLATION_STARS.forEach((star, index) => {
      const pos = getStarPosition(star);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "star-node";
      btn.style.left = `${pos.x}%`;
      btn.style.top = `${pos.y}%`;
      btn.dataset.index = String(index);
      btn.setAttribute(
        "aria-label",
        `Star ${star.id}: ${star.title}. Click to read message.`
      );

      btn.innerHTML = `
        <span class="star-halo" aria-hidden="true"></span>
        <span class="star-ring" aria-hidden="true"></span>
        <svg class="star-core-svg" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 1 C26.2 17, 31 21.8, 47 24 C31 26.2, 26.2 31, 24 47 C21.8 31, 17 26.2, 1 24 C17 21.8, 21.8 17, 24 1 Z"
            fill="currentColor"
          />
          <circle cx="24" cy="24" r="4.2" fill="#ffffff" />
        </svg>
        <span class="star-label">${star.roman}. ${star.title}</span>
      `;

      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        spawnStardustBurst(centerX, centerY, 26);
        openStarModal(index);
      });

      nodesContainer.appendChild(btn);
      starButtonEls.push(btn);

      // Modal indicator dot
      const dot = document.createElement("span");
      dot.className = "modal-dot";
      modalDots.appendChild(dot);
    });

    renderConstellationLines();
  }

  function renderConstellationLines() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    svgLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgLayer.innerHTML = "";
    litLineEls.length = 0;

    // Connect stars 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 (and closing softly 7 -> 1)
    const total = CONSTELLATION_STARS.length;
    for (let i = 0; i < total; i++) {
      const currentStar = CONSTELLATION_STARS[i];
      const nextStar = CONSTELLATION_STARS[(i + 1) % total];

      // Only close the loop (7 -> 1) visually as a faint celestial bridge
      const p1 = getStarPosition(currentStar);
      const p2 = getStarPosition(nextStar);

      const x1 = (p1.x / 100) * width;
      const y1 = (p1.y / 100) * height;
      const x2 = (p2.x / 100) * width;
      const y2 = (p2.y / 100) * height;

      // Base dashed faint constellation line
      const baseLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      baseLine.setAttribute("x1", String(x1));
      baseLine.setAttribute("y1", String(y1));
      baseLine.setAttribute("x2", String(x2));
      baseLine.setAttribute("y2", String(y2));
      baseLine.setAttribute("class", "constellation-line-base");
      svgLayer.appendChild(baseLine);

      // Illuminated golden line
      const litLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      litLine.setAttribute("x1", String(x1));
      litLine.setAttribute("y1", String(y1));
      litLine.setAttribute("x2", String(x2));
      litLine.setAttribute("y2", String(y2));
      litLine.setAttribute("class", "constellation-line-lit");
      svgLayer.appendChild(litLine);

      litLineEls.push({
        line: litLine,
        fromIndex: i,
        toIndex: (i + 1) % total,
      });
    }

    updateConstellationVisuals();
  }

  function updateStarPositionsOnResize() {
    CONSTELLATION_STARS.forEach((star, index) => {
      const pos = getStarPosition(star);
      const btn = starButtonEls[index];
      if (btn) {
        btn.style.left = `${pos.x}%`;
        btn.style.top = `${pos.y}%`;
      }
    });
    renderConstellationLines();
  }

  function updateConstellationVisuals() {
    // Update each star button state
    starButtonEls.forEach((btn, idx) => {
      if (visitedStars.has(idx)) {
        btn.classList.add("is-visited");
      }
    });

    // Light up constellation lines when adjacent stars are visited (or all visited)
    const allVisited = visitedStars.size === CONSTELLATION_STARS.length;
    litLineEls.forEach(({ line, fromIndex, toIndex }) => {
      const shouldLight =
        allVisited ||
        (visitedStars.has(fromIndex) && visitedStars.has(toIndex));
      if (shouldLight) {
        line.classList.add("is-connected");
      }
    });

    // Update top counter
    progressCountEl.textContent = String(visitedStars.size);

    // Update bottom whisper when all 7 stars have been read
    if (allVisited) {
      whisperTextEl.textContent =
        "Every star shines for you, Mahathi. Happy Belated Birthday, my love. ✦";
      whisperTextEl.classList.add("is-complete");
    }
  }

  /* --------------------------------------------------------------------------
     4. GLASSMORPHISM MODAL LOGIC
     -------------------------------------------------------------------------- */
  function openStarModal(index) {
    activeStarIndex = index;
    const star = CONSTELLATION_STARS[index];

    const wasAlreadyAllVisited = visitedStars.size === CONSTELLATION_STARS.length;
    visitedStars.add(index);

    modalStarIndex.textContent = `Star ${star.roman} of VII`;
    modalStarTitle.textContent = star.title;

    if (star.imageUrl) {
      modalStarImage.src = star.imageUrl;
      modalStarImage.alt = `${star.title} — Memory with Mahathi`;
      modalStarImage.style.display = "block";
    } else {
      modalStarImage.removeAttribute("src");
      modalStarImage.style.display = "none";
    }

    modalStarBody.textContent = star.message;

    // Update modal progress dots
    const dotEls = modalDots.querySelectorAll(".modal-dot");
    dotEls.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === index);
      dot.classList.toggle("is-visited", visitedStars.has(idx));
    });

    updateConstellationVisuals();

    // If this click completed all 7 stars, trigger a celebratory stardust shower
    if (!wasAlreadyAllVisited && visitedStars.size === CONSTELLATION_STARS.length) {
      triggerCelebrationShower();
    }

    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalCloseBtn.focus({ preventScroll: true });
  }

  function closeStarModal() {
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    if (starButtonEls[activeStarIndex]) {
      starButtonEls[activeStarIndex].focus({ preventScroll: true });
    }
  }

  function stepModalStar(delta) {
    const total = CONSTELLATION_STARS.length;
    const nextIndex = (activeStarIndex + delta + total) % total;
    openStarModal(nextIndex);
  }

  // Modal Event Listeners
  modalCloseBtn.addEventListener("click", closeStarModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeStarModal();
    }
  });

  modalPrevBtn.addEventListener("click", () => stepModalStar(-1));
  modalNextBtn.addEventListener("click", () => stepModalStar(1));

  window.addEventListener("keydown", (e) => {
    if (!modalOverlay.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeStarModal();
    } else if (e.key === "ArrowRight") {
      stepModalStar(1);
    } else if (e.key === "ArrowLeft") {
      stepModalStar(-1);
    }
  });

  /* --------------------------------------------------------------------------
     5. INTERACTIVE PARTICLE STARFIELD & SHOOTING STARS ENGINE
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById("starfield-canvas");
  const ctx = canvas.getContext("2d");

  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const backgroundStars = [];
  const burstParticles = [];
  const shootingStars = [];

  const pointer = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
  };

  const STAR_PALETTE = [
    { r: 255, g: 252, b: 245 }, // Soft glowing white
    { r: 245, g: 223, b: 174 }, // Pale gold
    { r: 240, g: 198, b: 120 }, // Warm champagne gold
    { r: 195, g: 216, b: 255 }, // Celestial ice blue
    { r: 232, g: 205, b: 255 }, // Soft lavender starlight
  ];

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initBackgroundStars();
  }

  function initBackgroundStars() {
    backgroundStars.length = 0;
    const area = canvasWidth * canvasHeight;
    const count = Math.min(Math.max(Math.floor(area / 6200), 95), 240);

    for (let i = 0; i < count; i++) {
      const color = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
      const radius = Math.random() < 0.18 ? 1.6 + Math.random() * 1.2 : 0.6 + Math.random() * 1.1;

      backgroundStars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.16, // Gentle upward celestial drift
        radius,
        color,
        baseAlpha: 0.28 + Math.random() * 0.62,
        twinkleSpeed: 0.008 + Math.random() * 0.022,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function spawnStardustBurst(x, y, count = 24) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = 1.1 + Math.random() * 3.4;
      const color = STAR_PALETTE[Math.floor(Math.random() * 3)]; // Gold & white tones

      burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2.2,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.016,
        color,
      });
    }
  }

  function spawnShootingStar() {
    const startX = Math.random() * canvasWidth * 0.85;
    const startY = Math.random() * canvasHeight * 0.38;
    const angle = (22 + Math.random() * 20) * (Math.PI / 180);
    const speed = 7 + Math.random() * 5;

    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 65 + Math.random() * 55,
      alpha: 1,
      decay: 0.015 + Math.random() * 0.01,
    });
  }

  function triggerCelebrationShower() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnShootingStar();
      }, i * 320);
    }
  }

  // Pointer Tracking (Mouse & Touch)
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  function animateStarfield() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Smooth pointer interpolation
    if (pointer.active) {
      if (pointer.x < -1000) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      } else {
        pointer.x += (pointer.targetX - pointer.x) * 0.14;
        pointer.y += (pointer.targetY - pointer.y) * 0.14;
      }
    }

    const interactRadius = isMobileLayout() ? 95 : 135;

    // 1. Update & Draw Drifting Background Stars
    for (let i = 0; i < backgroundStars.length; i++) {
      const s = backgroundStars[i];

      s.x += s.vx;
      s.y += s.vy;
      s.twinklePhase += s.twinkleSpeed;

      // Wrap around screen edges seamlessly
      if (s.x < -10) s.x = canvasWidth + 10;
      if (s.x > canvasWidth + 10) s.x = -10;
      if (s.y < -10) s.y = canvasHeight + 10;
      if (s.y > canvasHeight + 10) s.y = -10;

      let drawX = s.x;
      let drawY = s.y;
      let alphaBoost = 0;

      // Subtle hover interaction with cursor/touch
      if (pointer.active) {
        const dx = s.x - pointer.x;
        const dy = s.y - pointer.y;
        const dist = Math.hypot(dx, dy);

        if (dist < interactRadius && dist > 0.01) {
          const factor = 1 - dist / interactRadius;
          // Gentle orbital push + glow boost
          drawX += (dx / dist) * factor * 12;
          drawY += (dy / dist) * factor * 12;
          alphaBoost = factor * 0.45;

          // Draw gossamer constellation thread to pointer for nearby stars
          if (dist < interactRadius * 0.78) {
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(245, 223, 174, ${(factor * 0.22).toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      const twinkle = Math.sin(s.twinklePhase) * 0.24;
      const alpha = Math.min(Math.max(s.baseAlpha + twinkle + alphaBoost, 0.12), 1);

      ctx.beginPath();
      ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${alpha.toFixed(3)})`;
      ctx.fill();

      // Soft halo for brighter background stars
      if (s.radius > 1.55) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.radius * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${(alpha * 0.18).toFixed(3)})`;
        ctx.fill();
      }
    }

    // 2. Update & Draw Shooting Stars
    if (Math.random() < 0.0045 && shootingStars.length < 2) {
      spawnShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const m = shootingStars[i];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.decay;

      if (m.alpha <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }

      const speed = Math.hypot(m.vx, m.vy);
      const tailX = m.x - (m.vx / speed) * m.length;
      const tailY = m.y - (m.vy / speed) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 250, 235, ${m.alpha.toFixed(3)})`);
      grad.addColorStop(0.4, `rgba(245, 223, 174, ${(m.alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(1, "rgba(245, 223, 174, 0)");

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // 3. Update & Draw Click Stardust Burst Particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha.toFixed(3)})`;
      ctx.fill();
    }

    requestAnimationFrame(animateStarfield);
  }

  /* --------------------------------------------------------------------------
     6. INITIALIZATION & RESIZE HANDLING
     -------------------------------------------------------------------------- */
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      updateStarPositionsOnResize();
    }, 80);
  });

  resizeCanvas();
  initConstellationDOM();
  requestAnimationFrame(animateStarfield);
})();

