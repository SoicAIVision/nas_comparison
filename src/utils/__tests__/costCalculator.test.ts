import { describe, it, expect } from 'vitest';
import { calculatePlanCost } from '../costCalculator';
import { NasModel, HardDrive, RamModule } from '../../types';

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
    pcieSlots: '1 x PCIe Gen3 x8',
    usbPorts: '3 x USB 3.2',
    hardwareTranscoding: false,
    warrantyYears: 3,
    description: 'Test NAS',
    msrp: 32999,
    pricing: {
      coolpc: { source: 'coolpc', price: 32999, inStock: true, itemTitle: 'DS1825+', updatedAt: '2026-08-26T13:30:00+08:00' },
      sinya: { source: 'sinya', price: 32999, inStock: true, itemTitle: 'DS1825+', updatedAt: '2026-08-26T13:28:00+08:00' },
      bestPrice: 32999,
      bestSource: 'both',
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
      coolpc: { source: 'coolpc', price: 13990, inStock: true, itemTitle: 'IronWolf Pro 18TB', updatedAt: '2026-08-26T13:30:00+08:00' },
      sinya: { source: 'sinya', price: 13950, inStock: true, itemTitle: 'IronWolf Pro 18TB', updatedAt: '2026-08-26T13:28:00+08:00' },
      bestPrice: 13950,
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
      coolpc: { source: 'coolpc', price: 8999, inStock: true, itemTitle: '16GB ECC', updatedAt: '2026-08-26T13:30:00+08:00' },
      sinya: { source: 'sinya', price: 8900, inStock: true, itemTitle: '16GB ECC', updatedAt: '2026-08-26T13:28:00+08:00' },
      bestPrice: 8900,
      bestSource: 'sinya',
    },
  };

  it('should calculate total costs for NAS + 4 x HDDs without extra RAM', () => {
    const cost = calculatePlanCost({
      nasModel: mockNas,
      hddModel: mockHdd,
      hddCount: 4,
      ramModule: undefined,
      addons: [],
      usableTb: 54,
    });

    // NAS: 32999
    // HDDs: 4 * 13950 = 55800 (best)
    // CoolPC total: 32999 + (4 * 13990) = 88959
    // Sinyaw total: 32999 + (4 * 13950) = 88799
    // Best total: 32999 + 55800 = 88799
    expect(cost.totalCoolpc).toBe(88959);
    expect(cost.totalSinya).toBe(88799);
    expect(cost.totalBest).toBe(88799);
    expect(cost.costPerUsableTb).toBe(Math.round(88799 / 54));
  });

  it('should correctly include RAM and calculate cost per usable TB', () => {
    const cost = calculatePlanCost({
      nasModel: mockNas,
      hddModel: mockHdd,
      hddCount: 4,
      ramModule: mockRam,
      addons: [],
      usableTb: 54,
    });

    // Best total: 88799 + 8900 = 97699
    expect(cost.totalBest).toBe(97699);
    expect(cost.costPerUsableTb).toBe(Math.round(97699 / 54));
  });
});
