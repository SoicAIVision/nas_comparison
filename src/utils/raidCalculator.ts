import { RaidType, StorageCalculationResult } from '../types';

export interface CalculateStorageParams {
  diskCount: number;
  diskCapacityTb: number;
  raidType: RaidType;
}

export interface CalculateMixedStorageParams {
  diskCapacities: number[];
  raidType: RaidType;
}

/**
 * Calculates storage capacity for uniform disk capacity.
 */
export function calculateStorageCapacity(params: CalculateStorageParams): StorageCalculationResult {
  const { diskCount, diskCapacityTb, raidType } = params;
  const diskCapacities = Array(diskCount).fill(diskCapacityTb);
  return calculateMixedStorageCapacity({ diskCapacities, raidType });
}

/**
 * Calculates storage capacity for mixed disk capacities, supporting Synology SHR-1 / SHR-2 slicing.
 */
export function calculateMixedStorageCapacity(params: CalculateMixedStorageParams): StorageCalculationResult {
  const { diskCapacities, raidType } = params;
  const validDisks = diskCapacities.filter((c) => c > 0);
  const diskCount = validDisks.length;

  if (diskCount === 0) {
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

  const totalRawTb = validDisks.reduce((sum, c) => sum + c, 0);
  let usableTb = 0;
  let parityTb = 0;
  let unallocatedTb = 0;
  let faultToleranceDisks = 0;

  switch (raidType) {
    case 'SHR1': {
      if (diskCount === 1) {
        usableTb = validDisks[0];
        parityTb = 0;
        unallocatedTb = 0;
        faultToleranceDisks = 0;
      } else {
        // Synology SHR-1 Slicing Algorithm
        const sorted = [...validDisks].sort((a, b) => a - b);
        const uniqueBreakpoints = Array.from(new Set([0, ...sorted])).sort((a, b) => a - b);

        faultToleranceDisks = 1;
        for (let i = 1; i < uniqueBreakpoints.length; i++) {
          const prevHeight = uniqueBreakpoints[i - 1];
          const currHeight = uniqueBreakpoints[i];
          const sliceHeight = currHeight - prevHeight;

          // Count how many disks have at least currHeight
          const disksInSlice = sorted.filter((cap) => cap >= currHeight).length;

          if (disksInSlice >= 3) {
            // RAID 5 slice: (M - 1) * delta
            usableTb += (disksInSlice - 1) * sliceHeight;
            parityTb += 1 * sliceHeight;
          } else if (disksInSlice === 2) {
            // RAID 1 slice: 1 * delta
            usableTb += 1 * sliceHeight;
            parityTb += 1 * sliceHeight;
          } else if (disksInSlice === 1) {
            // Unprotected / unusable space
            unallocatedTb += 1 * sliceHeight;
          }
        }
      }
      break;
    }

    case 'RAID5': {
      if (diskCount < 3) {
        usableTb = 0;
        parityTb = 0;
        unallocatedTb = totalRawTb;
        faultToleranceDisks = 0;
      } else {
        // Traditional RAID 5: bottlenecked by smallest disk
        const minCapacity = Math.min(...validDisks);
        usableTb = (diskCount - 1) * minCapacity;
        parityTb = 1 * minCapacity;
        unallocatedTb = totalRawTb - diskCount * minCapacity;
        faultToleranceDisks = 1;
      }
      break;
    }

    case 'RAID6':
    case 'SHR2': {
      if (diskCount < 4) {
        usableTb = 0;
        parityTb = 0;
        unallocatedTb = totalRawTb;
        faultToleranceDisks = 0;
      } else {
        const minCapacity = Math.min(...validDisks);
        usableTb = (diskCount - 2) * minCapacity;
        parityTb = 2 * minCapacity;
        unallocatedTb = totalRawTb - diskCount * minCapacity;
        faultToleranceDisks = 2;
      }
      break;
    }

    case 'RAID10': {
      if (diskCount < 4 || diskCount % 2 !== 0) {
        usableTb = 0;
        parityTb = 0;
        unallocatedTb = totalRawTb;
        faultToleranceDisks = 0;
      } else {
        const sorted = [...validDisks].sort((a, b) => a - b);
        let pairUsable = 0;
        let pairWasted = 0;
        for (let i = 0; i < sorted.length; i += 2) {
          const d1 = sorted[i];
          const d2 = sorted[i + 1];
          const minD = Math.min(d1, d2);
          pairUsable += minD;
          pairWasted += Math.abs(d1 - d2);
        }
        usableTb = pairUsable;
        parityTb = pairUsable;
        unallocatedTb = pairWasted;
        faultToleranceDisks = 1;
      }
      break;
    }

    case 'RAID1': {
      if (diskCount < 2) {
        usableTb = 0;
        parityTb = 0;
        unallocatedTb = totalRawTb;
        faultToleranceDisks = 0;
      } else {
        const minCapacity = Math.min(...validDisks);
        usableTb = minCapacity;
        parityTb = (diskCount - 1) * minCapacity;
        unallocatedTb = totalRawTb - diskCount * minCapacity;
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
      unallocatedTb = 0;
      faultToleranceDisks = 0;
      break;
    }
  }

  // Convert decimal TB (10^12 bytes) to binary TiB (2^40 bytes)
  const TB_TO_TIB = Math.pow(10, 12) / Math.pow(2, 40);
  const usableTib = Math.round(usableTb * TB_TO_TIB * 100) / 100;
  const storageEfficiencyPercent = totalRawTb > 0 ? Math.round((usableTb / totalRawTb) * 100) : 0;
  const meets50TbTarget = checkMeets50TbTarget(usableTb);

  return {
    usableTb,
    usableTib,
    parityTb,
    unallocatedTb,
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
