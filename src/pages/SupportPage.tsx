import React, { useState } from 'react';
import { Search, MessageCircle, Phone, Mail, Clock, CheckCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import LiveChatModal from '../components/LiveChatModal';

const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const supportCategories = [
    {
      title: 'Getting Started',
      icon: <CheckCircle className="w-6 h-6" />,
      articles: 12,
      description: 'Learn the basics of using SSRMS'
    },
    {
      title: 'Account Management',
      icon: <MessageCircle className="w-6 h-6" />,
      articles: 8,
      description: 'Manage your account settings and profile'
    },
    {
      title: 'Compliance & Regulations',
      icon: <AlertCircle className="w-6 h-6" />,
      articles: 15,
      description: 'Understanding South African regulations'
    },
    {
      title: 'Technical Support',
      icon: <Phone className="w-6 h-6" />,
      articles: 6,
      description: 'Technical issues and troubleshooting'
    }
  ];

  const faqItems = [
    {
      question: 'How do I register my shop on SSRMS?',
      answer: 'To register your shop, click on "Register" and select "Shop Owner". Fill in your business details, upload required documents, and wait for verification. The process typically takes 2-3 business days.'
    },
    {
      question: 'What documents do I need for compliance?',
      answer: 'You need a valid business license, tax clearance certificate, and proof of address. Additional documents may be required based on your business type and location.'
    },
    {
      question: 'How can customers find my shop?',
      answer: 'Customers can search for shops by location, category, or name. Ensure your shop profile is complete with accurate information, photos, and operating hours to improve visibility.'
    },
    {
      question: 'What are the monitoring requirements?',
      answer: 'Government officials can monitor shop compliance through the platform. You must keep your information updated and respond to any compliance requests within the specified timeframe.'
    },
    {
      question: 'How do I update my shop information?',
      answer: 'Log into your shop owner dashboard and navigate to "Shop Profile". You can update your business information, operating hours, contact details, and photos at any time.'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Support Center</h1>
            <p className="text-lg text-gray-600 mb-8">
              Get help with SSRMS - your questions answered quickly
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Support Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportCategories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="text-blue-600">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                            <span className="text-blue-600 text-sm font-medium">{category.articles} articles</span>
                          </div>
                        </div>
                        {expandedCategory === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    {expandedCategory === index && (
                      <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                        <ul className="space-y-2">
                          <li className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">• How to get started with SSRMS</li>
                          <li className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">• Creating your first shop profile</li>
                          <li className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">• Understanding the dashboard</li>
                          <li className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">• Uploading required documents</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowLiveChat(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Live Chat</div>
                    <div className="text-sm text-gray-600">Available 24/7</div>
                  </div>
                </button>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone Support</div>
                    <div className="text-sm text-gray-600">+27 11 123 4567</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-600">support@ssrms.co.za</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">Currently Online</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Emergency Support</h3>
              <p className="text-sm text-red-700 mb-3">
                For urgent compliance or security issues
              </p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900">+27 11 999 0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Chat Modal */}
      <LiveChatModal isOpen={showLiveChat} onClose={() => setShowLiveChat(false)} />
    </div>
  );
};

export default SupportPage;