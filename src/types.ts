export type RegionId = 'pnw' | 'southwest' | 'midwest' | 'southeast' | 'northeast';

export interface Region {
  id: RegionId;
  label: string;
  states: string[];
  description: string;
}

export type AssetTypeId =
  | 'multifamily'
  | 'apartment_complex'
  | 'condo_complex'
  | 'industrial_warehouse'
  | 'flex_industrial'
  | 'light_manufacturing'
  | 'distribution_center'
  | 'single_family'
  | 'duplex_triplex'
  | 'townhome';

export interface AssetType {
  id: AssetTypeId;
  label: string;
  category: 'primary' | 'residential';
}

export interface FinancialMetrics {
  capRate: number;
  pricePerUnit: number;
  pricePerSqFt: number;
  occupancyRate: number;
  noi: number;
  grossYield: number;
  unitCount?: number;
}

export interface LoanDetails {
  hasLoan: boolean;
  bankName?: string;
  outstandingBalance?: number;
  monthlyPayment?: number;
  interestRate?: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  region: RegionId;
  type: AssetTypeId | string;
  price: number;
  metrics: FinancialMetrics;
  valueScore: number;
  loan?: LoanDetails;
  sqft?: number;
  yearBuilt?: number;
  description?: string;
  source?: string;
}

export interface SortOption {
  value: string;
  label: string;
}
