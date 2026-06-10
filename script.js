const header = document.querySelector(".site-header");
const progress = document.querySelector("#scrollProgress");
const reveals = document.querySelectorAll(".reveal");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".main-nav a");
const filters = document.querySelectorAll(".filter");
const workoutCards = document.querySelectorAll(".workout-card");
const heroImage = document.querySelector(".hero-media img");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.03, rootMargin: "0px 0px 18% 0px" },
);

reveals.forEach((node) => revealObserver.observe(node));

function updateScrollState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", scrollTop > 24);

  if (heroImage) {
    heroImage.style.transform = `scale(1.06) translateY(${scrollTop * 0.04}px)`;
  }
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === filter));

    workoutCards.forEach((card) => {
      const isVisible = selected === "all" || card.dataset.type === selected;
      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) {
        card.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 260, easing: "ease-out" },
        );
      }
    });
  });
});

document.querySelector(".signup-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const originalText = button.textContent;
  button.textContent = "Plan Queued";
  setTimeout(() => {
    button.textContent = originalText;
    event.currentTarget.reset();
  }, 1800);
});

updateScrollState();
