document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = form.querySelector('.form-note');
    if (note) {
      note.textContent = 'Спасибо! Заявка заполнена. Подключите Google Sheets или почту для реальной отправки.';
    }
    form.reset();
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const slides = Array.from(carousel.querySelectorAll('.letter-card'));
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const dotsContainer = carousel.querySelector('[data-carousel-dots]');

  if (!viewport || slides.length === 0 || !previous || !next || !dotsContainer) {
    return;
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Показать грамоту ${index + 1}`);
    dot.addEventListener('click', () => {
      slides[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsContainer.append(dot);
    return dot;
  });

  const getCurrentIndex = () => {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    return slides.reduce((closestIndex, slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const closestCenter = slides[closestIndex].offsetLeft + slides[closestIndex].offsetWidth / 2;
      return Math.abs(slideCenter - center) < Math.abs(closestCenter - center) ? index : closestIndex;
    }, 0);
  };

  const updateState = () => {
    const active = getCurrentIndex();
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    previous.disabled = active === 0;
    next.disabled = active === slides.length - 1;
  };

  const goTo = (offset) => {
    const target = Math.min(Math.max(getCurrentIndex() + offset, 0), slides.length - 1);
    slides[target].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  previous.addEventListener('click', () => goTo(-1));
  next.addEventListener('click', () => goTo(1));
  viewport.addEventListener('scroll', () => window.requestAnimationFrame(updateState), { passive: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(-1);
    if (event.key === 'ArrowRight') goTo(1);
  });

  updateState();
});

const revealItems = document.querySelectorAll('.service-card, .tool-card, .request-grid article, .about-card, .statement-card, .contact-form');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    if (item.getBoundingClientRect().top < window.innerHeight) {
      item.classList.add('is-visible');
    } else {
      revealObserver.observe(item);
    }
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
