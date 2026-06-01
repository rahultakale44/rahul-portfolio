/* MENU TOGGLE */
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon && navbar) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };
}

/* CLOSE MENU ON LINK CLICK */
const navLinks = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section[id]");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menuIcon && navbar) {
      menuIcon.classList.remove("bx-x");
      navbar.classList.remove("active");
    }
  });
});

/* ACTIVE NAVBAR LINK ON SCROLL */
window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* NETFLIX STYLE HERO SLIDESHOW */
const slides = document.querySelectorAll(".slide");
let slideIndex = 0;

function showNextSlide() {
  if (slides.length === 0) return;

  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}

setInterval(showNextSlide, 5000);

/* HEADER SHADOW ON SCROLL */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 60) {
    header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.35)";
  } else {
    header.style.boxShadow = "none";
  }
});

/* SCROLL REVEAL ANIMATION */
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    distance: "70px",
    duration: 1500,
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

/* EMAILJS CONTACT FORM */
if (typeof emailjs !== "undefined") {
  emailjs.init("Oe2zLK_m-zVxayU5f");
}

const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");

if (contactForm && contactBtn && typeof emailjs !== "undefined") {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    contactBtn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> Sending...`;
    contactBtn.disabled = true;

    emailjs
      .sendForm("service_wpdzrqh", "template_9omquwt", contactForm)
      .then(() => {
        alert("Message sent successfully!");
        contactForm.reset();
        contactBtn.innerHTML = `<i class="bx bx-send"></i> Send Message`;
        contactBtn.disabled = false;
      })
      .catch((error) => {
        console.log("EmailJS Error:", error);
        alert("Message failed. Please try again.");
        contactBtn.innerHTML = `<i class="bx bx-send"></i> Send Message`;
        contactBtn.disabled = false;
      });
  });
}

/* PREMIUM CARD + SECTION HEADING REVEAL ANIMATION */
const animatedCards = document.querySelectorAll(
  ".tech-heading, .projects-heading, .experience-heading, .achievements-heading, .contact-heading, .tech-card, .project-card, .experience-card, .experience-gallery, .achievement-card, .contact-card, .contact-form"
);

animatedCards.forEach((card) => {
  card.classList.add("reveal-card");
});

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.12,
  }
);

animatedCards.forEach((card) => {
  cardObserver.observe(card);
});