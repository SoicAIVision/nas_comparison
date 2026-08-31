import { create } from 'zustand';
import {
  PlanConfiguration,
  CompletePlanEvaluation,
  ScrapedPriceDatabase,
  NasModel,
  HardDrive,
  RamModule,
  M2SsdModule,
  AddonAccessory,
  EvaluatedDriveItem,
} from '../types';
import { NAS_MODELS } from '../data/nasModels';
import { HARD_DRIVES, RAM_MODULES, M2_SSD_MODULES, ADDON_ACCESSORIES } from '../data/accessories';
import { DEFAULT_PLANS } from '../data/defaultPlans';
import { calculateMixedStorageCapacity } from '../utils/raidCalculator';
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
  toastNotification: string | null;

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
  dismissToast: () => void;

  // Selectors / Evaluators
  getEvaluatedPlans: () => CompletePlanEvaluation[];
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  plans: DEFAULT_PLANS,
  priceDb: null,
  isRefreshing: false,
  refreshStatus: { type: 'idle' },
  priceOverrides: {},
  toastNotification: null,

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
    const defaultHdd = HARD_DRIVES[1]; // 20TB IronWolf Pro

    const hddId = customPlan?.hddModelId || defaultHdd.id;
    const hddCnt = customPlan?.hddCount ?? 4;

    const newPlan: PlanConfiguration = {
      id: newId,
      name: customPlan?.name || `方案 ${String.fromCharCode(65 + existingPlans.length)} (DS1825+ 4x18TB)`,
      nasModelId: customPlan?.nasModelId || defaultNas.id,
      isMixedDrives: true,
      mixedDrives: customPlan?.mixedDrives || [{ hddModelId: hddId, count: hddCnt }],
      hddModelId: hddId,
      hddCount: hddCnt,
      raidType: customPlan?.raidType || 'RAID5',
      selectedRamId: customPlan?.selectedRamId,
      selectedM2SsdId: customPlan?.selectedM2SsdId,
      m2SsdCount: customPlan?.m2SsdCount ?? 0,
      m2Usage: customPlan?.m2Usage || 'storage_pool',
      selectedAddonIds: customPlan?.selectedAddonIds || [],
      customNotes: customPlan?.customNotes || '',
    };

    const updated = [...existingPlans, newPlan];
    set({
      plans: updated,
      toastNotification: `✨ 已新增「${newPlan.name}」！已為您自動新增至下方卡片清單。`,
    });

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
    set({
      plans: updated,
      toastNotification: `✨ 已複製「${newPlan.name}」！可於下方卡片直接微調。`,
    });

    if (typeof window !== 'undefined') {
      const hashStr = encodePlansToHash(updated);
      window.location.hash = `/compare?data=${hashStr}`;
    }
  },

  dismissToast: () => {
    set({ toastNotification: null });
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

      // 2. Resolve HDD (Single or Mixed)
      const isMixed = !!config.isMixedDrives && Array.isArray(config.mixedDrives) && config.mixedDrives.length > 0;
      let evaluatedDriveItems: EvaluatedDriveItem[] = [];
      let primaryHddModel: HardDrive;
      let diskCapacities: number[] = [];

      if (isMixed && config.mixedDrives) {
        for (const item of config.mixedDrives) {
          const baseItemHdd = HARD_DRIVES.find((h) => h.id === item.hddModelId) || HARD_DRIVES[0];
          const hPricing = priceDb?.items[baseItemHdd.id] || baseItemHdd.pricing;
          const hModel: HardDrive = {
            ...baseItemHdd,
            pricing: matchAndMergePrices(hPricing),
          };
          if (priceOverrides[hModel.id] !== undefined) {
            hModel.pricing.bestPrice = priceOverrides[hModel.id];
            hModel.pricing.bestSource = 'manual';
          }
          const unitP = hModel.pricing.bestPrice || 0;
          evaluatedDriveItems.push({
            hddModel: hModel,
            count: item.count,
            unitPrice: unitP,
            totalPrice: unitP * item.count,
          });
          for (let i = 0; i < item.count; i++) {
            diskCapacities.push(hModel.capacityTb);
          }
        }
        primaryHddModel = evaluatedDriveItems[0]?.hddModel || HARD_DRIVES[0];
      } else {
        const baseHdd = HARD_DRIVES.find((h) => h.id === config.hddModelId) || HARD_DRIVES[0];
        const hddPricing = priceDb?.items[baseHdd.id] || baseHdd.pricing;
        primaryHddModel = {
          ...baseHdd,
          pricing: matchAndMergePrices(hddPricing),
        };
        if (priceOverrides[primaryHddModel.id] !== undefined) {
          primaryHddModel.pricing.bestPrice = priceOverrides[primaryHddModel.id];
          primaryHddModel.pricing.bestSource = 'manual';
        }
        const unitP = primaryHddModel.pricing.bestPrice || 0;
        evaluatedDriveItems = [
          {
            hddModel: primaryHddModel,
            count: config.hddCount,
            unitPrice: unitP,
            totalPrice: unitP * config.hddCount,
          },
        ];
        diskCapacities = Array(config.hddCount).fill(primaryHddModel.capacityTb);
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

      // 4. Resolve M.2 SSD
      let m2SsdModule: M2SsdModule | undefined = undefined;
      const m2Count = config.m2SsdCount || 0;
      if (config.selectedM2SsdId && m2Count > 0) {
        const baseM2 = M2_SSD_MODULES.find((m) => m.id === config.selectedM2SsdId);
        if (baseM2) {
          const m2Pricing = priceDb?.items[baseM2.id] || baseM2.pricing;
          m2SsdModule = {
            ...baseM2,
            pricing: matchAndMergePrices(m2Pricing),
          };
          if (priceOverrides[m2SsdModule.id] !== undefined) {
            m2SsdModule.pricing.bestPrice = priceOverrides[m2SsdModule.id];
            m2SsdModule.pricing.bestSource = 'manual';
          }
        }
      }

      // 5. Resolve Addons
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

      // 6. Calculate storage with Slicing & SHR support
      const storage = calculateMixedStorageCapacity({
        diskCapacities,
        raidType: config.raidType,
      });

      // Calculate SHR advantage if applicable
      let shrAdvantageTb: number | undefined = undefined;
      if (config.raidType === 'RAID5' && isMixed) {
        const shrStorage = calculateMixedStorageCapacity({
          diskCapacities,
          raidType: 'SHR1',
        });
        if (shrStorage.usableTb > storage.usableTb) {
          shrAdvantageTb = shrStorage.usableTb - storage.usableTb;
        }
      }

      // 7. Calculate costs
      const cost = calculatePlanCost({
        nasModel,
        mixedDrives: evaluatedDriveItems,
        ramModule,
        m2SsdModule,
        m2SsdCount: m2Count,
        addons,
        usableTb: storage.usableTb,
      });

      // 8. Calculate Bay stats & compatibility
      const usedBays = evaluatedDriveItems.reduce((acc, curr) => acc + curr.count, 0);
      const freeBays = Math.max(0, nasModel.bays - usedBays);
      const totalRamGb = nasModel.defaultRamGb + (ramModule?.capacityGb || 0);
      const ramIsEcc = nasModel.defaultRamType.includes('ECC') && (!ramModule || ramModule.type.includes('ECC'));
      const hasBuiltIn10G = !!nasModel.hasBuiltIn10G;

      const compatibilityWarnings: string[] = [];
      if (usedBays > nasModel.bays) {
        compatibilityWarnings.push(`總硬碟數量 (${usedBays}) 超過主機原生 Bay 數 (${nasModel.bays})，需加購擴充櫃！`);
      }
      if (totalRamGb > nasModel.maxRamGb) {
        compatibilityWarnings.push(`總記憶體 (${totalRamGb}GB) 超過原廠最大支援上限 (${nasModel.maxRamGb}GB)！`);
      }
      if (nasModel.series === 'neo+' && ramModule && ramModule.type.includes('ECC')) {
        compatibilityWarnings.push('DS1825neo+ 原廠預載 4GB non-ECC 記憶體，升級 ECC 時需拔除原廠 4GB 模組以避免混插不相容。');
      }
      if (hasBuiltIn10G && config.selectedAddonIds.includes('synology-e10g18-t1')) {
        compatibilityWarnings.push('💡 提醒：此 NAS 機型已標配原生 10GbE 網卡，除非需要雙 10G 鏈路聚合 (LAG)，否則無需額外加購 10GbE 擴充卡。');
      }

      return {
        config,
        nasModel,
        hddModel: primaryHddModel,
        isMixedDrives: isMixed,
        mixedDriveItems: evaluatedDriveItems,
        ramModule,
        m2SsdModule,
        m2SsdCount: m2Count,
        m2Usage: config.m2Usage || 'storage_pool',
        hasBuiltIn10G,
        addons,
        storage,
        cost,
        usedBays,
        freeBays,
        totalRamGb,
        ramIsEcc,
        compatibilityWarnings,
        shrAdvantageTb,
      };
    });
  },
}));
