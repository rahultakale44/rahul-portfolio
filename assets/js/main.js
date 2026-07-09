/* =====================================================
   MENU TOGGLE
===================================================== */

const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section[id]");

if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!menuIcon || !navbar) return;

    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  });
});

/* =====================================================
   ACTIVE NAVBAR LINK + HEADER SHADOW
===================================================== */

const header = document.querySelector(".header");

function handleScrollEffects() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id") || "";
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  if (header) {
    header.style.boxShadow =
      window.scrollY > 60
        ? "0 10px 30px rgba(0, 0, 0, 0.35)"
        : "none";
  }
}

window.addEventListener("scroll", handleScrollEffects);
window.addEventListener("load", handleScrollEffects);

/* =====================================================
   HERO SLIDESHOW
===================================================== */

const slides = document.querySelectorAll(".slide");
let slideIndex = 0;

function showNextSlide() {
  if (!slides.length) return;

  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}

if (slides.length > 1) {
  setInterval(showNextSlide, 5000);
}


/* =====================================================
   HERO NAME TYPING + BACKSPACE ANIMATION
   Rahul first line, Takale second line
===================================================== */

const typingName = document.getElementById("typing-name");

if (typingName) {
  const firstName = "Rahul";
  const lastName = "Takale";
  const fullText = `${firstName}\n${lastName}`;

  let index = 0;
  let isDeleting = false;

  function renderTypedName(text) {
    const parts = text.split("\n");

    const first = parts[0] || "";
    const second = parts[1] || "";

    typingName.innerHTML = `
      <span class="typing-white">${first}</span>
      ${text.includes("\n") ? `<br><span class="typing-green">${second}</span>` : ""}
    `;
  }

  function typeNameLoop() {
    const currentText = fullText.substring(0, index);
    renderTypedName(currentText);

    if (!isDeleting && index < fullText.length) {
      index++;
      setTimeout(typeNameLoop, 155);
      return;
    }

    if (!isDeleting && index === fullText.length) {
      isDeleting = true;
      setTimeout(typeNameLoop, 4000);
      return;
    }

    if (isDeleting && index > 0) {
      index--;
      setTimeout(typeNameLoop, 65);
      return;
    }

    if (isDeleting && index === 0) {
      isDeleting = false;
      setTimeout(typeNameLoop, 700);
    }
  }

  typeNameLoop();
}

/* =====================================================
   SCROLL REVEAL
===================================================== */

if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    distance: "70px",
    duration: 1400,
    delay: 120,
    reset: false,
    easing: "ease-in-out",
  });

  sr.reveal(".home-content", {
    distance: "0px",
    opacity: 0,
    duration: 1300,
    delay: 120,
  });

  sr.reveal(".about-img", { origin: "left" });
  sr.reveal(".about-content", { origin: "right" });
  sr.reveal(".about-card", { origin: "bottom", interval: 120 });
}

/* =====================================================
   EMAILJS CONTACT FORM
===================================================== */

if (typeof emailjs !== "undefined") {
  emailjs.init("Oe2zLK_m-zVxayU5f");
}

const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");

