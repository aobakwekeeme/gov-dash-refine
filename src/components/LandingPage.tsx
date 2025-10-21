import { Link } from 'react-router-dom';
import { Store, Shield, Users } from 'lucide-react';
import { useShops } from '../hooks/useShops';
import { useEffect, useState } from 'react';

function LandingPage() {
  const { shops } = useShops();
  const [stats, setStats] = useState({
    totalShops: 0,
    complianceRate: 0
  });

  useEffect(() => {
    if (shops.length > 0) {
      const totalShops = shops.length;
      const compliantShops = shops.filter(shop => 
        shop.status === 'approved' && (shop.compliance_score ?? 0) >= 80
      ).length;
      const complianceRate = totalShops > 0 
        ? Math.round((compliantShops / totalShops) * 100) 
        : 0;
      
      setStats({ totalShops, complianceRate });
    }
  }, [shops]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="SSRMS Logo" className="w-10 h-10 rounded-lg" />
            <div className="text-2xl font-bold text-gray-900">SSRMS</div>
          </button>
          <div className="flex items-center space-x-4">
            <Link
              to="/signin"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signin?mode=signup"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full px-6 py-2 mb-8 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Trusted by 1,200+ Shops • 50+ Officials • 5,000+ Customers</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Fair and Transparent Spaza Shop Registration
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Empowering local entrepreneurs while ensuring quality and compliance for all customers. 
            Our digital platform streamlines shop registration, verification, and compliance monitoring 
            across South Africa.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link
              to="/signin?mode=signup"
              className="group bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                Register Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <button 
              onClick={() => {
                const featuresSection = document.getElementById('features-section');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group border-2 border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-600 px-10 py-4 rounded-xl font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              Learn More
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-teal-600 mb-2">{stats.totalShops.toLocaleString()}+</div>
              <div className="text-gray-600 font-medium">Registered Shops</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.complianceRate}%</div>
              <div className="text-gray-600 font-medium">Compliance Rate</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features-section" className="relative py-20 bg-gradient-to-b from-indigo-100 via-white to-teal-50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Store className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Digital Registration</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined digital registration process for spaza shops with comprehensive 
                documentation and automated verification systems for local entrepreneurs.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quality & Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                Prevents food safety violations through real-time compliance monitoring 
                and ensures all regulatory requirements are met for customer protection.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Customer Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Improves trust between shop owners and customers through transparent 
                feedback systems and comprehensive issue reporting mechanisms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Role */}
      <section className="relative bg-gradient-to-b from-teal-50 via-blue-50 to-indigo-100 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Choose Your Role
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105 flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Store className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Shop Owner</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                Register your spaza shop, manage compliance documentation, track business 
                performance, and access government oversight support.
              </p>
              <Link
                to="/signin?mode=signup"
                className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Register as Shop
              </Link>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105 flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Government Official</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                Review shop applications, monitor compliance rates, manage inspections, 
                and ensure fair ownership distribution across your jurisdiction.
              </p>
              <Link
                to="/signin?mode=signup"
                className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Register as Government
              </Link>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105 flex flex-col">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Customer</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                Find verified spaza shops in your area, leave reviews, report safety issues, 
                and help improve community standards.
              </p>
              <Link
                to="/signin?mode=signup"
                className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Register as Customer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-64 h-64 bg-teal-900/20 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
              >
                <img src="/logo.png" alt="SSRMS Logo" className="w-10 h-10 rounded-lg" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">SSRMS</h3>
              </button>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering local entrepreneurs while ensuring quality and compliance 
                for all customers in South African spaza shops.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About</Link></li>
                <li><Link to="/features" className="hover:text-teal-400 transition-colors">Features</Link></li>
                <li><Link to="/support" className="hover:text-teal-400 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/compliance" className="hover:text-teal-400 transition-colors">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/support" className="hover:text-teal-400 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
                <li><Link to="/feedback" className="hover:text-teal-400 transition-colors">Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-gray-300 text-center">
            © 2025 SSRMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;