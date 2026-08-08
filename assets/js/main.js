/* =====================================================
   THEME PRELOADER — 1 TO 100
===================================================== */

(function initializePortfolioLoader() {
  const loader = document.getElementById("site-preloader");
  const count = document.getElementById("loader-count");
  const bar = document.getElementById("loader-progress-bar");

  const heroSlides = document.querySelectorAll(".hero-slider .slide");
  const heroVideos = document.querySelectorAll(".hero-slider video.slide");

  /*
    Loader ke peeche video play nahi hogi.
    Isse first video ka starting part miss nahi hoga.
  */
  heroVideos.forEach((video) => {
    video.pause();

    try {
      video.currentTime = 0;
    } catch (error) {
      console.log("Video reset waiting for metadata");
    }
  });

  if (!loader || !count || !bar) {
    document.body.classList.remove("is-loading");
    return;
  }

  let progress = 1;
  let pageReady = document.readyState === "complete";

  const startedAt = performance.now();
  const minimumDuration = 1850;

  window.addEventListener(
    "load",
    () => {
      pageReady = true;
    },
    { once: true }
  );

  function completeLoader() {
    count.textContent = "100";
    bar.style.width = "100%";

    /*
      Loader remove hone se pehle first slide ko active karo.
    */
    heroSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === 0);
    });

    const firstSlide = heroSlides[0];

    /*
      Agar first slide video hai toh usko beginning se play karo.
    */
    if (firstSlide instanceof HTMLVideoElement) {
      const startFirstVideo = () => {
        try {
          firstSlide.currentTime = 0;
        } catch (error) {
          console.log("Unable to reset video immediately");
        }

        firstSlide.play().catch((error) => {
          console.log("Video autoplay blocked:", error);
        });
      };

      if (firstSlide.readyState >= 1) {
        startFirstVideo();
      } else {
        firstSlide.addEventListener("loadedmetadata", startFirstVideo, {
          once: true,
        });
      }
    }

    loader.classList.add("loader-complete");
    document.body.classList.remove("is-loading");

    /*
      Slideshow timer ab loader complete hone ke baad start hoga.
    */
    window.dispatchEvent(new CustomEvent("portfolio:ready"));

    setTimeout(() => {
      loader.remove();
    }, 850);
  }

  function advanceLoader() {
    const elapsed = performance.now() - startedAt;

    if (progress < 92) {
      let step = 0;

      if (progress < 55) {
        step = 2;
      } else if (progress < 80) {
        step = 1;
      } else if (Math.random() > 0.55) {
        step = 1;
      }

      progress = Math.min(92, progress + step);
    } else if (pageReady && elapsed >= minimumDuration) {
      progress += 2;
    }

    const visibleProgress = Math.min(progress, 100);

    count.textContent = String(visibleProgress);
    bar.style.width = `${visibleProgress}%`;

    if (progress >= 100) {
      completeLoader();
      return;
    }

    setTimeout(advanceLoader, 24 + Math.random() * 20);
  }

  advanceLoader();
})();

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

const slides = document.querySelectorAll(".hero-slider .slide");

let slideIndex = 0;
let slideTimer = null;

function activateSlide(nextIndex) {
  if (!slides.length) return;

  slides.forEach((slide, index) => {
    const isActive = index === nextIndex;

    slide.classList.toggle("active", isActive);

    if (slide instanceof HTMLVideoElement) {
      if (isActive) {
        const playActiveVideo = () => {
          try {
            slide.currentTime = 0;
          } catch (error) {
            console.log("Video reset pending");
          }

          slide.play().catch((error) => {
            console.log("Video playback failed:", error);
          });
        };

        if (slide.readyState >= 1) {
          playActiveVideo();
        } else {
          slide.addEventListener("loadedmetadata", playActiveVideo, {
            once: true,
          });
        }
      } else {
        slide.pause();
      }
    }
  });

  slideIndex = nextIndex;
}

function showNextSlide() {
  if (!slides.length) return;

  const nextIndex = (slideIndex + 1) % slides.length;
  activateSlide(nextIndex);
}

function startHeroSlideshow() {
  if (!slides.length || slideTimer) return;

  /*
    Loader ke baad hamesha first slide se start hoga.
  */
  activateSlide(0);

  /*
    First video ko clearly dikhane ke liye 7 seconds rakha hai.
  */
  slideTimer = window.setInterval(showNextSlide, 7000);
}

if (document.body.classList.contains("is-loading")) {
  window.addEventListener("portfolio:ready", startHeroSlideshow, {
    once: true,
  });
} else {
  startHeroSlideshow();
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
  ".section-heading, .tech-card, .project-card, .research-card, .experience-card, .experience-gallery, .achievement-card, .contact-card, .contact-form"
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
    "a, button, .tech-card, .project-card, .research-card, .about-card, .experience-card, .achievement-card, .contact-card, .contact-form"
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
    ".tech-card, .project-card, .research-card, .about-card, .experience-card, .achievement-card, .contact-card, .contact-form"
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

// UNESCO video: play when visible, pause when out of view
const unescoVideo = document.getElementById("unesco-video");

if (unescoVideo) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const playPromise = unescoVideo.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Video autoplay was blocked:", error);
            });
          }
        } else {
          unescoVideo.pause();
        }
      });
    },
    {
      threshold: [0, 0.5, 1],
    }
  );

  videoObserver.observe(unescoVideo);
}

/* =====================================================
   ABOUT CARDS INTERSECTION ANIMATION
===================================================== */

const aboutCards = document.querySelectorAll(".about-card");

const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  /*
   * Mobile par cards ko turant visible rakho.
   * ScrollReveal ya observer ke wait ki zarurat nahi.
   */
  aboutCards.forEach((card) => {
    card.classList.remove("about-animate");
    card.classList.add("about-visible");

    card.style.opacity = "1";
    card.style.visibility = "visible";
    card.style.transform = "none";
  });
} else {
  /*
   * Desktop par cards left/right se animate honge.
   */
  aboutCards.forEach((card) => {
    card.classList.add("about-animate");
  });

  const aboutCardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("about-visible");
          entry.target.classList.remove("about-animate");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,

      /*
       * Section screen ke thoda neeche hote hue hi animation
       * start ho jayegi, user ko wait nahi karna padega.
       */
      rootMargin: "0px 0px 120px 0px",
    }
  );

  aboutCards.forEach((card) => {
    aboutCardObserver.observe(card);
  });
}