if (contactForm && contactBtn && typeof emailjs !== "undefined") {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactBtn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> Sending...`;
    contactBtn.disabled = true;

    emailjs
      .sendForm("service_wpdzrqh", "template_9omquwt", contactForm)
      .then(() => {
        alert("Message sent successfully!");
        contactForm.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Message failed. Please try again.");
      })
      .finally(() => {
        contactBtn.innerHTML = `<i class="bx bx-send"></i> Send Message`;
        contactBtn.disabled = false;
      });
  });
}

/* =====================================================
   REVEAL CARDS ON SCROLL
===================================================== */

const animatedElements = document.querySelectorAll(
  ".section-heading, .tech-card, .project-card, .experience-card, .experience-gallery, .achievement-card, .contact-card, .contact-form"
);

animatedElements.forEach((element) => {
  element.classList.add("reveal-card");
});

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        cardObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

animatedElements.forEach((element) => {
  cardObserver.observe(element);
});

/* =====================================================
   ULTRA INTERACTIVE MOTION SYSTEM
   Cursor glow, particles, magnetic buttons, 3D tilt
===================================================== */

(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) return;

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOrb = document.querySelector(".cursor-orb");
  const progress = document.querySelector(".scroll-progress");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let orbX = mouseX;
  let orbY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function animateCursor() {
    orbX += (mouseX - orbX) * 0.14;
    orbY += (mouseY - orbY) * 0.14;

    if (cursorOrb) {
      cursorOrb.style.transform = `translate(${orbX}px, ${orbY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  const hoverTargets = document.querySelectorAll(
    "a, button, .tech-card, .project-card, .about-card, .experience-card, .achievement-card, .contact-card, .contact-form"
  );

  hoverTargets.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      if (cursorOrb) cursorOrb.classList.add("hovering");
    });

    element.addEventListener("mouseleave", () => {
      if (cursorOrb) cursorOrb.classList.remove("hovering");
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrolled =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

      if (progress) {
        progress.style.width = `${scrolled}%`;
      }
    },
    { passive: true }
  );

  /* Canvas particle galaxy */
  const canvas = document.getElementById("cosmic-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  if (canvas && ctx) {
    let particles = [];

    const colors = [
      "rgba(32,246,199,",
      "rgba(65,184,255,",
      "rgba(166,108,255,",
    ];

    function resizeCanvas() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      );

      const count = Math.min(120, Math.floor(window.innerWidth / 12));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 0.7,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.45 + 0.15,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function drawGalaxy() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle, index) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 150) {
          particle.x -= dx * 0.003;
          particle.y -= dy * 0.003;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.vy *= -1;
        }

        ctx.beginPath();
        ctx.fillStyle = `${particle.c}${particle.a})`;
        ctx.shadowBlur = 16;
        ctx.shadowColor = `${particle.c}0.65)`;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const dist = Math.hypot(particle.x - other.x, particle.y - other.y);

          if (dist < 95) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(32,246,199,${
              (1 - dist / 95) * 0.11
            })`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(drawGalaxy);
    }

    resizeCanvas();
    drawGalaxy();

    window.addEventListener("resize", resizeCanvas);
  }

  /* Card tilt */
  const tiltCards = document.querySelectorAll(
    ".tech-card, .project-card, .about-card, .experience-card, .achievement-card, .contact-card, .contact-form"
  );

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * 7;
      const rotateX = -((y - midY) / midY) * 7;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.012)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* Magnetic buttons */
  const magnets = document.querySelectorAll(
    ".btn, .resume-btn, .project-github, .contact-btn"
  );

  magnets.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.16}px, ${
        y * 0.22
      }px) translateY(-4px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  /* Click ripple */
  window.addEventListener("click", (event) => {
    const burst = document.createElement("span");

    burst.className = "click-burst";
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;

    document.body.appendChild(burst);

    setTimeout(() => {
      burst.remove();
    }, 700);
  });

  const burstStyle = document.createElement("style");

  burstStyle.textContent = `
    .click-burst {
      position: fixed;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 4500;
      transform: translate(-50%, -50%);
      border: 2px solid rgba(32, 246, 199, 0.9);
      box-shadow: 0 0 35px rgba(32, 246, 199, 0.65);
      animation: burstPop 0.7s ease forwards;
    }

    @keyframes burstPop {
      to {
        width: 95px;
        height: 95px;
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(burstStyle);
})();

/* =====================================================
   EXTRA FLOATING OBJECTS
===================================================== */

