import { describe, it, expect } from 'vitest';
import { matchAndMergePrices, extractLatestTimestamps } from '../priceMatcher';
import { ComponentPricing, ScrapedPriceDatabase } from '../../types';

describe('priceMatcher', () => {
  const mockScrapedDb: ScrapedPriceDatabase = {
    timestamp: '2026-08-26T13:30:00+08:00',
    coolpcTimestamp: '2026-08-26T13:30:00+08:00',
    sinyaTimestamp: '2026-08-26T13:28:00+08:00',
    items: {
      'synology-ds1825-plus': {
        coolpc: {
          source: 'coolpc',
          price: 32999,
          inStock: true,
          itemTitle: '群暉 DS1825+ 8Bay NAS',
          updatedAt: '2026-08-26T13:30:00+08:00',
        },
        sinya: {
          source: 'sinya',
          price: 32900,
          inStock: true,
          itemTitle: 'Synology DS1825+ 8-Bay',
          updatedAt: '2026-08-26T13:28:00+08:00',
        },
        bestPrice: 32900,
        bestSource: 'sinya',
      },
    },
  };

  it('should find best price between coolpc and sinya', () => {
    const pricing: ComponentPricing = {
      coolpc: { source: 'coolpc', price: 13990, inStock: true, itemTitle: 'HDD 18TB', updatedAt: '2026-08-26T13:30:00+08:00' },
      sinya: { source: 'sinya', price: 13888, inStock: true, itemTitle: 'HDD 18TB', updatedAt: '2026-08-26T13:28:00+08:00' },
    };

    const merged = matchAndMergePrices(pricing);
    expect(merged.bestPrice).toBe(13888);
    expect(merged.bestSource).toBe('sinya');
  });

  it('should handle when one source is out of stock', () => {
    const pricing: ComponentPricing = {
      coolpc: { source: 'coolpc', price: 13990, inStock: false, itemTitle: 'HDD 18TB (缺貨)', updatedAt: '2026-08-26T13:30:00+08:00' },
      sinya: { source: 'sinya', price: 14200, inStock: true, itemTitle: 'HDD 18TB', updatedAt: '2026-08-26T13:28:00+08:00' },
    };

    const merged = matchAndMergePrices(pricing);
    expect(merged.bestPrice).toBe(14200);
    expect(merged.bestSource).toBe('sinya');
  });

  it('should extract formatted timestamps with source indicators', () => {
    const timestamps = extractLatestTimestamps(mockScrapedDb);
    expect(timestamps.coolpcFormatted).toContain('2026-08-26');
    expect(timestamps.sinyaFormatted).toContain('2026-08-26');
  });
});
