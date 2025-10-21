import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Activity {
  id: string;
  user_id: string;
  shop_id?: string | null;
  type: string;
  description: string;
  metadata?: any;
  created_at: string;
  shops?: {
    name: string;
  } | null;
}


export const useActivities = (limit = 10) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          shops (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id
        });

      if (error) throw error;
      await fetchActivities(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add activity');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user, limit]);

  return { activities, loading, error, refetch: fetchActivities, addActivity };
};