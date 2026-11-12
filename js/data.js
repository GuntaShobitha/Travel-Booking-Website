/* ==========================================================================
   Solara Travel Booking — Curated Sample Data
   ========================================================================== */

(function (global) {
  'use strict';

  const DESTINATIONS = [
    {
      id: 'santorini',
      name: 'Santorini',
      country: 'Greece',
      region: 'Europe',
      style: 'Coastal & Island',
      tagline: 'Caldera sunsets & cliffside limestone villas',
      propertyCount: 48,
      startingPrice: 340,
      bestSeason: 'May – Oct',
      image: 'assets/images/dest-santorini.jpg',
      alt: 'Whitewashed cliffside village in Santorini overlooking the Aegean Sea at sunset'
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      style: 'Cultural & Heritage',
      tagline: 'Cedar ryokans, bamboo paths & lantern alleys',
      propertyCount: 62,
      startingPrice: 245,
      bestSeason: 'Mar – May, Oct – Nov',
      image: 'assets/images/dest-kyoto.jpg',
      alt: 'Peaceful Kyoto bamboo grove path with traditional wooden temple roofs in morning light'
    },
    {
      id: 'amalfi',
      name: 'Amalfi Coast',
      country: 'Italy',
      region: 'Europe',
      style: 'Coastal & Island',
      tagline: 'Lemon terraces above turquoise Tyrrhenian coves',
      propertyCount: 54,
      startingPrice: 375,
      bestSeason: 'May – Sep',
      image: 'assets/images/dest-amalfi.jpg',
      alt: 'Pastel cliffside town on the Amalfi Coast above turquoise Mediterranean water'
    },
    {
      id: 'zermatt',
      name: 'Zermatt',
      country: 'Switzerland',
      region: 'Europe',
      style: 'Alpine & Mountain',
      tagline: 'Car-free timber chalets beneath the Matterhorn',
      propertyCount: 36,
      startingPrice: 290,
      bestSeason: 'Dec – Mar, Jul – Sep',
      image: 'assets/images/dest-zermatt.jpg',
      alt: 'Snow-capped Matterhorn rising over alpine wooden chalets in Zermatt at twilight'
    },
    {
      id: 'bali',
      name: 'Ubud, Bali',
      country: 'Indonesia',
      region: 'Asia',
      style: 'Wellness & Nature',
      tagline: 'Emerald rice terraces & canyon infinity sanctuaries',
      propertyCount: 71,
      startingPrice: 175,
      bestSeason: 'Apr – Oct',
      image: 'assets/images/dest-bali.jpg',
      alt: 'Lush emerald rice terraces and misty palm valley in Ubud Bali at sunrise'
    },
    {
      id: 'marrakech',
      name: 'Marrakech',
      country: 'Morocco',
      region: 'Africa',
      style: 'Cultural & Heritage',
      tagline: 'Carved courtyard riads & saffron-lit rooftops',
      propertyCount: 44,
      startingPrice: 230,
      bestSeason: 'Mar – May, Oct – Nov',
      image: 'assets/images/dest-marrakech.jpg',
      alt: 'Sunlit Moroccan riad courtyard with geometric zellige fountain and orange trees'
    },
    {
      id: 'patagonia',
      name: 'Patagonia',
      country: 'Chile',
      region: 'Americas',
      style: 'Wellness & Nature',
      tagline: 'Granite spires, glacial fjords & glass eco-lodges',
      propertyCount: 19,
      startingPrice: 740,
      bestSeason: 'Nov – Mar',
      image: 'assets/images/dest-patagonia.jpg',
      alt: 'Granite peaks of Torres del Paine reflected in a turquoise glacial lake in Patagonia'
    },
    // {
    //   id: 'reykjavik',
    //   name: 'Reykjavik',
    //   country: 'Iceland',
    //   region: 'Europe',
    //   style: 'Wellness & Nature',
    //   tagline: 'Mineral geothermal lagoons & Nordic aurora skies',
    //   propertyCount: 28,
    //   startingPrice: 410,
    //   bestSeason: 'Sep – Mar, Jun – Aug',
    //   image: 'https://images.unsplash.com/photo-1509592149645-b62eeb60ca91?auto=format&fit=crop&w=1200&q=80',
    //   fallbackImage: 'assets/images/dest-patagonia.jpg',
    //   alt: 'Steaming mineral blue geothermal lagoon framed by dark volcanic basalt in Iceland'
    // }
  ];

  const HOTELS = [
    {
      id: 'hotel-caldera-horizon',
      name: 'Caldera Horizon Suites',
      destinationId: 'santorini',
      location: 'Oia, Santorini, Greece',
      propertyType: 'Cliffside Suites',
      pricePerNight: 460,
      rating: 4.9,
      reviewsCount: 312,
      featuredScore: 99,
      badge: 'Guest Favorite',
      amenities: ['Infinity Pool', 'Breakfast Included', 'Sea View Terrace'],
      description: 'Carved directly into volcanic cliffs with heated private plunge pools and unobstructed caldera sunsets.',
      image: 'assets/images/hotel-1.jpg',
      alt: 'Caldera Horizon Suites cliffside plunge pool overlooking the Aegean Sea at sunset'
    },
    {
      id: 'hotel-oia-limestone',
      name: 'Oia Limestone Retreat',
      destinationId: 'santorini',
      location: 'Imerovigli, Santorini, Greece',
      propertyType: 'Cave Villa Hotel',
      pricePerNight: 340,
      rating: 4.7,
      reviewsCount: 198,
      featuredScore: 88,
      badge: 'Boutique Pick',
      amenities: ['Plunge Pool', 'Sunset Veranda', 'Island Concierge'],
      description: 'Vaulted Cycladic cave suites dressed in raw linen and natural travertine above quiet Aegean waters.',
      image: 'assets/images/hotel-2.jpg',
      alt: 'Oia Limestone Retreat arched white Cycladic cave suite opening onto a sunlit terrace'
    },
    {
      id: 'hotel-arashiyama-kaze',
      name: 'Arashiyama Kaze Ryokan',
      destinationId: 'kyoto',
      location: 'Arashiyama, Kyoto, Japan',
      propertyType: 'Luxury Ryokan',
      pricePerNight: 520,
      rating: 4.95,
      reviewsCount: 274,
      featuredScore: 98,
      badge: 'Top Rated',
      amenities: ['Private Onsen', 'Kaiseki Dining', 'Bamboo Garden'],
      description: 'Hinoki cedar suites beside serene bamboo groves featuring private mineral soaking baths and seasonal dining.',
      image: 'assets/images/hotel-3.jpg',
      alt: 'Arashiyama Kaze Ryokan cedar suite with private steaming stone onsen bath'
    },
    {
      id: 'hotel-higashiyama-lantern',
      name: 'Higashiyama Lantern House',
      destinationId: 'kyoto',
      location: 'Higashiyama, Kyoto, Japan',
      propertyType: 'Heritage Boutique',
      pricePerNight: 245,
      rating: 4.6,
      reviewsCount: 186,
      featuredScore: 85,
      badge: 'Great Value',
      amenities: ['Tea Lounge', 'Moss Courtyard', 'Central Walk'],
      description: 'Restored machiya townhouse steps from historic shrines, complete with an atmospheric evening tea room.',
      image: 'assets/images/dest-kyoto.jpg',
      alt: 'Higashiyama Lantern House tranquil bamboo and temple garden sanctuary in Kyoto'
    },
    {
      id: 'hotel-villa-limonaia',
      name: 'Villa Solara Ravello',
      destinationId: 'amalfi',
      location: 'Ravello, Amalfi Coast, Italy',
      propertyType: 'Cliffside Estate',
      pricePerNight: 590,
      rating: 4.85,
      reviewsCount: 229,
      featuredScore: 95,
      badge: 'Signature Stay',
      amenities: ['Infinity Pool', 'Private Boat', 'Coastal Dining'],
      description: 'Seventeenth-century coastal estate draped in olive terraces with panoramic Tyrrhenian infinity pool.',
      image: 'assets/images/hero-coastal.jpg',
      alt: 'Villa Solara Ravello cliffside limestone infinity pool overlooking the sea at sunset'
    },
    {
      id: 'hotel-positano-azure',
      name: 'Positano Azure Boutique',
      destinationId: 'amalfi',
      location: 'Positano, Amalfi Coast, Italy',
      propertyType: 'Coastal Boutique',
      pricePerNight: 375,
      rating: 4.7,
      reviewsCount: 164,
      featuredScore: 86,
      badge: 'Seafront',
      amenities: ['Beach Access', 'Lemon Terrace', 'Aperitivo Bar'],
      description: 'Hand-painted Vietri tile suites perched minutes above Spiaggia Grande with sunset cocktail terraces.',
      image: 'assets/images/dest-amalfi.jpg',
      alt: 'Positano Azure Boutique pastel cliffside terrace framed by lemon branches and blue bay'
    },
    {
      id: 'hotel-matterhorn-glass',
      name: 'Matterhorn Glass Chalet',
      destinationId: 'zermatt',
      location: 'Winkelmatten, Zermatt, Switzerland',
      propertyType: 'Alpine Spa Lodge',
      pricePerNight: 680,
      rating: 4.9,
      reviewsCount: 205,
      featuredScore: 96,
      badge: 'Ski-In / Ski-Out',
      amenities: ['Thermal Spa', 'Panoramic Hearth', 'Private Ski Room'],
      description: 'Timber-and-glass alpine sanctuary framing uninterrupted views of the Matterhorn from every suite.',
      image: 'assets/images/hotel-7.jpg',
      alt: 'Matterhorn Glass Chalet glowing warmly in twilight snow below alpine peaks'
    },
    {
      id: 'hotel-alpine-timber',
      name: 'Alpine Timber Refuge',
      destinationId: 'zermatt',
      location: 'Bahnhofplatz, Zermatt, Switzerland',
      propertyType: 'Mountain Boutique',
      pricePerNight: 290,
      rating: 4.5,
      reviewsCount: 142,
      featuredScore: 81,
      badge: 'Cozy Chalet',
      amenities: ['Pine Sauna', 'Breakfast Included', 'Rail Access'],
      description: 'Warm larch-wood interiors, crackling stone fireplaces, and effortless access to scenic mountain railways.',
      image: 'assets/images/dest-zermatt.jpg',
      alt: 'Alpine Timber Refuge nestled beneath the snow-capped Matterhorn at twilight'
    },
    {
      id: 'hotel-sayan-canopy',
      name: 'Sayan Canopy Sanctuary',
      destinationId: 'bali',
      location: 'Sayan Ridge, Ubud, Bali',
      propertyType: 'Jungle Pool Villa',
      pricePerNight: 265,
      rating: 4.85,
      reviewsCount: 340,
      featuredScore: 94,
      badge: 'Wellness Pick',
      amenities: ['Rice Terrace View', 'Holistic Spa', 'Yoga Pavilion'],
      description: 'Cantilevered rainforest villas floating above emerald rice terraces with open-air teak soaking tubs.',
      image: 'assets/images/dest-bali.jpg',
      alt: 'Sayan Canopy Sanctuary overlooking misty emerald rice terraces in Ubud Bali'
    },
    {
      id: 'hotel-riad-zellige',
      name: 'Riad Zellige Palmeraie',
      destinationId: 'marrakech',
      location: 'Medina, Marrakech, Morocco',
      propertyType: 'Courtyard Riad',
      pricePerNight: 230,
      rating: 4.8,
      reviewsCount: 267,
      featuredScore: 91,
      badge: 'Design Gem',
      amenities: ['Hammam Spa', 'Courtyard Fountain', 'Rooftop Lanterns'],
      description: 'Intimate courtyard sanctuary adorned with artisan mosaic tiles, citrus trees, and candlelit rooftop dining.',
      image: 'assets/images/dest-marrakech.jpg',
      alt: 'Riad Zellige Palmeraie sunlit Moroccan courtyard with zellige fountain and orange trees'
    },
    {
      id: 'hotel-fjord-glacier',
      name: 'Fjord & Glacier Lodge',
      destinationId: 'patagonia',
      location: 'Torres del Paine, Patagonia, Chile',
      propertyType: 'Wilderness Lodge',
      pricePerNight: 740,
      rating: 4.9,
      reviewsCount: 131,
      featuredScore: 93,
      badge: 'All-Inclusive',
      amenities: ['Guided Treks', 'Glacier View', 'Gourmet Dining'],
      description: 'Architectural timber-and-glass outpost perched beside glacial waters with expert naturalist excursions.',
      image: 'assets/images/dest-patagonia.jpg',
      alt: 'Fjord & Glacier Lodge overlooking Torres del Paine peaks and turquoise glacial lake'
    },
    {
      id: 'hotel-skylight-geothermal',
      name: 'Skylight Geothermal Spa Hotel',
      destinationId: 'reykjavik',
      location: 'Reykjanes, Reykjavik, Iceland',
      propertyType: 'Nordic Design Hotel',
      pricePerNight: 410,
      rating: 4.8,
      reviewsCount: 194,
      featuredScore: 90,
      badge: 'Aurora View',
      amenities: ['Mineral Lagoon', 'Aurora Wake-Up', 'Nordic Kitchen'],
      description: 'Minimalist basalt architecture built directly onto steaming silica lagoons beneath northern lights skies.',
      image: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: 'assets/images/hotel-7.jpg',
      alt: 'Skylight Geothermal Spa Hotel beneath glowing Icelandic northern lights skies'
    }
  ];

  const SPECIAL_OFFERS = [
    {
      id: 'offer-solara15',
      code: 'SOLARA15',
      badge: 'Seasonal Escape',
      discountLabel: '15% OFF',
      discountType: 'percent',
      discountValue: 15,
      minNights: 2,
      title: 'Sunlit Coastal & Boutique Retreats',
      description: 'Save 15% on stays of 2 nights or more across our handpicked Mediterranean and island sanctuaries.',
      validity: 'Valid on stays of 2+ nights'
    },
    {
      id: 'offer-early20',
      code: 'EARLY20',
      badge: 'Advance Planner',
      discountLabel: '20% OFF',
      discountType: 'percent',
      discountValue: 20,
      minNights: 4,
      title: 'Extended Stay Early Bird',
      description: 'Unlock 20% off your nightly rate when reserving 4 or more consecutive nights anywhere in our collection.',
      validity: 'Valid on stays of 4+ nights'
    },
    {
      id: 'offer-weekend10',
      code: 'WEEKEND10',
      badge: 'Instant Perk',
      discountLabel: '10% OFF',
      discountType: 'percent',
      discountValue: 10,
      minNights: 1,
      title: 'Spontaneous Getaway Pass',
      description: 'Enjoy an instant 10% reduction on any check-in length, from single-night layovers to quick escapes.',
      validity: 'No minimum stay required'
    },
    {
      id: 'offer-luxe150',
      code: 'LUXE150',
      badge: 'Suite Credit',
      discountLabel: '$150 OFF',
      discountType: 'flat',
      discountValue: 150,
      minNights: 3,
      title: 'Signature Suite & Villa Credit',
      description: 'Take a flat $150 off your stay subtotal on 3+ night bookings—ideal for alpine chalets and eco-lodges.',
      validity: 'Valid on stays of 3+ nights'
    }
  ];

  const WHY_CHOOSE_US = [
    {
      id: 'curated',
      metric: '100% Vetted',
      title: 'Handpicked Design & Character',
      description: 'Every property passes an in-person architectural, hospitality, and location inspection before joining Solara.'
    },
    {
      id: 'transparent',
      metric: 'Zero Hidden Fees',
      title: 'Upfront Live Price Estimates',
      description: 'See exact nightly rates, extra-guest adjustments, promo savings, and occupancy taxes before you commit.'
    },
    {
      id: 'flexible',
      metric: '48h Free Changes',
      title: 'Flexible Date Adjustments',
      description: 'Plans shift effortlessly. Modify check-in windows or room counts up to 48 hours prior to arrival.'
    },
    {
      id: 'concierge',
      metric: '24/7 Local Hosts',
      title: 'Dedicated Destination Concierge',
      description: 'From private boat transfers in Ravello to onsen reservations in Kyoto, real local specialists guide every trip.'
    }
  ];

  const TESTIMONIALS = [
    {
      id: 'test-1',
      name: 'Elena Rostova',
      initials: 'ER',
      location: 'London, UK',
      tripType: 'Anniversary Escape',
      stayName: 'Caldera Horizon Suites · Santorini',
      rating: 5,
      quote: 'The live estimator matched our final invoice to the dollar, and waking up to that plunge pool view over Oia felt like stepping inside a postcard.'
    },
    {
      id: 'test-2',
      name: 'Kenji Takahashi',
      initials: 'KT',
      location: 'San Francisco, USA',
      tripType: 'Solo Cultural Trip',
      stayName: 'Arashiyama Kaze Ryokan · Kyoto',
      rating: 5,
      quote: 'Solara filtered out all the tourist traps. Watching morning mist drift through the bamboo grove from my cedar onsen was unforgettable.'
    },
    {
      id: 'test-3',
      name: 'Camille Laurent',
      initials: 'CL',
      location: 'Paris, France',
      tripType: 'Summer Villa Stay',
      stayName: 'Villa Limonaia Ravello · Amalfi Coast',
      rating: 5,
      quote: 'Using the EARLY20 code saved us nearly $500 on a five-night Amalfi stay. The concierge even arranged our private wooden boat along Positano.'
    },
    {
      id: 'test-4',
      name: 'Marcus & Priya Patel',
      initials: 'MP',
      location: 'Toronto, Canada',
      tripType: 'Winter Alpine Break',
      stayName: 'Matterhorn Glass Chalet · Zermatt',
      rating: 5,
      quote: 'We saved three chalets to our wishlist over a week while comparing dates. Having the exact total recalculate as we changed rooms made deciding effortless.'
    },
    {
      id: 'test-5',
      name: 'Sofia Lindqvist',
      initials: 'SL',
      location: 'Stockholm, Sweden',
      tripType: 'Wellness Sabbatical',
      stayName: 'Sayan Canopy Sanctuary · Bali',
      rating: 4.9,
      quote: 'Every detail on the site reflected reality when we arrived in Ubud—quiet jungle mornings, attentive hosts, and zero surprise resort surcharges.'
    },
    {
      id: 'test-6',
      name: 'Mateo Alvarez',
      initials: 'MA',
      location: 'Madrid, Spain',
      tripType: 'Photography Expedition',
      stayName: 'Fjord & Glacier Lodge · Patagonia',
      rating: 5,
      quote: 'Seamless planning from start to finish. Watching granite peaks glow pink at sunrise right through the lodge glass wall was worth every mile.'
    }
  ];

  global.SolaraData = {
    DESTINATIONS,
    HOTELS,
    SPECIAL_OFFERS,
    WHY_CHOOSE_US,
    TESTIMONIALS
  };
})(window);
