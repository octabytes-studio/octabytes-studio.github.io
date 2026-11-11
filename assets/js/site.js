(() => {
  "use strict";

  const doc = document;
  const html = doc.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = doc.getElementById("site-header");
  const menuToggle = doc.querySelector(".menu-toggle");
  const mobileNav = doc.getElementById("mobile-nav");
  const backdrop = doc.querySelector(".nav-backdrop");
  const pageMain = doc.getElementById("main");
  const pageFooter = doc.querySelector(".footer");
  const lightbox = doc.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox-img");
  const lightboxCaption = doc.getElementById("lightbox-caption");
  const lightboxCount = lightbox?.querySelector(".lightbox-count");
  const toast = doc.getElementById("toast");
  const year = doc.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header state ---------- */
  let scrollTicking = false;
  const updateHeader = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 14);
    }
    scrollTicking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
  updateHeader();

  /* ---------- Mobile menu ---------- */
  let closeMenuTimer = 0;
  const setMenu = (open) => {
    if (!menuToggle || !mobileNav || !backdrop) return;
    window.clearTimeout(closeMenuTimer);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("no-scroll", open);
    if (pageMain) pageMain.inert = open;
    if (pageFooter) pageFooter.inert = open;

    if (open) {
      mobileNav.hidden = false;
      backdrop.hidden = false;
      window.requestAnimationFrame(() => {
        mobileNav.classList.add("is-open");
        backdrop.classList.add("is-open");
      });
      const firstLink = mobileNav.querySelector("a");
      if (firstLink) window.setTimeout(() => firstLink.focus({ preventScroll: true }), 80);
    } else {
      mobileNav.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      const delay = reduceMotion.matches ? 0 : 240;
      closeMenuTimer = window.setTimeout(() => {
        mobileNav.hidden = true;
        backdrop.hidden = true;
      }, delay);
    }
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
      menuToggle?.focus({ preventScroll: true });
    });
  });

  backdrop?.addEventListener("click", () => {
    setMenu(false);
    menuToggle?.focus({ preventScroll: true });
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = doc.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Active nav ---------- */
  const navLinks = Array.from(doc.querySelectorAll(".nav-links a"));
  const sectionIds = ["work", "studio", "craft", "process"];
  const sections = sectionIds
    .map((id) => doc.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Octagon + capability list ---------- */
  const octa = doc.getElementById("octa");
  const capabilityItems = Array.from(doc.querySelectorAll(".capability"));
  const octaSides = Array.from(doc.querySelectorAll(".octa-sides line"));
  const octaNum = doc.getElementById("octa-num");
  const octaLabel = doc.getElementById("octa-label");

  const resetOcta = () => {
    if (!octa) return;
    octa.classList.remove("is-active");
    octaSides.forEach((side) => side.classList.remove("is-on"));
    if (octaNum) octaNum.textContent = "08";
    if (octaLabel) octaLabel.textContent = "Sides of one studio";
  };

  const activateOcta = (index) => {
    if (!octa) return;
    const item = capabilityItems[index];
    const title = item?.querySelector("h3")?.textContent?.trim();
    if (!title) return;
    octa.classList.add("is-active");
    octaSides.forEach((side, sideIndex) => side.classList.toggle("is-on", sideIndex === index));
    if (octaNum) octaNum.textContent = String(index + 1).padStart(2, "0");
    if (octaLabel) octaLabel.textContent = title;
  };

  capabilityItems.forEach((item, index) => {
    item.addEventListener("pointerenter", () => activateOcta(index));
    item.addEventListener("pointerleave", resetOcta);
    item.addEventListener("focusin", () => activateOcta(index));
    item.addEventListener("focusout", resetOcta);
  });

  /* ---------- Galleries ---------- */
  const galleryDefs = {};
  doc.querySelectorAll("template[data-gallery]").forEach((template) => {
    const key = template.getAttribute("data-gallery");
    const shots = Array.from(template.content.querySelectorAll("[data-src]")).map((shot) => ({
      src: shot.getAttribute("data-src"),
      caption: shot.getAttribute("data-caption") || "",
      alt: shot.getAttribute("data-alt") || "",
    }));
    if (key && shots.length) galleryDefs[key] = shots;
  });

  let activeGallery = null;
  let activeIndex = 0;
  let galleryTrigger = null;

  const renderGallery = () => {
    if (!activeGallery) return;
    const shots = galleryDefs[activeGallery];
    const shot = shots[activeIndex];
    if (!shot) return;
    if (lightboxImg) {
      lightboxImg.src = shot.src;
      lightboxImg.alt = shot.alt;
    }
    if (lightboxCaption) lightboxCaption.textContent = shot.caption;
    if (lightboxCount) lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;

    const next = shots[(activeIndex + 1) % shots.length];
    if (next) {
      const preloader = new Image();
      preloader.src = next.src;
    }
  };

  const openGallery = (key, trigger) => {
    if (!lightbox || !galleryDefs[key]) return;
    activeGallery = key;
    activeIndex = 0;
    galleryTrigger = trigger || null;
    renderGallery();
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
    doc.body.classList.add("no-scroll");
  };

  const closeGallery = () => {
    if (!lightbox) return;
    if (typeof lightbox.close === "function") {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
    doc.body.classList.remove("no-scroll");
    if (galleryTrigger) galleryTrigger.focus({ preventScroll: true });
  };

  const stepGallery = (direction) => {
    if (!activeGallery) return;
    const length = galleryDefs[activeGallery].length;
    activeIndex = (activeIndex + direction + length) % length;
    renderGallery();
  };

  doc.querySelectorAll(".gallery-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => openGallery(trigger.getAttribute("data-gallery"), trigger));
  });

  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeGallery);
  lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => stepGallery(-1));
  lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => stepGallery(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeGallery();
  });

  lightbox?.addEventListener("close", () => {
    doc.body.classList.remove("no-scroll");
    if (galleryTrigger) galleryTrigger.focus({ preventScroll: true });
  });

  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepGallery(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepGallery(1);
    }
  });

  /* ---------- Copy email ---------- */
  let toastTimer = 0;
  const showToast = (message) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  doc.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const textarea = doc.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          doc.body.appendChild(textarea);
          textarea.select();
          doc.execCommand("copy");
          textarea.remove();
        }
        showToast("Email copied");
      } catch (error) {
        showToast("Copy failed — select the email");
      }
    });
  });
})();
