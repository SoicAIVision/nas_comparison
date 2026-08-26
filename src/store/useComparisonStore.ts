import { create } from 'zustand';
import {
  PlanConfiguration,
  CompletePlanEvaluation,
  ScrapedPriceDatabase,
  NasModel,
  HardDrive,
  RamModule,
  AddonAccessory,
} from '../types';
import { NAS_MODELS } from '../data/nasModels';
import { HARD_DRIVES, RAM_MODULES, ADDON_ACCESSORIES } from '../data/accessories';
import { DEFAULT_PLANS } from '../data/defaultPlans';
import { calculateStorageCapacity } from '../utils/raidCalculator';
import { calculatePlanCost } from '../utils/costCalculator';
import { encodePlansToHash, decodePlansFromHash } from '../utils/urlSync';
import { fetchLatestPrices } from '../services/priceFetcher';
import { matchAndMergePrices } from '../services/priceMatcher';

interface ComparisonState {
  plans: PlanConfiguration[];
  priceDb: ScrapedPriceDatabase | null;
  isRefreshing: boolean;
  refreshStatus: { type: 'idle' | 'loading' | 'success' | 'error'; message?: string };
  priceOverrides: Record<string, number>; // itemId -> custom price

  // Actions
  init: () => Promise<void>;
  addPlan: (customPlan?: Partial<PlanConfiguration>) => void;
  duplicatePlan: (planId: string) => void;
  removePlan: (planId: string) => void;
  updatePlan: (planId: string, updates: Partial<PlanConfiguration>) => void;
  resetToDefaults: () => void;
  refreshPrices: () => Promise<void>;
  setPriceOverride: (itemId: string, price: number) => void;
  clearPriceOverride: (itemId: string) => void;

  // Selectors / Evaluators
  getEvaluatedPlans: () => CompletePlanEvaluation[];
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  plans: DEFAULT_PLANS,
  priceDb: null,
  isRefreshing: false,
  refreshStatus: { type: 'idle' },
  priceOverrides: {},

  init: async () => {
    // 1. Check URL Hash for shared configuration
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const decoded = decodePlansFromHash(hash);
      if (decoded && decoded.length > 0) {
        set({ plans: decoded });
      }
    }

