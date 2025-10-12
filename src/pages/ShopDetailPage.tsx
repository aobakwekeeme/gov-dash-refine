import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Star, Heart, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useFavorites } from '../hooks/useFavorites';
import { useActivities } from '../hooks/useActivities';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface Shop {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  phone?: string | null;
  email?: string | null;
  status: string;
  compliance_score: number | null;
  business_type?: string | null;
  categories?: string[] | null;
  trading_hours?: any;
  logo_url?: string | null;
  banner_url?: string | null;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
}

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addActivity } = useActivities();
  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopDetails();
    fetchReviews();
    
    if (user && shopId) {
      addActivity({
        type: 'shop_view',
        description: `Viewed shop details`,
        shop_id: shopId
      });
    }
  }, [shopId]);

  const fetchShopDetails = async () => {
    if (!shopId) return;
    
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

      if (error) throw error;
      setShop(data);
    } catch {
      toast.error('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!shopId) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!shopId || !user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    const wasFavorite = isFavorite(shopId);
    
    if (wasFavorite) {
      const success = await removeFromFavorites(shopId);
      if (success) {
        toast.success('Removed from favorites');
        addActivity({
          type: 'favorite_removed',
          description: `Removed ${shop?.name} from favorites`,
          shop_id: shopId
        });
      }
    } else {
      const success = await addToFavorites(shopId);
      if (success) {
        toast.success('Added to favorites');
        addActivity({
          type: 'favorite_added',
          description: `Added ${shop?.name} to favorites`,
          shop_id: shopId
        });
      }
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Shop not found</h2>
          <Link to="/shops" className="text-primary hover:text-primary/80">
            Browse all shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Banner */}
      <div className="relative h-72 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 overflow-hidden">
        {shop.banner_url ? (
          <img src={shop.banner_url} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 z-10 mb-6">
          <Link to="/shops" className="inline-flex items-center text-primary hover:text-primary/80 mb-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </Link>

          {/* Shop Info Card */}
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-6 flex-1">
                {shop.logo_url && (
                  <img src={shop.logo_url} alt={shop.name} className="w-24 h-24 rounded-xl object-cover shadow-md border-2 border-border flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-bold text-foreground mb-3 break-words">{shop.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      shop.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      shop.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {shop.status}
                    </span>
                    {shop.business_type && (
                      <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">{shop.business_type}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-amber-500 fill-current mr-2" />
                      <span className="font-bold text-foreground text-lg">{getAverageRating()}</span>
                      <span className="text-muted-foreground ml-2 text-sm">({reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center bg-primary/5 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      <span className="font-semibold text-foreground">Compliance: {shop.compliance_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-4 rounded-xl transition-all shadow-md ${
                  isFavorite(shop.id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:shadow-lg'
                }`}
              >
                <Heart className={`w-7 h-7 ${isFavorite(shop.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-card rounded-xl p-8 border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b border-border">About This Shop</h2>
              <p className="text-foreground leading-relaxed text-lg">{shop.description || 'No description available.'}</p>
            </div>

            {/* Categories */}
            {shop.categories && shop.categories.length > 0 && (
              <div className="bg-card rounded-xl p-8 border shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b border-border">Categories</h2>
                <div className="flex flex-wrap gap-3">
                  {shop.categories.map((category, index) => (
                    <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-card rounded-xl p-8 border shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
                {user && (
                  <Link
                    to={`/shop/${shop.id}/reviews`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
                  >
                    Write a Review
                  </Link>
                )}
              </div>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-muted/30 rounded-lg p-5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground text-lg">
                          {user && review.user_id === user.id ? 'You' : 'Anonymous User'}
                        </p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-foreground leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                    <Star className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground font-medium">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-5 pb-3 border-b border-border">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Address</p>
                    <p className="text-foreground font-medium leading-relaxed">{shop.address}</p>
                  </div>
                </div>
                {shop.phone && (
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-primary hover:text-primary/80 font-semibold">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                )}
                {shop.email && (
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Email</p>
                      <a href={`mailto:${shop.email}`} className="text-primary hover:text-primary/80 font-semibold break-all">
                        {shop.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Hours */}
            {shop.trading_hours && (
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-5 pb-3 border-b border-border flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Trading Hours
                </h2>
                <div className="space-y-3">
                  {Object.entries(shop.trading_hours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-lg">
                      <span className="text-foreground font-semibold capitalize">{day}</span>
                      <span className="text-muted-foreground font-medium">
                        {typeof hours === 'object' && hours.open && hours.close 
                          ? `${hours.open} - ${hours.close}` 
                          : typeof hours === 'string' 
                          ? hours 
                          : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-5 pb-3 border-b border-border">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                {user && (
                  <Link
                    to={`/shop/${shop.id}/reviews`}
                    className="flex items-center justify-center space-x-2 w-full bg-amber-500 text-white px-5 py-3 rounded-lg hover:bg-amber-600 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <Star className="w-5 h-5" />
                    <span>Write Review</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}