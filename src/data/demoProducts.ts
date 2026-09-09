import { Product } from '../types/product';

export const DEMO_PRODUCTS: Product[] = [
  // ================= NORMAL STORE: MEN =================
  {
    id: 'prod-nm-01',
    name: 'Classic Oxford Cotton Button-Down Shirt',
    brand: 'HIGHLANDER',
    description: 'Pre-washed breathable 100% combed cotton button-down shirt designed for all-day smart casual and office wear.',
    details: [
      '100% Breathable Long-Staple Cotton',
      'Button-down collar with pearlescent buttons',
      'Reinforced single-needle tailoring',
      'Machine wash cold, tumble dry low',
    ],
    price: 999,
    originalPrice: 1999,
    discount: 50,
    categoryId: 'men',
    subcategoryId: 'men-shirts',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', // Sky Blue
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', // White
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop', // Navy
    ],
    colorImages: {
      'Sky Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      'Crisp White': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      'Navy': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.3,
    reviewCount: 428,
    reviews: [
      {
        id: 'rev-01',
        userName: 'Vikram Sharma',
        rating: 5,
        comment: 'Superb fitting and genuine cotton fabric. Sky Blue color looks even better in real daylight. 100% value for money!',
        date: '3 days ago',
        verified: true,
      },
      {
        id: 'rev-02',
        userName: 'Rohan Mehra',
        rating: 4,
        comment: 'Good collar stiffness and quality stitching. Delivered in 2 days.',
        date: '1 week ago',
        verified: true,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        name: 'Sky Blue',
        hex: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Crisp light pastel blue with oxford weave texture',
      },
      {
        name: 'Crisp White',
        hex: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Pure bright optical white formal look',
      },
      {
        name: 'Navy',
        hex: '#000080',
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Deep midnight navy casual shade',
      },
    ],
    stock: 45,
    isFeatured: true,
    isTrending: true,
    tags: ['bestseller', 'casual', 'office'],
  },
  {
    id: 'prod-nm-02',
    name: 'Heavyweight Graphic Oversized Tee',
    brand: 'ROADSTER',
    description: '240 GSM drop-shoulder streetwear graphic t-shirt featuring high-density typography print.',
    details: ['240 GSM Pure Bio-Washed Cotton', 'Ribbed lycra neckline', 'Relaxed boxy silhouette'],
    price: 649,
    originalPrice: 1299,
    discount: 50,
    categoryId: 'men',
    subcategoryId: 'men-tshirts',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', // Charcoal
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', // Bone White
    ],
    colorImages: {
      'Charcoal Wash': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      'Bone White': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.5,
    reviewCount: 890,
    reviews: [
      {
        id: 'rev-03',
        userName: 'Aakash Verma',
        rating: 5,
        comment: 'The 240 GSM thickness is unreal at ₹649. Drop shoulder cut is pure streetwear perfection.',
        date: 'Yesterday',
        verified: true,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        name: 'Charcoal Wash',
        hex: '#36454F',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Vintage washed dark grey finish',
      },
      {
        name: 'Bone White',
        hex: '#F9F6EE',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Muted warm ecru streetwear tone',
      },
    ],
    stock: 75,
    isNewArrival: true,
    isTrending: true,
    tags: ['streetwear', 'oversized'],
  },
  {
    id: 'prod-nm-03',
    name: 'Slim Tapered Stretch Denim Jeans',
    brand: 'SPYKAR',
    description: 'Clean medium-indigo faded 5-pocket denim with 2% elastane for unrestricted stretch and flexibility.',
    details: ['98% Cotton, 2% Elastane', 'Zip fly with shank button', 'Whiskering and hand-scrape wash'],
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    categoryId: 'men',
    subcategoryId: 'men-jeans',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop', // Medium Indigo
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', // Washed Black
    ],
    colorImages: {
      'Medium Wash Indigo': 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
      'Washed Black': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.2,
    reviewCount: 312,
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      {
        name: 'Medium Wash Indigo',
        hex: '#2B4C7E',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Washed Black',
        hex: '#222222',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 38,
    isFeatured: false,
    tags: ['denim', 'everyday'],
  },

  // ================= LOW RANGE / BUDGET SECTION (MEESHO / MYNTRA PICKS) =================
  {
    id: 'prod-nm-budget-01',
    name: 'Pure Combed Cotton Round Neck Tee',
    brand: 'MAX FASHION',
    description: 'Super-soft 180 GSM bio-washed daily wear t-shirt. Breathable fabric ideal for summer and casual layering.',
    details: ['100% Breathable Combed Cotton', 'Ribbed lycra neckband prevents sagging', 'Pre-shrunk colorfast dye', 'Daily machine wash friendly'],
    price: 199,
    originalPrice: 499,
    discount: 60,
    categoryId: 'men',
    subcategoryId: 'men-tshirts',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', // Jet Black
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop', // Olive Green
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop', // Heather Grey
    ],
    colorImages: {
      'Jet Black': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'Olive Green': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
      'Heather Grey': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.4,
    reviewCount: 1420,
    reviews: [
      {
        id: 'rev-b1',
        userName: 'Suresh Kumar',
        rating: 5,
        comment: 'At ₹199 this t-shirt is unbeatable! Soft fabric, doesn’t shrink after wash. Ordered 3 colors.',
        date: '2 days ago',
        verified: true,
      },
      {
        id: 'rev-b2',
        userName: 'Deepak Patel',
        rating: 4,
        comment: 'Great everyday basic t-shirt. Fast delivery in Bangalore.',
        date: '5 days ago',
        verified: true,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        name: 'Jet Black',
        hex: '#111111',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Deep solid black everyday basic',
      },
      {
        name: 'Olive Green',
        hex: '#556B2F',
        imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Earthy military olive tone',
      },
      {
        name: 'Heather Grey',
        hex: '#A9A9A9',
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Melange textured athletic grey',
      },
    ],
    stock: 120,
    isFeatured: true,
    isTrending: true,
    tags: ['budget', 'under299', 'bestseller', 'meesho-special'],
  },
  {
    id: 'prod-nm-budget-02',
    name: 'Printed Casual Rayon Daily Kurti',
    brand: 'ANOUK',
    description: 'Lightweight flowing rayon daily wear straight kurti with floral ethnic prints and three-quarter sleeves.',
    details: ['100% Soft Breathable Viscose Rayon', 'Round neck with button placket', 'Calf length with side slits', 'Gentle hand or machine wash'],
    price: 299,
    originalPrice: 799,
    discount: 62,
    categoryId: 'women',
    subcategoryId: 'women-ethnic',
    gender: 'women',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', // Indigo Blue
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop', // Mustard Gold
    ],
    colorImages: {
      'Indigo Floral': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      'Mustard Yellow': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.5,
    reviewCount: 980,
    reviews: [
      {
        id: 'rev-b3',
        userName: 'Priya Sundaram',
        rating: 5,
        comment: 'Such a pretty kurti! Looks very elegant for office and daily college wear. Fabric is super soft.',
        date: '1 day ago',
        verified: true,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        name: 'Indigo Floral',
        hex: '#1F3A52',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Traditional bagru inspired indigo blue',
      },
      {
        name: 'Mustard Yellow',
        hex: '#E1AD01',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Warm festive turmeric yellow',
      },
    ],
    stock: 95,
    isFeatured: true,
    isTrending: true,
    tags: ['budget', 'under499', 'ethnic', 'kurti'],
  },
  {
    id: 'prod-nm-budget-03',
    name: 'Ultra-Lightweight Ergonomic Casual Slides',
    brand: 'CAMPUS',
    description: 'High-rebound molded EVA waterproof comfort sliders with anti-slip textured grip footbed.',
    details: ['100% Water-Resistant Soft EVA', 'Ergonomic arch support footbed', 'Anti-skid wave tread outsole', 'Washable and quick drying'],
    price: 249,
    originalPrice: 599,
    discount: 58,
    categoryId: 'footwear',
    subcategoryId: 'footwear-casual',
    gender: 'unisex',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop', // Slate Grey
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', // Navy Blue
    ],
    colorImages: {
      'Slate Grey': 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop',
      'Navy Blue': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.3,
    reviewCount: 654,
    reviews: [
      {
        id: 'rev-b4',
        userName: 'Naveen Reddy',
        rating: 5,
        comment: 'Cushioning is like walking on clouds. Perfect for home and casual outings.',
        date: '4 days ago',
        verified: true,
      },
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      {
        name: 'Slate Grey',
        hex: '#708090',
        imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Navy Blue',
        hex: '#002147',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 80,
    isFeatured: true,
    tags: ['footwear', 'budget', 'slides', 'under299'],
  },
  {
    id: 'prod-nm-budget-04',
    name: 'Quick-Dry Athletic Gym Training Shorts',
    brand: 'HRX',
    description: 'Performance stretch running and workout shorts with dual side zip pockets and elasticated drawstring.',
    details: ['Moisture-wicking polyester-spandex blend', 'Deep zippered pockets for phone security', 'Reflective night safety logo'],
    price: 299,
    originalPrice: 699,
    discount: 57,
    categoryId: 'men',
    subcategoryId: 'men-trousers',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', // Carbon Black
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop', // Steel Navy
    ],
    colorImages: {
      'Carbon Black': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
      'Steel Navy': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.4,
    reviewCount: 512,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      {
        name: 'Carbon Black',
        hex: '#1A1A1A',
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Steel Navy',
        hex: '#232B38',
        imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 65,
    tags: ['gym', 'shorts', 'budget'],
  },
  {
    id: 'prod-nm-budget-05',
    name: 'Womens Floral Print Ruffle Casual Top',
    brand: 'DOROTHY PERKINS',
    description: 'Flirty flutter-sleeve floral georgette blouse with subtle split V-neckline. Perfect with denim shorts or trousers.',
    details: ['Lightweight crepe georgette', 'Wrinkle-resistant wash & wear', 'Elasticated cuff detailing'],
    price: 349,
    originalPrice: 899,
    discount: 61,
    categoryId: 'women',
    subcategoryId: 'women-tops',
    gender: 'women',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=800&auto=format&fit=crop', // Cherry Red
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', // Pastel Cream
    ],
    colorImages: {
      'Cherry Red': 'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=800&auto=format&fit=crop',
      'Pastel Cream': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.6,
    reviewCount: 388,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      {
        name: 'Cherry Red',
        hex: '#D2042D',
        imageUrl: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Pastel Cream',
        hex: '#FFFDD0',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 70,
    tags: ['top', 'women', 'budget', 'under499'],
  },
  {
    id: 'prod-nm-budget-06',
    name: 'Relaxed Fit Cotton Twill Cargo Joggers',
    brand: 'LOCOMOTIVE',
    description: 'Rugged utility multi-pocket jogger pants featuring ribbed ankle cuffs and adjustable drawcord waist.',
    details: ['100% Washed Cotton Twill', '6 functional flap utility pockets', 'Reinforced knee stitching'],
    price: 499,
    originalPrice: 1299,
    discount: 61,
    categoryId: 'men',
    subcategoryId: 'men-trousers',
    gender: 'men',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop', // Olive Green
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop', // Khaki Tan
    ],
    colorImages: {
      'Olive Green': 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
      'Khaki Tan': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.3,
    reviewCount: 720,
    sizes: ['30', '32', '34', '36'],
    colors: [
      {
        name: 'Olive Green',
        hex: '#556B2F',
        imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Khaki Tan',
        hex: '#C3B091',
        imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 50,
    tags: ['cargos', 'joggers', 'budget'],
  },
  {
    id: 'prod-nm-budget-07',
    name: 'Polarized Metal Frame Aviator Sunglasses',
    brand: 'VOYAGE',
    description: 'Classic teardrop aviator shades with UV400 anti-glare protection and spring hinge comfort temples.',
    details: ['UV400 Category 3 Sun Protection', 'Lightweight surgical steel frame', 'Silicone hypoallergenic nose pads'],
    price: 299,
    originalPrice: 799,
    discount: 62,
    categoryId: 'accessories',
    subcategoryId: 'acc-eyewear',
    gender: 'unisex',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', // Gold Frame
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', // Silver Black
    ],
    colorImages: {
      'Gold & Green': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
      'Silver & Black': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.5,
    reviewCount: 840,
    sizes: ['Standard Medium (58mm)'],
    colors: [
      {
        name: 'Gold & Green',
        hex: '#D4AF37',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Silver & Black',
        hex: '#C0C0C0',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 90,
    tags: ['sunglasses', 'budget', 'under299'],
  },
  {
    id: 'prod-nm-budget-08',
    name: 'Cushioned Athletic Ankle Socks (Pack of 5)',
    brand: 'PUMA BASIC',
    description: 'High-density terry cushioned heel and toe ankle socks with breathable mesh venting for maximum comfort.',
    details: ['80% Combed Cotton, 17% Poly, 3% Elastane', 'Arch compression support band', 'Reinforced heel and toe wear zones'],
    price: 199,
    originalPrice: 499,
    discount: 60,
    categoryId: 'accessories',
    subcategoryId: 'acc-socks',
    gender: 'unisex',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
    ],
    colorImages: {
      'Assorted Monochrome': 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.7,
    reviewCount: 1650,
    sizes: ['Free Size (Fits UK 6-11)'],
    colors: [
      {
        name: 'Assorted Monochrome',
        hex: '#333333',
        imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 200,
    tags: ['socks', 'pack', 'budget', 'under199'],
  },

  // ================= NORMAL STORE: WOMEN =================
  {
    id: 'prod-nm-06',
    name: 'Floral A-Line Tiered Midi Dress',
    brand: 'FOREVER NEW',
    description: 'Feminine sweetheart neck printed floral midi dress with puff sleeves and flattering ruched bodice.',
    details: ['Soft georgette with cotton lining', 'Smocked stretchy back panel', 'Concealed side zipper'],
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    categoryId: 'women',
    subcategoryId: 'women-dresses',
    gender: 'women',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop', // Pastel Rose
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop', // White Daisy
    ],
    colorImages: {
      'Pastel Rose': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'White Daisy': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.6,
    reviewCount: 520,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      {
        name: 'Pastel Rose',
        hex: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'White Daisy',
        hex: '#FFFFFF',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 40,
    isFeatured: true,
    tags: ['floral', 'dress', 'summer'],
  },
  {
    id: 'prod-nm-09',
    name: 'Air Flow Lightweight Performance Sneaker',
    brand: 'RED TAPE',
    description: 'Athletic lifestyle walking sneaker featuring memory foam insole and breathable mesh upper.',
    details: ['Memory tech high-rebound cushioning', 'Slip-resistant EVA phylon sole', 'Lightweight 220g design'],
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    categoryId: 'footwear',
    subcategoryId: 'footwear-casual',
    gender: 'unisex',
    storeType: 'normal',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', // Crimson Red
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop', // Stealth Black
    ],
    colorImages: {
      'Crimson Red': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'Stealth Black': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.4,
    reviewCount: 880,
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      {
        name: 'Crimson Red',
        hex: '#DC143C',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Stealth Black',
        hex: '#111111',
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 55,
    isTrending: true,
    tags: ['sneakers', 'sports'],
  },

  // ================= PREMIUM STORE: ACCESSIBLE LUXURY STARTERS =================
  {
    id: 'prod-pm-budget-01',
    name: 'Mulberry Silk Jacquard Pocket Square',
    brand: 'ARMANI EXCHANGE',
    description: 'Hand-rolled pure Italian Mulberry silk pocket square woven in Como, Italy with signature micro-geometric jacquard motifs.',
    details: ['100% Pure Italian Mulberry Silk', 'Hand-rolled and sewn borders', 'Dimensions: 33 x 33 cm', 'Presented in gilded luxury gift box'],
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    categoryId: 'accessories',
    subcategoryId: 'acc-menswear',
    gender: 'men',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop', // Champagne Gold
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop', // Navy Blue
    ],
    colorImages: {
      'Champagne Gold': 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
      'Midnight Navy': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.8,
    reviewCount: 142,
    reviews: [
      {
        id: 'rev-p1',
        userName: 'Siddharth Oberoi',
        rating: 5,
        comment: 'Exquisite silk sheen! Adds an immediate touch of royalty to my tuxedo. Best entry luxury purchase.',
        date: '2 weeks ago',
        verified: true,
      },
    ],
    sizes: ['33cm x 33cm'],
    colors: [
      {
        name: 'Champagne Gold',
        hex: '#F7E7CE',
        imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Subtle metallic champagne with micro-herringbone weave',
      },
      {
        name: 'Midnight Navy',
        hex: '#191970',
        imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Deep sapphire navy with satin lustre',
      },
    ],
    stock: 28,
    isFeatured: true,
    tags: ['luxury', 'silk', 'accessories', 'budget-luxury'],
  },
  {
    id: 'prod-pm-budget-02',
    name: 'Artisanal Woven Leather Key Clochette',
    brand: 'BOTTEGA ATELIER',
    description: 'Masterfully hand-braided Intrecciato calfskin leather key ring clochette with palladium-finished split ring.',
    details: ['100% Full-Grain Tuscan Calfskin', 'Handmade in Veneto, Italy', 'Laser-engraved hardware'],
    price: 1899,
    originalPrice: 3799,
    discount: 50,
    categoryId: 'accessories',
    subcategoryId: 'acc-leather',
    gender: 'unisex',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop', // Obsidian Black
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop', // Tan Cognac
    ],
    colorImages: {
      'Obsidian Black': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      'Tan Cognac': 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.9,
    reviewCount: 96,
    sizes: ['One Size'],
    colors: [
      {
        name: 'Obsidian Black',
        hex: '#0A0A0A',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Tan Cognac',
        hex: '#9A4B1A',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 22,
    tags: ['leather', 'luxury', 'keyholder'],
  },
  {
    id: 'prod-pm-budget-03',
    name: 'Saffiano Calfskin Minimalist 4-Card Case',
    brand: 'MONTBLANC ATELIER',
    description: 'Ultra-slim pocket wallet crafted from scratch-resistant German Saffiano leather featuring the signature snowcap emblem.',
    details: ['Scratch-resistant cross-hatch Saffiano leather', '4 credit card slots and central cash sleeve', 'RFID blocking inner lining'],
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    categoryId: 'accessories',
    subcategoryId: 'acc-wallets',
    gender: 'unisex',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop', // Noir Black
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800&auto=format&fit=crop', // Royal Navy
    ],
    colorImages: {
      'Noir Black': 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'Royal Navy': 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.9,
    reviewCount: 180,
    sizes: ['10 x 7.5 cm'],
    colors: [
      {
        name: 'Noir Black',
        hex: '#111111',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Royal Navy',
        hex: '#002366',
        imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 25,
    isFeatured: true,
    tags: ['leather', 'wallet', 'luxury', 'cardholder'],
  },
  {
    id: 'prod-pm-budget-04',
    name: 'Private Blend Discovery Fragrance Trio',
    brand: 'TOM FORD BEAUTY',
    description: 'Exclusive 3x10ml atomizer discovery set featuring iconic extrait de parfums: Oud Wood, Tobacco Vanille, and Soleil Blanc.',
    details: ['Pure concentrated Extrait de Parfum', 'Travel-friendly magnetic cap atomizers', 'High projection and 14+ hour longevity'],
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    categoryId: 'accessories',
    subcategoryId: 'acc-fragrance',
    gender: 'unisex',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    ],
    colorImages: {
      'Amber Noir Flacon': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.9,
    reviewCount: 215,
    sizes: ['3 x 10ml Travel Set'],
    colors: [
      {
        name: 'Amber Noir Flacon',
        hex: '#7E3517',
        imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 18,
    isTrending: true,
    tags: ['perfume', 'luxury', 'fragrance'],
  },
  {
    id: 'prod-pm-budget-05',
    name: '100% Cashmere Ribbed Minimalist Beanie',
    brand: 'LORO PIANA ATELIER',
    description: 'Spun from virgin Mongolian baby cashmere fibers, offering weightless warmth and supreme softness against the skin.',
    details: ['100% Extra-Fine Baby Cashmere', '7-gauge fisherman rib knit', 'Turn-up cuff for adjustable styling'],
    price: 2799,
    originalPrice: 5499,
    discount: 49,
    categoryId: 'accessories',
    subcategoryId: 'acc-knitwear',
    gender: 'unisex',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop', // Charcoal Grey
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop', // Winter Camel
    ],
    colorImages: {
      'Charcoal Heather': 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop',
      'Winter Camel': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    },
    rating: 5.0,
    reviewCount: 78,
    sizes: ['One Size Fits All'],
    colors: [
      {
        name: 'Charcoal Heather',
        hex: '#36454F',
        imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Winter Camel',
        hex: '#C19A6B',
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 15,
    tags: ['cashmere', 'luxury', 'beanie'],
  },

  // ================= PREMIUM STORE: FLAGSHIP HIGH LUXURY =================
  {
    id: 'prod-pm-01',
    name: 'Hand-Tailored Wool-Silk Peak Lapel Tuxedo',
    brand: 'GIORGIO ARMANI',
    description: 'Masterfully crafted in Biella, Italy with Super 160s virgin wool and Mulberry silk satin lapels for timeless black-tie majesty.',
    details: [
      'Super 160s Italian Virgin Wool & Silk Blend',
      'Pure silk satin peak lapels and covered buttons',
      'Full floating canvas construction for custom drape',
      'Dry clean only by luxury garment specialists',
    ],
    price: 24999,
    originalPrice: 38999,
    discount: 36,
    categoryId: 'men',
    subcategoryId: 'men-suits',
    gender: 'men',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop', // Midnight Black
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', // Royal Navy Blue
    ],
    colorImages: {
      'Midnight Black': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      'Royal Navy': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.9,
    reviewCount: 94,
    reviews: [
      {
        id: 'rev-p2',
        userName: 'Aditya Singhania',
        rating: 5,
        comment: 'Armani peak lapel fit is unparalleled. The floating canvas adjusts naturally to posture. Flawless concierge packing.',
        date: '1 month ago',
        verified: true,
      },
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: [
      {
        name: 'Midnight Black',
        hex: '#0A0A0E',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Deepest formal matte obsidian with lustrous silk facings',
      },
      {
        name: 'Royal Navy',
        hex: '#0A1128',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Regal sapphire midnight hue tailored for gala dinners',
      },
    ],
    stock: 12,
    isFeatured: true,
    isTrending: true,
    tags: ['tuxedo', 'black-tie', 'luxury'],
  },
  {
    id: 'prod-pm-02',
    name: 'Hand-Pleated Mulberry Silk Evening Gown',
    brand: 'VALENTINO COUTURE',
    description: 'Bespoke floor-length evening gown crafted with 100% double-faced silk crepe featuring dramatic flowing asymmetrical pleating.',
    details: [
      '100% Mulberry Silk Crepe de Chine',
      'Hand-pleated bodice by Roman atelier artisans',
      'Integrated corsetry boning with concealed back closure',
    ],
    price: 32999,
    originalPrice: 48999,
    discount: 33,
    categoryId: 'women',
    subcategoryId: 'women-gowns',
    gender: 'women',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop', // Emerald Green
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop', // Crimson Ruby
    ],
    colorImages: {
      'Emerald Green': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      'Crimson Ruby': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    },
    rating: 5.0,
    reviewCount: 48,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      {
        name: 'Emerald Green',
        hex: '#046307',
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Jewel-toned rich forest emerald with satin drape',
      },
      {
        name: 'Crimson Ruby',
        hex: '#9B111E',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        toneDescription: 'Fiery Roman ruby red haute couture tone',
      },
    ],
    stock: 8,
    isFeatured: true,
    tags: ['haute-couture', 'silk', 'gown'],
  },
  {
    id: 'prod-pm-03',
    name: 'Chronograph Perpetual Calendar Gold Watch',
    brand: 'PATEK PHILLIPE ATELIER',
    description: 'Swiss certified automatic chronometer movement housed in 18K solid rose-gold case with hand-stitched alligator strap.',
    details: [
      '18K Solid Rose Gold 41mm polished case',
      'Automatic Calibre 324 with 48-hour power reserve',
      'Scratch-proof sapphire crystal front and exhibition back',
      'Water resistant to 50 meters',
    ],
    price: 49999,
    originalPrice: 75000,
    discount: 33,
    categoryId: 'accessories',
    subcategoryId: 'acc-watches',
    gender: 'unisex',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', // Rose Gold
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop', // Platinum White
    ],
    colorImages: {
      'Rose Gold': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      'Platinum Silver': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    },
    rating: 5.0,
    reviewCount: 31,
    sizes: ['41mm Case Diameter'],
    colors: [
      {
        name: 'Rose Gold',
        hex: '#B76E79',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Platinum Silver',
        hex: '#E5E4E2',
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 5,
    isFeatured: true,
    tags: ['horology', 'swiss-made', 'watch'],
  },
  {
    id: 'prod-pm-05',
    name: 'Saffiano Monogram Leather Structured Tote',
    brand: 'PRADA MILANO',
    description: 'Iconic structured tote crafted from scratch-resistant Italian Saffiano calf leather with 24K gold-plated hardware.',
    details: [
      'Cross-hatch textured Saffiano leather',
      'Nappa leather interior with dual zip compartments',
      'Detachable clochette with customized key ring',
      'Made in Florence, Italy',
    ],
    price: 15999,
    originalPrice: 22999,
    discount: 30,
    categoryId: 'accessories',
    subcategoryId: 'acc-bags',
    gender: 'women',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', // Onyx Black
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', // Caramel Toffee
    ],
    colorImages: {
      'Onyx Black & Gold': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'Caramel Toffee': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    },
    rating: 4.8,
    reviewCount: 112,
    sizes: ['36 x 28 x 16 cm'],
    colors: [
      {
        name: 'Onyx Black & Gold',
        hex: '#1C1C1C',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Caramel Toffee',
        hex: '#967117',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 9,
    isFeatured: true,
    tags: ['handbag', 'luxury', 'leather'],
  },
  {
    id: 'prod-pm-06',
    name: 'Cashmere-Silk Double-Faced Belted Coat',
    brand: 'MAX MARA ATELIER',
    description: 'Iconic belted wrap coat masterfully spun from 70% Mongolian Cashmere and 30% Mulberry Silk with hand-stitched borders.',
    details: [
      'Double-faced brushed cashmere-silk weave',
      'Kimono sleeves with wide lapels and matching tie belt',
      'Unlined lightness with maximum thermal insulation',
    ],
    price: 19999,
    originalPrice: 29999,
    discount: 33,
    categoryId: 'women',
    subcategoryId: 'women-tops',
    gender: 'women',
    storeType: 'premium',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=800&auto=format&fit=crop', // Camel Tan
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', // Ivory Cream
    ],
    colorImages: {
      'Camel Tan': 'https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=800&auto=format&fit=crop',
      'Ivory Cream': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    },
    rating: 5.0,
    reviewCount: 64,
    sizes: ['S', 'M', 'L'],
    colors: [
      {
        name: 'Camel Tan',
        hex: '#C19A6B',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Ivory Cream',
        hex: '#FFFDD0',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      },
    ],
    stock: 7,
    isNewArrival: true,
    tags: ['cashmere', 'luxury', 'coat'],
  },
];
