import { PlanConfiguration } from '../types';

export const DEFAULT_PLANS: PlanConfiguration[] = [
  {
    id: 'plan-a-18tb-4disks',
    name: '方案 A：DS1825+ 搭配 4x18TB (容量推薦/空4槽)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'seagate-ironwolf-pro-18tb',
    hddCount: 4,
    raidType: 'RAID5',
    selectedRamId: undefined, // default 8GB ECC is enough
    selectedAddonIds: [],
    customNotes: '4 顆 18TB 建立 RAID 5 擁有 54 TB 標稱容量 (49.1 TiB)，剩餘 4 Bay 供未來擴充',
  },
  {
    id: 'plan-b-20tb-4disks',
    name: '方案 B：DS1825+ 搭配 4x20TB (破50TiB門檻)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'seagate-ironwolf-pro-20tb',
    hddCount: 4,
    raidType: 'RAID5',
    selectedRamId: undefined,
    selectedAddonIds: [],
    customNotes: '4 顆 20TB 建立 RAID 5 擁有 60 TB 標稱容量 (54.5 TiB)，實體真實破 50 TiB 門檻',
  },
  {
    id: 'plan-c-14tb-5disks',
    name: '方案 C：DS1825+ 搭配 5x14TB (經濟均攤型)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'toshiba-n300-14tb',
    hddCount: 5,
    raidType: 'RAID5',
    selectedRamId: undefined,
    selectedAddonIds: [],
    customNotes: '5 顆 14TB 建立 RAID 5 擁有 56 TB 標稱容量 (50.9 TiB)，東芝 N300 單 TB 成本最低',
  },
  {
    id: 'plan-d-neo-18tb-4disks',
    name: '方案 D：DS1825neo+ 搭配 4x18TB (預算親民款)',
    nasModelId: 'synology-ds1825-neo-plus',
    hddModelId: 'seagate-ironwolf-pro-18tb',
    hddCount: 4,
    raidType: 'RAID5',
    selectedRamId: undefined,
    selectedAddonIds: [],
    customNotes: 'DS1825neo+ 主機更平價，同為 8-Bay 機構，搭配 4 顆 18TB 達成 54TB (49.1 TiB)',
  },
];
