import { ComponentPricing } from '../types';

export interface DualStorePricingInfo {
  coolpcPrice?: number;
  sinyaPrice?: number;
  coolpcText: string;
  sinyaText: string;
  bestPrice: number;
  bestSourceText: string;
  diffText?: string;
  dropdownText: string;
}

/**
 * Formats pricing from both CoolPC and Sinya into clear, human-readable comparison labels.
 */
export function getDualStorePricingInfo(pricing: ComponentPricing): DualStorePricingInfo {
  const coolpcPrice = pricing.coolpc?.inStock ? pricing.coolpc.price : undefined;
  const sinyaPrice = pricing.sinya?.inStock ? pricing.sinya.price : undefined;
  const bestPrice =
    pricing.bestPrice ||
    Math.min(...[coolpcPrice, sinyaPrice].filter((p): p is number => p !== undefined)) ||
    0;

  const coolpcText = coolpcPrice ? `NT$ ${coolpcPrice.toLocaleString()}` : '無報價';
  const sinyaText = sinyaPrice ? `NT$ ${sinyaPrice.toLocaleString()}` : '無報價';

  let diffText: string | undefined = undefined;
  let bestSourceText = '最佳價';

  if (coolpcPrice && sinyaPrice) {
    if (coolpcPrice === sinyaPrice) {
      diffText = '兩家同價';
      bestSourceText = '兩家同價';
    } else if (coolpcPrice < sinyaPrice) {
      const diff = sinyaPrice - coolpcPrice;
      diffText = `原價屋便宜 NT$ ${diff.toLocaleString()}`;
      bestSourceText = '原價屋最省';
    } else {
      const diff = coolpcPrice - sinyaPrice;
      diffText = `欣亞便宜 NT$ ${diff.toLocaleString()}`;
      bestSourceText = '欣亞最省';
    }
  } else if (coolpcPrice) {
    bestSourceText = '僅原價屋販售';
  } else if (sinyaPrice) {
    bestSourceText = '僅欣亞數位販售';
  }

  const dropdownText = `原: ${coolpcPrice ? '$' + coolpcPrice.toLocaleString() : '無'} | 欣: ${sinyaPrice ? '$' + sinyaPrice.toLocaleString() : '無'}`;

  return {
    coolpcPrice,
    sinyaPrice,
    coolpcText,
    sinyaText,
    bestPrice,
    bestSourceText,
    diffText,
    dropdownText,
  };
}
