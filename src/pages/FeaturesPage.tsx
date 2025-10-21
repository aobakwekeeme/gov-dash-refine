import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Shield, Users, FileText, BarChart3, MapPin, Bell, Star, CheckCircle, Clock } from 'lucide-react';

export default function FeaturesPage() {
  const [activeRole, setActiveRole] = useState<'customer' | 'shop-owner' | 'government'>('customer');

  const coreFeatures = [
    {
      icon: Store,
      title: 'Digital Registration',
      description: 'Streamlined online registration process for spaza shops with automated document verification.',
      benefits: ['Faster approval times', 'Reduced paperwork', 'Real-time status tracking']
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'Real-time compliance tracking with automated alerts and reporting systems.',
      benefits: ['Proactive compliance management', 'Automated reminders', 'Detailed reporting']
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Transparent review and rating system building trust between shops and customers.',
      benefits: ['Customer feedback system', 'Verified shop status', 'Community engagement']
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Secure digital storage and management of all business documentation.',
      benefits: ['Cloud storage', 'Easy access', 'Version control']
    }
  ];

  const roleFeatures = {
    customer: [
      {
        icon: MapPin,
        title: 'Shop Discovery',
        description: 'Find verified spaza shops in your area with map integration and filtering options.',
        details: ['Interactive map view', 'Distance-based search', 'Category filtering', 'Operating hours display']
      },
      {
        icon: Star,
        title: 'Reviews & Ratings',
        description: 'Leave detailed reviews and ratings to help other customers and improve shop quality.',
        details: ['5-star rating system', 'Photo uploads', 'Detailed comments', 'Review moderation']
      },
      {
        icon: Bell,
        title: 'Safety Reporting',
        description: 'Report food safety concerns or other issues directly to relevant authorities.',
        details: ['Anonymous reporting', 'Photo evidence', 'Status tracking', 'Follow-up notifications']
      },
      {
        icon: CheckCircle,
        title: 'Verification Status',
        description: 'View real-time compliance status and safety ratings for all registered shops.',
        details: ['Compliance scores', 'Certification status', 'Inspection history', 'Safety badges']
      }
    ],
    'shop-owner': [
      {
        icon: FileText,
        title: 'Business Registration',
        description: 'Complete digital registration process with guided document upload and verification.',
        details: ['Step-by-step guidance', 'Document templates', 'Real-time validation', 'Status notifications']
      },
      {
        icon: BarChart3,
        title: 'Performance Analytics',
        description: 'Track business performance, customer feedback, and compliance metrics.',
        details: ['Sales insights', 'Customer demographics', 'Compliance trends', 'Performance benchmarks']
      },
      {
        icon: Clock,
        title: 'Inspection Management',
        description: 'Schedule and manage government inspections with automated reminders.',
        details: ['Inspection scheduling', 'Preparation checklists', 'History tracking', 'Result notifications']
      },
      {
        icon: Users,
        title: 'Customer Engagement',
        description: 'Respond to customer reviews and build stronger community relationships.',
        details: ['Review responses', 'Customer messaging', 'Loyalty programs', 'Feedback analysis']
      }
    ],
    government: [
      {
        icon: Shield,
        title: 'Application Review',
        description: 'Streamlined review process for shop registration applications with digital workflows.',
        details: ['Automated screening', 'Document verification', 'Approval workflows', 'Batch processing']
      },
      {
        icon: BarChart3,
        title: 'Compliance Dashboard',
        description: 'Monitor compliance rates and trends across your jurisdiction with detailed analytics.',
        details: ['Regional statistics', 'Compliance trends', 'Risk assessment', 'Performance metrics']
      },
      {
        icon: Bell,
        title: 'Alert System',
        description: 'Receive automated alerts for non-compliance issues and safety concerns.',
        details: ['Real-time notifications', 'Priority classification', 'Escalation procedures', 'Response tracking']
      },
      {
        icon: FileText,
        title: 'Report Generation',
        description: 'Generate comprehensive reports for regulatory compliance and policy making.',
        details: ['Custom report builder', 'Automated scheduling', 'Data export options', 'Visualization tools']
      }
    ]
  };

  const upcomingFeatures = [
    {
      title: 'Mobile App',
      description: 'Native mobile applications for iOS and Android with offline capabilities.',
      timeline: 'Q2 2025',
      status: 'In Development'
    },
    {
      title: 'Payment Integration',
      description: 'Integrated payment processing for shop registration fees and services.',
      timeline: 'Q3 2025',
      status: 'Planned'
    },
    {
      title: 'AI-Powered Insights',
      description: 'Machine learning algorithms for predictive compliance and risk assessment.',
      timeline: 'Q4 2025',
      status: 'Research Phase'
    },
    {
      title: 'Multi-language Support',
      description: 'Support for all 11 official South African languages.',
      timeline: 'Q1 2026',
      status: 'Planned'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="SSRMS Logo" className="w-10 h-10 rounded-lg" />
            <div className="text-2xl font-bold text-gray-900">SSRMS</div>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Platform Features</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover how SSRMS transforms spaza shop registration, compliance monitoring, 
            and community engagement through innovative digital solutions.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Specific Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features by Role</h2>
          
          {/* Role Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setActiveRole('customer')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeRole === 'customer'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setActiveRole('shop-owner')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeRole === 'shop-owner'
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shop Owner
              </button>
              <button
                onClick={() => setActiveRole('government')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeRole === 'government'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Government
              </button>
            </div>
          </div>

          {/* Role Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roleFeatures[activeRole].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Upcoming Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    feature.status === 'In Development' ? 'bg-blue-100 text-blue-700' :
                    feature.status === 'Planned' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {feature.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <p className="text-sm text-gray-500">Expected: {feature.timeline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of users already benefiting from our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Register Now
            </Link>
            <Link
              to="/support"
              className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="SSRMS Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">SSRMS</span>
          </Link>
          <p className="text-gray-400">© 2025 SSRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}