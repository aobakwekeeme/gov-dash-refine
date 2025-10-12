import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Heart, ArrowLeft } from 'lucide-react';
import { useShops } from '../hooks/useShops';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../integrations/supabase/client';

const ShopBrowsePage: React.FC = () => {
  const { shops, loading } = useShops();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shopRatings, setShopRatings] = useState<Record<string, { avg: number; count: number }>>({});

  useEffect(() => {
    const fetchRatings = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('shop_id, rating');
      
      if (data) {
        const ratings: Record<string, { avg: number; count: number }> = {};
        data.forEach((review: any) => {
          if (!ratings[review.shop_id]) {
            ratings[review.shop_id] = { avg: 0, count: 0 };
          }
          ratings[review.shop_id].avg += review.rating;
          ratings[review.shop_id].count += 1;
        });
        
        Object.keys(ratings).forEach(shopId => {
          ratings[shopId].avg = ratings[shopId].avg / ratings[shopId].count;
        });
        
        setShopRatings(ratings);
      }
    };
    
    fetchRatings();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleFavorite = async (shopId: string) => {
    if (isFavorite(shopId)) {
      await removeFromFavorites(shopId);
    } else {
      await addToFavorites(shopId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Shops</h1>
          <p className="text-gray-600">Discover spaza shops in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {shop.banner_url ? (
                  <img src={shop.banner_url} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-4xl font-bold">{shop.name.charAt(0)}</span>
                  </div>
                )}
                <button
                  onClick={() => handleToggleFavorite(shop.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isFavorite(shop.id) 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(shop.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shop.status)}`}>
                    {shop.status}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{shop.address}</span>
                </div>
                
                {shop.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {shopRatings[shop.id] ? shopRatings[shop.id].avg.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">Compliance: {shop.compliance_score}%</span>
                  </div>
                  <Link
                    to={`/shop/${shop.id}`}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopBrowsePage;