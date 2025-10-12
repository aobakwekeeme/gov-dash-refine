import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Inspection {
  id: string;
  shop_id: string;
  inspector_id?: string | null;
  type: string;
  status: string;
  scheduled_date: string;
  completed_date?: string | null;
  score?: number | null;
  notes?: string | null;
  issues?: string[] | null;
  created_at: string;
  updated_at: string;
  shops?: {
    name: string;
    address: string;
  };
}

export const useInspections = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          shops (
            name,
            address
          )
        `)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setInspections(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [user]);

  return { inspections, loading, error, refetch: fetchInspections };
};

export const useShopInspections = (shopId: string) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopInspections = async () => {
    if (!shopId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('shop_id', shopId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shop inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopInspections();
  }, [shopId]);

  return { inspections, loading, error, refetch: fetchShopInspections };
};