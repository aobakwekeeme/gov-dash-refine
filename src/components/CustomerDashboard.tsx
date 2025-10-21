import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useShops, useNearbyShops } from '../hooks/useShops';
import { useFavorites } from '../hooks/useFavorites';
import { useActivities } from '../hooks/useActivities';
import { Heart, MapPin, Clock, ShoppingBag, Home, Store, Star, Activity, HelpCircle, Menu, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const { shops: allShops } = useShops();
  const { shops: nearbyShops } = useNearbyShops();
  const { favorites } = useFavorites();
  const favoriteShops = favorites.map(fav => fav.shops).filter(Boolean);
  const { activities } = useActivities(5);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="customer-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="SSRMS Logo" className="w-8 h-8 rounded-lg" />
              <h1 className="text-2xl font-bold text-white">Customer Portal</h1>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-white hidden md:block">Welcome, {profile?.full_name || user?.email}</p>
              <NotificationDropdown />
              <ProfileDropdown />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 hover:bg-pink-700 rounded-lg transition-colors md:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute right-4 top-16 z-50 w-64 bg-white border border-border rounded-lg shadow-lg">
            <div className="p-4">
              <nav className="flex flex-col space-y-2">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link to="/shops" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Browse Shops</span>
                </Link>
                <Link to="/my-reviews" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">My Reviews</span>
                </Link>
                <Link to="/activities" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Activities</span>
                </Link>
                <Link to="/support" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Support</span>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Link to="/shops" className="stat-card bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl card-elevated border-0 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide">Favorited Shops</p>
                <p className="text-3xl font-bold text-rose-700 mt-1">{favorites.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm text-rose-600/80 mt-3 font-medium">Your saved shops</p>
          </Link>

          <Link to="/shops" className="stat-card bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl card-elevated border-0 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Nearby Shops</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">{nearbyShops.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm text-blue-600/80 mt-3 font-medium">In your area</p>
          </Link>

          <Link to="/activities" className="stat-card bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl card-elevated border-0 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Recent Activities</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">{activities.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm text-amber-600/80 mt-3 font-medium">Last 7 days</p>
          </Link>

          <Link to="/shops" className="stat-card bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl card-elevated border-0 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Total Shops</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{allShops.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-sm text-emerald-600/80 mt-3 font-medium">Available in system</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nearby Verified Shops */}
            <div className="bg-card rounded-xl p-6 card-elevated border-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-customer-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-customer-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Nearby Verified Shops</h3>
                </div>
                <Link to="/shops" className="bg-customer-primary text-white px-4 py-2 rounded-lg hover:bg-customer-primary/90 transition-colors font-medium text-sm">
                  View All Shops
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyShops.slice(0, 4).map((shop) => (
                  <div key={shop.id} className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 rounded-xl p-5 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 group-hover:text-customer-primary transition-colors">{shop.name}</h4>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        shop.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        shop.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {shop.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shop.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-customer-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-customer-primary">{shop.compliance_score || 0}</span>
                        </div>
                        <span className="text-sm text-gray-500">/100</span>
                      </div>
                      <Link to={`/shop/${shop.id}`} className="text-sm font-medium text-customer-primary hover:text-customer-primary/80 bg-customer-primary/5 hover:bg-customer-primary/10 px-3 py-1.5 rounded-lg transition-all">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-muted-foreground">No recent activities</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Favorite Shops */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Favorite Shops</h3>
              <div className="space-y-4">
                {favoriteShops.map((shop: any) => (
                  <div key={shop.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{shop.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        shop.status === 'approved' ? 'bg-green-100 text-green-800' :
                        shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shop.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{shop.address}</p>
                    <Link
                      to={`/shop/${shop.id}`}
                      className="text-sm text-primary hover:text-primary/80 w-full text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
                {favoriteShops.length === 0 && (
                  <p className="text-muted-foreground">No favorite shops yet</p>
                )}
              </div>
            </div>

            {/* Recently Added Shops */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Recently Added Shops</h3>
              <div className="space-y-4">
                {allShops.slice(0, 3).map((shop) => (
                  <div key={shop.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{shop.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        New
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(shop.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-muted-foreground">{shop.categories?.[0] || 'General'}</p>
                      <Link to={`/shop/${shop.id}`} className="text-sm text-primary hover:text-primary/80">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/shops" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                  Search Shops
                </Link>
                <Link to="/my-reviews" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                  My Reviews
                </Link>
                <Link to="/feedback" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                  Report Issue
                </Link>
                <Link to="/support" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}