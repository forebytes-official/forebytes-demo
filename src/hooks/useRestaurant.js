import { useMemo } from 'react';
import restaurants from '../restaurants';

export function useRestaurant() {
  return useMemo(() => {
    // ?restaurant=<slug> lets each developer test any restaurant on localhost
    // without editing shared files — has no effect in production
    const devParam = new URLSearchParams(location.search).get('restaurant');
    if (devParam && restaurants[devParam]) return restaurants[devParam];

    const hostname  = window.location.hostname;
    const parts     = hostname.split('.');
    const subdomain = parts.length >= 3 ? parts[0] : hostname;
    return restaurants[subdomain] ?? restaurants['localhost'];
  }, []);
}
