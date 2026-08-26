import { PlanConfiguration } from '../types';

export const DEFAULT_PLANS: PlanConfiguration[] = [
  {
    id: 'plan-a-balanced',
    name: '方案 A：DS1825+ 最佳平衡推薦 (4x18TB / 剩4槽)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'seagate-ironwolf-pro-18tb',
    hddCount: 4,
    raidType: 'RAID5',
    selectedRamId: undefined, // 8GB ECC 標配
    selectedAddonIds: [],
    customNotes: '【最佳平衡解】4 顆 18TB 建立 RAID 5 擁有 54 TB 標稱容量 (49.1 TiB)，出廠標配 8GB ECC，保留 4 個空槽供未來無痛擴充',
  },
  {
    id: 'plan-b-cheapest',
    name: '方案 B：DS1825neo+ 經濟實惠最省 (5x14TB / 單TB最低)',
    nasModelId: 'synology-ds1825-neo-plus',
    hddModelId: 'toshiba-n300-14tb',
    hddCount: 5,
    raidType: 'RAID5',
    selectedRamId: undefined,
    selectedAddonIds: [],
    customNotes: '【最便宜解】DS1825neo+ 主機更平價，搭配 5 顆 Toshiba 14TB 達成 56 TB (50.9 TiB)，單 TB 建置成本與總價最省',
  },
  {
    id: 'plan-c-flagship-raid6',
    name: '方案 C：DS1825+ 旗艦高安全解 (6x16TB RAID 6 / 雙碟容錯)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'seagate-ironwolf-pro-16tb',
    hddCount: 6,
    raidType: 'RAID6',
    selectedRamId: 'synology-ecc-16gb-d4ecso-3200', // +16GB ECC (總計 24GB)
    selectedAddonIds: ['synology-e10g18-t1'], // 10GbE 網卡
    customNotes: '【最高安全性與效能解】RAID 6 容許 2 顆硬碟同時損壞仍保有 64 TB (58.2 TiB)，升級 24GB ECC RAM 與 10GbE 網卡',
  },
];
