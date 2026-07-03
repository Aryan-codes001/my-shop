export const PRODUCTS = [
  {
    id: 1,
    name: "AeroPulse ANC Headphones",
    category: "Tech",
    price: 249.99,
    rating: 4.8,
    reviews: 124,
    description: "Experience absolute acoustic clarity with active hybrid noise cancellation, 45-hour battery life, and spatial audio support. Crafted with premium memory foam earcups and a lightweight aluminum frame.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    features: [
      "Hybrid Active Noise Cancellation (up to 40dB)",
      "45 Hours battery life with fast charging",
      "Spatial audio with dynamic head tracking",
      "Bluetooth 5.2 & Multipoint connection"
    ],
    colors: ["Space Gray", "Silver Matte", "Alpine White"],
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Chronos Smart Watch Edition 4",
    category: "Tech",
    price: 329.99,
    rating: 4.7,
    reviews: 88,
    description: "A gorgeous titanium timepiece that monitors your vitals, tracks athletic output, and keeps you seamlessly connected. Features a bright Always-On Retina display with up to 7 days of power.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600",
    features: [
      "Always-On LTPO OLED Retina display",
      "Heart rate, SpO2, and sleep tracking",
      "100m water resistance (swimproof)",
      "Titanium case with fluorocarbon strap"
    ],
    colors: ["Midnight Black", "Titanium Raw", "Sunset Orange"],
    badge: "Trending"
  },
  {
    id: 3,
    name: "Apex 75% Mechanical Keyboard",
    category: "Office",
    price: 159.99,
    rating: 4.9,
    reviews: 210,
    description: "The ultimate tactile typing experience. Hot-swappable linear yellow switches, double-shot PBT keycaps, gasket-mounted sound dampening, and custom RGB backlight control via onboard memory.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    features: [
      "Gasket-mounted layout with PC plate",
      "Pre-lubed linear yellow switches (hot-swappable)",
      "Premium double-shot PBT keycaps",
      "Tri-mode connectivity (2.4Ghz, BT 5.0, USB-C)"
    ],
    colors: ["Classic Charcoal", "Nordic White", "Cyberpunk Violet"],
    badge: "Staff Pick"
  },
  {
    id: 4,
    name: "Nomad Canvas Adventure Pack",
    category: "Lifestyle",
    price: 119.99,
    rating: 4.6,
    reviews: 67,
    description: "Weatherproof waxed canvas meets modular storage. Fits a 16-inch laptop with a dedicated suspended pocket, custom organization dividers, and a hidden secure passport pocket for travel.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    features: [
      "Water-resistant waxed cotton canvas",
      "Suspended 16-inch laptop compartment",
      "Luggage pass-through strap for travel",
      "Capacity: 24L expandable to 28L"
    ],
    colors: ["Olive Drab", "Desert Tan", "Obsidian Black"],
    badge: "New"
  },
  {
    id: 5,
    name: "HydroFlask Meridian Bottle",
    category: "Lifestyle",
    price: 39.99,
    rating: 4.5,
    reviews: 142,
    description: "Double-walled vacuum insulated bottle keeping beverages ice-cold for 24 hours or steaming hot for 12. Complete with a soft-touch powder coat and a leak-proof magnetic cap.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
    features: [
      "TempShield insulation keeps drinks cold/hot",
      "BPA-free & 18/8 food-grade stainless steel",
      "Leak-proof straw cap with carrying loop",
      "Powder coat finish for comfortable grip"
    ],
    colors: ["Sage Green", "Pacific Blue", "Sandstorm"],
    badge: ""
  },
  {
    id: 6,
    name: "EgoCurve Ergonomic Desk Chair",
    category: "Office",
    price: 449.99,
    rating: 4.7,
    reviews: 54,
    description: "Redefining task comfort. Highly breathable premium mesh back, self-adjusting dynamic lumbar support, 4D adjustable armrests, and a multi-angle synchronous tilt mechanism.",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600",
    features: [
      "Auto-adjusting lumbar support system",
      "Ultra-breathable premium Korean mesh back",
      "4D armrests (height, angle, depth, width)",
      "Heavy-duty aluminum alloy base (supports 300 lbs)"
    ],
    colors: ["Slate Gray", "Polar White"],
    badge: "Premium"
  },
  {
    id: 7,
    name: "Nomad Wool Felt Desk Mat",
    category: "Office",
    price: 49.99,
    rating: 4.8,
    reviews: 95,
    description: "Soft Merino wool felt desk pad designed to elevate and organize your workspace. Protects your desk surface, dampens keystroke noise, and provides a smooth trackable surface for optical mice.",
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=600",
    features: [
      "100% natural Merino wool felt",
      "Non-slip natural rubber backing",
      "Precision-stitched anti-fray borders",
      "Dimensions: 900mm x 400mm x 4mm"
    ],
    colors: ["Dark Ash", "Light Gray"],
    badge: ""
  },
  {
    id: 8,
    name: "Flux MagSafe Wireless Charger",
    category: "Tech",
    price: 79.99,
    rating: 4.6,
    reviews: 73,
    description: "A minimal 3-in-1 magnetic charging station crafted from aerospace-grade aluminum. Charges your smartphone, smartwatch, and wireless earbuds simultaneously with fast-charging technology.",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600",
    features: [
      "15W MagSafe fast charging for phones",
      "Integrated Apple Watch charging puck",
      "Dedicated 5W Qi wireless pad for earbuds",
      "Single USB-C input with PD adapter included"
    ],
    colors: ["Anodized Silver", "Space Matte"],
    badge: "New"
  }
];

export const COUPONS = {
  "WELCOME10": 0.10, // 10% off
  "PROMSHOP": 0.15, // 15% off
  "BIGDEAL": 20.00,  // Flat $20 off (handled conditionally)
};
