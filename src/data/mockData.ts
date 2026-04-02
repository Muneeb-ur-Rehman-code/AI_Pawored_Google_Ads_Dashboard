export type Recommendation = 'scale' | 'optimise' | 'pause' | 'review' | 'exclude';
export type ProductStatus = 'active' | 'paused' | 'excluded' | 'pending';
export type UserRole = 'admin' | 'manager' | 'viewer';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  integrations: { shopify: boolean; googleAds: boolean; merchantCenter: boolean };
  productCount: number;
  spend30d: number;
  status: 'Active' | 'Setup Pending';
  created: string;
  notes: string;
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedBrands: string[];
  status: 'Active' | 'Invited';
  lastLogin: string;
  initials: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  user?: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: string;
  vendor: string;
  price: number;
  cogs: number;
  grossMarginPct: number;
  spend: number;
  revenue: number;
  orders: number;
  clicks: number;
  impressions: number;
  roas: number;
  breakEvenRoas: number;
  contributionMargin: number;
  recommendation: Recommendation;
  priorityScore: number;
  status: ProductStatus;
  imageUrl: string;
  aiSummary: string;
  brandId: string;
  brandName: string;
}

export interface DailyPerformance {
  date: string;
  spend: number;
  revenue: number;
  orders: number;
  clicks: number;
  impressions: number;
}

// Brands
export const mockBrands: Brand[] = [
  {
    id: 'brand_1', name: 'Acme Footwear', logo: 'https://placehold.co/40x40/e4e4e7/71717a?text=AF',
    integrations: { shopify: true, googleAds: true, merchantCenter: true },
    productCount: 342, spend30d: 45230, status: 'Active', created: 'Mar 1, 2026', notes: 'Primary footwear brand'
  },
  {
    id: 'brand_2', name: 'Summit Outdoor', logo: 'https://placehold.co/40x40/e4e4e7/71717a?text=SO',
    integrations: { shopify: false, googleAds: true, merchantCenter: false },
    productCount: 289, spend30d: 38120, status: 'Active', created: 'Feb 15, 2026', notes: 'Outdoor gear brand'
  },
  {
    id: 'brand_3', name: 'Urban Lifestyle', logo: 'https://placehold.co/40x40/e4e4e7/71717a?text=UL',
    integrations: { shopify: false, googleAds: false, merchantCenter: false },
    productCount: 0, spend30d: 0, status: 'Setup Pending', created: 'Mar 20, 2026', notes: 'New brand onboarding'
  },
];

// Team users
export const mockUsers: TeamUser[] = [
  { id: 'u1', name: 'Tariq Mohammed', email: 'tariq@360-om.co.uk', role: 'admin', assignedBrands: ['All Brands'], status: 'Active', lastLogin: 'Today', initials: 'TM' },
  { id: 'u2', name: 'Sarah Mitchell', email: 'sarah@360-om.co.uk', role: 'manager', assignedBrands: ['Acme Footwear', 'Summit Outdoor'], status: 'Active', lastLogin: '2h ago', initials: 'SM' },
  { id: 'u3', name: 'James Kumar', email: 'james@360-om.co.uk', role: 'manager', assignedBrands: ['Summit Outdoor', 'Urban Lifestyle'], status: 'Active', lastLogin: '1d ago', initials: 'JK' },
  { id: 'u4', name: 'Alex Rivera', email: 'alex@360-om.co.uk', role: 'viewer', assignedBrands: ['Acme Footwear'], status: 'Invited', lastLogin: 'Never', initials: 'AR' },
  { id: 'u5', name: 'Emma Chen', email: 'emma@360-om.co.uk', role: 'manager', assignedBrands: ['All Brands'], status: 'Active', lastLogin: '3h ago', initials: 'EC' },
  { id: 'u6', name: 'David Park', email: 'david@360-om.co.uk', role: 'viewer', assignedBrands: ['Urban Lifestyle'], status: 'Active', lastLogin: '5d ago', initials: 'DP' },
];

