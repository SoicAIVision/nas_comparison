export type StoreSource = 'coolpc' | 'sinya';

export interface PriceQuote {
  source: StoreSource;
  price: number; // in TWD
  url?: string;
  inStock: boolean;
  itemTitle: string;
  updatedAt: string; // ISO 8601 string
  isOverridden?: boolean;
}

export interface ComponentPricing {
  coolpc?: PriceQuote;
  sinya?: PriceQuote;
  bestPrice?: number;
  bestSource?: StoreSource | 'both' | 'manual';
  manualPrice?: number;
}

export interface NasModel {
  id: string;
  brand: 'Synology' | 'QNAP' | 'Asustor';
  name: string; // e.g. "DS1825+"
  series: 'Plus' | 'neo+' | 'Value' | 'XS';
  bays: number; // e.g. 8
  maxBaysWithExpansion: number; // e.g. 18
  cpu: string; // e.g. "AMD Ryzen V1500B (4C/8T 2.2GHz)"
  defaultRamGb: number; // e.g. 8
  defaultRamType: 'ECC DDR4' | 'non-ECC DDR4' | 'ECC DDR5';
  maxRamGb: number; // e.g. 32
  ramSlots: number; // e.g. 2
  m2Slots: number; // e.g. 2 (NVMe M.2 2280)
  m2PoolSupport: boolean; // true if supports storage pool creation
  ethernetPorts: string; // e.g. "2 x 2.5GbE RJ-45"
  pcieSlots: string; // e.g. "1 x Gen3 x8 slot (x4 link)"
  usbPorts: string; // e.g. "3 x USB 3.2 Gen 1"
  hardwareTranscoding: boolean;
  warrantyYears: number; // e.g. 3
  description: string;
  msrp: number; // TWD
  pricing: ComponentPricing;
}

export interface HardDrive {
  id: string;
  brand: 'Seagate' | 'Western Digital' | 'Toshiba' | 'Synology';
  series: 'IronWolf' | 'IronWolf Pro' | 'Red Plus' | 'Red Pro' | 'N300' | 'Enterprise HAT';
  modelNumber: string; // e.g. "ST18000NT001"
  capacityTb: number; // e.g. 18
  rpm: number; // e.g. 7200
  cacheMb: number; // e.g. 256
  cmr: boolean; // Always true for NAS grade
  workloadRatingTbYear: number; // e.g. 550 or 300
  warrantyYears: number; // e.g. 5
  pricing: ComponentPricing;
}

export interface RamModule {
  id: string;
  brand: 'Synology' | 'Crucial' | 'Kingston' | 'Transcend';
  capacityGb: number; // e.g. 8, 16
  type: 'DDR4-3200 ECC SODIMM' | 'DDR4-3200 non-ECC SODIMM';
  isOfficial: boolean;
  pricing: ComponentPricing;
}

export interface AddonAccessory {
  id: string;
  name: string;
  type: 'nic_10g' | 'nic_25g' | 'm2_ssd_cache' | 'expansion_unit';
  description: string;
  pricing: ComponentPricing;
}

export type RaidType = 'RAID0' | 'RAID1' | 'RAID5' | 'RAID6' | 'RAID10' | 'SHR1' | 'SHR2' | 'BASIC' | 'JBOD';

export interface StorageCalculationResult {
  usableTb: number;
  usableTib: number;
  parityTb: number;
  unallocatedTb: number;
  faultToleranceDisks: number;
  meets50TbTarget: boolean;
  totalRawTb: number;
  storageEfficiencyPercent: number;
}

export interface PlanConfiguration {
  id: string;
  name: string; // e.g. "方案 A (DS1825+ 4x18TB)"
  nasModelId: string;
  hddModelId: string;
  hddCount: number;
  raidType: RaidType;
  selectedRamId?: string;
  selectedAddonIds: string[];
  customNotes?: string;
}

export interface PlanCostBreakdown {
  nasCost: { coolpc?: number; sinya?: number; best: number; source: string };
  hddCost: { coolpc?: number; sinya?: number; best: number; unitPrice: number; source: string };
  ramCost: { coolpc?: number; sinya?: number; best: number; source: string };
  addonsCost: { coolpc?: number; sinya?: number; best: number; source: string };
  totalCoolpc?: number;
  totalSinya?: number;
  totalBest: number;
  costPerUsableTb: number; // TWD / TB
  costPerUsableTib: number; // TWD / TiB
}

export interface CompletePlanEvaluation {
  config: PlanConfiguration;
  nasModel: NasModel;
  hddModel: HardDrive;
  ramModule?: RamModule;
  addons: AddonAccessory[];
  storage: StorageCalculationResult;
  cost: PlanCostBreakdown;
  usedBays: number;
  freeBays: number;
  totalRamGb: number;
  ramIsEcc: boolean;
  compatibilityWarnings: string[];
}

export interface ScrapedPriceDatabase {
  timestamp: string; // ISO 8601
  coolpcTimestamp: string;
  sinyaTimestamp: string;
  items: Record<string, ComponentPricing>;
}
