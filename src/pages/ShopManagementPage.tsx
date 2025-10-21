import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Eye, FileText, Star, Ban } from 'lucide-react';
import { useShops } from '../hooks/useShops';
import { useDocuments } from '../hooks/useDocuments';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export default function ShopManagementPage() {
  const { shops, refetch } = useShops();
  const { documents } = useDocuments();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'all');

  const filteredShops = filterStatus === 'all' 
    ? shops 
    : shops.filter(shop => shop.status === filterStatus);

  const handleApprove = async (shopId: string) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status: 'approved' })
        .eq('id', shopId);

      if (error) throw error;
      toast.success('Shop approved successfully');
      refetch();
    } catch {
      toast.error('Failed to approve shop');
    }
  };

  const handleReject = async (shopId: string) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status: 'rejected' })
        .eq('id', shopId);

      if (error) throw error;
      toast.error('Shop rejected');
      refetch();
    } catch {
      toast.error('Failed to reject shop');
    }
  };

  const handleStatusChange = async (shopId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ status: newStatus })
        .eq('id', shopId);

      if (error) throw error;
      toast.success(`Shop status updated to ${newStatus}`);
      refetch();
    } catch {
      toast.error('Failed to update shop status');
    }
  };

  // Fetch reviews for selected shop
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedShop) {
        setReviews([]);
        return;
      }
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('shop_id', selectedShop)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setReviews(data);
      }
    };
    
    fetchReviews();
  }, [selectedShop]);

  const shopDocuments = selectedShop 
    ? documents.filter(doc => doc.shop_id === selectedShop)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shop Management</h1>
          <p className="text-muted-foreground">Review and manage shop applications</p>
        </div>

        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-foreground">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Shops</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Shop Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredShops.map((shop) => (
                      <tr 
                        key={shop.id} 
                        className={`hover:bg-muted/30 cursor-pointer ${selectedShop === shop.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedShop(shop.id)}
                      >
                        <td className="py-4 px-4 font-medium text-foreground">{shop.name}</td>
                        <td className="py-4 px-4 text-muted-foreground">{shop.address}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            shop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            shop.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            shop.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {shop.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {shop.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(shop.id);
                                  }}
                                  className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(shop.id);
                                  }}
                                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {(shop.status === 'approved' || shop.status === 'suspended') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(shop.id, shop.status === 'approved' ? 'suspended' : 'approved');
                                }}
                                className={`p-2 rounded-lg ${
                                  shop.status === 'approved' 
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                }`}
                                title={shop.status === 'approved' ? 'Suspend' : 'Restore'}
                              >
                                {shop.status === 'approved' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedShop(shop.id);
                              }}
                              className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Shop Details</h3>
            {selectedShop ? (
              <div className="space-y-4">
                {(() => {
                  const shop = shops.find(s => s.id === selectedShop);
                  if (!shop) return null;
                  return (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-foreground font-medium">{shop.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-foreground">{shop.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                        <p className="text-foreground">{shop.business_type || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contact</label>
                        <p className="text-foreground">{shop.phone || 'N/A'}</p>
                        <p className="text-foreground">{shop.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Compliance Score</label>
                        <p className="text-foreground font-bold">{shop.compliance_score || 0}/100</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Documents</label>
                        <div className="space-y-2">
                          {shopDocuments.length > 0 ? (
                            shopDocuments.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">{doc.name}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  doc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No documents uploaded</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                          <Star className="w-4 h-4 mr-1 text-amber-500" />
                          Reviews ({reviews.length})
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {reviews.length > 0 ? (
                            reviews.map((review: any) => (
                              <div key={review.id} className="p-3 bg-muted/30 rounded">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-foreground">
                                    {review.profiles?.full_name || 'Anonymous'}
                                  </span>
                                  <div className="flex items-center">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                    ))}
                                  </div>
                                </div>
                                {review.comment && (
                                  <p className="text-xs text-muted-foreground">{review.comment}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No reviews yet</p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Select a shop to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}