const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const counterElements = document.querySelectorAll('.counter');
const revealElements = document.querySelectorAll('.section-reveal');
const anchorLinks = document.querySelectorAll('a[href^="#"]');

const closeNavigation = () => {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    closeNavigation();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1800;
  const startTime = performance.now();

  const updateValue = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const value = Math.floor(target * easeOutQuart);

    element.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateValue);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(updateValue);
};

let countersTriggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      if (entry.target.classList.contains('counter') && !countersTriggered) {
        countersTriggered = true;
        counterElements.forEach(animateCounter);
      }

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

revealElements.forEach((element) => observer.observe(element));

if (counterElements.length) {
  counterElements.forEach((element) => observer.observe(element));
}

const updateScrollTopButton = () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
};

window.addEventListener('scroll', updateScrollTopButton, { passive: true });
updateScrollTopButton();

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('click', (event) => {
  if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeNavigation();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeNavigation();
  }
});