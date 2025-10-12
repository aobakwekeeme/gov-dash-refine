import { useState, useEffect } from 'react';
import { useShops } from './useShops';

export const useNearbyShops = (userLat?: number, userLng?: number, radiusKm: number = 5) => {
  const { shops, loading, error } = useShops();
  const [nearbyShops, setNearbyShops] = useState<typeof shops>([]);

  useEffect(() => {
    if (!userLat || !userLng) {
      // If no user location, just return approved shops
      setNearbyShops(shops.filter(shop => shop.status === 'approved').slice(0, 5));
      return;
    }

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const nearby = shops
      .filter(shop => {
        if (!shop.latitude || !shop.longitude) return false;
        const distance = calculateDistance(
          userLat, 
          userLng, 
          Number(shop.latitude), 
          Number(shop.longitude)
        );
        return distance <= radiusKm && shop.status === 'approved';
      })
      .sort((a, b) => {
        const distA = calculateDistance(userLat, userLng, Number(a.latitude), Number(a.longitude));
        const distB = calculateDistance(userLat, userLng, Number(b.latitude), Number(b.longitude));
        return distA - distB;
      });

    setNearbyShops(nearby);
  }, [shops, userLat, userLng, radiusKm]);

  return { nearbyShops, loading, error };
};