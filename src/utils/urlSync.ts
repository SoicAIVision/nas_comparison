import LZString from 'lz-string';
import { PlanConfiguration } from '../types';

/**
 * Encodes an array of comparison plan configurations into a compressed URL-safe string
 */
export function encodePlansToHash(plans: PlanConfiguration[]): string {
  try {
    const jsonString = JSON.stringify(plans);
    return LZString.compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error('Failed to encode plans to hash:', error);
    return '';
  }
}

/**
 * Decodes a compressed hash string back into an array of plan configurations
 */
export function decodePlansFromHash(hashString: string): PlanConfiguration[] | null {
  if (!hashString || typeof hashString !== 'string') return null;

  try {
    // Remove leading # or #/ if present
    const cleanHash = hashString.replace(/^#\/?/, '').replace(/^compare\?data=/, '');
    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as PlanConfiguration[];
    }
    return null;
  } catch (error) {
    console.warn('Failed to parse decoded plans from hash string:', error);
    return null;
  }
}
