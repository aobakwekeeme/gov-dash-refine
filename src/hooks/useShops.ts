import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description?: string | null;
  address: string;
  phone?: string | null;
  email?: string | null;
  business_registration_number?: string | null;
  business_type?: string | null;
  vat_number?: string | null;
  trading_license_number?: string | null;
  tax_clearance_certificate?: string | null;
  zoning_certificate?: string | null;
  trading_hours?: any;
  categories?: string[] | null;
  logo_url?: string | null;
  banner_url?: string | null;
  status: string;
  compliance_score: number | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return { shops, loading, error, refetch: fetchShops };
};

export const useUserShop = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserShop = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setShop(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserShop();
  }, [user]);

  return { shop, loading, error, refetch: fetchUserShop };
};

export const useNearbyShops = (latitude?: number, longitude?: number, limit = 10) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyShops = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('shops')
        .select('*')
        .eq('status', 'approved')
        .limit(limit);

      // If location is provided, we could add distance calculation here
      // For now, just fetch approved shops
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyShops();
  }, [latitude, longitude, limit]);

  return { shops, loading, error, refetch: fetchNearbyShops };
};