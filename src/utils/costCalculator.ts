import { NasModel, HardDrive, RamModule, AddonAccessory, PlanCostBreakdown } from '../types';

export interface CalculatePlanCostParams {
  nasModel: NasModel;
  hddModel: HardDrive;
  hddCount: number;
  ramModule?: RamModule;
  addons: AddonAccessory[];
  usableTb: number;
}

/**
 * Calculates itemized costs and store comparisons (CoolPC, Sinyaw, Best Mixed)
 */
export function calculatePlanCost(params: CalculatePlanCostParams): PlanCostBreakdown {
  const { nasModel, hddModel, hddCount, ramModule, addons, usableTb } = params;

  // 1. NAS Mainframe cost
  const nasCoolpc = nasModel.pricing.coolpc?.inStock ? nasModel.pricing.coolpc.price : undefined;
  const nasSinya = nasModel.pricing.sinya?.inStock ? nasModel.pricing.sinya.price : undefined;
  const nasBest = nasModel.pricing.bestPrice || Math.min(...[nasCoolpc, nasSinya].filter((p): p is number => p !== undefined));
  const nasSource = nasModel.pricing.bestSource || (nasBest === nasCoolpc ? 'coolpc' : 'sinya');

  // 2. HDD costs
  const hddUnitPriceCoolpc = hddModel.pricing.coolpc?.inStock ? hddModel.pricing.coolpc.price : undefined;
  const hddUnitPriceSinya = hddModel.pricing.sinya?.inStock ? hddModel.pricing.sinya.price : undefined;
  const hddBestUnitPrice = hddModel.pricing.bestPrice || Math.min(...[hddUnitPriceCoolpc, hddUnitPriceSinya].filter((p): p is number => p !== undefined));
  const hddCoolpcTotal = hddUnitPriceCoolpc ? hddUnitPriceCoolpc * hddCount : undefined;
  const hddSinyaTotal = hddUnitPriceSinya ? hddUnitPriceSinya * hddCount : undefined;
  const hddBestTotal = hddBestUnitPrice * hddCount;
  const hddSource = hddModel.pricing.bestSource || (hddBestUnitPrice === hddUnitPriceCoolpc ? 'coolpc' : 'sinya');

  // 3. RAM cost
  let ramCoolpc: number | undefined = undefined;
  let ramSinya: number | undefined = undefined;
  let ramBest = 0;
  let ramSource = 'none';

  if (ramModule) {
    ramCoolpc = ramModule.pricing.coolpc?.inStock ? ramModule.pricing.coolpc.price : undefined;
    ramSinya = ramModule.pricing.sinya?.inStock ? ramModule.pricing.sinya.price : undefined;
    ramBest = ramModule.pricing.bestPrice || Math.min(...[ramCoolpc, ramSinya].filter((p): p is number => p !== undefined));
    ramSource = ramModule.pricing.bestSource || (ramBest === ramCoolpc ? 'coolpc' : 'sinya');
  }

  // 4. Addons costs
  let addonsCoolpcTotal = 0;
  let addonsSinyaTotal = 0;
  let addonsBestTotal = 0;

  for (const addon of addons) {
    const ac = addon.pricing.coolpc?.inStock ? addon.pricing.coolpc.price : addon.pricing.bestPrice || 0;
    const as = addon.pricing.sinya?.inStock ? addon.pricing.sinya.price : addon.pricing.bestPrice || 0;
    const ab = addon.pricing.bestPrice || Math.min(ac, as);

    addonsCoolpcTotal += ac;
    addonsSinyaTotal += as;
    addonsBestTotal += ab;
  }

  // 5. Grand totals
  const totalCoolpc =
    nasCoolpc !== undefined && hddCoolpcTotal !== undefined
      ? nasCoolpc + hddCoolpcTotal + (ramCoolpc ?? (ramModule ? 0 : 0)) + addonsCoolpcTotal
      : undefined;

  const totalSinya =
    nasSinya !== undefined && hddSinyaTotal !== undefined
      ? nasSinya + hddSinyaTotal + (ramSinya ?? (ramModule ? 0 : 0)) + addonsSinyaTotal
      : undefined;

  const totalBest = nasBest + hddBestTotal + ramBest + addonsBestTotal;

  // Cost per usable TB / TiB
  const costPerUsableTb = usableTb > 0 ? Math.round(totalBest / usableTb) : 0;
  const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);
  const usableTib = usableTb * TB_TO_TIB;
  const costPerUsableTib = usableTib > 0 ? Math.round(totalBest / usableTib) : 0;

  return {
    nasCost: { coolpc: nasCoolpc, sinya: nasSinya, best: nasBest, source: nasSource },
    hddCost: { coolpc: hddCoolpcTotal, sinya: hddSinyaTotal, best: hddBestTotal, unitPrice: hddBestUnitPrice, source: hddSource },
    ramCost: { coolpc: ramCoolpc, sinya: ramSinya, best: ramBest, source: ramSource },
    addonsCost: { coolpc: addonsCoolpcTotal, sinya: addonsSinyaTotal, best: addonsBestTotal, source: 'mixed' },
    totalCoolpc,
    totalSinya,
    totalBest,
    costPerUsableTb,
    costPerUsableTib,
  };
}
