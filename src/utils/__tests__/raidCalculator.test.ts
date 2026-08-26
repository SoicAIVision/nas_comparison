import { describe, it, expect } from 'vitest';
import { calculateStorageCapacity, checkMeets50TbTarget } from '../raidCalculator';

describe('raidCalculator', () => {
  describe('RAID 5 Calculations', () => {
    it('should correctly calculate capacity for 4 x 18TB in RAID 5', () => {
      // 4 x 18TB in RAID 5 -> Usable = (4-1) * 18 = 54 TB
      const result = calculateStorageCapacity({
        diskCount: 4,
        diskCapacityTb: 18,
        raidType: 'RAID5',
      });

      expect(result.usableTb).toBe(54);
      expect(result.parityTb).toBe(18);
      expect(result.totalRawTb).toBe(72);
      expect(result.faultToleranceDisks).toBe(1);
      expect(result.storageEfficiencyPercent).toBe(75);
      expect(result.meets50TbTarget).toBe(true);
      // 54 TB in TiB (54 * 10^12 / 2^40) ≈ 49.11 TiB
      expect(result.usableTib).toBeCloseTo(49.11, 1);
    });

    it('should correctly calculate capacity for 4 x 20TB in RAID 5 (exceeds 50 TiB)', () => {
      // 4 x 20TB in RAID 5 -> Usable = (4-1) * 20 = 60 TB
      const result = calculateStorageCapacity({
        diskCount: 4,
        diskCapacityTb: 20,
        raidType: 'RAID5',
      });

      expect(result.usableTb).toBe(60);
      expect(result.parityTb).toBe(20);
      expect(result.totalRawTb).toBe(80);
      expect(result.faultToleranceDisks).toBe(1);
      expect(result.usableTib).toBeCloseTo(54.57, 1);
      expect(result.meets50TbTarget).toBe(true);
    });

    it('should correctly calculate capacity for 5 x 14TB in RAID 5', () => {
      // 5 x 14TB in RAID 5 -> Usable = (5-1) * 14 = 56 TB
      const result = calculateStorageCapacity({
        diskCount: 5,
        diskCapacityTb: 14,
        raidType: 'RAID5',
      });

      expect(result.usableTb).toBe(56);
      expect(result.parityTb).toBe(14);
      expect(result.totalRawTb).toBe(70);
      expect(result.storageEfficiencyPercent).toBe(80);
      expect(result.meets50TbTarget).toBe(true);
    });

    it('should flag as not meeting 50TB when total usable is under 50TB', () => {
      // 4 x 8TB in RAID 5 -> Usable = 3 * 8 = 24 TB < 50 TB
      const result = calculateStorageCapacity({
        diskCount: 4,
        diskCapacityTb: 8,
        raidType: 'RAID5',
      });

      expect(result.usableTb).toBe(24);
      expect(result.meets50TbTarget).toBe(false);
    });

    it('should handle invalid disk count for RAID 5 (requires at least 3 disks)', () => {
      const result = calculateStorageCapacity({
        diskCount: 2,
        diskCapacityTb: 18,
        raidType: 'RAID5',
      });

      expect(result.usableTb).toBe(0);
      expect(result.meets50TbTarget).toBe(false);
    });
  });

  describe('Other RAID Types', () => {
    it('should calculate RAID 6 (2 parity disks)', () => {
      // 6 x 16TB in RAID 6 -> Usable = (6-2) * 16 = 64 TB
      const result = calculateStorageCapacity({
        diskCount: 6,
        diskCapacityTb: 16,
        raidType: 'RAID6',
      });

      expect(result.usableTb).toBe(64);
      expect(result.parityTb).toBe(32);
      expect(result.faultToleranceDisks).toBe(2);
      expect(result.meets50TbTarget).toBe(true);
    });

    it('should calculate RAID 10 (mirroring + striping)', () => {
      // 4 x 18TB in RAID 10 -> Usable = 4 / 2 * 18 = 36 TB
      const result = calculateStorageCapacity({
        diskCount: 4,
        diskCapacityTb: 18,
        raidType: 'RAID10',
      });

      expect(result.usableTb).toBe(36);
      expect(result.parityTb).toBe(36);
      expect(result.faultToleranceDisks).toBe(1);
    });

    it('should calculate RAID 1 / Mirroring', () => {
      // 2 x 18TB in RAID 1 -> Usable = 18 TB
      const result = calculateStorageCapacity({
        diskCount: 2,
        diskCapacityTb: 18,
        raidType: 'RAID1',
      });

      expect(result.usableTb).toBe(18);
      expect(result.parityTb).toBe(18);
      expect(result.faultToleranceDisks).toBe(1);
    });

    it('should calculate SHR1 with uniform disks like RAID 5', () => {
      const result = calculateStorageCapacity({
        diskCount: 4,
        diskCapacityTb: 18,
        raidType: 'SHR1',
      });

      expect(result.usableTb).toBe(54);
      expect(result.faultToleranceDisks).toBe(1);
    });
  });

  describe('checkMeets50TbTarget helper', () => {
    it('should return true for >= 50 TB', () => {
      expect(checkMeets50TbTarget(50)).toBe(true);
      expect(checkMeets50TbTarget(54)).toBe(true);
      expect(checkMeets50TbTarget(49.9)).toBe(false);
    });
  });
});
