import { PlanConfiguration } from '../types';

export const DEFAULT_PLANS: PlanConfiguration[] = [
  {
    id: 'plan-a-balanced',
    name: '方案 A：DS1825+ 最佳平衡推薦 (4x18TB / 剩4槽)',
    nasModelId: 'synology-ds1825-plus',
    hddModelId: 'seagate-ironwolf-pro-18tb',
    hddCount: 4,
    isMixedDrives: true,
    mixedDrives: [{ hddModelId: 'seagate-ironwolf-pro-18tb', count: 4 }],
    raidType: 'RAID5',
    selectedRamId: undefined, // 8GB ECC 標配
    selectedM2SsdId: undefined,
    m2SsdCount: 0,
    m2Usage: 'storage_pool',
    selectedAddonIds: [],
    customNotes: '【最佳平衡解】4 顆 18TB 建立 RAID 5 擁有 54 TB 標稱容量 (49.1 TiB)，出廠標配 8GB ECC，保留 4 個空槽供未來無痛擴充',
  },
  {
    id: 'plan-b-cheapest',
    name: '方案 B：DS1825neo+ 經濟實惠最省 (5x14TB / 單TB最低)',
    nasModelId: 'synology-ds1825-neo-plus',
    hddModelId: 'toshiba-n300-14tb',
    hddCount: 5,
    isMixedDrives: true,
    mixedDrives: [{ hddModelId: 'toshiba-n300-14tb', count: 5 }],
    raidType: 'RAID5',
    selectedRamId: undefined,
    selectedM2SsdId: undefined,
    m2SsdCount: 0,
    m2Usage: 'storage_pool',
    selectedAddonIds: [],
    customNotes: '【最便宜解】DS1825neo+ 主機更平價，搭配 5 顆 Toshiba 14TB 達成 56 TB (50.9 TiB)，單 TB 建置成本與總價最省',
  },
  {
    id: 'plan-c-flagship-ds1823xs',
    name: '方案 C：DS1823xs+ 企業旗艦 (4x20TB / 原生10G / 雙M.2系統碟)',
    nasModelId: 'synology-ds1823xs-plus',
    hddModelId: 'seagate-ironwolf-pro-20tb',
    hddCount: 4,
    isMixedDrives: true,
    mixedDrives: [{ hddModelId: 'seagate-ironwolf-pro-20tb', count: 4 }],
    raidType: 'RAID5',
    selectedRamId: undefined, // 8GB ECC 標配 (最高擴充至 32GB ECC)
    selectedM2SsdId: 'kingston-kc3000-1tb',
    m2SsdCount: 2, // 2 顆 M.2 組 RAID 1 鏡像系統碟
    m2Usage: 'storage_pool',
    selectedAddonIds: [], // 內建原生 10GbE 網卡，免加購！
    customNotes: '【企業頂級旗艦】DS1823xs+ 原生內建 10GbE 網卡與 5 年保固；4 顆 20TB RAID 5 達成 60 TB (54.5 TiB)，並加裝 2 顆 1TB M.2 NVMe SSD 建立 RAID 1 高速系統集區 (Docker/VM/套件)',
  },
];
