import { NasModel, HardDrive, RamModule, M2SsdModule, AddonAccessory, PlanCostBreakdown } from '../types';

export interface DriveItemParam {
  hddModel: HardDrive;
  count: number;
}

export interface CalculatePlanCostParams {
  nasModel: NasModel;
  hddModel?: HardDrive;
  hddCount?: number;
  mixedDrives?: DriveItemParam[];
  ramModule?: RamModule;
  m2SsdModule?: M2SsdModule;
  m2SsdCount?: number;
  addons: AddonAccessory[];
  usableTb: number;
}

/**
 * Calculates itemized costs and store comparisons (CoolPC, Sinya, Best Mixed)
 * Supporting single HDD model, mixed HDD models, and M.2 SSD modules.
 */
export function calculatePlanCost(params: CalculatePlanCostParams): PlanCostBreakdown {
  const {
    nasModel,
    hddModel,
    hddCount = 0,
    mixedDrives,
    ramModule,
    m2SsdModule,
    m2SsdCount = 0,
    addons,
    usableTb,
  } = params;

  // 1. NAS Mainframe cost
  const nasCoolpc = nasModel.pricing.coolpc?.inStock ? nasModel.pricing.coolpc.price : undefined;
  const nasSinya = nasModel.pricing.sinya?.inStock ? nasModel.pricing.sinya.price : undefined;
  const nasBest = nasModel.pricing.bestPrice || Math.min(...[nasCoolpc, nasSinya].filter((p): p is number => p !== undefined));
  const nasSource = nasModel.pricing.bestSource || (nasBest === nasCoolpc ? 'coolpc' : 'sinya');

  // 2. HDD costs (Single or Mixed)
  const driveItems: DriveItemParam[] =
    mixedDrives && mixedDrives.length > 0
      ? mixedDrives
      : hddModel && hddCount > 0
      ? [{ hddModel, count: hddCount }]
      : [];

  let hddCoolpcTotal: number | undefined = 0;
  let hddSinyaTotal: number | undefined = 0;
  let hddBestTotal = 0;
  let totalDiskCount = 0;
  const itemizedBreakdown: { name: string; count: number; unitPrice: number; subtotal: number }[] = [];

  for (const item of driveItems) {
    const model = item.hddModel;
    const count = item.count;
    totalDiskCount += count;

    const unitCoolpc = model.pricing.coolpc?.inStock ? model.pricing.coolpc.price : undefined;
    const unitSinya = model.pricing.sinya?.inStock ? model.pricing.sinya.price : undefined;
    const unitBest = model.pricing.bestPrice || Math.min(...[unitCoolpc, unitSinya].filter((p): p is number => p !== undefined));

    if (hddCoolpcTotal !== undefined) {
      if (unitCoolpc !== undefined) {
        hddCoolpcTotal += unitCoolpc * count;
      } else {
        hddCoolpcTotal = undefined; // At least one drive out of stock at Coolpc
      }
    }

    if (hddSinyaTotal !== undefined) {
      if (unitSinya !== undefined) {
        hddSinyaTotal += unitSinya * count;
      } else {
        hddSinyaTotal = undefined; // At least one drive out of stock at Sinya
      }
    }

    const subtotal = unitBest * count;
    hddBestTotal += subtotal;
    itemizedBreakdown.push({
      name: `${model.brand} ${model.series} ${model.capacityTb}TB`,
      count,
      unitPrice: unitBest,
      subtotal,
    });
  }

  const hddBestUnitPrice = totalDiskCount > 0 ? Math.round(hddBestTotal / totalDiskCount) : 0;
  const hddSource = driveItems.length > 1 ? 'mixed' : driveItems[0]?.hddModel.pricing.bestSource || 'best';

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

  // 4. M.2 SSD cost
  let m2CoolpcTotal: number | undefined = 0;
  let m2SinyaTotal: number | undefined = 0;
  let m2BestTotal = 0;
  let m2UnitPrice = 0;
  let m2Source = 'none';

  if (m2SsdModule && m2SsdCount > 0) {
    const unitCoolpc = m2SsdModule.pricing.coolpc?.inStock ? m2SsdModule.pricing.coolpc.price : undefined;
    const unitSinya = m2SsdModule.pricing.sinya?.inStock ? m2SsdModule.pricing.sinya.price : undefined;
    m2UnitPrice = m2SsdModule.pricing.bestPrice || Math.min(...[unitCoolpc, unitSinya].filter((p): p is number => p !== undefined));
    m2BestTotal = m2UnitPrice * m2SsdCount;

    m2CoolpcTotal = unitCoolpc !== undefined ? unitCoolpc * m2SsdCount : undefined;
    m2SinyaTotal = unitSinya !== undefined ? unitSinya * m2SsdCount : undefined;
    m2Source = m2SsdModule.pricing.bestSource || (m2UnitPrice === unitCoolpc ? 'coolpc' : 'sinya');
  } else {
    m2CoolpcTotal = 0;
    m2SinyaTotal = 0;
  }

  // 5. Addons costs
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

  // 6. Grand totals
  const totalCoolpc =
    nasCoolpc !== undefined && hddCoolpcTotal !== undefined && m2CoolpcTotal !== undefined
      ? nasCoolpc + hddCoolpcTotal + (ramCoolpc ?? 0) + m2CoolpcTotal + addonsCoolpcTotal
      : undefined;

  const totalSinya =
    nasSinya !== undefined && hddSinyaTotal !== undefined && m2SinyaTotal !== undefined
      ? nasSinya + hddSinyaTotal + (ramSinya ?? 0) + m2SinyaTotal + addonsSinyaTotal
      : undefined;

  const totalBest = nasBest + hddBestTotal + ramBest + m2BestTotal + addonsBestTotal;

  // Cost per usable TB / TiB
  const costPerUsableTb = usableTb > 0 ? Math.round(totalBest / usableTb) : 0;
  const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);
  const usableTib = usableTb * TB_TO_TIB;
  const costPerUsableTib = usableTib > 0 ? Math.round(totalBest / usableTib) : 0;

  return {
    nasCost: { coolpc: nasCoolpc, sinya: nasSinya, best: nasBest, source: nasSource },
    hddCost: {
      coolpc: hddCoolpcTotal,
      sinya: hddSinyaTotal,
      best: hddBestTotal,
      unitPrice: hddBestUnitPrice,
      source: hddSource,
      items: itemizedBreakdown,
    },
    ramCost: { coolpc: ramCoolpc, sinya: ramSinya, best: ramBest, source: ramSource },
    m2SsdCost: {
      coolpc: m2CoolpcTotal,
      sinya: m2SinyaTotal,
      best: m2BestTotal,
      unitPrice: m2UnitPrice,
      count: m2SsdCount,
      source: m2Source,
    },
    addonsCost: { coolpc: addonsCoolpcTotal, sinya: addonsSinyaTotal, best: addonsBestTotal, source: 'mixed' },
    totalCoolpc,
    totalSinya,
    totalBest,
    costPerUsableTb,
    costPerUsableTib,
  };
}
