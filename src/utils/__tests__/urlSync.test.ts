import { describe, it, expect } from 'vitest';
import { encodePlansToHash, decodePlansFromHash } from '../urlSync';
import { PlanConfiguration } from '../../types';

describe('urlSync', () => {
  const samplePlans: PlanConfiguration[] = [
    {
      id: 'plan-1',
      name: 'Plan 1',
      nasModelId: 'synology-ds1825-plus',
      hddModelId: 'seagate-ironwolf-pro-18tb',
      hddCount: 4,
      raidType: 'RAID5',
      selectedRamId: 'synology-ecc-16gb',
      selectedAddonIds: ['synology-e10g18-t1'],
    },
    {
      id: 'plan-2',
      name: 'Plan 2',
      nasModelId: 'synology-ds1825-neo-plus',
      hddModelId: 'toshiba-n300-14tb',
      hddCount: 5,
      raidType: 'RAID5',
      selectedAddonIds: [],
    },
  ];

  it('should encode and decode plans losslessly through hash string', () => {
    const encoded = encodePlansToHash(samplePlans);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodePlansFromHash(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.length).toBe(2);
    expect(decoded?.[0].nasModelId).toBe('synology-ds1825-plus');
    expect(decoded?.[0].hddCount).toBe(4);
    expect(decoded?.[0].selectedRamId).toBe('synology-ecc-16gb');
    expect(decoded?.[1].nasModelId).toBe('synology-ds1825-neo-plus');
    expect(decoded?.[1].hddCount).toBe(5);
  });

  it('should return null or default when hash string is invalid or corrupted', () => {
    const decoded = decodePlansFromHash('invalid_corrupted_string');
    expect(decoded).toBeNull();
  });
});
