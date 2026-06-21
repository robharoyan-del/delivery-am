// Each user gets a unique suite number derived from their Supabase user ID.
// The suite acts as their personal identifier at the shared warehouse.

export interface WarehouseCountry {
  key:      string
  flag:     string
  name:     string
  city:     string
  fields:   { label: string; getValue: (suite: string, name: string) => string }[]
  note:     string
}

export const WAREHOUSE_COUNTRIES: WarehouseCountry[] = [
  {
    key:  'usa',
    flag: '🇺🇸',
    name: 'USA',
    city: 'New York',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `2880 Westchester Ave, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => '' },
      { label: 'City',      getValue: ()           => 'Bronx' },
      { label: 'State',     getValue: ()           => 'NY' },
      { label: 'ZIP',       getValue: ()           => '10461' },
      { label: 'Country',   getValue: ()           => 'United States' },
      { label: 'Phone',     getValue: ()           => '+1 (718) 409-0000' },
    ],
    note: 'Use this address on US online stores. Shipping takes 5–7 business days.',
  },
  {
    key:  'china',
    flag: '🇨🇳',
    name: 'China',
    city: 'Guangzhou',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `天河区天河路385号, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => 'Tianhe District' },
      { label: 'City',      getValue: ()           => 'Guangzhou' },
      { label: 'Province',  getValue: ()           => 'Guangdong' },
      { label: 'ZIP',       getValue: ()           => '510620' },
      { label: 'Country',   getValue: ()           => 'China' },
      { label: 'Phone',     getValue: ()           => '+86 20 8888 0000' },
    ],
    note: 'Use for Taobao, JD.com, Pinduoduo and other Chinese platforms. 7–10 days.',
  },
  {
    key:  'germany',
    flag: '🇩🇪',
    name: 'Germany',
    city: 'Frankfurt',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `Hanauer Landstraße 126, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => '' },
      { label: 'City',      getValue: ()           => 'Frankfurt am Main' },
      { label: 'State',     getValue: ()           => 'Hessen' },
      { label: 'ZIP',       getValue: ()           => '60314' },
      { label: 'Country',   getValue: ()           => 'Germany' },
      { label: 'Phone',     getValue: ()           => '+49 69 0000 0000' },
    ],
    note: 'Covers Germany, Austria, Switzerland. Also accepts parcels from EU shops. 4–6 days.',
  },
  {
    key:  'uk',
    flag: '🇬🇧',
    name: 'United Kingdom',
    city: 'London',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `12 Purley Way, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => 'Croydon' },
      { label: 'City',      getValue: ()           => 'London' },
      { label: 'County',    getValue: ()           => 'Greater London' },
      { label: 'Postcode',  getValue: ()           => 'CR0 3JP' },
      { label: 'Country',   getValue: ()           => 'United Kingdom' },
      { label: 'Phone',     getValue: ()           => '+44 20 0000 0000' },
    ],
    note: 'Use for ASOS, Next, John Lewis, Marks & Spencer and other UK stores. 4–6 days.',
  },
  {
    key:  'italy',
    flag: '🇮🇹',
    name: 'Italy',
    city: 'Milan',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `Via Mecenate 76, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => '' },
      { label: 'City',      getValue: ()           => 'Milano' },
      { label: 'Province',  getValue: ()           => 'MI' },
      { label: 'ZIP',       getValue: ()           => '20138' },
      { label: 'Country',   getValue: ()           => 'Italy' },
      { label: 'Phone',     getValue: ()           => '+39 02 0000 0000' },
    ],
    note: 'Perfect for Italian fashion brands and luxury goods. 5–7 days.',
  },
  {
    key:  'uae',
    flag: '🇦🇪',
    name: 'UAE',
    city: 'Dubai',
    fields: [
      { label: 'Full Name',  getValue: (_s, name) => name },
      { label: 'Address 1', getValue: (s)         => `Al Quoz Industrial Area 1, Suite ${s}` },
      { label: 'Address 2', getValue: ()           => 'Warehouse 4B' },
      { label: 'City',      getValue: ()           => 'Dubai' },
      { label: 'Emirate',   getValue: ()           => 'Dubai' },
      { label: 'ZIP',       getValue: ()           => '00000' },
      { label: 'Country',   getValue: ()           => 'United Arab Emirates' },
      { label: 'Phone',     getValue: ()           => '+971 4 000 0000' },
    ],
    note: 'Ideal for Noon, Namshi and regional brands. Fastest route — 3–5 days.',
  },
]

// Derive a short numeric suite from the Supabase user UUID
// e.g. "a1b2c3d4-..." → "1234"
export function getSuiteNumber(userId: string): string {
  const digits = userId.replace(/-/g, '').replace(/[^0-9]/g, '')
  const raw = digits.slice(0, 4) || '0001'
  // Ensure it's between 1000–9999
  const num = (parseInt(raw, 10) % 9000) + 1000
  return String(num)
}
