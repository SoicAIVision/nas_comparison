import { ComponentPricing, ScrapedPriceDatabase, StoreSource } from '../types';

/**
 * Merges quotes from CoolPC and Sinyaw, selecting best available price
 */
export function matchAndMergePrices(pricing: ComponentPricing): ComponentPricing {
  const coolpc = pricing.coolpc;
  const sinya = pricing.sinya;

  const validQuotes: { source: StoreSource; price: number }[] = [];
  if (coolpc && coolpc.inStock && coolpc.price > 0) {
    validQuotes.push({ source: 'coolpc', price: coolpc.price });
  }
  if (sinya && sinya.inStock && sinya.price > 0) {
    validQuotes.push({ source: 'sinya', price: sinya.price });
  }

  if (validQuotes.length === 0) {
    // Both out of stock or missing, fallback to any available price or MSRP
    const fallbackPrice = coolpc?.price || sinya?.price || 0;
    return {
      ...pricing,
      bestPrice: fallbackPrice,
      bestSource: 'both',
    };
  }

  if (validQuotes.length === 1) {
    return {
      ...pricing,
      bestPrice: validQuotes[0].price,
      bestSource: validQuotes[0].source,
    };
  }

  // Both have valid in-stock quotes
  const minPrice = Math.min(validQuotes[0].price, validQuotes[1].price);
  let bestSource: StoreSource | 'both' = 'both';
  if (validQuotes[0].price < validQuotes[1].price) {
    bestSource = validQuotes[0].source;
  } else if (validQuotes[1].price < validQuotes[0].price) {
    bestSource = validQuotes[1].source;
  }

  return {
    ...pricing,
    bestPrice: minPrice,
    bestSource,
  };
}

export interface FormattedTimestamps {
  rawTimestamp: string;
  coolpcFormatted: string;
  sinyaFormatted: string;
  globalFormatted: string;
}

/**
 * Extracts and formats the latest price capture timestamps
 */
export function extractLatestTimestamps(db: ScrapedPriceDatabase): FormattedTimestamps {
  const formatIso = (isoStr?: string) => {
    if (!isoStr) return '未知時間';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return isoStr;
    }
  };

  return {
    rawTimestamp: db.timestamp,
    coolpcFormatted: formatIso(db.coolpcTimestamp || db.timestamp),
    sinyaFormatted: formatIso(db.sinyaTimestamp || db.timestamp),
    globalFormatted: formatIso(db.timestamp),
  };
}
