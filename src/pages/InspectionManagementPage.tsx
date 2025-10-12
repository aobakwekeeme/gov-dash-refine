import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useInspections } from '../hooks/useInspections';
import { useShops } from '../hooks/useShops';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export default function InspectionManagementPage() {
  const { user } = useAuth();
  const { inspections, refetch } = useInspections();
  const { shops } = useShops();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    shop_id: '',
    type: 'routine',
    scheduled_date: '',
    notes: ''
  });
  const [shopSearch, setShopSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const provinces = Array.from(new Set(shops.map((s: any) => s.province).filter(Boolean)));
  const districts = Array.from(new Set(shops.map((s: any) => s.district_municipality).filter(Boolean)));

  const filteredShops = shops.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(shopSearch.toLowerCase()) || s.address.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesProvince = !provinceFilter || (s as any).province === provinceFilter;
    const matchesDistrict = !districtFilter || (s as any).district_municipality === districtFilter;
    return matchesSearch && matchesProvince && matchesDistrict;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.shop_id) {
        toast.error('Please select a shop');
        return;
      }
      
      if (!formData.scheduled_date) {
        toast.error('Please select a date and time');
        return;
      }

      const { error } = await supabase
        .from('inspections')
        .insert({
          shop_id: formData.shop_id,
          type: formData.type,
          scheduled_date: new Date(formData.scheduled_date).toISOString(),
          notes: formData.notes,
          inspector_id: user?.id,
          status: 'scheduled'
        });

      if (error) {
        console.error('Inspection creation error:', error);
        throw error;
      }
      
      toast.success('Inspection scheduled successfully');
      setShowCreateModal(false);
      setFormData({ shop_id: '', type: 'routine', scheduled_date: '', notes: '' });
      refetch();
    } catch (error: any) {
      console.error('Failed to schedule inspection:', error);
      toast.error(error?.message || 'Failed to schedule inspection');
    }
  };

  const handleComplete = async (inspectionId: string, score: number) => {
    try {
      const { error } = await supabase
        .from('inspections')
        .update({ 
          status: 'completed',
          completed_date: new Date().toISOString(),
          score 
        })
        .eq('id', inspectionId);

      if (error) throw error;
      toast.success('Inspection marked as completed');
      refetch();
    } catch (error) {
      toast.error('Failed to update inspection');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Inspection Management</h1>
            <p className="text-muted-foreground">Schedule and manage shop inspections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Inspection</span>
          </button>
        </div>

        <div className="grid gap-6">
          {inspections.map((inspection) => {
            const shop = shops.find(s => s.id === inspection.shop_id);
            return (
              <div key={inspection.id} className="bg-card rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{shop?.name || 'Unknown Shop'}</h3>
                    <p className="text-muted-foreground">{shop?.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    inspection.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    inspection.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {inspection.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-foreground capitalize">{inspection.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                    <p className="text-foreground">{new Date(inspection.scheduled_date).toLocaleDateString()}</p>
                  </div>
                  {inspection.score && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Score</label>
                      <p className="text-foreground font-bold">{inspection.score}/100</p>
                    </div>
                  )}
                </div>

                {inspection.notes && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="text-foreground">{inspection.notes}</p>
                  </div>
                )}

                {inspection.status === 'scheduled' && (
                  <button
                    onClick={() => handleComplete(inspection.id, 85)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-foreground mb-4">Schedule Inspection</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Shop</label>
                  <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <select
                      value={provinceFilter}
                      onChange={(e) => setProvinceFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">All Provinces</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">All Districts</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={formData.shop_id}
                    onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground mt-2"
                    required
                  >
                    <option value="">Select a shop</option>
                    {filteredShops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Inspection Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  >
                    <option value="routine">Routine</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="complaint">Complaint</option>
                    <option value="initial">Initial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}