/* =====================================================
   RESEARCH → EXPERIENCE VAULT TRANSITION
   Runs once when the divider becomes visible.
===================================================== */

(function initializeVaultTransition() {
  const vaultTransition = document.getElementById("vault-transition");

  if (!vaultTransition) return;

  const statusText = vaultTransition.querySelector(".vault-status-text");
  const statusNext = vaultTransition.querySelector(".vault-status-next");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    vaultTransition.classList.add("is-active");
    if (statusText) statusText.textContent = "RESEARCH ARCHIVE SECURED";
    if (statusNext) statusNext.textContent = "PROFESSIONAL MODE";
    return;
  }

  const vaultObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        vaultTransition.classList.add("is-active");

        window.setTimeout(() => {
          if (statusText) statusText.textContent = "RESEARCH ARCHIVE SECURED";
          if (statusNext) statusNext.textContent = "PROFESSIONAL MODE ACTIVE";
        }, 2350);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45,
    }
  );

  vaultObserver.observe(vaultTransition);
})();


/* =====================================================
   TECHNOLOGY CAPABILITY CONSOLE
===================================================== */
(function initializeTechCapabilityConsole() {
  const triggers = document.querySelectorAll(".tech-rail-item");
  const panels = document.querySelectorAll(".tech-console-panel");

  if (!triggers.length || !panels.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.techPanel;

      triggers.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      trigger.classList.add("active");

      const activePanel = document.querySelector(
        `.tech-console-panel[data-tech-content="${target}"]`
      );

      if (activePanel) activePanel.classList.add("active");
    });
  });
})();


/* =====================================================
   FINAL ABOUT PRESENTER — FIRST VIEW ANIMATION
===================================================== */
(function initFinalAboutPresenter() {
  const about = document.querySelector(".final-about");
  if (!about) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    about.classList.add("presenter-started");
    return;
  }

  let played = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || played) return;

        played = true;
        about.classList.add("presenter-started");
        observer.unobserve(about);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  observer.observe(about);
})();

/* =====================================================
   HOME → ABOUT CINEMATIC ENTRY
   Plays once as the About section starts entering view.
===================================================== */
(function initializeAboutEntryAnimation() {
  const aboutSection = document.querySelector("#about.about-cinematic");

  if (!aboutSection) return;

  aboutSection.classList.add("about-entry-ready");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    aboutSection.classList.add("about-entry-active");
    return;
  }

  let hasPlayed = false;

  const aboutEntryObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || hasPlayed) return;

        hasPlayed = true;

        requestAnimationFrame(() => {
          aboutSection.classList.add("about-entry-active");
        });

        observer.unobserve(aboutSection);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  aboutEntryObserver.observe(aboutSection);
})();


/* =====================================================
   INTERACTIVE PORTFOLIO CARD DETAIL SYSTEM
===================================================== */

