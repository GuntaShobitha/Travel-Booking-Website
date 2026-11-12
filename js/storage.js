/* ==========================================================================
   Solara Travel Booking — LocalStorage Persistence Layer
   ========================================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEYS = {
    WISHLIST: 'solara_wishlist_v1',
    SEARCH_PREFS: 'solara_search_prefs_v1',
    APPLIED_COUPON: 'solara_applied_coupon_v1',
    NEWSLETTER: 'solara_newsletter_v1',
    SAVED_ESTIMATES: 'solara_estimates_v1'
  };

  function safeRead(key, fallback) {
    try {
      const raw = global.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`LocalStorage read failed for "${key}":`, error);
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`LocalStorage write failed for "${key}":`, error);
      return false;
    }
  }

  function safeRemove(key) {
    try {
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`LocalStorage remove failed for "${key}":`, error);
      return false;
    }
  }

  function getWishlist() {
    const list = safeRead(STORAGE_KEYS.WISHLIST, []);
    return Array.isArray(list) ? list : [];
  }

  function setWishlist(ids) {
    const unique = Array.from(new Set(ids));
    safeWrite(STORAGE_KEYS.WISHLIST, unique);
    return unique;
  }

  function toggleWishlistItem(hotelId) {
    const current = getWishlist();
    const exists = current.includes(hotelId);
    const updated = exists
      ? current.filter((id) => id !== hotelId)
      : [...current, hotelId];
    setWishlist(updated);
    return {
      isWishlisted: !exists,
      wishlist: updated
    };
  }

  function getSearchPrefs() {
    return safeRead(STORAGE_KEYS.SEARCH_PREFS, null);
  }

  function saveSearchPrefs(prefs) {
    return safeWrite(STORAGE_KEYS.SEARCH_PREFS, prefs);
  }

  function getAppliedCoupon() {
    return safeRead(STORAGE_KEYS.APPLIED_COUPON, null);
  }

  function saveAppliedCoupon(couponCode) {
    if (!couponCode) {
      return safeRemove(STORAGE_KEYS.APPLIED_COUPON);
    }
    return safeWrite(STORAGE_KEYS.APPLIED_COUPON, couponCode);
  }

  function getNewsletterSubscription() {
    return safeRead(STORAGE_KEYS.NEWSLETTER, null);
  }

  function saveNewsletterSubscription(payload) {
    return safeWrite(STORAGE_KEYS.NEWSLETTER, payload);
  }

  function getSavedEstimates() {
    const items = safeRead(STORAGE_KEYS.SAVED_ESTIMATES, []);
    return Array.isArray(items) ? items : [];
  }

  function saveEstimate(estimate) {
    const existing = getSavedEstimates();
    const updated = [estimate, ...existing].slice(0, 6);
    safeWrite(STORAGE_KEYS.SAVED_ESTIMATES, updated);
    return updated;
  }

  global.SolaraStorage = {
    getWishlist,
    setWishlist,
    toggleWishlistItem,
    getSearchPrefs,
    saveSearchPrefs,
    getAppliedCoupon,
    saveAppliedCoupon,
    getNewsletterSubscription,
    saveNewsletterSubscription,
    getSavedEstimates,
    saveEstimate
  };
})(window);
