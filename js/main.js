/* ==========================================================================
   Solara Travel Booking — Application Controller
   ========================================================================== */

(function (global) {
  'use strict';

  const {
    DESTINATIONS,
    HOTELS,
    SPECIAL_OFFERS,
    WHY_CHOOSE_US,
    TESTIMONIALS
  } = global.SolaraData;

  const Storage = global.SolaraStorage;
  const Validation = global.SolaraValidation;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatCurrency(amount) {
    return `$${Number(amount).toLocaleString('en-US')}`;
  }

  function getWhyIconSvg(id) {
    const icons = {
      curated:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path></svg>',
      transparent:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
      flexible:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><path d="m9 14 2 2 4-4"></path></svg>',
      concierge:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
    };
    return icons[id] || icons.curated;
  }

  function buildImgTag(item, extraClass) {
    const fallbackAttr = item.fallbackImage
      ? ` onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${escapeHtml(item.fallbackImage)}';}"`
      : '';
    const cls = extraClass ? ` class="${escapeHtml(extraClass)}"` : '';
    return `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy"${cls}${fallbackAttr} />`;
  }

  function init() {
    const todayStr = Validation.getTodayDateString();
    const savedSearch = Storage.getSearchPrefs();

    let defaultCheckIn = Validation.addDays(todayStr, 7);
    let defaultCheckOut = Validation.addDays(todayStr, 10);
    let defaultQuery = '';
    let defaultDestId = 'all';
    let defaultAdults = 2;
    let defaultChildren = 0;
    let defaultRooms = 1;

    if (savedSearch) {
      const checkSavedDates = Validation.validateDateRange(
        savedSearch.checkIn,
        savedSearch.checkOut
      );
      if (checkSavedDates.valid) {
        defaultCheckIn = savedSearch.checkIn;
        defaultCheckOut = savedSearch.checkOut;
      }
      if (typeof savedSearch.searchQuery === 'string') {
        defaultQuery = savedSearch.searchQuery;
      }
      if (typeof savedSearch.destinationId === 'string') {
        defaultDestId = savedSearch.destinationId;
      }
      const normalizedGuests = Validation.validateGuestsAndRooms(
        savedSearch.adults,
        savedSearch.children,
        savedSearch.rooms
      );
      defaultAdults = normalizedGuests.adults;
      defaultChildren = normalizedGuests.children;
      defaultRooms = normalizedGuests.rooms;
    }

    const state = {
      searchQuery: defaultQuery,
      selectedDestinationId: defaultDestId,
      regionFilter: 'All',
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      nights: Validation.calculateNights(defaultCheckIn, defaultCheckOut) || 3,
      adults: defaultAdults,
      children: defaultChildren,
      rooms: defaultRooms,
      maxPrice: 800,
      minRating: 0,
      sortBy: 'recommended',
      wishlist: Storage.getWishlist(),
      appliedCouponCode: Storage.getAppliedCoupon() || null,
      activeModalHotelId: null,
      hasRenderedHotelsOnce: false,
      hasRenderedDestinationsOnce: false
    };

    // DOM Elements
    const els = {
      siteHeader: document.getElementById('siteHeader'),
      headerPromoPill: document.getElementById('headerPromoPill'),
      wishlistOpenBtn: document.getElementById('wishlistOpenBtn'),
      wishlistCount: document.getElementById('wishlistCount'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      mobileNavBackdrop: document.getElementById('mobileNavBackdrop'),
      mobileNavPanel: document.getElementById('mobileNavPanel'),
      mobileNavCloseBtn: document.getElementById('mobileNavCloseBtn'),
      mobileWishlistBtn: document.getElementById('mobileWishlistBtn'),

      heroSearchForm: document.getElementById('heroSearchForm'),
      destinationInput: document.getElementById('destinationInput'),
      clearDestinationBtn: document.getElementById('clearDestinationBtn'),
      destinationSuggestions: document.getElementById('destinationSuggestions'),
      checkInField: document.getElementById('checkInField'),
      checkOutField: document.getElementById('checkOutField'),
      checkInInput: document.getElementById('checkInInput'),
      checkOutInput: document.getElementById('checkOutInput'),
      guestTriggerBtn: document.getElementById('guestTriggerBtn'),
      guestSummaryText: document.getElementById('guestSummaryText'),
      guestPopover: document.getElementById('guestPopover'),
      adultsValue: document.getElementById('adultsValue'),
      childrenValue: document.getElementById('childrenValue'),
      roomsValue: document.getElementById('roomsValue'),
      guestDoneBtn: document.getElementById('guestDoneBtn'),
      searchValidationMsg: document.getElementById('searchValidationMsg'),

      regionFilters: document.getElementById('regionFilters'),
      destinationsGrid: document.getElementById('destinationsGrid'),

      contextDestinationChip: document.getElementById('contextDestinationChip'),
      contextDatesChip: document.getElementById('contextDatesChip'),
      contextGuestsChip: document.getElementById('contextGuestsChip'),
      contextPromoChip: document.getElementById('contextPromoChip'),
      clearPromoBtn: document.getElementById('clearPromoBtn'),

      hotelDestinationFilter: document.getElementById('hotelDestinationFilter'),
      priceRangeFilter: document.getElementById('priceRangeFilter'),
      priceRangeLabel: document.getElementById('priceRangeLabel'),
      ratingFilters: document.getElementById('ratingFilters'),
      hotelSortSelect: document.getElementById('hotelSortSelect'),
      resetFiltersBtn: document.getElementById('resetFiltersBtn'),
      hotelsResultCount: document.getElementById('hotelsResultCount'),
      hotelsGrid: document.getElementById('hotelsGrid'),

      offersGrid: document.getElementById('offersGrid'),
      whyChooseGrid: document.getElementById('whyChooseGrid'),

      testimonialPrevBtn: document.getElementById('testimonialPrevBtn'),
      testimonialNextBtn: document.getElementById('testimonialNextBtn'),
      testimonialTrack: document.getElementById('testimonialTrack'),
      testimonialDots: document.getElementById('testimonialDots'),

      newsletterForm: document.getElementById('newsletterForm'),
      newsletterInterest: document.getElementById('newsletterInterest'),
      newsletterEmail: document.getElementById('newsletterEmail'),
      newsletterConsent: document.getElementById('newsletterConsent'),
      newsletterFeedback: document.getElementById('newsletterFeedback'),

      wishlistBackdrop: document.getElementById('wishlistBackdrop'),
      wishlistDrawer: document.getElementById('wishlistDrawer'),
      wishlistCloseBtn: document.getElementById('wishlistCloseBtn'),
      wishlistItems: document.getElementById('wishlistItems'),
      wishlistClearBtn: document.getElementById('wishlistClearBtn'),
      wishlistExploreBtn: document.getElementById('wishlistExploreBtn'),

      estimatorBackdrop: document.getElementById('estimatorBackdrop'),
      estimatorModal: document.getElementById('estimatorModal'),
      estimatorCloseBtn: document.getElementById('estimatorCloseBtn'),
      estimatorHotelSummary: document.getElementById('estimatorHotelSummary'),
      modalCheckIn: document.getElementById('modalCheckIn'),
      modalCheckOut: document.getElementById('modalCheckOut'),
      modalRooms: document.getElementById('modalRooms'),
      modalAdults: document.getElementById('modalAdults'),
      modalChildren: document.getElementById('modalChildren'),
      modalCouponInput: document.getElementById('modalCouponInput'),
      modalApplyCouponBtn: document.getElementById('modalApplyCouponBtn'),
      modalCouponNote: document.getElementById('modalCouponNote'),
      modalDateError: document.getElementById('modalDateError'),
      modalBreakdown: document.getElementById('modalBreakdown'),
      modalSaveEstimateBtn: document.getElementById('modalSaveEstimateBtn'),
      modalConfirmFeedback: document.getElementById('modalConfirmFeedback'),

      toastRegion: document.getElementById('toastRegion')
    };

    // =========================================================================
    // Toast Notification Helper
    // =========================================================================
    function showToast(message, variant = 'default') {
      if (!els.toastRegion) return;
      const toast = document.createElement('div');
      toast.className = `toast-pill${variant === 'success' ? ' is-success' : ''}`;
      toast.textContent = message;
      els.toastRegion.appendChild(toast);

      global.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
        global.setTimeout(() => toast.remove(), 200);
      }, 2800);
    }

    // =========================================================================
    // Promo & Pricing Helpers
    // =========================================================================
    function getActiveOffer() {
      if (!state.appliedCouponCode) return null;
      return (
        SPECIAL_OFFERS.find(
          (offer) => offer.code.toUpperCase() === state.appliedCouponCode.toUpperCase()
        ) || null
      );
    }

    function persistSearchState() {
      Storage.saveSearchPrefs({
        searchQuery: state.searchQuery,
        destinationId: state.selectedDestinationId,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        adults: state.adults,
        children: state.children,
        rooms: state.rooms
      });
    }

    function applyPromoCode(code) {
      const normalized = (code || '').trim().toUpperCase();
      if (!normalized) {
        state.appliedCouponCode = null;
        Storage.saveAppliedCoupon(null);
        updatePromoUI();
        renderHotels();
        renderOffers();
        if (state.activeModalHotelId) updateModalEstimate();
        return { ok: true, cleared: true };
      }

      const matched = SPECIAL_OFFERS.find((o) => o.code.toUpperCase() === normalized);
      if (!matched) {
        return { ok: false, message: `Promo code "${normalized}" not recognized.` };
      }

      state.appliedCouponCode = matched.code;
      Storage.saveAppliedCoupon(matched.code);
      updatePromoUI();
      renderHotels();
      renderOffers();
      renderWishlistDrawer();
      if (state.activeModalHotelId) updateModalEstimate();

      return { ok: true, offer: matched };
    }

    function updatePromoUI() {
      const offer = getActiveOffer();
      if (offer) {
        els.headerPromoPill.textContent = `${offer.code} (${offer.discountLabel}) ×`;
        els.headerPromoPill.hidden = false;

        els.contextPromoChip.textContent = `Promo: ${offer.code} (${offer.discountLabel})`;
        els.contextPromoChip.hidden = false;
        els.clearPromoBtn.hidden = false;
      } else {
        els.headerPromoPill.hidden = true;
        els.contextPromoChip.hidden = true;
        els.clearPromoBtn.hidden = true;
      }
    }

    // =========================================================================
    // Header Scroll & Mobile Navigation
    // =========================================================================
    function updateHeaderOnScroll() {
      const scrolled = global.scrollY > 36;
      els.siteHeader.classList.toggle('is-scrolled', scrolled);
    }

    function openMobileNav() {
      els.mobileNavBackdrop.classList.add('is-open');
      els.mobileNavPanel.classList.add('is-open');
      els.mobileNavBackdrop.setAttribute('aria-hidden', 'false');
      els.mobileNavPanel.setAttribute('aria-hidden', 'false');
      els.mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }

    function closeMobileNav() {
      els.mobileNavBackdrop.classList.remove('is-open');
      els.mobileNavPanel.classList.remove('is-open');
      els.mobileNavBackdrop.setAttribute('aria-hidden', 'true');
      els.mobileNavPanel.setAttribute('aria-hidden', 'true');
      els.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    // =========================================================================
    // Search Bar, Dates, Guests & Autocomplete
    // =========================================================================
    function syncGuestControlsUI() {
      const totalGuests = state.adults + state.children;
      const guestLabel = `${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'}`;
      const roomLabel = `${state.rooms} ${state.rooms === 1 ? 'Room' : 'Rooms'}`;
      els.guestSummaryText.textContent = `${guestLabel} · ${roomLabel}`;

      els.adultsValue.textContent = String(state.adults);
      els.childrenValue.textContent = String(state.children);
      els.roomsValue.textContent = String(state.rooms);

      const decAdults = els.guestPopover.querySelector('[data-guest-control="adults"][data-action="dec"]');
      const incAdults = els.guestPopover.querySelector('[data-guest-control="adults"][data-action="inc"]');
      const decChildren = els.guestPopover.querySelector('[data-guest-control="children"][data-action="dec"]');
      const incChildren = els.guestPopover.querySelector('[data-guest-control="children"][data-action="inc"]');
      const decRooms = els.guestPopover.querySelector('[data-guest-control="rooms"][data-action="dec"]');
      const incRooms = els.guestPopover.querySelector('[data-guest-control="rooms"][data-action="inc"]');

      decAdults.disabled = state.adults <= 1;
      incAdults.disabled = state.adults >= 12;
      decChildren.disabled = state.children <= 0;
      incChildren.disabled = state.children >= 8;
      decRooms.disabled = state.rooms <= 1;
      incRooms.disabled = state.rooms >= Math.min(6, state.adults);
    }

    function updateDatesValidationUI(showFeedbackToast) {
      const result = Validation.validateDateRange(
        els.checkInInput.value,
        els.checkOutInput.value
      );

      els.checkInField.classList.toggle('has-error', result.errorField === 'checkIn');
      els.checkOutField.classList.toggle('has-error', result.errorField === 'checkOut');

      if (!result.valid) {
        els.searchValidationMsg.textContent = result.message;
        els.searchValidationMsg.classList.add('is-error');
        if (showFeedbackToast) showToast(result.message);
        return false;
      }

      state.checkIn = els.checkInInput.value;
      state.checkOut = els.checkOutInput.value;
      state.nights = result.nights;
      els.checkOutInput.min = Validation.addDays(state.checkIn, 1);

      els.searchValidationMsg.textContent = `${result.nights} ${result.nights === 1 ? 'night' : 'nights'} selected · Instant rate estimator active`;
      els.searchValidationMsg.classList.remove('is-error');

      persistSearchState();
      updateTripContextBanner();
      renderHotels();
      renderWishlistDrawer();
      return true;
    }

    function renderDestinationSuggestions(query) {
      const trimmed = (query || '').trim().toLowerCase();
      const matches = DESTINATIONS.filter((dest) => {
        if (!trimmed) return true;
        return (
          dest.name.toLowerCase().includes(trimmed) ||
          dest.country.toLowerCase().includes(trimmed) ||
          dest.region.toLowerCase().includes(trimmed) ||
          dest.style.toLowerCase().includes(trimmed)
        );
      });

      if (matches.length === 0) {
        els.destinationSuggestions.innerHTML = `
          <div style="padding: 12px; font-size: 0.86rem; color: var(--ink-muted);">
            No destination matches "${escapeHtml(query)}". Try Santorini, Kyoto, Amalfi, or Bali.
          </div>
        `;
      } else {
        els.destinationSuggestions.innerHTML = matches
          .map(
            (dest) => `
            <button
              type="button"
              class="suggestion-item"
              data-suggest-id="${escapeHtml(dest.id)}"
              role="option"
            >
              <div>
                <div class="suggestion-title">${escapeHtml(dest.name)}, ${escapeHtml(dest.country)}</div>
                <div class="suggestion-meta">${escapeHtml(dest.style)} · ${dest.propertyCount} stays</div>
              </div>
              <span class="suggestion-meta">From ${formatCurrency(dest.startingPrice)}/nt</span>
            </button>
          `
          )
          .join('');
      }

      els.destinationSuggestions.hidden = false;
    }

    function selectDestination(destId, shouldScroll) {
      const dest = DESTINATIONS.find((d) => d.id === destId);
      if (!dest) {
        state.selectedDestinationId = 'all';
        state.searchQuery = '';
        els.destinationInput.value = '';
        els.clearDestinationBtn.hidden = true;
      } else {
        state.selectedDestinationId = dest.id;
        state.searchQuery = dest.name;
        els.destinationInput.value = `${dest.name}, ${dest.country}`;
        els.clearDestinationBtn.hidden = false;
      }

      els.hotelDestinationFilter.value = state.selectedDestinationId;
      els.destinationSuggestions.hidden = true;

      persistSearchState();
      updateTripContextBanner();
      renderDestinations();
      renderHotels();

      if (shouldScroll) {
        const hotelsSection = document.getElementById('hotels');
        if (hotelsSection) {
          hotelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    // =========================================================================
    // Trip Context Banner
    // =========================================================================
    function updateTripContextBanner() {
      let destText = 'All Destinations';
      if (state.selectedDestinationId !== 'all') {
        const dest = DESTINATIONS.find((d) => d.id === state.selectedDestinationId);
        if (dest) destText = `${dest.name}, ${dest.country}`;
      } else if (state.searchQuery.trim()) {
        destText = `Search: "${state.searchQuery.trim()}"`;
      }

      const totalGuests = state.adults + state.children;
      els.contextDestinationChip.textContent = destText;
      els.contextDatesChip.textContent = `${state.checkIn} → ${state.checkOut} (${state.nights} ${state.nights === 1 ? 'night' : 'nights'})`;
      els.contextGuestsChip.textContent = `${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'} · ${state.rooms} ${state.rooms === 1 ? 'Room' : 'Rooms'}`;
    }

    // =========================================================================
    // Destinations Rendering
    // =========================================================================
    function populateDestinationDropdown() {
      const optionsHtml = [
        `<option value="all">All Destinations (${DESTINATIONS.length})</option>`,
        ...DESTINATIONS.map(
          (dest) =>
            `<option value="${escapeHtml(dest.id)}">${escapeHtml(dest.name)}, ${escapeHtml(dest.country)}</option>`
        )
      ].join('');
      els.hotelDestinationFilter.innerHTML = optionsHtml;
      els.hotelDestinationFilter.value = state.selectedDestinationId;
    }

    function renderDestinations() {
      const filtered = DESTINATIONS.filter(
        (dest) => state.regionFilter === 'All' || dest.region === state.regionFilter
      );

      const useAos = !state.hasRenderedDestinationsOnce;
      els.destinationsGrid.innerHTML = filtered
        .map((dest, index) => {
          const isSelected = state.selectedDestinationId === dest.id;
          const aosAttr = useAos
            ? ` data-aos="fade-up" data-aos-delay="${Math.min(index * 60, 240)}"`
            : '';
          return `
            <article class="destination-card${isSelected ? ' is-selected' : ''}"${aosAttr}>
              <div class="destination-media">
                ${buildImgTag(dest)}
                <span class="destination-region-tag">${escapeHtml(dest.region)} · ${escapeHtml(dest.bestSeason)}</span>
              </div>
              <div class="destination-body">
                <div class="destination-heading">
                  <h3 class="destination-name">${escapeHtml(dest.name)}</h3>
                  <span class="destination-country">${escapeHtml(dest.country)}</span>
                </div>
                <p class="destination-tagline">${escapeHtml(dest.tagline)}</p>
                <div class="destination-meta">
                  <span>${dest.propertyCount} curated stays</span>
                  <span class="destination-price">From <strong>${formatCurrency(dest.startingPrice)}</strong>/nt</span>
                </div>
                <button
                  type="button"
                  class="btn ${isSelected ? 'btn-accent' : 'btn-secondary'} btn-sm destination-explore-btn"
                  data-select-destination="${escapeHtml(dest.id)}"
                >
                  ${isSelected ? 'Viewing Stays ✓' : 'Explore Stays'}
                </button>
              </div>
            </article>
          `;
        })
        .join('');

      state.hasRenderedDestinationsOnce = true;
      refreshAOS();
    }

    // =========================================================================
    // Featured Hotels Filtering, Sorting & Dynamic Card Rendering
    // =========================================================================
    function getFilteredAndSortedHotels() {
      const query = state.searchQuery.trim().toLowerCase();

      const filtered = HOTELS.filter((hotel) => {
        if (
          state.selectedDestinationId !== 'all' &&
          hotel.destinationId !== state.selectedDestinationId
        ) {
          return false;
        }

        if (state.selectedDestinationId === 'all' && query) {
          const destObj = DESTINATIONS.find((d) => d.id === hotel.destinationId);
          const hay = [
            hotel.name,
            hotel.location,
            hotel.propertyType,
            hotel.description,
            destObj ? destObj.name : '',
            destObj ? destObj.country : '',
            destObj ? destObj.region : ''
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(query)) return false;
        }

        if (hotel.pricePerNight > state.maxPrice) return false;
        if (hotel.rating < state.minRating) return false;

        return true;
      });

      const sorted = [...filtered];
      switch (state.sortBy) {
        case 'price-asc':
          sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
          break;
        case 'price-desc':
          sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
          break;
        case 'rating-desc':
          sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
          break;
        case 'reviews-desc':
          sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
        default:
          sorted.sort((a, b) => b.featuredScore - a.featuredScore);
          break;
      }

      return sorted;
    }

    function renderHotels() {
      const hotels = getFilteredAndSortedHotels();
      const activeOffer = getActiveOffer();
      const useAos = !state.hasRenderedHotelsOnce;

      els.hotelsResultCount.textContent = `Showing ${hotels.length} of ${HOTELS.length} curated stays`;

      if (hotels.length === 0) {
        els.hotelsGrid.innerHTML = `
          <div class="empty-state">
            <h3>No stays match these filters</h3>
            <p>
              Try raising your maximum nightly rate, selecting a lower minimum rating, or resetting your destination search.
            </p>
            <button type="button" id="emptyResetBtn" class="btn btn-primary">
              Reset All Filters
            </button>
          </div>
        `;
        const emptyResetBtn = document.getElementById('emptyResetBtn');
        if (emptyResetBtn) {
          emptyResetBtn.addEventListener('click', resetAllHotelFilters);
        }
        state.hasRenderedHotelsOnce = true;
        return;
      }

      els.hotelsGrid.innerHTML = hotels
        .map((hotel, index) => {
          const isSaved = state.wishlist.includes(hotel.id);
          const estimate = Validation.calculateBookingEstimate({
            pricePerNight: hotel.pricePerNight,
            nights: state.nights,
            rooms: state.rooms,
            adults: state.adults,
            children: state.children,
            offer: activeOffer
          });

          const aosAttr = useAos
            ? ` data-aos="fade-up" data-aos-delay="${Math.min((index % 3) * 80, 160)}"`
            : '';

          let promoPill = '';
          if (estimate.couponStatus === 'applied') {
            promoPill = `<span class="discount-badge-inline">Saved ${formatCurrency(estimate.discountAmount)} (${escapeHtml(activeOffer.code)})</span>`;
          } else if (estimate.couponStatus === 'ineligible') {
            promoPill = `<span class="discount-badge-inline" style="background: var(--brand-accent-soft); color: var(--brand-accent-dark);">${escapeHtml(estimate.couponNote)}</span>`;
          }

          return `
            <article class="hotel-card"${aosAttr}>
              <div class="hotel-media">
                ${buildImgTag(hotel)}
                <span class="hotel-badge">${escapeHtml(hotel.badge)}</span>
                <button
                  type="button"
                  class="wishlist-heart-btn${isSaved ? ' is-active' : ''}"
                  data-wishlist-id="${escapeHtml(hotel.id)}"
                  aria-label="${isSaved ? 'Remove' : 'Save'} ${escapeHtml(hotel.name)} ${isSaved ? 'from' : 'to'} wishlist"
                  aria-pressed="${isSaved}"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </button>
              </div>

              <div class="hotel-body">
                <div class="hotel-top-meta">
                  <span>${escapeHtml(hotel.propertyType)}</span>
                  <span class="hotel-rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${hotel.rating.toFixed(hotel.rating % 1 === 0 ? 1 : 2)}
                    <span style="font-weight: 500; color: var(--ink-muted);">(${hotel.reviewsCount})</span>
                  </span>
                </div>

                <h3 class="hotel-title">${escapeHtml(hotel.name)}</h3>
                <div class="hotel-location">${escapeHtml(hotel.location)}</div>
                <p class="hotel-desc">${escapeHtml(hotel.description)}</p>

                <div class="hotel-amenities">
                  ${hotel.amenities
                    .slice(0, 3)
                    .map((item) => `<span class="amenity-chip">${escapeHtml(item)}</span>`)
                    .join('')}
                </div>

                <div class="hotel-pricing-box">
                  <div class="hotel-estimate-panel">
                    <div>
                      <div class="nightly-rate">
                        <strong>${formatCurrency(hotel.pricePerNight)}</strong> / night
                      </div>
                      <div class="estimated-total">
                        Est. ${formatCurrency(estimate.grandTotal)} total (${estimate.nights} nt${estimate.nights > 1 ? 's' : ''} · ${estimate.rooms} rm${estimate.rooms > 1 ? 's' : ''})
                      </div>
                      ${promoPill}
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      data-estimate-hotel="${escapeHtml(hotel.id)}"
                    >
                      Estimate &amp; Book
                    </button>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      state.hasRenderedHotelsOnce = true;
      refreshAOS();
    }

    function resetAllHotelFilters() {
      state.selectedDestinationId = 'all';
      state.searchQuery = '';
      state.maxPrice = 800;
      state.minRating = 0;
      state.sortBy = 'recommended';

      els.destinationInput.value = '';
      els.clearDestinationBtn.hidden = true;
      els.hotelDestinationFilter.value = 'all';
      els.priceRangeFilter.value = '800';
      els.priceRangeLabel.textContent = 'Up to $800/night';
      els.hotelSortSelect.value = 'recommended';

      els.ratingFilters.querySelectorAll('.rating-pill').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.rating === '0');
      });

      persistSearchState();
      updateTripContextBanner();
      renderDestinations();
      renderHotels();
      showToast('All destination and hotel filters reset');
    }

    // =========================================================================
    // Special Offers & Coupon Copying
    // =========================================================================
    function copyTextToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      }
      return fallbackCopy(text);
    }

    function fallbackCopy(text) {
      return new Promise((resolve) => {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.warn('Clipboard copy fallback failed:', err);
        }
        temp.remove();
        resolve();
      });
    }

    function renderOffers() {
      els.offersGrid.innerHTML = SPECIAL_OFFERS.map((offer, index) => {
        const isApplied =
          state.appliedCouponCode &&
          state.appliedCouponCode.toUpperCase() === offer.code.toUpperCase();

        return `
          <article class="offer-card${isApplied ? ' is-applied' : ''}" data-aos="fade-up" data-aos-delay="${(index % 2) * 80}">
            <div class="offer-top">
              <span class="offer-badge">${escapeHtml(offer.badge)}</span>
              <span class="offer-discount">${escapeHtml(offer.discountLabel)}</span>
            </div>
            <h3 class="offer-title">${escapeHtml(offer.title)}</h3>
            <p class="offer-desc">${escapeHtml(offer.description)}</p>
            <span class="offer-validity">${escapeHtml(offer.validity)}</span>

            <div class="offer-actions">
              <div class="coupon-code-box">
                <span class="coupon-code-text">${escapeHtml(offer.code)}</span>
                <button
                  type="button"
                  class="copy-code-btn"
                  data-copy-code="${escapeHtml(offer.code)}"
                >
                  Copy Code
                </button>
              </div>

              <button
                type="button"
                class="btn ${isApplied ? 'btn-accent' : 'btn-secondary'} btn-sm"
                data-apply-offer="${escapeHtml(offer.code)}"
              >
                ${isApplied ? 'Applied to Estimates ✓' : 'Apply to Estimate'}
              </button>
            </div>
          </article>
        `;
      }).join('');
    }

    // =========================================================================
    // Why Choose Us & Testimonials
    // =========================================================================
    function renderWhyChooseUs() {
      els.whyChooseGrid.innerHTML = WHY_CHOOSE_US.map(
        (item, index) => `
          <article class="why-card" data-aos="fade-up" data-aos-delay="${index * 70}">
            <div class="why-icon" aria-hidden="true">${getWhyIconSvg(item.id)}</div>
            <div class="why-metric">${escapeHtml(item.metric)}</div>
            <h3 class="why-title">${escapeHtml(item.title)}</h3>
            <p class="why-desc">${escapeHtml(item.description)}</p>
          </article>
        `
      ).join('');
    }

    function initTestimonials() {
      if (!global.SolaraSlider) return;
      global.SolaraSlider.createTestimonialSlider({
        trackEl: els.testimonialTrack,
        dotsEl: els.testimonialDots,
        prevBtn: els.testimonialPrevBtn,
        nextBtn: els.testimonialNextBtn,
        items: TESTIMONIALS,
        renderCard: (item) => {
          const starsCount = Math.round(item.rating);
          const stars = '★'.repeat(starsCount);
          return `
            <article class="testimonial-card">
              <div class="testimonial-stars">
                <span class="stars-row" aria-label="${item.rating} out of 5 stars">${stars}</span>
                <span>${escapeHtml(item.tripType)}</span>
              </div>
              <blockquote class="testimonial-quote">&ldquo;${escapeHtml(item.quote)}&rdquo;</blockquote>
              <div class="testimonial-author">
                <div class="author-avatar" aria-hidden="true">${escapeHtml(item.initials)}</div>
                <div>
                  <div class="author-name">${escapeHtml(item.name)}</div>
                  <div class="author-meta">${escapeHtml(item.location)} · ${escapeHtml(item.stayName)}</div>
                </div>
              </div>
            </article>
          `;
        }
      });
    }

    // =========================================================================
    // Wishlist Drawer (LocalStorage)
    // =========================================================================
    function updateWishlistBadge() {
      els.wishlistCount.textContent = String(state.wishlist.length);
    }

    function renderWishlistDrawer() {
      updateWishlistBadge();
      const activeOffer = getActiveOffer();

      if (state.wishlist.length === 0) {
        els.wishlistItems.innerHTML = `
          <div style="text-align: center; padding: 48px 16px; color: var(--ink-secondary);">
            <p style="font-weight: 600; color: var(--ink-primary); margin-bottom: 6px;">Your wishlist is empty</p>
            <p style="font-size: 0.88rem;">Tap the heart icon on any featured hotel to save stays across visits.</p>
          </div>
        `;
        els.wishlistClearBtn.disabled = true;
        return;
      }

      els.wishlistClearBtn.disabled = false;
      const savedHotels = state.wishlist
        .map((id) => HOTELS.find((h) => h.id === id))
        .filter(Boolean);

      els.wishlistItems.innerHTML = savedHotels
        .map((hotel) => {
          const estimate = Validation.calculateBookingEstimate({
            pricePerNight: hotel.pricePerNight,
            nights: state.nights,
            rooms: state.rooms,
            adults: state.adults,
            children: state.children,
            offer: activeOffer
          });

          return `
            <div class="wishlist-item">
              ${buildImgTag(hotel)}
              <div>
                <h4 style="font-family: var(--font-display); font-size: 1.05rem;">${escapeHtml(hotel.name)}</h4>
                <div style="font-size: 0.8rem; color: var(--ink-muted);">${escapeHtml(hotel.location)}</div>
                <div style="font-size: 0.84rem; margin-top: 4px;">
                  <strong>${formatCurrency(hotel.pricePerNight)}</strong>/nt · Est. ${formatCurrency(estimate.grandTotal)}
                </div>
                <div class="wishlist-item-actions">
                  <button type="button" class="btn btn-primary btn-sm" data-estimate-hotel="${escapeHtml(hotel.id)}">
                    Estimate
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm" data-remove-wishlist="${escapeHtml(hotel.id)}">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    function openWishlistDrawer() {
      renderWishlistDrawer();
      els.wishlistBackdrop.classList.add('is-open');
      els.wishlistDrawer.classList.add('is-open');
      els.wishlistBackdrop.setAttribute('aria-hidden', 'false');
      els.wishlistDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }

    function closeWishlistDrawer() {
      els.wishlistBackdrop.classList.remove('is-open');
      els.wishlistDrawer.classList.remove('is-open');
      els.wishlistBackdrop.setAttribute('aria-hidden', 'true');
      els.wishlistDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }

    function toggleWishlist(hotelId) {
      const hotel = HOTELS.find((h) => h.id === hotelId);
      const { isWishlisted, wishlist } = Storage.toggleWishlistItem(hotelId);
      state.wishlist = wishlist;
      renderHotels();
      renderWishlistDrawer();
      if (hotel) {
        showToast(
          isWishlisted
            ? `Saved ${hotel.name} to Wishlist`
            : `Removed ${hotel.name} from Wishlist`,
          isWishlisted ? 'success' : 'default'
        );
      }
    }

    // =========================================================================
    // Booking Price Estimator Modal
    // =========================================================================
    function openEstimatorModal(hotelId) {
      const hotel = HOTELS.find((h) => h.id === hotelId);
      if (!hotel) return;

      closeWishlistDrawer();
      state.activeModalHotelId = hotelId;

      els.estimatorHotelSummary.innerHTML = `
        ${buildImgTag(hotel)}
        <div>
          <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--brand-accent);">
            ${escapeHtml(hotel.propertyType)}
          </span>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem;">${escapeHtml(hotel.name)}</h3>
          <div style="font-size: 0.85rem; color: var(--ink-secondary);">${escapeHtml(hotel.location)} · ${formatCurrency(hotel.pricePerNight)}/night</div>
        </div>
      `;

      els.modalCheckIn.min = todayStr;
      els.modalCheckIn.value = state.checkIn;
      els.modalCheckOut.min = Validation.addDays(state.checkIn, 1);
      els.modalCheckOut.value = state.checkOut;

      els.modalRooms.value = String(Math.min(4, state.rooms));
      els.modalAdults.value = String(Math.min(6, state.adults));
      els.modalChildren.value = String(Math.min(4, state.children));
      els.modalCouponInput.value = state.appliedCouponCode || '';
      els.modalConfirmFeedback.hidden = true;

      updateModalEstimate();

      els.estimatorBackdrop.classList.add('is-open');
      els.estimatorModal.classList.add('is-open');
      els.estimatorBackdrop.setAttribute('aria-hidden', 'false');
      els.estimatorModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }

    function closeEstimatorModal() {
      state.activeModalHotelId = null;
      els.estimatorBackdrop.classList.remove('is-open');
      els.estimatorModal.classList.remove('is-open');
      els.estimatorBackdrop.setAttribute('aria-hidden', 'true');
      els.estimatorModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }

    function updateModalEstimate() {
      const hotel = HOTELS.find((h) => h.id === state.activeModalHotelId);
      if (!hotel) return;

      const dateCheck = Validation.validateDateRange(
        els.modalCheckIn.value,
        els.modalCheckOut.value
      );

      if (!dateCheck.valid) {
        els.modalDateError.textContent = dateCheck.message;
        els.modalDateError.hidden = false;
        els.modalSaveEstimateBtn.disabled = true;
        return;
      }

      els.modalDateError.hidden = true;
      els.modalSaveEstimateBtn.disabled = false;
      els.modalCheckOut.min = Validation.addDays(els.modalCheckIn.value, 1);

      const normalized = Validation.validateGuestsAndRooms(
        els.modalAdults.value,
        els.modalChildren.value,
        els.modalRooms.value
      );
      if (String(normalized.rooms) !== els.modalRooms.value) {
        els.modalRooms.value = String(normalized.rooms);
      }
      const rooms = normalized.rooms;
      const adults = normalized.adults;
      const children = normalized.children;
      const offer = getActiveOffer();

      const estimate = Validation.calculateBookingEstimate({
        pricePerNight: hotel.pricePerNight,
        nights: dateCheck.nights,
        rooms,
        adults,
        children,
        offer
      });

      if (offer) {
        if (estimate.couponStatus === 'applied') {
          els.modalCouponNote.style.color = 'var(--status-success)';
          els.modalCouponNote.textContent = `✓ ${estimate.couponNote}`;
        } else {
          els.modalCouponNote.style.color = 'var(--brand-accent-dark)';
          els.modalCouponNote.textContent = `! ${estimate.couponNote}`;
        }
      } else {
        els.modalCouponNote.style.color = 'var(--ink-muted)';
        els.modalCouponNote.textContent = 'Enter a promo code from Special Offers to preview savings.';
      }

      const extraGuestRow =
        estimate.extraGuests > 0
          ? `
          <div class="breakdown-row">
            <span>Extra guest fee (${estimate.extraGuests} extra &times; $35 &times; ${estimate.nights} nts)</span>
            <span>${formatCurrency(estimate.extraGuestFee)}</span>
          </div>
        `
          : '';

      const discountRow =
        estimate.discountAmount > 0
          ? `
          <div class="breakdown-row is-discount">
            <span>Promo Discount (${escapeHtml(offer.code)})</span>
            <span>-${formatCurrency(estimate.discountAmount)}</span>
          </div>
        `
          : '';

      els.modalBreakdown.innerHTML = `
        <div class="breakdown-row">
          <span>${formatCurrency(hotel.pricePerNight)} &times; ${estimate.nights} night${estimate.nights > 1 ? 's' : ''} &times; ${estimate.rooms} room${estimate.rooms > 1 ? 's' : ''}</span>
          <span>${formatCurrency(estimate.roomSubtotal)}</span>
        </div>
        ${extraGuestRow}
        ${discountRow}
        <div class="breakdown-row">
          <span>Occupancy Taxes &amp; Resort Fees (12%)</span>
          <span>${formatCurrency(estimate.taxesAndFees)}</span>
        </div>
        <div class="breakdown-total">
          <span>Estimated Trip Total</span>
          <strong>${formatCurrency(estimate.grandTotal)}</strong>
        </div>
      `;
    }

    // =========================================================================
    // Newsletter Subscription
    // =========================================================================
    function restoreNewsletterState() {
      const saved = Storage.getNewsletterSubscription();
      if (saved && saved.email) {
        els.newsletterEmail.value = saved.email;
        if (saved.interest) els.newsletterInterest.value = saved.interest;
        els.newsletterConsent.checked = true;
        els.newsletterFeedback.textContent = `Subscribed with ${saved.email}. You can update preferences anytime.`;
        els.newsletterFeedback.className = 'newsletter-feedback is-success';
        els.newsletterFeedback.hidden = false;
      }
    }

    // =========================================================================
    // AOS Initialization & Graceful Fallback
    // =========================================================================
    function initAOS() {
      if (global.AOS) {
        global.AOS.init({
          duration: 680,
          easing: 'ease-out-cubic',
          once: true,
          offset: 50
        });
      } else {
        document.querySelectorAll('[data-aos]').forEach((el) => {
          el.classList.add('aos-animate');
        });
      }
    }

    function refreshAOS() {
      if (global.AOS) {
        global.AOS.refresh();
      }
    }

    // =========================================================================
    // Event Listeners Wiring
    // =========================================================================
    function bindEvents() {
      global.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
      updateHeaderOnScroll();

      // Mobile Navigation
      els.mobileMenuBtn.addEventListener('click', openMobileNav);
      els.mobileNavCloseBtn.addEventListener('click', closeMobileNav);
      els.mobileNavBackdrop.addEventListener('click', closeMobileNav);
      els.mobileWishlistBtn.addEventListener('click', () => {
        closeMobileNav();
        openWishlistDrawer();
      });
      els.mobileNavPanel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileNav);
      });

      // Header Promo Pill
      els.headerPromoPill.addEventListener('click', () => {
        applyPromoCode('');
        showToast('Promo code removed');
      });

      els.clearPromoBtn.addEventListener('click', () => {
        applyPromoCode('');
        showToast('Promo code removed');
      });

      // Destination Search Input & Autocomplete
      els.destinationInput.addEventListener('focus', () => {
        renderDestinationSuggestions(els.destinationInput.value);
      });

      els.destinationInput.addEventListener('input', () => {
        const val = els.destinationInput.value;
        els.clearDestinationBtn.hidden = !val.trim();
        state.searchQuery = val;
        state.selectedDestinationId = 'all';
        els.hotelDestinationFilter.value = 'all';
        renderDestinationSuggestions(val);
        updateTripContextBanner();
        renderDestinations();
        renderHotels();
      });

      els.clearDestinationBtn.addEventListener('click', () => {
        selectDestination('all', false);
        els.destinationInput.focus();
      });

      els.destinationSuggestions.addEventListener('click', (event) => {
        const item = event.target.closest('[data-suggest-id]');
        if (!item) return;
        selectDestination(item.dataset.suggestId, false);
      });

      // Quick Trending Destination Chips
      document.querySelectorAll('[data-quick-dest]').forEach((chip) => {
        chip.addEventListener('click', () => {
          selectDestination(chip.dataset.quickDest, true);
        });
      });

      // Dates Validation
      els.checkInInput.addEventListener('change', () => updateDatesValidationUI(false));
      els.checkOutInput.addEventListener('change', () => updateDatesValidationUI(false));

      // Guest & Room Popover
      els.guestTriggerBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = !els.guestPopover.hidden;
        els.guestPopover.hidden = isOpen;
        els.guestTriggerBtn.setAttribute('aria-expanded', String(!isOpen));
      });

      els.guestDoneBtn.addEventListener('click', () => {
        els.guestPopover.hidden = true;
        els.guestTriggerBtn.setAttribute('aria-expanded', 'false');
      });

      els.guestPopover.addEventListener('click', (event) => {
        event.stopPropagation();
        const btn = event.target.closest('[data-guest-control]');
        if (!btn) return;

        const field = btn.dataset.guestControl;
        const action = btn.dataset.action;
        const delta = action === 'inc' ? 1 : -1;

        let nextAdults = state.adults;
        let nextChildren = state.children;
        let nextRooms = state.rooms;

        if (field === 'adults') nextAdults += delta;
        if (field === 'children') nextChildren += delta;
        if (field === 'rooms') nextRooms += delta;

        const validated = Validation.validateGuestsAndRooms(
          nextAdults,
          nextChildren,
          nextRooms
        );
        state.adults = validated.adults;
        state.children = validated.children;
        state.rooms = validated.rooms;

        syncGuestControlsUI();
        persistSearchState();
        updateTripContextBanner();
        renderHotels();
        renderWishlistDrawer();
      });

      // Close popovers on outside click
      document.addEventListener('click', (event) => {
        if (!event.target.closest('#destinationField')) {
          els.destinationSuggestions.hidden = true;
        }
        if (!event.target.closest('#guestsField')) {
          els.guestPopover.hidden = true;
          els.guestTriggerBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Hero Search Form Submit
      els.heroSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const datesOk = updateDatesValidationUI(true);
        if (!datesOk) return;

        const typed = els.destinationInput.value.trim().toLowerCase();
        if (typed && state.selectedDestinationId === 'all') {
          const exactDest = DESTINATIONS.find(
            (d) =>
              d.name.toLowerCase() === typed ||
              `${d.name}, ${d.country}`.toLowerCase() === typed
          );
          if (exactDest) {
            state.selectedDestinationId = exactDest.id;
            els.hotelDestinationFilter.value = exactDest.id;
          }
        }

        persistSearchState();
        updateTripContextBanner();
        renderDestinations();
        renderHotels();

        const hotelsSection = document.getElementById('hotels');
        if (hotelsSection) {
          hotelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      // Destination Region Pills & Cards
      els.regionFilters.addEventListener('click', (event) => {
        const pill = event.target.closest('[data-region]');
        if (!pill) return;
        state.regionFilter = pill.dataset.region;
        els.regionFilters.querySelectorAll('.filter-pill').forEach((btn) => {
          btn.classList.toggle('is-active', btn === pill);
        });
        renderDestinations();
      });

      els.destinationsGrid.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-select-destination]');
        if (!btn) return;
        selectDestination(btn.dataset.selectDestination, true);
      });

      // Hotel Filter & Sort Controls
      els.hotelDestinationFilter.addEventListener('change', () => {
        const val = els.hotelDestinationFilter.value;
        selectDestination(val, false);
      });

      els.priceRangeFilter.addEventListener('input', () => {
        state.maxPrice = Number(els.priceRangeFilter.value);
        els.priceRangeLabel.textContent = `Up to ${formatCurrency(state.maxPrice)}/night`;
        renderHotels();
      });

      els.ratingFilters.addEventListener('click', (event) => {
        const pill = event.target.closest('[data-rating]');
        if (!pill) return;
        state.minRating = Number(pill.dataset.rating);
        els.ratingFilters.querySelectorAll('.rating-pill').forEach((btn) => {
          btn.classList.toggle('is-active', btn === pill);
        });
        renderHotels();
      });

      els.hotelSortSelect.addEventListener('change', () => {
        state.sortBy = els.hotelSortSelect.value;
        renderHotels();
      });

      els.resetFiltersBtn.addEventListener('click', resetAllHotelFilters);

      // Hotel Card Actions (Wishlist + Booking Estimator)
      els.hotelsGrid.addEventListener('click', (event) => {
        const wishBtn = event.target.closest('[data-wishlist-id]');
        if (wishBtn) {
          toggleWishlist(wishBtn.dataset.wishlistId);
          return;
        }
        const estBtn = event.target.closest('[data-estimate-hotel]');
        if (estBtn) {
          openEstimatorModal(estBtn.dataset.estimateHotel);
        }
      });

      // Special Offers (Copy Code + Apply Offer)
      els.offersGrid.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('[data-copy-code]');
        if (copyBtn) {
          const code = copyBtn.dataset.copyCode;
          copyTextToClipboard(code).then(() => {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('is-copied');
            showToast(`Copied coupon code ${code}`, 'success');
            global.setTimeout(() => {
              copyBtn.textContent = 'Copy Code';
              copyBtn.classList.remove('is-copied');
            }, 2200);
          });
          return;
        }

        const applyBtn = event.target.closest('[data-apply-offer]');
        if (applyBtn) {
          const code = applyBtn.dataset.applyOffer;
          const isSame =
            state.appliedCouponCode &&
            state.appliedCouponCode.toUpperCase() === code.toUpperCase();
          if (isSame) {
            applyPromoCode('');
            showToast(`Removed promo code ${code}`);
          } else {
            applyPromoCode(code);
            showToast(`Applied ${code} to all live booking estimates`, 'success');
          }
        }
      });

      // Wishlist Drawer
      els.wishlistOpenBtn.addEventListener('click', openWishlistDrawer);
      els.wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
      els.wishlistBackdrop.addEventListener('click', closeWishlistDrawer);
      els.wishlistExploreBtn.addEventListener('click', closeWishlistDrawer);

      els.wishlistItems.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-remove-wishlist]');
        if (removeBtn) {
          toggleWishlist(removeBtn.dataset.removeWishlist);
          return;
        }
        const estBtn = event.target.closest('[data-estimate-hotel]');
        if (estBtn) {
          openEstimatorModal(estBtn.dataset.estimateHotel);
        }
      });

      els.wishlistClearBtn.addEventListener('click', () => {
        state.wishlist = Storage.setWishlist([]);
        renderHotels();
        renderWishlistDrawer();
        showToast('Cleared saved wishlist');
      });

      // Booking Estimator Modal
      els.estimatorCloseBtn.addEventListener('click', closeEstimatorModal);
      els.estimatorBackdrop.addEventListener('click', closeEstimatorModal);

      [
        els.modalCheckIn,
        els.modalCheckOut,
        els.modalRooms,
        els.modalAdults,
        els.modalChildren
      ].forEach((input) => {
        input.addEventListener('change', () => {
          els.modalConfirmFeedback.hidden = true;
          updateModalEstimate();
        });
      });

      els.modalApplyCouponBtn.addEventListener('click', () => {
        const code = els.modalCouponInput.value.trim().toUpperCase();
        const result = applyPromoCode(code);
        if (!result.ok) {
          els.modalCouponNote.style.color = 'var(--status-danger)';
          els.modalCouponNote.textContent = result.message;
          return;
        }
        updateModalEstimate();
        if (result.offer) {
          showToast(`Promo ${result.offer.code} applied!`, 'success');
        } else {
          showToast('Promo code cleared');
        }
      });

      els.modalSaveEstimateBtn.addEventListener('click', () => {
        const hotel = HOTELS.find((h) => h.id === state.activeModalHotelId);
        if (!hotel) return;
        const dateCheck = Validation.validateDateRange(
          els.modalCheckIn.value,
          els.modalCheckOut.value
        );
        if (!dateCheck.valid) return;

        // Sync modal trip parameters back to page state
        state.checkIn = els.modalCheckIn.value;
        state.checkOut = els.modalCheckOut.value;
        state.nights = dateCheck.nights;
        const validated = Validation.validateGuestsAndRooms(
          els.modalAdults.value,
          els.modalChildren.value,
          els.modalRooms.value
        );
        state.adults = validated.adults;
        state.children = validated.children;
        state.rooms = validated.rooms;

        els.checkInInput.value = state.checkIn;
        els.checkOutInput.value = state.checkOut;
        syncGuestControlsUI();
        persistSearchState();
        updateTripContextBanner();
        renderHotels();

        const estimate = Validation.calculateBookingEstimate({
          pricePerNight: hotel.pricePerNight,
          nights: state.nights,
          rooms: state.rooms,
          adults: state.adults,
          children: state.children,
          offer: getActiveOffer()
        });

        Storage.saveEstimate({
          hotelId: hotel.id,
          hotelName: hotel.name,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          grandTotal: estimate.grandTotal,
          savedAt: new Date().toISOString()
        });

        els.modalConfirmFeedback.textContent = `Estimate saved for ${hotel.name}: ${formatCurrency(estimate.grandTotal)} total (${state.nights} nights · ${state.rooms} room${state.rooms > 1 ? 's' : ''}).`;
        els.modalConfirmFeedback.hidden = false;
        showToast('Trip estimate saved to LocalStorage', 'success');
      });

      // Newsletter Form Validation
      els.newsletterEmail.addEventListener('input', () => {
        if (els.newsletterFeedback.classList.contains('is-error')) {
          els.newsletterFeedback.hidden = true;
        }
      });

      els.newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const result = Validation.validateNewsletterForm(
          els.newsletterEmail.value,
          els.newsletterConsent.checked
        );

        els.newsletterFeedback.textContent = result.message;
        els.newsletterFeedback.className = `newsletter-feedback ${result.valid ? 'is-success' : 'is-error'}`;
        els.newsletterFeedback.hidden = false;

        if (!result.valid) {
          els.newsletterEmail.focus();
          return;
        }

        Storage.saveNewsletterSubscription({
          email: result.email,
          interest: els.newsletterInterest.value,
          subscribedAt: new Date().toISOString()
        });
        showToast('Subscribed to The Solara Dispatch!', 'success');
      });

      // Global Escape Key Handler
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeMobileNav();
        closeWishlistDrawer();
        closeEstimatorModal();
        els.destinationSuggestions.hidden = true;
        els.guestPopover.hidden = true;
        els.guestTriggerBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // =========================================================================
    // Initial Hydration
    // =========================================================================
    els.checkInInput.min = todayStr;
    els.checkInInput.value = state.checkIn;
    els.checkOutInput.min = Validation.addDays(state.checkIn, 1);
    els.checkOutInput.value = state.checkOut;

    if (state.searchQuery) {
      els.destinationInput.value = state.searchQuery;
      els.clearDestinationBtn.hidden = false;
    } else if (state.selectedDestinationId !== 'all') {
      const dest = DESTINATIONS.find((d) => d.id === state.selectedDestinationId);
      if (dest) {
        els.destinationInput.value = `${dest.name}, ${dest.country}`;
        els.clearDestinationBtn.hidden = false;
      }
    }

    populateDestinationDropdown();
    syncGuestControlsUI();
    updatePromoUI();
    updateTripContextBanner();
    renderDestinations();
    renderHotels();
    renderOffers();
    renderWhyChooseUs();
    initTestimonials();
    renderWishlistDrawer();
    restoreNewsletterState();
    bindEvents();
    initAOS();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
