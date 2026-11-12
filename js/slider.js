/* ==========================================================================
   Solara Travel Booking — Responsive Testimonial Slider
   ========================================================================== */

(function (global) {
  'use strict';

  function createTestimonialSlider(options) {
    const {
      trackEl,
      dotsEl,
      prevBtn,
      nextBtn,
      items,
      renderCard
    } = options;

    if (!trackEl || !Array.isArray(items) || items.length === 0) {
      return null;
    }

    let currentIndex = 0;
    let visibleCount = getVisibleCount();
    let autoPlayTimer = null;
    let touchStartX = 0;

    function getVisibleCount() {
      const width = global.innerWidth;
      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, items.length - visibleCount);
    }

    function renderSlides() {
      trackEl.innerHTML = items.map(renderCard).join('');
      trackEl.style.setProperty('--visible-slides', String(visibleCount));
    }

    function renderDots() {
      if (!dotsEl) return;
      const totalStops = getMaxIndex() + 1;
      const buttons = [];
      for (let i = 0; i < totalStops; i += 1) {
        const isActive = i === currentIndex;
        buttons.push(
          `<button type="button" class="slider-dot${isActive ? ' is-active' : ''}" data-slide-index="${i}" aria-label="Show testimonials group ${i + 1}" aria-pressed="${isActive}"></button>`
        );
      }
      dotsEl.innerHTML = buttons.join('');
    }

    function updatePosition() {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const firstCard = trackEl.querySelector('.testimonial-card');
      if (firstCard) {
        const trackStyles = global.getComputedStyle(trackEl);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '24') || 24;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const offset = currentIndex * (cardWidth + gap);
        trackEl.style.transform = `translateX(-${offset}px)`;
      }

      if (prevBtn) {
        prevBtn.disabled = items.length <= visibleCount;
      }
      if (nextBtn) {
        nextBtn.disabled = items.length <= visibleCount;
      }

      if (dotsEl) {
        const dotBtns = dotsEl.querySelectorAll('.slider-dot');
        dotBtns.forEach((btn, idx) => {
          const active = idx === currentIndex;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
        });
      }
    }

    function goTo(index) {
      const maxIndex = getMaxIndex();
      if (index > maxIndex) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex = index;
      }
      updatePosition();
    }

    function next() {
      goTo(currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      autoPlayTimer = global.setInterval(() => {
        next();
      }, 6500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        global.clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function handleResize() {
      const nextCount = getVisibleCount();
      if (nextCount !== visibleCount) {
        visibleCount = nextCount;
        trackEl.style.setProperty('--visible-slides', String(visibleCount));
        renderDots();
      }
      updatePosition();
    }

    function bindEvents() {
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prev();
          startAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          next();
          startAutoPlay();
        });
      }

      if (dotsEl) {
        dotsEl.addEventListener('click', (event) => {
          const dot = event.target.closest('[data-slide-index]');
          if (!dot) return;
          const idx = Number(dot.dataset.slideIndex);
          goTo(idx);
          startAutoPlay();
        });
      }

      const viewport = trackEl.parentElement;
      if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoPlay);
        viewport.addEventListener('mouseleave', startAutoPlay);
        viewport.addEventListener('focusin', stopAutoPlay);
        viewport.addEventListener('focusout', startAutoPlay);
        viewport.setAttribute('tabindex', '0');
        viewport.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight') {
            next();
            startAutoPlay();
          } else if (event.key === 'ArrowLeft') {
            prev();
            startAutoPlay();
          }
        });

        viewport.addEventListener(
          'touchstart',
          (event) => {
            touchStartX = event.changedTouches[0].clientX;
            stopAutoPlay();
          },
          { passive: true }
        );

        viewport.addEventListener(
          'touchend',
          (event) => {
            const deltaX = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 45) {
              if (deltaX < 0) next();
              else prev();
            }
            startAutoPlay();
          },
          { passive: true }
        );
      }

      global.addEventListener('resize', handleResize);
    }

    renderSlides();
    renderDots();
    bindEvents();
    global.requestAnimationFrame(updatePosition);
    startAutoPlay();

    return {
      next,
      prev,
      goTo,
      refresh: updatePosition
    };
  }

  global.SolaraSlider = {
    createTestimonialSlider
  };
})(window);
