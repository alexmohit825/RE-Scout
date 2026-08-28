import { Region, AssetType, Property, FinancialMetrics, LoanDetails } from '../types';

export const PRIMARY_ASSET_TYPES: AssetType[] = [
  { id: 'multifamily', label: 'Multi-Family (5+ units)', category: 'primary' },
  { id: 'apartment_complex', label: 'Apartment Complex', category: 'primary' },
  { id: 'condo_complex', label: 'Condo / HOA Complex', category: 'primary' },
  { id: 'industrial_warehouse', label: 'Industrial / Warehouse', category: 'primary' },
  { id: 'flex_industrial', label: 'Flex Industrial Space', category: 'primary' },
  { id: 'light_manufacturing', label: 'Light Manufacturing', category: 'primary' },
  { id: 'distribution_center', label: 'Distribution / Logistics', category: 'primary' }
];

export const RESIDENTIAL_ASSET_TYPES: AssetType[] = [
  { id: 'single_family', label: 'Single Family (SFR)', category: 'residential' },
  { id: 'duplex_triplex', label: 'Duplex / Triplex', category: 'residential' },
  { id: 'townhome', label: 'Townhome / Townhouse', category: 'residential' }
];

export const REGIONS: Region[] = [
  {
    id: 'pnw',
    label: 'Washington & Oregon',
    states: ['WA', 'OR'],
    description: 'Pacific Northwest — Seattle, Portland, Spokane, Eugene'
  },
  {
    id: 'southwest',
    label: 'Southwest',
    states: ['CA', 'AZ', 'NV', 'NM', 'UT', 'CO', 'HI'],
    description: 'Western Sun Belt — Phoenix, Las Vegas, Denver, SoCal'
  },
  {
    id: 'midwest',
    label: 'Midwest',
    states: ['IL', 'IN', 'OH', 'MI', 'WI', 'MN', 'IA', 'MO', 'KS', 'NE', 'SD', 'ND'],
    description: 'Heartland — Chicago, Columbus, Detroit, Minneapolis'
  },
  {
    id: 'southeast',
    label: 'Southeast',
    states: ['FL', 'GA', 'NC', 'SC', 'TN', 'AL', 'MS', 'VA', 'KY', 'WV', 'AR', 'LA'],
    description: 'Sun Belt South — Atlanta, Miami, Charlotte, Nashville'
  },
  {
    id: 'northeast',
    label: 'Northeast',
    states: ['NY', 'PA', 'NJ', 'MA', 'CT', 'RI', 'VT', 'NH', 'ME', 'DE', 'MD', 'DC'],
    description: 'East Coast — NYC, Boston, Philly, Baltimore, DC'
  }
];

export const SORT_OPTIONS = [
  { value: 'valueScore', label: 'Best Value Score' },
  { value: 'capRate', label: 'Highest Cap Rate' },
  { value: 'pricePerUnit', label: 'Lowest $/Unit' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'occupancy', label: 'Highest Occupancy' }
];

