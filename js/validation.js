/* ==========================================================================
   Solara Travel Booking — Date, Guest, Form Validation & Price Estimation
   ========================================================================== */

(function (global) {
  'use strict';

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const TAX_RATE = 0.12;
  const EXTRA_GUEST_NIGHTLY_FEE = 35;
  const INCLUDED_GUESTS_PER_ROOM = 2;

  function toLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  function getTodayDateString() {
    return toLocalISODate(new Date());
  }

  function addDays(dateStr, days) {
    const parsed = parseLocalDate(dateStr);
    if (!parsed) return '';
    const next = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + days);
    return toLocalISODate(next);
  }

  function calculateNights(checkInStr, checkOutStr) {
    const start = parseLocalDate(checkInStr);
    const end = parseLocalDate(checkOutStr);
    if (!start || !end) return 0;
    return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  }

  function validateDateRange(checkInStr, checkOutStr) {
    const todayStr = getTodayDateString();
    const today = parseLocalDate(todayStr);
    const checkIn = parseLocalDate(checkInStr);
    const checkOut = parseLocalDate(checkOutStr);

    if (!checkIn) {
      return {
        valid: false,
        nights: 0,
        errorField: 'checkIn',
        message: 'Please select a valid check-in date.'
      };
    }

    if (checkIn.getTime() < today.getTime()) {
      return {
        valid: false,
        nights: 0,
        errorField: 'checkIn',
        message: 'Check-in date cannot be in the past.'
      };
    }

    if (!checkOut) {
      return {
        valid: false,
        nights: 0,
        errorField: 'checkOut',
        message: 'Please select a valid check-out date.'
      };
    }

    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);

    if (nights < 1) {
      return {
        valid: false,
        nights: 0,
        errorField: 'checkOut',
        message: 'Check-out must be at least 1 night after check-in.'
      };
    }

    if (nights > 45) {
      return {
        valid: false,
        nights: 0,
        errorField: 'checkOut',
        message: 'Online stays are limited to 45 nights maximum.'
      };
    }

    return {
      valid: true,
      nights,
      errorField: null,
      message: `${nights} ${nights === 1 ? 'night' : 'nights'} selected`
    };
  }

  function validateGuestsAndRooms(adults, children, rooms) {
    const safeAdults = Math.max(1, Math.min(12, Number(adults) || 1));
    const safeChildren = Math.max(0, Math.min(8, Number(children) || 0));
    let safeRooms = Math.max(1, Math.min(6, Number(rooms) || 1));

    if (safeRooms > safeAdults) {
      safeRooms = safeAdults;
    }

    return {
      adults: safeAdults,
      children: safeChildren,
      rooms: safeRooms,
      totalGuests: safeAdults + safeChildren
    };
  }

  function validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Please enter your email address.' };
    }
    const trimmed = email.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your email address.' };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(trimmed)) {
      return {
        valid: false,
        message: 'Please enter a valid email address (e.g., alex@example.com).'
      };
    }
    return { valid: true, email: trimmed, message: '' };
  }

  function validateNewsletterForm(email, consentChecked) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return emailCheck;
    }
    if (!consentChecked) {
      return {
        valid: false,
        message: 'Please agree to receive curated travel offers and updates.'
      };
    }
    return {
      valid: true,
      email: emailCheck.email,
      message: 'Welcome aboard! Your exclusive welcome perks are on the way.'
    };
  }

  function calculateBookingEstimate({
    pricePerNight,
    nights,
    rooms,
    adults,
    children,
    offer
  }) {
    const safeNights = Math.max(1, Number(nights) || 1);
    const safeRooms = Math.max(1, Number(rooms) || 1);
    const totalGuests = Math.max(1, (Number(adults) || 1) + (Number(children) || 0));

    const roomSubtotal = pricePerNight * safeNights * safeRooms;
    const includedCapacity = safeRooms * INCLUDED_GUESTS_PER_ROOM;
    const extraGuests = Math.max(0, totalGuests - includedCapacity);
    const extraGuestFee = extraGuests * EXTRA_GUEST_NIGHTLY_FEE * safeNights;
    const preDiscountSubtotal = roomSubtotal + extraGuestFee;

    let discountAmount = 0;
    let couponStatus = 'none';
    let couponNote = '';

    if (offer) {
      const minNights = offer.minNights || 1;
      if (safeNights >= minNights) {
        if (offer.discountType === 'percent') {
          discountAmount = Math.round((preDiscountSubtotal * offer.discountValue) / 100);
        } else if (offer.discountType === 'flat') {
          discountAmount = Math.min(preDiscountSubtotal, offer.discountValue);
        }
        couponStatus = 'applied';
        couponNote = `${offer.code} applied (-$${discountAmount.toLocaleString()})`;
      } else {
        couponStatus = 'ineligible';
        couponNote = `${offer.code} requires at least ${minNights} nights`;
      }
    }

    const discountedSubtotal = Math.max(0, preDiscountSubtotal - discountAmount);
    const taxesAndFees = Math.round(discountedSubtotal * TAX_RATE);
    const grandTotal = discountedSubtotal + taxesAndFees;

    return {
      nights: safeNights,
      rooms: safeRooms,
      totalGuests,
      extraGuests,
      pricePerNight,
      roomSubtotal,
      extraGuestFee,
      preDiscountSubtotal,
      discountAmount,
      couponStatus,
      couponNote,
      taxesAndFees,
      grandTotal
    };
  }

  global.SolaraValidation = {
    getTodayDateString,
    addDays,
    calculateNights,
    validateDateRange,
    validateGuestsAndRooms,
    validateEmail,
    validateNewsletterForm,
    calculateBookingEstimate
  };
})(window);
