import { RaidType, StorageCalculationResult } from '../types';

export interface CalculateStorageParams {
  diskCount: number;
  diskCapacityTb: number;
  raidType: RaidType;
}

/**
 * Calculates raw, usable, parity and fault-tolerant storage capacities
 * along with TB to TiB conversion and 50TB procurement target validation.
 */
export function calculateStorageCapacity(params: CalculateStorageParams): StorageCalculationResult {
  const { diskCount, diskCapacityTb, raidType } = params;

  if (diskCount <= 0 || diskCapacityTb <= 0) {
    return {
      usableTb: 0,
      usableTib: 0,
      parityTb: 0,
      unallocatedTb: 0,
      faultToleranceDisks: 0,
      meets50TbTarget: false,
      totalRawTb: 0,
      storageEfficiencyPercent: 0,
    };
  }

  const totalRawTb = diskCount * diskCapacityTb;
  let usableTb = 0;
  let parityTb = 0;
  let faultToleranceDisks = 0;

  switch (raidType) {
    case 'RAID5':
    case 'SHR1': {
      if (diskCount < 3 && raidType === 'RAID5') {
        // RAID 5 requires at least 3 disks
        usableTb = 0;
        parityTb = 0;
        faultToleranceDisks = 0;
      } else if (diskCount === 1) {
        usableTb = diskCapacityTb;
        parityTb = 0;
        faultToleranceDisks = 0;
      } else if (diskCount === 2) {
        // SHR1 with 2 disks acts as RAID 1
        usableTb = diskCapacityTb;
        parityTb = diskCapacityTb;
        faultToleranceDisks = 1;
      } else {
        // Uniform disk size: (N - 1) * Capacity
        usableTb = (diskCount - 1) * diskCapacityTb;
        parityTb = diskCapacityTb;
        faultToleranceDisks = 1;
      }
      break;
    }

    case 'RAID6':
    case 'SHR2': {
      if (diskCount < 4) {
        usableTb = 0;
        parityTb = 0;
        faultToleranceDisks = 0;
      } else {
        usableTb = (diskCount - 2) * diskCapacityTb;
        parityTb = 2 * diskCapacityTb;
        faultToleranceDisks = 2;
      }
      break;
    }

    case 'RAID10': {
      if (diskCount < 4 || diskCount % 2 !== 0) {
        usableTb = 0;
        parityTb = 0;
        faultToleranceDisks = 0;
      } else {
        usableTb = (diskCount / 2) * diskCapacityTb;
        parityTb = (diskCount / 2) * diskCapacityTb;
        faultToleranceDisks = 1; // can survive up to 1 disk per mirror pair
      }
      break;
    }

    case 'RAID1': {
      if (diskCount < 2) {
        usableTb = 0;
        parityTb = 0;
        faultToleranceDisks = 0;
      } else {
        usableTb = diskCapacityTb;
        parityTb = (diskCount - 1) * diskCapacityTb;
        faultToleranceDisks = diskCount - 1;
      }
      break;
    }

    case 'RAID0':
    case 'JBOD':
    case 'BASIC':
    default: {
      usableTb = totalRawTb;
      parityTb = 0;
      faultToleranceDisks = 0;
      break;
    }
  }

  // Convert decimal TB (10^12 bytes) to binary TiB (2^40 bytes)
  // Factor: 10^12 / 2^40 = 1,000,000,000,000 / 1,099,511,627,776 ≈ 0.90949470177
  const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);
  const usableTib = Math.round(usableTb * TB_TO_TIB * 100) / 100;
  const storageEfficiencyPercent = totalRawTb > 0 ? Math.round((usableTb / totalRawTb) * 100) : 0;
  const meets50TbTarget = checkMeets50TbTarget(usableTb);

  return {
    usableTb,
    usableTib,
    parityTb,
    unallocatedTb: 0,
    faultToleranceDisks,
    meets50TbTarget,
    totalRawTb,
    storageEfficiencyPercent,
  };
}

/**
 * Verifies if usable TB meets or exceeds the 50TB procurement target
 */
export function checkMeets50TbTarget(usableTb: number): boolean {
  return usableTb >= 50;
}