const portfolioDetailData = {"project-ai-and-iot-aeroponics-system": {"id": "project-ai-and-iot-aeroponics-system", "category": "Project", "anchor": "projects", "title": "AI & IoT Aeroponics System", "eyebrow": "AI, IoT and Smart Agriculture", "summary": "Developed an AI and IoT-powered aeroponics system for sustainable urban farming with real-time sensor monitoring and an LLM-powered plant assistant using Ollama for intelligent crop and nutrient recommendations.", "images": ["assets/img/project-aeroponics.jpg"], "tags": ["Node.js", "React.js", "IoT", "LLM Integration", "ESP32"], "github": "https://github.com/rahultakale44", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "The project explores how urban farming can be made more observable and intelligent by combining aeroponics, connected sensors and an AI-assisted decision layer instead of relying only on manual checking.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["ESP32 and IoT sensors capture plant-environment readings.", "The application layer organizes real-time monitoring for the growing system.", "A Node.js backend connects device data with the web experience.", "React.js presents system status and useful monitoring information.", "An Ollama-powered plant assistant supports crop and nutrient recommendations."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Real-time sensing and connected-device monitoring", "AI-assisted crop and nutrient guidance", "Web-based visibility for an aeroponics setup", "Integration of software, IoT and an LLM assistant"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["Node.js", "React.js", "IoT", "LLM Integration", "ESP32"]}]}, "project-ai-powered-cctv-surveillance-system-for-kumbh-mela": {"id": "project-ai-powered-cctv-surveillance-system-for-kumbh-mela", "category": "Project", "anchor": "projects", "title": "AI Powered CCTV Surveillance System for Kumbh Mela", "eyebrow": "AI & Computer Vision", "summary": "Designed and studied an AI-powered CCTV surveillance solution for crowd management and public safety during large-scale religious gatherings. Explored Python, OpenCV, object detection, people counting and crowd-density estimation for CCTV video streams.", "images": ["assets/img/kumbhpic.png"], "tags": ["OpenCV", "YOLO", "Flask", "Python", "HTML CSS JS"], "github": "https://github.com/rahultakale44", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "Large public gatherings create a monitoring problem where raw CCTV feeds can overwhelm human operators. This project studies how computer vision can convert video into crowd-management signals that are easier to act on.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["CCTV/video frames are ingested through a Python/OpenCV pipeline.", "Object detection identifies people in monitored regions.", "People-count and crowd-density logic turns detections into measurable signals.", "Flask exposes the processed results to a lightweight monitoring interface.", "Alerts and visual feedback support faster operational awareness."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Crowd-density estimation", "People counting from CCTV streams", "Object detection with YOLO", "Public-safety monitoring and decision support"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["OpenCV", "YOLO", "Flask", "Python", "HTML CSS JS"]}]}, "project-docmate-healthcare-appointment-management-platform": {"id": "project-docmate-healthcare-appointment-management-platform", "category": "Project", "anchor": "projects", "title": "DocMate – Healthcare Appointment Management Platform", "eyebrow": "MERN Stack Development", "summary": "DocMate is a full-stack healthcare appointment platform that allows patients to discover doctors, book or cancel appointments and manage their consultation history. It provides secure role-based dashboards for patients, doctors and administrators with JWT authentication and appointment management.", "images": ["assets/img/docmate.png"], "tags": ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"], "github": "https://github.com/rahultakale44/docmate-healthcare-platform", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "DocMate focuses on the everyday coordination problem between patients, doctors and administrators: discovering doctors, booking consultations, managing appointments and preserving role-specific access.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["React.js provides patient, doctor and administrator interfaces.", "Node.js and Express.js implement the application API layer.", "MongoDB stores users, doctors and appointment information.", "JWT authentication protects role-specific routes and dashboards.", "Appointment actions support booking, cancellation and consultation-history management."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Role-based healthcare workflows", "Secure authentication with JWT", "Appointment lifecycle management", "Patient, doctor and admin dashboards"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"]}]}, "project-shopsphere-java-full-stack-e-commerce-platform": {"id": "project-shopsphere-java-full-stack-e-commerce-platform", "category": "Project", "anchor": "projects", "title": "ShopSphere – Java Full Stack E-Commerce Platform", "eyebrow": "Java Full Stack Development", "summary": "ShopSphere is a complete Java full-stack e-commerce platform featuring secure user authentication, product browsing, search, cart and wishlist management, checkout, online payment and order tracking. It also includes an admin dashboard for managing products, inventory and customer orders.", "images": ["assets/img/shopsphere.png"], "tags": ["React.js", "Spring Boot", "Spring Security", "MySQL", "JWT"], "github": "https://github.com/rahultakale44", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "ShopSphere is built around the complete e-commerce lifecycle rather than a single catalogue screen: users need discovery, secure identity, cart state, checkout, payment, order tracking and administrative control.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["React.js provides product discovery, cart, checkout and account interfaces.", "Spring Boot exposes REST APIs for the commerce workflow.", "Spring Security and JWT protect authenticated operations.", "MySQL persists users, products, cart/order data and related transactional state.", "The admin flow supports product, inventory and customer-order management."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["End-to-end commerce workflow", "Secure Java backend architecture", "Cart, wishlist and checkout state", "Payment and order-management integration"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["React.js", "Spring Boot", "Spring Security", "MySQL", "JWT"]}]}, "project-campuscare-smart-campus-complaint-management-system": {"id": "project-campuscare-smart-campus-complaint-management-system", "category": "Project", "anchor": "projects", "title": "CampusCare – Smart Campus Complaint Management System", "eyebrow": "Java Full Stack Development", "summary": "CampusCare is a full-stack campus complaint management platform built using React.js, Spring Boot and MySQL. It includes JWT authentication, role-based access control, complaint tracking, analytics and CSV report export.", "images": ["assets/img/ach-campuscare.jpeg"], "tags": ["React.js", "Spring Boot", "JWT", "MySQL", "REST APIs"], "github": "https://github.com/rahultakale44/campuscare-backend", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "CampusCare addresses the gap between reporting a campus issue and being able to track its resolution. The system structures complaint intake, access control, tracking and administrative reporting.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["React.js provides the user-facing complaint experience.", "Spring Boot exposes the complaint-management REST API.", "JWT and role-based access control separate user and administrative operations.", "MySQL stores complaint and user data.", "Analytics and CSV export support reporting and operational review."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Complaint lifecycle tracking", "Role-based access control", "Operational analytics", "CSV report export"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["React.js", "Spring Boot", "JWT", "MySQL", "REST APIs"]}]}, "project-intelligent-fitness-posture-detection-system": {"id": "project-intelligent-fitness-posture-detection-system", "category": "Project", "anchor": "projects", "title": "Intelligent Fitness Posture Detection System", "eyebrow": "AI Fitness Application", "summary": "Developed a computer vision-based fitness posture detection system using Python, OpenCV and MediaPipe Pose to analyze body movements, calculate joint angles and provide corrective posture feedback.", "images": ["assets/img/project-fitness.jpg"], "tags": ["Python", "OpenCV", "Pose Estimation", "MediaPipe", "SQLite"], "github": "https://github.com/rahultakale44/ai-fitness-coach", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "The project explores how camera-based pose estimation can turn body movement into measurable joint-angle feedback for exercise posture without requiring dedicated wearable hardware.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["Camera frames are processed with Python and OpenCV.", "MediaPipe Pose identifies body landmarks.", "Joint-angle calculations translate landmarks into posture measurements.", "Rule-based checks identify posture deviations.", "Corrective feedback is presented to the user while session data can be persisted with SQLite."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Pose landmark detection", "Joint-angle analysis", "Corrective posture feedback", "Computer-vision fitness assistance"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["Python", "OpenCV", "Pose Estimation", "MediaPipe", "SQLite"]}]}, "project-medscope-evidence-grounded-medical-literature-retrieval-system": {"id": "project-medscope-evidence-grounded-medical-literature-retrieval-system", "category": "Project", "anchor": "projects", "title": "MedScope – Evidence Grounded Medical Literature Retrieval System", "eyebrow": "Medical RAG & Evidence Retrieval", "summary": "MedScope is a privacy-focused medical literature RAG application that allows users to upload trusted research PDFs, perform domain-specific semantic search and generate evidence-grounded answers using a locally hosted BioMistral-7B model. It uses PubMedBERT embeddings and Qdrant for medical document retrieval, while displaying source documents, page numbers and similarity scores with every generated response.", "images": ["assets/img/medscope.jpg"], "tags": ["React.js", "FastAPI", "LangChain", "BioMistral-7B", "PubMedBERT", "Qdrant"], "github": "https://github.com/rahultakale44/medscope", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "MedScope focuses on evidence-grounded medical retrieval: answers should come from trusted uploaded literature and remain traceable to the supporting document rather than behaving like an unconstrained general chatbot.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["Trusted medical PDFs are ingested into the retrieval workflow.", "PubMedBERT creates domain-specific document embeddings.", "Qdrant stores and retrieves semantically relevant chunks.", "A locally hosted BioMistral-7B model generates answers from retrieved evidence.", "Responses surface source documents, page numbers and similarity scores for traceability."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Privacy-focused local medical RAG", "Domain-specific PubMedBERT embeddings", "Qdrant vector retrieval", "Source and page-level evidence traceability"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["React.js", "FastAPI", "LangChain", "BioMistral-7B", "PubMedBERT", "Qdrant"]}]}, "project-cartwise-ai-powered-shopping-assistant": {"id": "project-cartwise-ai-powered-shopping-assistant", "category": "Project", "anchor": "projects", "title": "CartWise – AI Powered Shopping Assistant", "eyebrow": "Generative AI & Product Discovery", "summary": "CartWise is an AI-powered product discovery and shopping assistant that helps users search, compare and understand products through natural language conversations. Built with React and FastAPI, it uses LangChain, Groq, Llama and retrieval-augmented generation to deliver personalized recommendations, product comparisons and reliable answers to shopping policy questions.", "images": ["assets/img/cartwise.jpg"], "tags": ["React.js", "FastAPI", "LangChain", "Groq", "Llama", "RAG"], "github": "https://github.com/rahultakale44/CartWise", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "CartWise explores conversational product discovery so users can search, compare and understand products using natural language instead of navigating only through fixed filters and static product pages.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["React.js provides the conversational shopping interface.", "FastAPI exposes the backend orchestration layer.", "LangChain coordinates retrieval and generation steps.", "Groq/Llama provide the language-model layer.", "RAG supports product recommendations, comparisons and shopping-policy questions."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Natural-language product discovery", "Product comparison", "Retrieval-augmented shopping Q&A", "FastAPI-based AI backend"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["React.js", "FastAPI", "LangChain", "Groq", "Llama", "RAG"]}]}, "project-contactless-biometric-fingerprint-authentication-system": {"id": "project-contactless-biometric-fingerprint-authentication-system", "category": "Project", "anchor": "projects", "title": "Contactless Biometric Fingerprint Authentication System", "eyebrow": "Computer Vision & Biometric Security", "summary": "Designed a contactless biometric authentication prototype that captures fingerprint imagery without requiring a physical scanner. The workflow applies computer-vision preprocessing to isolate the fingerprint region, improve ridge visibility and prepare distinctive biometric features for identity matching. The project explores a hygienic, touch-free alternative to conventional fingerprint devices for attendance, access control and secure identity verification scenarios.", "images": [], "tags": ["Python", "OpenCV", "Image Processing", "Biometrics", "Feature Matching", "Computer Vision"], "github": "https://github.com/rahultakale44", "metrics": [], "steps": [{"kicker": "01 · Context", "title": "Problem & Intent", "text": "The prototype investigates whether fingerprint identity workflows can be made touch-free by capturing fingerprint imagery without a conventional physical scanner and then applying computer-vision preprocessing for matching.", "bullets": []}, {"kicker": "02 · System", "title": "How the System Works", "text": "The implementation connects the technologies shown on the original project card into one end-to-end workflow.", "bullets": ["A camera-based workflow captures fingerprint imagery without physical scanner contact.", "Image-processing steps isolate the fingerprint region.", "Preprocessing improves ridge visibility and prepares the image for feature analysis.", "Distinctive biometric features are prepared for identity matching.", "The approach is positioned for attendance, access-control and identity-verification scenarios."]}, {"kicker": "03 · Engineering", "title": "Core Engineering Focus", "text": "The project is designed around practical implementation rather than a standalone demo screen.", "bullets": ["Touch-free biometric capture", "Fingerprint region extraction", "Ridge enhancement and preprocessing", "Feature-based identity matching"]}, {"kicker": "04 · Stack", "title": "Technology Map", "text": "The stack below is taken directly from the portfolio project card.", "bullets": ["Python", "OpenCV", "Image Processing", "Biometrics", "Feature Matching", "Computer Vision"]}]}, "research-quantum-graph-intelligence": {"id": "research-quantum-graph-intelligence", "category": "Research", "anchor": "research", "title": "Quantum Graph Intelligence", "eyebrow": "Quantum-Walk-Based Multi-Hop Knowledge Retrieval", "summary": "Exploring whether query-conditioned quantum walks can use interference across multiple reasoning paths to concentrate more retrieval probability on answer supporting subgraphs than bounded classical graph traversal under an equivalent exploration budget.", "images": ["assets/img/quantum-research.png"], "tags": ["Q-GraphRAG", "Quantum Walks", "Knowledge Graphs", "GraphRAG", "Multi-Hop Reasoning"], "github": "", "metrics": ["HYPOTHESIS FORMULATED"], "steps": [{"kicker": "01 · Research Question", "title": "What I Am Exploring", "text": "Exploring whether query-conditioned quantum walks can use interference across multiple reasoning paths to concentrate more retrieval probability on answer supporting subgraphs than bounded classical graph traversal under an equivalent exploration budget.", "bullets": ["Can quantum interference become a mechanism for relational evidence aggregation?"]}, {"kicker": "02 · Hypotheses", "title": "Working Hypotheses", "text": "The research card defines the following testable or investigatory directions.", "bullets": ["H₁ — Structural Advantage: Quantum walks may preserve long range dependencies and higher-order graph structure more effectively under a fixed retrieval budget.", "H₂ — Path Consensus: Constructive interference may amplify evidence supported by multiple semantically consistent reasoning paths.", "H₃ — Complexity Crossover: A graph complexity threshold may exist beyond which quantum retrieval begins outperforming bounded classical traversal.", "H₄ — Quantum-Stochastic Optimum: An intermediate stochastic quantum regime may achieve stronger retrieval than either purely classical or fully coherent walks."]}, {"kicker": "03 · Method", "title": "Exploration Workflow", "text": "The portfolio frames the investigation as a staged workflow.", "bullets": ["Query", "Entity Linking", "Knowledge Graph", "Quantum Walk", "Evidence Subgraph", "LLM"]}, {"kicker": "04 · Domain", "title": "Research Themes", "text": "These tags define the technical or scientific territory of the exploration.", "bullets": ["Q-GraphRAG", "Quantum Walks", "Knowledge Graphs", "GraphRAG", "Multi-Hop Reasoning"]}]}, "research-andromeda-galaxy": {"id": "research-andromeda-galaxy", "category": "Research", "anchor": "research", "title": "Andromeda Galaxy", "eyebrow": "Structure, Motion & the Future of Our Galactic Neighbourhood", "summary": "Exploring Andromeda as a nearby laboratory for studying spiral-galaxy structure, stellar populations, dark matter and the uncertain long-term gravitational evolution of the Local Group.", "images": ["https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2026/07/STScI-01KXZZ6H029XBJTKYKRPARFJE9.jpg?crop=faces%2Cfocalpoint&fit=clip&h=4935&w=8502"], "tags": ["Andromeda", "Galaxy Evolution", "Dark Matter", "Astrophysics", "Local Group"], "github": "", "metrics": ["RESEARCH EXPLORATION"], "steps": [{"kicker": "01 · Research Question", "title": "What I Am Exploring", "text": "Exploring Andromeda as a nearby laboratory for studying spiral-galaxy structure, stellar populations, dark matter and the uncertain long-term gravitational evolution of the Local Group.", "bullets": ["What can Andromeda reveal about galaxy evolution, hidden mass and the future interaction of the Milky Way–Andromeda system?"]}, {"kicker": "02 · Hypotheses", "title": "Working Hypotheses", "text": "The research card defines the following testable or investigatory directions.", "bullets": ["A₁ — Galactic Structure: Study the disk, bulge, halo, dust lanes and star-forming regions to understand how massive spiral galaxies are organized.", "A₂ — Motion & Dark Matter: Use rotation, stellar motions and satellite dynamics to investigate how visible matter traces a much larger gravitational mass.", "A₃ — Local Group Future: Explore competing orbital scenarios; current observations still leave major uncertainty over whether a future Milky Way merger occurs.", "A₄ — Stellar Archaeology: Compare stellar ages and populations across Andromeda to reconstruct episodes of star formation and past galactic interactions."]}, {"kicker": "03 · Method", "title": "Exploration Workflow", "text": "The portfolio frames the investigation as a staged workflow.", "bullets": ["Observation", "Spectral Analysis", "Galaxy Mapping", "Dynamics Modeling", "Future Simulation"]}, {"kicker": "04 · Domain", "title": "Research Themes", "text": "These tags define the technical or scientific territory of the exploration.", "bullets": ["Andromeda", "Galaxy Evolution", "Dark Matter", "Astrophysics", "Local Group"]}]}, "research-who-brought-water-to-earth": {"id": "research-who-brought-water-to-earth", "category": "Research", "anchor": "research", "title": "Who Brought Water to Earth?", "eyebrow": "Tracing the Origin of Earth’s Oceans Through Planetary Evidence", "summary": "Exploring how Earth acquired its water by comparing evidence for water inherited during planet formation, water rich asteroids and meteorites, cometary delivery and later geological recycling inside the young Earth.", "images": ["assets/img/ocean-waves.jpg"], "tags": ["Earth Oceans", "Asteroids", "Comets", "Planetary Science", "Origins of Water"], "github": "", "metrics": ["RESEARCH EXPLORATION"], "steps": [{"kicker": "01 · Research Question", "title": "What I Am Exploring", "text": "Exploring how Earth acquired its water by comparing evidence for water inherited during planet formation, water rich asteroids and meteorites, cometary delivery and later geological recycling inside the young Earth.", "bullets": ["How much of Earth’s ocean water was inherited locally, delivered by asteroids, contributed by comets, or released from Earth’s interior?"]}, {"kicker": "02 · Hypotheses", "title": "Working Hypotheses", "text": "The research card defines the following testable or investigatory directions.", "bullets": ["O₁ — Asteroid Delivery: Water-rich carbonaceous asteroid material is a leading candidate because its chemical fingerprints resemble important parts of Earth’s volatile inventory.", "O₂ — Comet Contribution: Some comet families contain water with Earth-like isotope ratios, keeping comets viable as contributors even if they were not the only source.", "O₃ — Primordial Water: Hydrogen and water-bearing material may also have been incorporated during Earth’s formation rather than arriving entirely after the planet formed.", "O₄ — Isotope Evidence: Hydrogen isotope ratios, meteorites, mineral chemistry and planetary models can be combined to constrain the relative contribution of each source."]}, {"kicker": "03 · Method", "title": "Exploration Workflow", "text": "The portfolio frames the investigation as a staged workflow.", "bullets": ["Early Solar System", "Meteorite Evidence", "Isotope Analysis", "Planet Formation Models", "Ocean Origin Study"]}, {"kicker": "04 · Domain", "title": "Research Themes", "text": "These tags define the technical or scientific territory of the exploration.", "bullets": ["Earth Oceans", "Asteroids", "Comets", "Planetary Science", "Origins of Water"]}]}, "experience-development-intern-innobytes-erfinden-technologies-pvt-ltd": {"id": "experience-development-intern-innobytes-erfinden-technologies-pvt-ltd", "category": "Experience", "anchor": "experience", "title": "Development Intern · INNOBYTES (Erfinden Technologies Pvt. Ltd.)", "eyebrow": "6 Months · Pimpri Chinchwad, Maharashtra · 2025", "summary": "Developed a full-stack MERN business networking platform that connects entrepreneurs, startups and enterprises.", "images": ["assets/img/BizGrowth.png", "assets/img/InnoHubs.png"], "tags": ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"], "github": "", "metrics": ["Development Intern", "INNOBYTES (Erfinden Technologies Pvt. Ltd.)", "6 Months · Pimpri Chinchwad, Maharashtra · 2025"], "steps": [{"kicker": "01 · Role", "title": "Internship Context", "text": "Development Intern at INNOBYTES (Erfinden Technologies Pvt. Ltd.). 6 Months · Pimpri Chinchwad, Maharashtra · 2025", "bullets": []}, {"kicker": "02 · Workstream", "title": "BizGrowth – Business Networking Platform", "text": "Key responsibilities and implementation work from this internship.", "bullets": ["Developed a full-stack MERN business networking platform that connects entrepreneurs, startups and enterprises.", "Implemented JWT authentication, protected routes, password hashing and token-based user sessions.", "Built business listing management, advanced search, category filters and user-specific dashboards."]}, {"kicker": "03 · Workstream", "title": "InnoHubs – Global Innovation & Entrepreneurship Platform", "text": "Key responsibilities and implementation work from this internship.", "bullets": ["Contributed to a MERN-based global innovation platform connecting entrepreneurs, students, researchers, professionals, academia and corporations.", "Developed responsive frontend components for innovation programs, startup collaboration, ecosystem partnerships and entrepreneurship opportunities.", "Supported platform modules focused on startup incubation, global partnerships, market access, corporate co-creation and innovation ecosystem development."]}, {"kicker": "04 · Stack", "title": "Tools & Technologies", "text": "Technologies highlighted in the experience card.", "bullets": ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"]}]}, "experience-hardware-intern-red-crest-charitable-trust-under-ngo-tech-work": {"id": "experience-hardware-intern-red-crest-charitable-trust-under-ngo-tech-work", "category": "Experience", "anchor": "experience", "title": "Hardware Intern · Red Crest Charitable Trust under NGO Tech Work", "eyebrow": "15 June 2025 – 15 July 2025 · 4 Weeks", "summary": "Contributed to the hardware prototyping and sensor integration of an IoT-based smart farming monitoring system.", "images": ["assets/img/redcrest-1.jpg", "assets/img/redcrest-2.jpg"], "tags": ["NodeMCU", "ESP8266", "IoT Sensors", "Hardware Testing"], "github": "", "metrics": ["Hardware Intern", "Red Crest Charitable Trust under NGO Tech Work", "15 June 2025 – 15 July 2025 · 4 Weeks"], "steps": [{"kicker": "01 · Role", "title": "Internship Context", "text": "Hardware Intern at Red Crest Charitable Trust under NGO Tech Work. 15 June 2025 – 15 July 2025 · 4 Weeks", "bullets": []}, {"kicker": "02 · Workstream", "title": "PrakritiAI – Smart Farming Monitoring System", "text": "Key responsibilities and implementation work from this internship.", "bullets": ["Contributed to the hardware prototyping and sensor integration of an IoT-based smart farming monitoring system.", "Worked with NodeMCU ESP8266 and environmental sensors for temperature, humidity, soil moisture and air-quality monitoring.", "Assisted in testing sensor readings, embedded components and real-world hardware outputs."]}, {"kicker": "03 · Workstream", "title": "Monitoring and System Integration", "text": "Key responsibilities and implementation work from this internship.", "bullets": ["Supported real-time sensor data monitoring through dashboards, visual summaries and threshold-based alerts.", "Explored MQTT and Wi-Fi communication for transmitting sensor readings to a central processing system.", "Contributed to documentation, calibration, testing workflows and evaluation of the working prototype."]}, {"kicker": "04 · Stack", "title": "Tools & Technologies", "text": "Technologies highlighted in the experience card.", "bullets": ["NodeMCU", "ESP8266", "IoT Sensors", "Hardware Testing"]}]}, "achievement-indradhanu-international-grand-challenge-finale": {"id": "achievement-indradhanu-international-grand-challenge-finale", "category": "Achievement", "anchor": "achievements", "title": "Indradhanu International Grand Challenge Finale", "eyebrow": "PCCOE · AI for Climate Change", "summary": "Our team CODEXCELLENCE was shortlisted among the Top 20 teams and presented Seed2Sustain , an AI-driven climate-smart aeroponics solution for urban sustainability.", "images": ["assets/img/ach-indradhanu-1.jpeg", "assets/img/ach-indradhanu-2.jpeg", "assets/img/ach-indradhanu-3.jpeg"], "tags": ["Top 20 Finalist", "1002+ Teams", "3-Month Phase"], "github": "", "metrics": ["Top 20 Finalist", "1002+ Teams", "3-Month Phase"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Our team CODEXCELLENCE was shortlisted among the Top 20 teams and presented Seed2Sustain , an AI-driven climate-smart aeroponics solution for urban sustainability.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Designed a soil-less aeroponics system for sustainable farming.", "Integrated IoT-based real-time monitoring for plant conditions.", "Applied AI-driven insights for plant health and system reliability."]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "PCCOE · AI for Climate Change", "bullets": ["Top 20 Finalist", "1002+ Teams", "3-Month Phase"]}]}, "achievement-prism-sociothon-2025": {"id": "achievement-prism-sociothon-2025", "category": "Achievement", "anchor": "achievements", "title": "PRISM Sociothon 2025", "eyebrow": "BRACT’s VIT Bibwewadi, Pune", "summary": "Led team Sync4Tech under the theme “Tech for a Sustainable Planet” and proposed CarbonVision , an AI-powered industrial emission monitoring system.", "images": ["assets/img/ach-vit-1.jpg", "assets/img/ach-vit-2.jpg", "assets/img/ach-vit-3.jpg"], "tags": ["Top 180", "792 Participants", "Team Leader"], "github": "", "metrics": ["Top 180", "792 Participants", "Team Leader"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Led team Sync4Tech under the theme “Tech for a Sustainable Planet” and proposed CarbonVision , an AI-powered industrial emission monitoring system.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Analyzed chimney/drone video feeds using computer vision.", "Estimated smoke density, color and emission levels.", "Planned real-time dashboards, alerts and trend analytics.", "Explored weather API integration for pollution dispersion prediction."]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "BRACT’s VIT Bibwewadi, Pune", "bullets": ["Top 180", "792 Participants", "Team Leader"]}]}, "achievement-kumbathon-2026": {"id": "achievement-kumbathon-2026", "category": "Achievement", "anchor": "achievements", "title": "Kumbathon 2026", "eyebrow": "MIT ADT University · National Startup Day", "summary": "Team Triveni Tech showcased an AI-Based Smart CCTV Surveillance and Command Centre System designed for monitoring large-scale events such as the Kumbh Mela.", "images": ["assets/img/ach-kumbathon-1.jpg", "assets/img/ach-kumbathon-2.jpg", "assets/img/ach-kumbathon-3.jpg"], "tags": ["AI Surveillance", "Working Prototype", "Command Centre"], "github": "", "metrics": ["AI Surveillance", "Working Prototype", "Command Centre"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Team Triveni Tech showcased an AI-Based Smart CCTV Surveillance and Command Centre System designed for monitoring large-scale events such as the Kumbh Mela.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Detected crowd-density risks and potentially unsafe situations.", "Converted live CCTV feeds into real-time monitoring and decision-support insights.", "Built an alert workflow connected to a centralized administration dashboard."]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "MIT ADT University · National Startup Day", "bullets": ["AI Surveillance", "Working Prototype", "Command Centre"]}]}, "achievement-mit-adt-ai-grand-challenge-2026": {"id": "achievement-mit-adt-ai-grand-challenge-2026", "category": "Achievement", "anchor": "achievements", "title": "MIT ADT AI Grand Challenge 2026", "eyebrow": "Blockchain & AI Innovation Category", "summary": "Developed AuditX , an AI and Blockchain-powered financial fraud prevention system designed to detect suspicious transactions before execution through real-time risk analysis.", "images": ["assets/img/ach-auditx-1.jpg", "assets/img/ach-auditx-2.jpeg", "assets/img/ach-auditx-3.jpg"], "tags": ["Top 7 Teams", "Blockchain", "AI Fraud Detection"], "github": "", "metrics": ["Top 7 Teams", "Blockchain", "AI Fraud Detection"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Developed AuditX , an AI and Blockchain-powered financial fraud prevention system designed to detect suspicious transactions before execution through real-time risk analysis.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Implemented Isolation Forest-based anomaly detection for fraud-risk scoring.", "Designed Solidity smart-contract rules for transaction validation.", "Integrated blockchain logging to maintain transaction integrity and transparency."]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "Blockchain & AI Innovation Category", "bullets": ["Top 7 Teams", "Blockchain", "AI Fraud Detection"]}]}, "achievement-unesco-youth-hackathon-2025": {"id": "achievement-unesco-youth-hackathon-2025", "category": "Achievement", "anchor": "achievements", "title": "UNESCO Youth Hackathon 2025", "eyebrow": "Global Platform · SDG Innovation", "summary": "Built NutriCheck , an AI-powered nutrition label analysis system that helps users decode food packaging and make healthier choices.", "images": [], "tags": ["Global Hackathon", "SDG 3", "SDG 12"], "github": "", "metrics": ["Global Hackathon", "SDG 3", "SDG 12"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Built NutriCheck , an AI-powered nutrition label analysis system that helps users decode food packaging and make healthier choices.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Used Flask for AI and OCR processing.", "Built the frontend using React and Tailwind CSS.", "Integrated Tesseract OCR and machine learning for nutrient detection.", "Presented the complete solution through a team-recorded project video for the UNESCO Youth Hackathon."]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "Global Platform · SDG Innovation", "bullets": ["Global Hackathon", "SDG 3", "SDG 12"]}]}, "achievement-campus-ambassador": {"id": "achievement-campus-ambassador", "category": "Achievement", "anchor": "achievements", "title": "Campus Ambassador", "eyebrow": "Parikshak.ai · Growth Partner Program", "summary": "Selected as a Campus Ambassador for the Parikshak.ai Growth Partner Program, where I contributed to promoting AI-powered interview preparation and career development resources among students. I supported student outreach, awareness campaigns and community engagement while helping learners understand modern interview practices, placement preparation and AI-driven learning tools.", "images": ["assets/img/ach-parikshak-1.jpg", "assets/img/ach-parikshak-2.jpg", "assets/img/ach-parikshak-3.jpg"], "tags": ["Growth Partner", "Leadership", "Career Tech"], "github": "", "metrics": ["Growth Partner", "Leadership", "Career Tech"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Selected as a Campus Ambassador for the Parikshak.ai Growth Partner Program, where I contributed to promoting AI-powered interview preparation and career development resources among students. I supported student outreach, awareness campaigns and community engagement while helping learners understand modern interview practices, placement preparation and AI-driven learning tools.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Growth Partner", "Leadership", "Career Tech"]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "Parikshak.ai · Growth Partner Program", "bullets": ["Growth Partner", "Leadership", "Career Tech"]}]}, "achievement-google-cloud-arcade-facilitator-program-2024": {"id": "achievement-google-cloud-arcade-facilitator-program-2024", "category": "Achievement", "anchor": "achievements", "title": "Google Cloud Arcade Facilitator Program 2024", "eyebrow": "Premium Plus Milestone Level", "summary": "Successfully achieved the Premium Plus Milestone in the Google Cloud Arcade Facilitator Program 2024 by completing multiple hands on labs, skill badges and cloud-learning challenges. Gained practical exposure to Google Cloud services, Kubernetes, AI/ML, cloud security, networking and infrastructure fundamentals.", "images": ["assets/img/ach-gcloud-1.jpg", "assets/img/ach-gcloud-2.jpg", "assets/img/ach-gcloud-3.jpg"], "tags": ["Premium Plus", "Kubernetes", "AI/ML"], "github": "", "metrics": ["Premium Plus", "Kubernetes", "AI/ML"], "steps": [{"kicker": "01 · Milestone", "title": "What This Achievement Represents", "text": "Successfully achieved the Premium Plus Milestone in the Google Cloud Arcade Facilitator Program 2024 by completing multiple hands on labs, skill badges and cloud-learning challenges. Gained practical exposure to Google Cloud services, Kubernetes, AI/ML, cloud security, networking and infrastructure fundamentals.", "bullets": []}, {"kicker": "02 · Highlights", "title": "Key Highlights", "text": "The original portfolio card highlights the following outcomes, responsibilities or technical contributions.", "bullets": ["Premium Plus", "Kubernetes", "AI/ML"]}, {"kicker": "03 · Evidence", "title": "Recognition & Context", "text": "Premium Plus Milestone Level", "bullets": ["Premium Plus", "Kubernetes", "AI/ML"]}]}};

(function initPortfolioCardNavigation() {
  const cards = document.querySelectorAll(
    ".project-card[data-detail-id], .research-card[data-detail-id], .experience-card[data-detail-id], .achievement-card[data-detail-id]"
  );

  const openCard = (card) => {
    const id = card.dataset.detailId;
    const item = portfolioDetailData[id];
    if (!id || !item) return;

    sessionStorage.setItem(
      "portfolioDetailReturn",
      `index.html#${item.anchor || "home"}`
    );

    window.location.href = `detail.html?id=${encodeURIComponent(id)}`;
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const interactive = event.target.closest("a, button, input, textarea, select");
      if (interactive) return;
      openCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("a, button, input, textarea, select")) return;
      event.preventDefault();
      openCard(card);
    });
  });
})();

