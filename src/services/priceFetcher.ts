import { ScrapedPriceDatabase } from '../types';

/**
 * Fetches the latest prices JSON data from static/dynamic endpoint
 */
export async function fetchLatestPrices(): Promise<ScrapedPriceDatabase> {
  // Use relative path so it works in local dev, preview and GitHub Pages subpaths
  const url = './data/prices.json?t=' + Date.now();
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ScrapedPriceDatabase = await response.json();
    return data;
  } catch (error) {
    console.warn('Failed to fetch prices from network, using local fallback:', error);
    // Fallback to minimal database
    return {
      timestamp: new Date().toISOString(),
      coolpcTimestamp: new Date().toISOString(),
      sinyaTimestamp: new Date().toISOString(),
      items: {},
    };
  }
}
