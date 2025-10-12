import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Favorite {
  id: string;
  user_id: string;
  shop_id: string;
  created_at: string;
  shops: {
    id: string;
    name: string;
    address: string;
    description?: string | null;
    compliance_score: number | null;
    status: string;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          shops (
            id,
            name,
            address,
            description,
            compliance_score,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (shopId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, shop_id: shopId });

      if (error) throw error;
      await fetchFavorites();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (shopId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('shop_id', shopId);

      if (error) throw error;
      await fetchFavorites();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      return false;
    }
  };

  const isFavorite = (shopId: string) => {
    return favorites.some(fav => fav.shop_id === shopId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return { 
    favorites, 
    loading, 
    error, 
    refetch: fetchFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  };
};