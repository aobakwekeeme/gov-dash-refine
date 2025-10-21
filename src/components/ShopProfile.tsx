import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Share, MoreHorizontal, MapPin, Phone, Mail, Clock, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserShop } from '../hooks/useShops';
import { useShopDocuments } from '../hooks/useDocuments';

export default function ShopProfile() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { shop, loading } = useUserShop();
  const { documents } = useShopDocuments(shop?.id || '');
  const [activeTab, setActiveTab] = useState('Overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop profile...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Shop Found</h2>
          <p className="text-gray-600 mb-6">You haven't registered a shop yet.</p>
          <button
            onClick={() => navigate('/shop/register')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
          >
            Register Your Shop
          </button>
        </div>
      </div>
    );
  }

  const approvedDocs = documents.filter(d => d.status === 'approved').length;
  const totalRequiredDocs = 7; // Based on compliance requirements

  const tabs = ['Overview', 'Documents', 'Compliance', 'History', 'Reviews'];

  const productCategories = [
    { name: 'Fresh Produce', items: 25 },
    { name: 'Dairy & Eggs', items: 18 },
    { name: 'Bread & Bakery', items: 12 },
    { name: 'Household Items', items: 35 },
    { name: 'Beverages', items: 22 },
    { name: 'Snacks & Sweets', items: 28 }
  ];

  const complianceItems = [
    { name: 'Business Registration', percentage: 90, color: 'bg-green-500' },
    { name: 'Health & Safety', percentage: 75, color: 'bg-yellow-500' },
    { name: 'Tax Compliance', percentage: 85, color: 'bg-green-500' }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on our platform!`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleContact = () => {
    if (shop.phone) {
      window.location.href = `tel:${shop.phone}`;
    } else if (shop.email) {
      window.location.href = `mailto:${shop.email}`;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-gray-600 mb-6">
                {shop.description || `${shop.name} is a registered spaza shop serving the local community 
                with essential groceries, household items, and fresh produce. We are committed 
                to maintaining high food safety standards and providing quality products at 
                affordable prices to support our neighborhood.`}
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Business Type</h4>
                  <p className="text-gray-600">{shop.business_type || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Registration No.</h4>
                  <p className="text-gray-600">{shop.business_registration_number || 'Pending'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Established</h4>
                  <p className="text-gray-600">{new Date(shop.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' })}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">District</h4>
                  <p className="text-gray-600">{(shop as any).district_municipality || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Products & Services */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Product Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {shop.categories && shop.categories.length > 0 ? (
                  shop.categories.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl">{['🥬', '🥚', '🍞', '🏠', '🥤', '🍫'][index % 6]}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{category}</h4>
                    </div>
                  ))
                ) : (
                  productCategories.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3"></div>
                      <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.items} Items</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      
      case 'Documents':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Documents</h3>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                    doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-gray-600 text-center py-8">No documents uploaded yet</p>
              )}
            </div>
          </div>
        );
      
      case 'Compliance':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Compliance Status</h3>
            <div className="space-y-4">
              {complianceItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-6 text-center">
              Overall Compliance Score: {shop.compliance_score || 0}%
            </p>
          </div>
        );
      
      case 'History':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Activity History</h3>
            <p className="text-gray-600 text-center py-8">No activity history available</p>
          </div>
        );
      
      case 'Reviews':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            <p className="text-gray-600 text-center py-8">No reviews yet</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Banner */}
      <div className="relative">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-200 to-blue-300"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Profile Section */}
        <div className="relative px-6 pb-6">
          <div className="max-w-6xl mx-auto">
            {/* Shop Logo */}
            <div className="absolute -top-20 left-0 w-24 h-24 bg-white rounded-lg border-4 border-white shadow-sm flex items-center justify-center">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-3xl font-bold text-gray-600">{shop.name?.charAt(0) || 'S'}</span>
              )}
            </div>
            
            {/* Shop Info */}
            <div className="pt-8 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                  <p className="text-gray-600 mb-3">
                    {shop.business_type || 'Spaza Shop'} • Established {new Date(shop.created_at).getFullYear()}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        shop.status === 'approved' ? 'bg-green-500' : 
                        shop.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`font-medium ${
                        shop.status === 'approved' ? 'text-green-600' : 
                        shop.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {shop.status === 'approved' ? 'Verified' : shop.status}
                      </span>
                    </div>
                    <span className="text-blue-600 font-medium">{shop.compliance_score || 0}% Compliance</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {profile?.role === 'shop_owner' && (
                    <button 
                      onClick={() => navigate('/documents')}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Manage Documents
                    </button>
                  )}
                  <button 
                    onClick={handleContact}
                    className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={handleShare}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share className="w-5 h-5" />
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors" title="More options">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{shop.address}</p>
                  </div>
                </div>
                
                {shop.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{shop.phone}</p>
                    </div>
                  </div>
                )}
                
                {shop.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{shop.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Trading Hours</p>
                    {shop.trading_hours ? (
                      <div className="text-gray-600 space-y-1">
                        {Object.entries(shop.trading_hours as Record<string, any>).map(([day, hours]) => {
                          const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                          if (typeof hours === 'boolean') {
                            return (
                              <p key={day}>{dayName}: {hours ? 'Open' : 'Closed'}</p>
                            );
                          } else if (hours && typeof hours === 'object' && 'open' in hours && 'close' in hours) {
                            return (
                              <p key={day}>{dayName}: {hours.open} - {hours.close}</p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600">Mon-Fri: 7AM - 7PM</p>
                        <p className="text-gray-600">Sat-Sun: 8AM - 5PM</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors">
                Get Directions
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-lg">Map Placeholder</div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Compliance Status</h3>
              
              {/* Overall Score */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(shop.compliance_score || 0) * 2.51} ${100 * 2.51}`}
                      className={`${
                        (shop.compliance_score || 0) >= 70 ? 'text-green-500' : 
                        (shop.compliance_score || 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{shop.compliance_score || 0}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {approvedDocs} of {totalRequiredDocs} documents approved
                </p>
              </div>
              
              {/* Individual Compliance Items */}
              <div className="space-y-4">
                {complianceItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate('/compliance')}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}