// Activities
export const mockActivities: ActivityItem[] = [
  { id: 'a1', message: 'Sarah M. added brand: Urban Lifestyle', timestamp: '2h ago', user: 'Sarah Mitchell' },
  { id: 'a2', message: 'System sync completed: 45 products updated', timestamp: '5h ago' },
  { id: 'a3', message: 'James K. invited user: alex@360-om.co.uk', timestamp: '1d ago', user: 'James Kumar' },
  { id: 'a4', message: 'Product ABC123 marked as Exclude', timestamp: '30 min ago' },
  { id: 'a5', message: 'Margin data uploaded — 120 products updated', timestamp: '5h ago', user: 'Emma Chen' },
  { id: 'a6', message: 'Sync completed — 45 products updated', timestamp: '1h ago' },
  { id: 'a7', message: 'New segment created: High ROAS Winners', timestamp: '2h ago', user: 'Sarah Mitchell' },
  { id: 'a8', message: 'Sarah M. accepted title suggestion for SKU-789', timestamp: '3h ago', user: 'Sarah Mitchell' },
  { id: 'a9', message: 'ROAS dropped below 2x for 12 products', timestamp: '1h ago' },
  { id: 'a10', message: 'New brand added: Urban Lifestyle', timestamp: '2h ago', user: 'Tariq Mohammed' },
];

// Notifications
export const mockNotifications = [
  { id: 'n1', message: 'Sync completed: 342 products updated', timestamp: '15 min ago', read: false },
  { id: 'n2', message: 'ROAS dropped below 2x for 12 products', timestamp: '1h ago', read: false },
  { id: 'n3', message: 'New brand added: Urban Lifestyle', timestamp: '2h ago', read: false },
  { id: 'n4', message: 'Weekly performance report ready', timestamp: '1d ago', read: true },
  { id: 'n5', message: 'Integration sync failed: Merchant Center', timestamp: '2d ago', read: true },
];

const categories = ['Footwear', 'Apparel', 'Accessories', 'Electronics', 'Home & Garden', 'Beauty'];
const vendors = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance', 'Reebok'];
const statuses: ProductStatus[] = ['active', 'paused', 'excluded', 'pending'];
const recommendations: Recommendation[] = ['scale', 'optimise', 'pause', 'review', 'exclude'];

const brandAssignment = (i: number) => {
  if (i <= 35) return { brandId: 'brand_1', brandName: 'Acme Footwear' };
  if (i <= 65) return { brandId: 'brand_2', brandName: 'Summit Outdoor' };
  return { brandId: 'brand_3', brandName: 'Urban Lifestyle' };
};

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateProduct(i: number): Product {
  const price = rand(29, 299);
  const cogs = rand(price * 0.2, price * 0.7);
  const grossMarginPct = Math.round(((price - cogs) / price) * 100);
  const spend = rand(50, 8000);
  const revenue = rand(0, 15000);
  const orders = Math.floor(rand(0, 200));
  const roas = revenue > 0 && spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0;
  const breakEvenRoas = grossMarginPct > 0 ? Math.round((1 / (grossMarginPct / 100)) * 100) / 100 : 999;
  const contributionMargin = revenue - cogs * orders - spend;
  const clicks = Math.floor(rand(10, 5000));
  const impressions = Math.floor(clicks * rand(10, 50));
  
  let recommendation: Recommendation;
  if (roas > breakEvenRoas && revenue > 1000) recommendation = 'scale';
  else if (clicks > 500 && orders < 10) recommendation = 'optimise';
  else if (spend > 2000 && revenue < 500) recommendation = 'pause';
  else if (grossMarginPct < 20) recommendation = 'review';
  else recommendation = recommendations[Math.floor(Math.random() * 5)];

  const priorityScore = Math.min(100, Math.max(1, Math.floor(
    (spend > 3000 ? 30 : 10) + 
    (roas < 1 ? 40 : roas < 2 ? 20 : 0) +
    (contributionMargin < 0 ? 30 : 0)
  )));

  const summaries: Record<Recommendation, string> = {
    scale: `Strong performer with ${roas.toFixed(1)}x ROAS and ${grossMarginPct}% margin. Increase budget allocation to capture more demand.`,
    optimise: `High click volume (${clicks}) but low conversion rate. Review ad copy, landing page, and audience targeting.`,
    pause: `$${spend.toFixed(0)} spent with only $${revenue.toFixed(0)} revenue. Recommend pausing ads immediately to reduce wasted spend.`,
    review: `Margin data appears incomplete or below threshold (${grossMarginPct}%). Verify COGS data before making bid decisions.`,
    exclude: `Consistently unprofitable over the past 30 days. Contribution margin is -$${Math.abs(contributionMargin).toFixed(0)}. Exclude from campaigns.`,
  };

  const brand = brandAssignment(i);

  return {
    id: `prod_${i.toString().padStart(4, '0')}`,
    sku: `SKU-${(1000 + i).toString()}`,
    title: `Product ${i} - ${categories[i % categories.length]} Item`,
    category: categories[i % categories.length],
    vendor: vendors[i % vendors.length],
    price,
    cogs,
    grossMarginPct,
    spend,
    revenue,
    orders,
    clicks,
    impressions,
    roas,
    breakEvenRoas,
    contributionMargin: Math.round(contributionMargin),
    recommendation,
    priorityScore,
    status: statuses[i % 4],
    imageUrl: `https://placehold.co/80x80/e4e4e7/71717a?text=${encodeURIComponent(`P${i}`)}`,
    aiSummary: summaries[recommendation],
    ...brand,
  };
}

