import { describe, it, expect } from 'vitest';
import { calculatePlanCost } from '../costCalculator';
import { NasModel, HardDrive, RamModule, M2SsdModule } from '../../types';

describe('costCalculator', () => {
  const mockNas: NasModel = {
    id: 'synology-ds1825-plus',
    brand: 'Synology',
    name: 'DS1825+',
    series: 'Plus',
    bays: 8,
    maxBaysWithExpansion: 18,
    cpu: 'AMD Ryzen V1500B',
    defaultRamGb: 8,
    defaultRamType: 'ECC DDR4',
    maxRamGb: 32,
    ramSlots: 2,
    m2Slots: 2,
    m2PoolSupport: true,
    ethernetPorts: '2 x 2.5GbE',
    hasBuiltIn10G: false,
    pcieSlots: '1 x PCIe Gen3 x8',
    usbPorts: '3 x USB 3.2',
    hardwareTranscoding: false,
    warrantyYears: 3,
    description: 'Test NAS',
    msrp: 47150,
    pricing: {
      coolpc: { source: 'coolpc', price: 47150, inStock: true, itemTitle: 'DS1825+', updatedAt: '2026-08-31T06:00:00Z' },
      sinya: { source: 'sinya', price: 47147, inStock: true, itemTitle: 'DS1825+', updatedAt: '2026-08-31T06:00:00Z' },
      bestPrice: 47147,
      bestSource: 'sinya',
    },
  };

  const mockHdd: HardDrive = {
    id: 'seagate-ironwolf-pro-18tb',
    brand: 'Seagate',
    series: 'IronWolf Pro',
    modelNumber: 'ST18000NT001',
    capacityTb: 18,
    rpm: 7200,
    cacheMb: 256,
    cmr: true,
    workloadRatingTbYear: 550,
    warrantyYears: 5,
    pricing: {
      coolpc: { source: 'coolpc', price: 24890, inStock: true, itemTitle: 'IronWolf Pro 18TB', updatedAt: '2026-08-31T06:00:00Z' },
      sinya: { source: 'sinya', price: 24880, inStock: true, itemTitle: 'IronWolf Pro 18TB', updatedAt: '2026-08-31T06:00:00Z' },
      bestPrice: 24880,
      bestSource: 'sinya',
    },
  };

  const mockRam: RamModule = {
    id: 'synology-ecc-16gb',
    brand: 'Synology',
    capacityGb: 16,
    type: 'DDR4-3200 ECC SODIMM',
    isOfficial: true,
    pricing: {
      coolpc: { source: 'coolpc', price: 8999, inStock: true, itemTitle: '16GB ECC', updatedAt: '2026-08-31T06:00:00Z' },
      sinya: { source: 'sinya', price: 8900, inStock: true, itemTitle: '16GB ECC', updatedAt: '2026-08-31T06:00:00Z' },
      bestPrice: 8900,
      bestSource: 'sinya',
    },
  };

  const mockM2Ssd: M2SsdModule = {
    id: 'kingston-kc3000-1tb',
    brand: 'Kingston',
    name: 'Kingston KC3000 1TB',
    capacityGb: 1000,
    formFactor: 'M.2 2280 NVMe PCIe',
    readSpeedMb: 7000,
    writeSpeedMb: 6000,
    isOfficial: false,
    pricing: {
      coolpc: { source: 'coolpc', price: 6288, inStock: true, itemTitle: 'KC3000 1TB', updatedAt: '2026-08-31T06:00:00Z' },
      sinya: { source: 'sinya', price: 6280, inStock: true, itemTitle: 'KC3000 1TB', updatedAt: '2026-08-31T06:00:00Z' },
      bestPrice: 6280,
      bestSource: 'sinya',
    },
  };

  it('should calculate total costs for NAS + 4 x HDDs without extra RAM or M.2 SSD', () => {
    const cost = calculatePlanCost({
      nasModel: mockNas,
      hddModel: mockHdd,
      hddCount: 4,
      ramModule: undefined,
      m2SsdModule: undefined,
      m2SsdCount: 0,
      addons: [],
      usableTb: 54,
    });

    // NAS: 47150 (CoolPC), 47147 (Sinya/Best)
    // HDDs: 4 * 24890 = 99560 (CoolPC), 4 * 24880 = 99520 (Sinya/Best)
    // CoolPC total: 47150 + 99560 = 146710
    // Sinya total: 47147 + 99520 = 146667
    // Best total: 47147 + 99520 = 146667
    expect(cost.totalCoolpc).toBe(146710);
    expect(cost.totalSinya).toBe(146667);
    expect(cost.totalBest).toBe(146667);
    expect(cost.costPerUsableTb).toBe(Math.round(146667 / 54));
  });

  it('should correctly include RAM and calculate cost per usable TB', () => {
    const cost = calculatePlanCost({
      nasModel: mockNas,
      hddModel: mockHdd,
      hddCount: 4,
      ramModule: mockRam,
      m2SsdModule: undefined,
      m2SsdCount: 0,
      addons: [],
      usableTb: 54,
    });

    // Best total: 146667 + 8900 = 155567
    expect(cost.totalBest).toBe(155567);
    expect(cost.costPerUsableTb).toBe(Math.round(155567 / 54));
  });

  it('should correctly include 2x M.2 NVMe SSDs into total cost calculation', () => {
    const cost = calculatePlanCost({
      nasModel: mockNas,
      hddModel: mockHdd,
      hddCount: 4,
      ramModule: undefined,
      m2SsdModule: mockM2Ssd,
      m2SsdCount: 2,
      addons: [],
      usableTb: 54,
    });

    // M.2 SSD CoolPC: 6288 * 2 = 12576, Sinya: 6280 * 2 = 12560, Best: 12560
    // Best total: 146667 + 12560 = 159227
    expect(cost.m2SsdCost.count).toBe(2);
    expect(cost.m2SsdCost.best).toBe(12560);
    expect(cost.totalCoolpc).toBe(146710 + 12576);
    expect(cost.totalSinya).toBe(146667 + 12560);
    expect(cost.totalBest).toBe(159227);
  });
});
