# Solara — Travel Booking Website Homepage

A responsive, frontend-only luxury travel booking homepage built exclusively with **HTML5**, **CSS3**, and **Vanilla JavaScript**, featuring **AOS (Animate On Scroll)** animations and **LocalStorage** persistence.

## Project Structure

```text
Travel Booking Website – Homepage/
├── index.html          # Semantic homepage markup, modals, drawers & AOS hooks
├── css/
│   ├── reset.css       # Modern CSS reset, accessibility & reduced-motion rules
│   ├── style.css       # Editorial design tokens, sections, cards, drawers & modals
│   └── responsive.css  # Desktop, tablet & mobile breakpoints
├── js/
│   ├── data.js         # Sample dataset (8 destinations, 12 hotels, 4 offers, 6 testimonials)
│   ├── storage.js      # LocalStorage persistence layer (wishlist, search prefs, coupons, newsletter)
│   ├── validation.js   # Date range, guest/room, newsletter validation & dynamic pricing logic
│   ├── slider.js       # Responsive testimonial carousel with touch & keyboard support
│   └── main.js         # Application state controller, rendering & event delegation
└── assets/
    └── images/         # High-resolution hero, destination, and hotel photography
```

## Key Features

- **Hero Destination Search**: Live autocomplete suggestions, trending destination quick chips, check-in/check-out date validation, and interactive guest & room stepper popover.
- **Popular Destinations**: 8 curated destinations with region filter pills and click-to-filter hotel integration.
- **Featured Hotels**: 12 properties with destination filtering, max nightly price range slider, minimum rating pills, sorting (`Recommended`, `Price`, `Rating`, `Reviews`), and empty-state reset.
- **Dynamic Booking Price Estimation**: Real-time estimated totals rendered directly on every hotel card plus an interactive **Booking Price Estimator** modal with itemized room rates, extra-guest fees, promo discounts, and occupancy taxes.
- **Wishlist Persistence**: Heart toggles synced with a slide-over **Saved Stays** drawer persisted via `localStorage`.
- **Special Offers & Coupon Codes**: 4 promotional deals with one-click clipboard copying and instant live estimate application.
- **Traveler Testimonials Slider**: Responsive multi-card carousel with arrow controls, pagination dots, and touch swipe support.
- **Newsletter Subscription**: Custom validation for email format and consent, persisted in `localStorage`.
- **Responsive Mobile Navigation**: Accessible slide-over drawer menu with backdrop and `Escape` key support.

## Usage

Open `index.html` directly in any modern web browser. No build tools, backend servers, or JavaScript frameworks are required.
