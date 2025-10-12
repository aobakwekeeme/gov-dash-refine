import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Document {
  id: string;
  shop_id: string;
  name: string;
  type: string;
  file_url?: string | null;
  status: string;
  expiry_date?: string | null;
  uploaded_at: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  notes?: string | null;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return { documents, loading, error, refetch: fetchDocuments };
};

export const useShopDocuments = (shopId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopDocuments = async () => {
    if (!shopId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('shop_id', shopId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shop documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopDocuments();
  }, [shopId]);

  return { documents, loading, error, refetch: fetchShopDocuments };
};