export const mockProducts: Product[] = Array.from({ length: 80 }, (_, i) => generateProduct(i + 1));

export function generateDailyPerformance(days: number = 30): DailyPerformance[] {
  const data: DailyPerformance[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      spend: rand(5000, 25000),
      revenue: rand(8000, 45000),
      orders: Math.floor(rand(50, 300)),
      clicks: Math.floor(rand(2000, 15000)),
      impressions: Math.floor(rand(50000, 300000)),
    });
  }
  return data;
}

export const mockDailyPerformance = generateDailyPerformance(30);

// Generate ROAS trend data
export const mockRoasTrend = mockDailyPerformance.map(d => ({
  date: d.date,
  roas: d.revenue > 0 && d.spend > 0 ? Math.round((d.revenue / d.spend) * 100) / 100 : 0,
}));

// Brand spend data for admin charts
export const brandSpendData = [
  { name: 'Acme Footwear', spend: 45230, revenue: 128400, products: 342 },
  { name: 'Summit Outdoor', spend: 38120, revenue: 95200, products: 289 },
  { name: 'Urban Lifestyle', spend: 0, revenue: 0, products: 0 },
];

// Products added over time
export const productsOverTime = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    count: Math.floor(rand(800, 860)),
  };
});

// Users by role for admin chart
export const usersByRole = [
  { name: 'Admin', value: 2, color: 'hsl(240, 6%, 10%)' },
  { name: 'Manager', value: 5, color: 'hsl(217, 91%, 60%)' },
  { name: 'Viewer', value: 5, color: 'hsl(240, 5%, 65%)' },
];

export const kpiData = {
  totalProducts: mockProducts.length,
  totalSpend: mockProducts.reduce((s, p) => s + p.spend, 0),
  totalRevenue: mockProducts.reduce((s, p) => s + p.revenue, 0),
  avgRoas: mockProducts.reduce((s, p) => s + p.roas, 0) / mockProducts.length,
  avgGrossMargin: mockProducts.reduce((s, p) => s + p.grossMarginPct, 0) / mockProducts.length,
  scaleCount: mockProducts.filter(p => p.recommendation === 'scale').length,
  optimiseCount: mockProducts.filter(p => p.recommendation === 'optimise').length,
  pauseCount: mockProducts.filter(p => p.recommendation === 'pause').length,
  reviewCount: mockProducts.filter(p => p.recommendation === 'review').length,
  excludeCount: mockProducts.filter(p => p.recommendation === 'exclude').length,
};

// Upload history mock
export const mockUploadHistory = [
  { id: 'up1', timestamp: 'Mar 14, 2026 09:30', fileName: 'cogs-march-2026.csv', type: 'CSV', processed: 120, failed: 3, status: 'Success' as const },
  { id: 'up2', timestamp: 'Mar 10, 2026 14:15', fileName: 'margin-update.csv', type: 'CSV', processed: 85, failed: 0, status: 'Success' as const },
  { id: 'up3', timestamp: 'Mar 5, 2026 11:00', fileName: 'Margin-Master-Data', type: 'Google Sheet', processed: 200, failed: 12, status: 'Partial' as const },
  { id: 'up4', timestamp: 'Feb 28, 2026 16:45', fileName: 'q1-cogs-final.xlsx', type: 'CSV', processed: 0, failed: 150, status: 'Failed' as const },
  { id: 'up5', timestamp: 'Feb 20, 2026 10:00', fileName: 'initial-cogs-import.csv', type: 'CSV', processed: 340, failed: 2, status: 'Success' as const },
];

// Export history mock
export const mockExportHistory = [
  { id: 'ex1', timestamp: 'Mar 15, 2026 10:00', productsExported: 45, status: 'Success' as const },
  { id: 'ex2', timestamp: 'Mar 14, 2026 10:00', productsExported: 42, status: 'Success' as const },
  { id: 'ex3', timestamp: 'Mar 13, 2026 10:00', productsExported: 0, status: 'Failed' as const },
  { id: 'ex4', timestamp: 'Mar 12, 2026 10:00', productsExported: 38, status: 'Success' as const },
  { id: 'ex5', timestamp: 'Mar 11, 2026 10:00', productsExported: 40, status: 'Success' as const },
];