(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) return;

  const lightSections = [
    {
      selector: ".about .motion-bg",
      items: ["⊕", "∑", "λ", "⚛", "⟲"],
    },
    {
      selector: ".projects-bg",
      items: ["</>", "{ }", "API", "DB", "git push", "debug"],
    },
    {
      selector: ".achievements-bg",
      items: ["★", "🏆", "Top 20", "Finalist", "Award"],
    },
  ];

  lightSections.forEach(({ selector, items }) => {
    const bg = document.querySelector(selector);

    if (!bg || bg.dataset.extraObjects) return;

    bg.dataset.extraObjects = "true";

    items.forEach((item, index) => {
      const span = document.createElement("span");

      span.className = "extra-float-object";
      span.textContent = item;

      span.style.setProperty("--x", `${8 + ((index * 19) % 82)}%`);
      span.style.setProperty("--y", `${12 + ((index * 23) % 72)}%`);
      span.style.setProperty("--d", `${index * 0.55}s`);

      bg.appendChild(span);
    });
  });

  const extraStyle = document.createElement("style");

  extraStyle.textContent = `
    .extra-float-object {
      position: absolute;
      left: var(--x);
      top: var(--y);
      z-index: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 9px 13px;
      border-radius: 999px;
      border: 1px solid rgba(6, 184, 138, 0.28);
      background: rgba(232, 255, 249, 0.68);
      color: rgba(3, 105, 88, 0.42);
      font-weight: 900;
      font-size: 18px;
      box-shadow: 0 12px 34px rgba(6, 184, 138, 0.10);
      animation: extraObjectFloat 8s ease-in-out infinite;
      animation-delay: var(--d);
      pointer-events: none;
      mix-blend-mode: multiply;
    }

    .tech-section .extra-float-object,
    .contact-section .extra-float-object {
      background: rgba(32, 246, 199, 0.08);
      color: rgba(154, 255, 232, 0.55);
      mix-blend-mode: normal;
    }

    @keyframes extraObjectFloat {
      0%, 100% {
        transform: translate3d(0, 0, 0) rotate(-2deg);
      }

      50% {
        transform: translate3d(18px, -28px, 0) rotate(4deg);
      }
    }
  `;

  document.head.appendChild(extraStyle);
})();

/* =====================================================
   FINAL STABLE HERO NAME TYPING
   Rahul + Takale visible guaranteed
===================================================== */

const finalFirstName = document.getElementById("finalFirstName");
const finalLastName = document.getElementById("finalLastName");

if (finalFirstName && finalLastName) {
  const firstName = "Rahul";
  const lastName = "Takale";

  let firstIndex = 0;
  let lastIndex = 0;
  let phase = "typingFirst";

  function runFinalNameTyping() {
    if (phase === "typingFirst") {
      finalFirstName.textContent = firstName.slice(0, firstIndex);
      finalLastName.textContent = "";

      if (firstIndex < firstName.length) {
        firstIndex++;
        setTimeout(runFinalNameTyping, 160);
        return;
      }

      phase = "typingLast";
      setTimeout(runFinalNameTyping, 300);
      return;
    }

    if (phase === "typingLast") {
      finalLastName.textContent = lastName.slice(0, lastIndex);

      if (lastIndex < lastName.length) {
        lastIndex++;
        setTimeout(runFinalNameTyping, 160);
        return;
      }

      phase = "hold";
      setTimeout(runFinalNameTyping, 3500);
      return;
    }

    if (phase === "hold") {
      phase = "deletingLast";
      setTimeout(runFinalNameTyping, 100);
      return;
    }

    if (phase === "deletingLast") {
      finalLastName.textContent = lastName.slice(0, lastIndex);

      if (lastIndex > 0) {
        lastIndex--;
        setTimeout(runFinalNameTyping, 70);
        return;
      }

      phase = "deletingFirst";
      setTimeout(runFinalNameTyping, 120);
      return;
    }

    if (phase === "deletingFirst") {
      finalFirstName.textContent = firstName.slice(0, firstIndex);

      if (firstIndex > 0) {
        firstIndex--;
        setTimeout(runFinalNameTyping, 70);
        return;
      }

      firstIndex = 0;
      lastIndex = 0;
      phase = "typingFirst";
      setTimeout(runFinalNameTyping, 600);
    }
  }

  runFinalNameTyping();
}