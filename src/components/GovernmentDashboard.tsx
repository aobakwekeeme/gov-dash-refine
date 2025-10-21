import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useShops } from '../hooks/useShops';
import { useInspections } from '../hooks/useInspections';
import { useDocuments } from '../hooks/useDocuments';
import { Home, Store, ClipboardCheck, HelpCircle, Menu, X } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function GovernmentDashboard() {
  const { user, profile } = useAuth();
  const { shops } = useShops();
  const { inspections } = useInspections();
  const { documents } = useDocuments();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pendingShops = shops.filter(shop => shop.status === 'pending');
  const approvedShops = shops.filter(shop => shop.status === 'approved');
  const upcomingInspections = inspections.filter(inspection => 
    inspection.status === 'scheduled' && new Date(inspection.scheduled_date) > new Date()
  );
  const pendingDocuments = documents.filter(doc => doc.status === 'pending');
  const nonCompliantShops = shops.filter(shop => 
    shop.compliance_score !== null && shop.compliance_score < 70
  );

  const complianceCategories = [
    { name: 'Food Safety', percentage: shops.length > 0 ? Math.round((approvedShops.length / shops.length) * 100) : 0 },
    { name: 'Documentation', percentage: documents.length > 0 ? Math.round(((documents.length - pendingDocuments.length) / documents.length) * 100) : 0 },
    { name: 'Inspections', percentage: inspections.length > 0 ? Math.round((inspections.filter(i => i.status === 'completed').length / inspections.length) * 100) : 0 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="gov-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="SSRMS Logo" className="w-8 h-8 rounded-lg" />
              <h1 className="text-2xl font-bold text-white">Government Dashboard</h1>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-white hidden md:block">Welcome, {profile?.full_name || user?.email}</p>
              <NotificationDropdown />
              <ProfileDropdown />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 hover:bg-emerald-700 rounded-lg transition-colors md:hidden"
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
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link to="/shop-management" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Shop Management</span>
                </Link>
                <Link to="/inspections" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="font-medium">Inspections</span>
                </Link>
                <Link to="/support" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Support</span>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <Link to="/shop-management" className="stat-card bg-white border border-gray-200/60 rounded-xl p-6 gov-shadow hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gov-primary/10 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-gov-primary rounded text-white text-xs font-bold flex items-center justify-center">
                  {shops.length}
                </div>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                {approvedShops.length} APPROVED
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wide">Total Registered</div>
            <div className="text-3xl font-bold text-gov-primary">{shops.length}</div>
            <div className="text-xs text-gray-500 mt-1">Spaza Shops</div>
          </Link>

          <Link to="/shop-management?status=pending" className="stat-card bg-white border border-gray-200/60 rounded-xl p-6 gov-shadow hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-amber-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  !
                </div>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold border border-amber-200">
                ACTION REQUIRED
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wide">Pending Approvals</div>
            <div className="text-3xl font-bold text-amber-600">{pendingShops.length}</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting Review</div>
          </Link>

          <Link to="/inspections" className="stat-card bg-white border border-gray-200/60 rounded-xl p-6 gov-shadow hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  📅
                </div>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                THIS WEEK
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wide">Scheduled Inspections</div>
            <div className="text-3xl font-bold text-blue-600">{upcomingInspections.length}</div>
            <div className="text-xs text-gray-500 mt-1">Upcoming</div>
          </Link>

          <Link to="/shop-management" className="stat-card bg-white border border-gray-200/60 rounded-xl p-6 gov-shadow hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-emerald-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  ✓
                </div>
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                +2% IMPROVED
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wide">Compliance Rate</div>
            <div className="text-3xl font-bold text-emerald-600">
              {shops.length > 0 ? Math.round(((shops.length - nonCompliantShops.length) / shops.length) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 mt-1">System-wide</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compliance Overview */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Compliance Overview</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.print()}
                    className="text-muted-foreground hover:text-foreground px-3 py-1 border rounded"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-8 text-center mb-6">
                <div className="text-muted-foreground text-lg">Compliance Statistics Chart</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {complianceCategories.map((category, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium text-foreground mb-2">{category.name}</div>
                    <div className="text-xl font-bold text-foreground mb-2">{category.percentage}%</div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Recent Applications</h3>
                <Link to="/shop-management" className="text-primary hover:text-primary/80">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-medium text-muted-foreground">SHOP NAME</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">ADDRESS</th>
                      <th className="text-left py-3 font-medium text-muted-foreground">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingShops.slice(0, 5).map((shop) => (
                      <tr key={shop.id} className="hover:bg-muted/30">
                        <td className="py-4 font-medium text-foreground">{shop.name}</td>
                        <td className="py-4 text-muted-foreground">{shop.address}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            {shop.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {pendingShops.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-muted-foreground text-center">
                          No pending applications
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Inspections */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Upcoming Inspections</h3>
              <div className="space-y-4">
                {upcomingInspections.slice(0, 3).map((inspection) => (
                  <div key={inspection.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">
                        {shops.find(s => s.id === inspection.shop_id)?.name || 'Unknown Shop'}
                      </h4>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(inspection.scheduled_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">{inspection.type}</p>
                    <div className="flex space-x-2">
                      <button className="text-sm text-muted-foreground hover:text-foreground">Reschedule</button>
                      <button className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded hover:bg-primary/90">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                {upcomingInspections.length === 0 && (
                  <p className="text-muted-foreground">No upcoming inspections</p>
                )}
              </div>
            </div>

            {/* Non-Compliant Shops */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Non-Compliant Shops</h3>
              <div className="space-y-4">
                {nonCompliantShops.slice(0, 3).map((shop) => (
                  <div key={shop.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{shop.name}</h4>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Action Required
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Compliance Score: {shop.compliance_score}/100
                    </p>
                      <button 
                        onClick={async () => {
                          toast.success(`Notification sent to ${shop.name}`);
                        }}
                        className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
                      >
                        Send Notification
                      </button>
                      <button
                        onClick={async () => {
                          const { error } = await supabase
                            .from('shops')
                            .update({ status: 'suspended' })
                            .eq('id', shop.id);
                          if (error) {
                            toast.error('Failed to suspend shop');
                          } else {
                            toast.success('Shop suspended');
                          }
                        }}
                        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Suspend Shop
                      </button>
                  </div>
                ))}
                {nonCompliantShops.length === 0 && (
                  <p className="text-muted-foreground">All shops are compliant</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Quick Actions</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/shop-management" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                    Review Shops
                  </Link>
                  <Link to="/inspections" className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                    Schedule Inspection
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                    Generate Report
                  </button>
                  <button className="bg-muted hover:bg-muted/80 px-4 py-3 rounded-lg text-center font-medium transition-colors text-foreground">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}