export function generateSyntheticLoan(id: string, price: number): LoanDetails {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // ~20% of assets free and clear
  if (!(Math.abs(hash % 10) < 8)) {
    return { hasLoan: false };
  }
  const lenders = [
    "Wells Fargo CRE",
    "Chase Commercial Term Lending",
    "Bank of America Merrill Lynch",
    "Capital One Commercial",
    "KeyBank Commercial",
    "U.S. Bank Commercial Real Estate",
    "PNC Real Estate",
    "Citi Community Capital"
  ];
  const bankName = lenders[Math.abs(hash) % lenders.length];
  const ltv = 55 + (Math.abs(hash >> 1) % 21); // 55% - 75% LTV
  const outstandingBalance = Math.round(price * (ltv / 100));
  const monthlyRate = 0.065 / 12;
  const numPayments = 300;
  const amortFactor = (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const monthlyPayment = Math.round(outstandingBalance * amortFactor);

  return {
    hasLoan: true,
    bankName,
    outstandingBalance,
    monthlyPayment
  };
}

export function calculateValueScore(metrics: FinancialMetrics, type: string): number {
  let score = 0;
  const isIndustrial = type.includes('industrial') || type.includes('warehouse') || type.includes('distribution') || type.includes('manufacturing');
  const targetCap = isIndustrial ? 7.0 : 6.0;

  // 1. Cap Rate (up to 30 pts)
  score += Math.min(30, (metrics.capRate / targetCap) * 30);

  // 2. Occupancy (up to 25 pts)
  score += Math.min(25, (metrics.occupancyRate / 90) * 25);

  // 3. Gross Yield (up to 25 pts)
  score += Math.min(25, (metrics.grossYield / 8.0) * 25);

  // 4. Valuation Discount (up to 20 pts)
  if (metrics.pricePerUnit && metrics.pricePerUnit > 0) {
    if (metrics.pricePerUnit < 150000) score += 20;
    else if (metrics.pricePerUnit < 200000) score += 10;
  } else {
    if (metrics.pricePerSqFt < 100) score += 20;
    else if (metrics.pricePerSqFt < 140) score += 10;
  }

  return Math.round(Math.min(100, score));
}

export function createProperty(raw: Omit<Property, 'valueScore' | 'loan'> & { loan?: LoanDetails }): Property {
  const loan = raw.loan || generateSyntheticLoan(raw.id, raw.price);
  return {
    ...raw,
    valueScore: calculateValueScore(raw.metrics, raw.type),
    loan
  };
}

export const INITIAL_PROPERTIES: Property[] = [
  createProperty({
    id: "wa-001",
    address: "1422 E Sprague Ave",
    city: "Spokane",
    state: "WA",
    region: "pnw",
    type: "apartment_complex",
    price: 2850000,
    metrics: {
      capRate: 6.8,
      pricePerUnit: 118750,
      pricePerSqFt: 112,
      occupancyRate: 94,
      noi: 193800,
      grossYield: 8.1,
      unitCount: 24
    }
  }),
  createProperty({
    id: "wa-002",
    address: "8800 Lake City Way NE",
    city: "Seattle",
    state: "WA",
    region: "pnw",
    type: "multifamily",
    price: 4100000,
    metrics: {
      capRate: 5.9,
      pricePerUnit: 205000,
      pricePerSqFt: 198,
      occupancyRate: 96,
      noi: 241900,
      grossYield: 7.2,
      unitCount: 20
    }
  }),
  createProperty({
    id: "or-001",
    address: "3301 NE Sandy Blvd",
    city: "Portland",
    state: "OR",
    region: "pnw",
    type: "industrial_warehouse",
    price: 3200000,
    metrics: {
      capRate: 7.1,
      pricePerUnit: 0,
      pricePerSqFt: 82,
      occupancyRate: 97,
      noi: 227200,
      grossYield: 9.0
    }
  }),
  createProperty({
    id: "wa-003",
    address: "3110 Harborview Dr",
    city: "Gig Harbor",
    state: "WA",
    region: "pnw",
    type: "apartment_complex",
    price: 3650000,
    metrics: {
      capRate: 6.4,
      pricePerUnit: 228125,
      pricePerSqFt: 215,
      occupancyRate: 95,
      noi: 233600,
      grossYield: 7.9,
      unitCount: 16
    }
  }),
  createProperty({
    id: "wa-004",
    address: "2102 South C St",
    city: "Tacoma",
    state: "WA",
    region: "pnw",
    type: "industrial_warehouse",
    price: 2450000,
    metrics: {
      capRate: 7.3,
      pricePerUnit: 0,
      pricePerSqFt: 98,
      occupancyRate: 96,
      noi: 178850,
      grossYield: 8.8
    }
  }),
  createProperty({
    id: "wa-005",
    address: "110 9th Ave SE",
    city: "Puyallup",
    state: "WA",
    region: "pnw",
    type: "multifamily",
    price: 1850000,
    metrics: {
      capRate: 6.9,
      pricePerUnit: 154166,
      pricePerSqFt: 135,
      occupancyRate: 94,
      noi: 127650,
      grossYield: 8.4,
      unitCount: 12
    }
  }),
  createProperty({
    id: "wa-006",
    address: "1515 Fryar Ave",
    city: "Sumner",
    state: "WA",
    region: "pnw",
    type: "distribution_center",
    price: 5200000,
    metrics: {
      capRate: 7.1,
      pricePerUnit: 0,
      pricePerSqFt: 85,
      occupancyRate: 98,
      noi: 369200,
      grossYield: 8.6
    }
  }),
  createProperty({
    id: "wa-007",
    address: "3400 Pacific Hwy E",
    city: "Fife",
    state: "WA",
    region: "pnw",
    type: "flex_industrial",
    price: 2950000,
    metrics: {
      capRate: 7.5,
      pricePerUnit: 0,
      pricePerSqFt: 92,
      occupancyRate: 92,
      noi: 221250,
      grossYield: 9.1
    }
  }),
  createProperty({
    id: "wa-008",
    address: "10111 Gravelly Lake Dr SW",
    city: "Lakewood",
    state: "WA",
    region: "pnw",
    type: "condo_complex",
    price: 3100000,
    metrics: {
      capRate: 6.2,
      pricePerUnit: 155000,
      pricePerSqFt: 142,
      occupancyRate: 93,
      noi: 192200,
      grossYield: 7.7,
      unitCount: 20
    }
  }),
  createProperty({
    id: "az-001",
    address: "5501 W McDowell Rd",
    city: "Phoenix",
    state: "AZ",
    region: "southwest",
    type: "industrial_warehouse",
    price: 4200000,
    metrics: {
      capRate: 7.2,
      pricePerUnit: 0,
      pricePerSqFt: 87,
      occupancyRate: 97,
      noi: 302400,
      grossYield: 9.0
    }
  }),
  createProperty({
    id: "co-001",
    address: "2201 W Colfax Ave",
    city: "Denver",
    state: "CO",
    region: "southwest",
    type: "apartment_complex",
    price: 5100000,
    metrics: {
      capRate: 6.0,
      pricePerUnit: 170000,
      pricePerSqFt: 165,
      occupancyRate: 93,
      noi: 306000,
      grossYield: 7.6,
      unitCount: 30
    }
  }),
  createProperty({
    id: "nv-001",
    address: "980 S Rainbow Blvd",
    city: "Las Vegas",
    state: "NV",
    region: "southwest",
    type: "flex_industrial",
    price: 2900000,
    metrics: {
      capRate: 7.4,
      pricePerUnit: 0,
      pricePerSqFt: 72,
      occupancyRate: 91,
      noi: 214600,
      grossYield: 9.2
    }
  }),
  createProperty({
    id: "il-001",
    address: "8801 S Cottage Grove",
    city: "Chicago",
    state: "IL",
    region: "midwest",
    type: "multifamily",
    price: 1650000,
    metrics: {
      capRate: 7.5,
      pricePerUnit: 82500,
      pricePerSqFt: 98,
      occupancyRate: 91,
      noi: 123750,
      grossYield: 9.4,
      unitCount: 20
    }
  }),
  createProperty({
    id: "oh-001",
    address: "4401 Lorain Ave",
    city: "Cleveland",
    state: "OH",
    region: "midwest",
    type: "apartment_complex",
    price: 980000,
    metrics: {
      capRate: 8.2,
      pricePerUnit: 65333,
      pricePerSqFt: 74,
      occupancyRate: 88,
      noi: 80360,
      grossYield: 10.5,
      unitCount: 15
    }
  }),
  createProperty({
    id: "mi-001",
    address: "7200 E Jefferson Ave",
    city: "Detroit",
    state: "MI",
    region: "midwest",
    type: "distribution_center",
    price: 3800000,
    metrics: {
      capRate: 8.0,
      pricePerUnit: 0,
      pricePerSqFt: 61,
      occupancyRate: 95,
      noi: 304000,
      grossYield: 10.1
    }
  }),
  createProperty({
    id: "fl-001",
    address: "3210 NW 7th Ave",
    city: "Miami",
    state: "FL",
    region: "southeast",
    type: "condo_complex",
    price: 5800000,
    metrics: {
      capRate: 5.9,
      pricePerUnit: 145000,
      pricePerSqFt: 195,
      occupancyRate: 92,
      noi: 342200,
      grossYield: 7.2,
      unitCount: 40
    }
  }),
  createProperty({
    id: "ga-001",
    address: "1800 Marietta Blvd",
    city: "Atlanta",
    state: "GA",
    region: "southeast",
    type: "industrial_warehouse",
    price: 4600000,
    metrics: {
      capRate: 7.0,
      pricePerUnit: 0,
      pricePerSqFt: 79,
      occupancyRate: 96,
      noi: 322000,
      grossYield: 8.8
    }
  }),
  createProperty({
    id: "nc-001",
    address: "2400 Rexford Rd",
    city: "Charlotte",
    state: "NC",
    region: "southeast",
    type: "apartment_complex",
    price: 3200000,
    metrics: {
      capRate: 6.4,
      pricePerUnit: 106667,
      pricePerSqFt: 128,
      occupancyRate: 93,
      noi: 204800,
      grossYield: 8.0,
      unitCount: 30
    }
  }),
  createProperty({
    id: "pa-001",
    address: "2244 N Broad St",
    city: "Philadelphia",
    state: "PA",
    region: "northeast",
    type: "flex_industrial",
    price: 3100000,
    metrics: {
      capRate: 7.0,
      pricePerUnit: 0,
      pricePerSqFt: 78,
      occupancyRate: 89,
      noi: 217000,
      grossYield: 8.5
    }
  }),
  createProperty({
    id: "ny-001",
    address: "540 Atlantic Ave",
    city: "Brooklyn",
    state: "NY",
    region: "northeast",
    type: "multifamily",
    price: 6800000,
    metrics: {
      capRate: 5.2,
      pricePerUnit: 340000,
      pricePerSqFt: 298,
      occupancyRate: 97,
      noi: 353600,
      grossYield: 6.5,
      unitCount: 20
    }
  }),
  createProperty({
    id: "ma-001",
    address: "1200 Washington St",
    city: "Boston",
    state: "MA",
    region: "northeast",
    type: "apartment_complex",
    price: 7200000,
    metrics: {
      capRate: 5.5,
      pricePerUnit: 240000,
      pricePerSqFt: 310,
      occupancyRate: 96,
      noi: 396000,
      grossYield: 7.0,
      unitCount: 30
    }
  })
];
