import { useMemo } from 'react';
import restaurants from '../restaurants';

export function useRestaurant() {
  return useMemo(() => {
    const hostname  = window.location.hostname;
    const parts     = hostname.split('.');
    // 'anuskitchen.forebytes.com' → 'anuskitchen'
    // 'localhost' → 'localhost'
    const subdomain = parts.length >= 3 ? parts[0] : hostname;
    return restaurants[subdomain] ?? restaurants['localhost'];
  }, []);
}