    // 2. Fetch prices
    await get().refreshPrices();
  },

  addPlan: (customPlan) => {
    const existingPlans = get().plans;
    const newId = 'plan-' + Date.now();
    const defaultNas = NAS_MODELS[0];
    const defaultHdd = HARD_DRIVES[1]; // 18TB IronWolf Pro

    const newPlan: PlanConfiguration = {
      id: newId,
      name: customPlan?.name || `方案 ${String.fromCharCode(65 + existingPlans.length)} (DS1825+ 4x18TB)`,
      nasModelId: customPlan?.nasModelId || defaultNas.id,
      hddModelId: customPlan?.hddModelId || defaultHdd.id,
      hddCount: customPlan?.hddCount ?? 4,
      raidType: customPlan?.raidType || 'RAID5',
      selectedRamId: customPlan?.selectedRamId,
      selectedAddonIds: customPlan?.selectedAddonIds || [],
      customNotes: customPlan?.customNotes || '',
    };

    const updated = [...existingPlans, newPlan];
    set({ plans: updated });

    // Sync to URL Hash
    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(updated);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  duplicatePlan: (planId: string) => {
    const existingPlans = get().plans;
    const target = existingPlans.find((p) => p.id === planId);
    if (!target) return;

    const newPlan: PlanConfiguration = {
      ...target,
      id: 'plan-' + Date.now(),
      name: `${target.name} (複製)`,
    };

    const updated = [...existingPlans, newPlan];
    set({ plans: updated });

    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(updated);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  removePlan: (planId: string) => {
    const existingPlans = get().plans;
    if (existingPlans.length <= 1) return; // Keep at least one plan

    const updated = existingPlans.filter((p) => p.id !== planId);
    set({ plans: updated });

    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(updated);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  updatePlan: (planId: string, updates: Partial<PlanConfiguration>) => {
    const existingPlans = get().plans;
    const updated = existingPlans.map((p) => (p.id === planId ? { ...p, ...updates } : p));
    set({ plans: updated });

    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(updated);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  resetToDefaults: () => {
    set({ plans: DEFAULT_PLANS });
    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(DEFAULT_PLANS);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  refreshPrices: async () => {
    set({ isRefreshing: true, refreshStatus: { type: 'loading', message: '正在同步原價屋與欣亞報價...' } });
    try {
      const db = await fetchLatestPrices();
      set({
        priceDb: db,
        isRefreshing: false,
        refreshStatus: {
          type: 'success',
          message: `已於 ${new Date().toLocaleTimeString()} 成功更新最新報價！`,
        },
      });
    } catch (error) {
      set({
        isRefreshing: false,
        refreshStatus: {
          type: 'error',
          message: '線上報價同步失敗，已切換至快取報價。',
        },
      });
    }
  },

  setPriceOverride: (itemId: string, price: number) => {
    set((state) => ({
      priceOverrides: { ...state.priceOverrides, [itemId]: price },
    }));
  },

  clearPriceOverride: (itemId: string) => {
    set((state) => {
      const next = { ...state.priceOverrides };
      delete next[itemId];
      return { priceOverrides: next };
    });
  },

  getEvaluatedPlans: (): CompletePlanEvaluation[] => {
    const { plans, priceDb, priceOverrides } = get();

    return plans.map((config) => {
      // 1. Resolve NAS model
      const baseNas = NAS_MODELS.find((m) => m.id === config.nasModelId) || NAS_MODELS[0];
      const nasPricing = priceDb?.items[baseNas.id] || baseNas.pricing;
      const nasModel: NasModel = {
        ...baseNas,
        pricing: matchAndMergePrices(nasPricing),
      };
      if (priceOverrides[nasModel.id] !== undefined) {
        nasModel.pricing.bestPrice = priceOverrides[nasModel.id];
        nasModel.pricing.bestSource = 'manual';
      }

      // 2. Resolve HDD
      const baseHdd = HARD_DRIVES.find((h) => h.id === config.hddModelId) || HARD_DRIVES[0];
      const hddPricing = priceDb?.items[baseHdd.id] || baseHdd.pricing;
      const hddModel: HardDrive = {
        ...baseHdd,
        pricing: matchAndMergePrices(hddPricing),
      };
      if (priceOverrides[hddModel.id] !== undefined) {
        hddModel.pricing.bestPrice = priceOverrides[hddModel.id];
        hddModel.pricing.bestSource = 'manual';
      }

      // 3. Resolve RAM
      let ramModule: RamModule | undefined = undefined;
      if (config.selectedRamId) {
        const baseRam = RAM_MODULES.find((r) => r.id === config.selectedRamId);
        if (baseRam) {
          const ramPricing = priceDb?.items[baseRam.id] || baseRam.pricing;
          ramModule = {
            ...baseRam,
            pricing: matchAndMergePrices(ramPricing),
          };
          if (priceOverrides[ramModule.id] !== undefined) {
            ramModule.pricing.bestPrice = priceOverrides[ramModule.id];
            ramModule.pricing.bestSource = 'manual';
          }
        }
      }

      // 4. Resolve Addons
      const addons: AddonAccessory[] = config.selectedAddonIds
        .map((addonId) => {
          const baseAddon = ADDON_ACCESSORIES.find((a) => a.id === addonId);
          if (!baseAddon) return null;
          const addonPricing = priceDb?.items[baseAddon.id] || baseAddon.pricing;
          const matched = {
            ...baseAddon,
            pricing: matchAndMergePrices(addonPricing),
          };
          if (priceOverrides[matched.id] !== undefined) {
            matched.pricing.bestPrice = priceOverrides[matched.id];
            matched.pricing.bestSource = 'manual';
          }
          return matched;
        })
        .filter((a): a is AddonAccessory => a !== null);

      // 5. Calculate storage (RAID 5 by default)
      const storage = calculateStorageCapacity({
        diskCount: config.hddCount,
        diskCapacityTb: hddModel.capacityTb,
        raidType: config.raidType,
      });

      // 6. Calculate costs
      const cost = calculatePlanCost({
        nasModel,
        hddModel,
        hddCount: config.hddCount,
        ramModule,
        addons,
        usableTb: storage.usableTb,
      });

      // 7. Calculate Bay stats & compatibility
      const usedBays = config.hddCount;
      const freeBays = Math.max(0, nasModel.bays - usedBays);
      const totalRamGb = nasModel.defaultRamGb + (ramModule?.capacityGb || 0);
      const ramIsEcc = nasModel.defaultRamType.includes('ECC') && (!ramModule || ramModule.type.includes('ECC'));

      const compatibilityWarnings: string[] = [];
      if (config.hddCount > nasModel.bays) {
        compatibilityWarnings.push(`硬碟數量 (${config.hddCount}) 超過主機原生 Bay 數 (${nasModel.bays})，需加購擴充櫃！`);
      }
      if (totalRamGb > nasModel.maxRamGb) {
        compatibilityWarnings.push(`總記憶體 (${totalRamGb}GB) 超過原廠最大支援上限 (${nasModel.maxRamGb}GB)！`);
      }
      if (nasModel.series === 'neo+' && ramModule && ramModule.type.includes('ECC')) {
        compatibilityWarnings.push('DS1825neo+ 原廠預載 4GB non-ECC 記憶體，升級 ECC 時需拔除原廠 4GB 模組以避免混插不相容。');
      }

      return {
        config,
        nasModel,
        hddModel,
        ramModule,
        addons,
        storage,
        cost,
        usedBays,
        freeBays,
        totalRamGb,
        ramIsEcc,
        compatibilityWarnings,
      };
    });
  },
}));