(function initPortfolioDetailPage() {
  const root = document.getElementById("detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const item = id ? portfolioDetailData[id] : null;

  const backButton = document.getElementById("detail-back");
  const fallbackBack = item
    ? `index.html#${item.anchor || "home"}`
    : "index.html#home";

  if (backButton) {
    backButton.addEventListener("click", () => {
      const stored = sessionStorage.getItem("portfolioDetailReturn");
      window.location.href = stored || fallbackBack;
    });
  }

  if (!item) {
    root.innerHTML = `
      <section class="detail-not-found">
        <h1>Detail not found</h1>
        <p>The requested portfolio entry could not be loaded.</p>
        <a class="detail-action primary" href="index.html#home">
          <i class="bx bx-left-arrow-alt"></i> Return to Portfolio
        </a>
      </section>
    `;
    return;
  }

  document.title = `${item.title} | Rahul Takale`;

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const heroImage = item.images && item.images.length ? item.images[0] : "";
  const heroMedia = heroImage
    ? `<div class="detail-hero-media"><img src="${esc(heroImage)}" alt="${esc(item.title)}" /></div>`
    : `<div class="detail-hero-media detail-no-image"></div>`;

  const githubAction = item.github
    ? `
      <a class="detail-action primary" href="${esc(item.github)}" target="_blank" rel="noopener noreferrer">
        <i class="bx bxl-github"></i>
        View GitHub Code
      </a>
    `
    : "";

  const tags = (item.tags || [])
    .map((tag) => `<span>${esc(tag)}</span>`)
    .join("");

  const steps = (item.steps || [])
    .map((step, index) => {
      const bullets = (step.bullets || [])
        .filter(Boolean)
        .map((bullet) => `<div class="detail-bullet">${esc(bullet)}</div>`)
        .join("");

      return `
        <article class="detail-story-step" id="story-step-${index + 1}" data-detail-step="${index}">
          <span class="step-kicker">${esc(step.kicker || `Step ${index + 1}`)}</span>
          <h3>${esc(step.title || "")}</h3>
          <p>${esc(step.text || "")}</p>
          ${bullets ? `<div class="detail-bullets">${bullets}</div>` : ""}
        </article>
      `;
    })
    .join("");

  const nav = (item.steps || [])
    .map(
      (step, index) => `
        <button type="button" data-step-target="${index}" class="${index === 0 ? "active" : ""}">
          ${String(index + 1).padStart(2, "0")} · ${esc(step.title || "Story")}
        </button>
      `
    )
    .join("");

  const mediaImages = (item.images || [])
    .map(
      (src, index) =>
        `<img loading="lazy" src="${esc(src)}" alt="${esc(item.title)} supporting visual ${index + 1}" />`
    )
    .join("");

  root.innerHTML = `
    <section class="detail-hero">
      ${heroMedia}
      <div class="detail-hero-shade"></div>
      <div class="detail-hero-inner">
        <span class="detail-category"><i class="bx bx-layer"></i>${esc(item.category)}</span>
        <h1>${esc(item.title)}</h1>
        <p class="detail-eyebrow">${esc(item.eyebrow || "")}</p>
        <p class="detail-summary">${esc(item.summary || "")}</p>
        <div class="detail-actions">
          ${githubAction}
          <button class="detail-action" type="button" id="detail-inline-back">
            <i class="bx bx-left-arrow-alt"></i> Back to ${esc(item.category)}
          </button>
        </div>
        ${tags ? `<div class="detail-tags">${tags}</div>` : ""}
      </div>
    </section>

    <section class="detail-story">
      <aside class="detail-story-rail">
        <small>SCROLLY STORY</small>
        <h2>Inside the Work</h2>
        <div class="detail-progress-track">
          <span class="detail-progress-fill" id="detail-progress-fill"></span>
        </div>
        <div class="detail-step-nav">${nav}</div>
      </aside>

      <div class="detail-story-content">
        ${steps}
      </div>
    </section>

    ${
      mediaImages
        ? `
          <section class="detail-media-strip">
            <h2>Supporting Visuals</h2>
            <div class="detail-media-grid">${mediaImages}</div>
          </section>
        `
        : ""
    }
  `;

  const inlineBack = document.getElementById("detail-inline-back");
  if (inlineBack) {
    inlineBack.addEventListener("click", () => {
      window.location.href =
        sessionStorage.getItem("portfolioDetailReturn") || fallbackBack;
    });
  }

  const storySteps = [...document.querySelectorAll(".detail-story-step")];
  const navButtons = [...document.querySelectorAll("[data-step-target]")];
  const progressFill = document.getElementById("detail-progress-fill");
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  const setActiveStep = (index) => {
    navButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
    });

    const total = Math.max(1, storySteps.length - 1);
    const progress = storySteps.length <= 1 ? 100 : (index / total) * 100;

    if (progressFill) {
      if (mobileQuery.matches) {
        progressFill.style.width = `${progress}%`;
        progressFill.style.height = "100%";
      } else {
        progressFill.style.height = `${progress}%`;
        progressFill.style.width = "100%";
      }
    }
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.stepTarget || 0);
      storySteps[target]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  });

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    storySteps.forEach((step) => step.classList.add("in-view"));
    setActiveStep(0);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.detailStep || 0);
        entry.target.classList.add("in-view");
        setActiveStep(index);
      });
    },
    {
      threshold: 0.44,
      rootMargin: "-10% 0px -28% 0px",
    }
  );

  storySteps.forEach((step) => observer.observe(step));

  if (storySteps[0]) storySteps[0].classList.add("in-view");
  setActiveStep(0);
})();
