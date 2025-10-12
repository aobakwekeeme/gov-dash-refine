import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, Users, Lock, FileText, Mail, Phone } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Eye },
    { id: 'collection', title: 'Information Collection', icon: Users },
    { id: 'usage', title: 'How We Use Information', icon: FileText },
    { id: 'sharing', title: 'Information Sharing', icon: Users },
    { id: 'security', title: 'Data Security', icon: Shield },
    { id: 'rights', title: 'Your Rights', icon: Lock },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="SSRMS Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-gray-900">SSRMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policy</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600">
                  Last updated: January 15, 2025
                </p>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    This Privacy Policy complies with the Protection of Personal Information Act (POPIA) of South Africa 
                    and explains how SSRMS collects, uses, and protects your personal information.
                  </p>
                </div>
              </div>

              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
                  <div className="prose prose-gray max-w-none">
                    <p>
                      The Spaza Shop Registration & Management System (SSRMS) is committed to protecting your privacy 
                      and personal information. This Privacy Policy explains how we collect, use, disclose, and 
                      safeguard your information when you use our platform.
                    </p>
                    <p>
                      As a responsible data controller under POPIA, we ensure that all personal information is 
                      processed lawfully, fairly, and transparently. We only collect information that is necessary 
                      for the legitimate purposes of our service.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mt-6">Key Principles</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>We collect only the minimum information necessary</li>
                      <li>We use your information only for stated purposes</li>
                      <li>We implement appropriate security measures</li>
                      <li>We respect your rights regarding your personal information</li>
                      <li>We are transparent about our data practices</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Information Collection Section */}
              {activeSection === 'collection' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-3">We collect the following personal information:</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Full name and contact details (email, phone, address)</li>
                          <li>Business information (for shop owners)</li>
                          <li>Government department details (for officials)</li>
                          <li>Identity verification documents</li>
                          <li>Business registration documents</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-3">We automatically collect:</p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Device information and browser type</li>
                          <li>IP address and location data</li>
                          <li>Platform usage patterns and preferences</li>
                          <li>Log files and error reports</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookies and Tracking</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          We use cookies and similar technologies to enhance your experience, remember your 
                          preferences, and analyze platform usage. You can control cookie settings through 
                          your browser preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Section */}
              {activeSection === 'usage' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Purposes</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h4 className="font-medium text-teal-900 mb-2">Service Provision</h4>
                          <ul className="text-sm text-teal-800 space-y-1">
                            <li>• Account creation and management</li>
                            <li>• Shop registration processing</li>
                            <li>• Compliance monitoring</li>
                            <li>• Communication and support</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Legal Compliance</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Regulatory reporting</li>
                            <li>• Government oversight</li>
                            <li>• Audit and inspection support</li>
                            <li>• Legal obligation fulfillment</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Secondary Purposes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Platform improvement and optimization</li>
                          <li>Security monitoring and fraud prevention</li>
                          <li>Analytics and usage statistics</li>
                          <li>Marketing communications (with consent)</li>
                          <li>Research and development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sharing Section */}
              {activeSection === 'sharing' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Information Sharing</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        We do not sell, trade, or rent your personal information to third parties.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Authorized Sharing</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Government Agencies</h4>
                          <p className="text-gray-700 text-sm">
                            We share relevant information with authorized government officials for regulatory 
                            compliance, inspections, and public safety purposes.
                          </p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Service Providers</h4>
                          <p className="text-gray-700 text-sm">
                            We may share information with trusted service providers who assist in platform 
                            operations, subject to strict confidentiality agreements.
                          </p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Legal Requirements</h4>
                          <p className="text-gray-700 text-sm">
                            We may disclose information when required by law, court order, or to protect 
                            our rights and the safety of our users.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Measures</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Technical Safeguards</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• SSL/TLS encryption</li>
                            <li>• Secure data centers</li>
                            <li>• Regular security audits</li>
                            <li>• Access controls and monitoring</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">Administrative Safeguards</h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• Staff training and awareness</li>
                            <li>• Data handling procedures</li>
                            <li>• Incident response plans</li>
                            <li>• Regular policy reviews</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Retention</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-3">
                          We retain your personal information only as long as necessary for the purposes 
                          outlined in this policy or as required by law.
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Account information: Duration of account plus 7 years</li>
                          <li>Business records: As required by business regulations</li>
                          <li>Usage logs: 2 years for security and analytics</li>
                          <li>Marketing data: Until consent is withdrawn</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rights Section */}
              {activeSection === 'rights' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Your Rights Under POPIA</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-blue-800">
                        Under the Protection of Personal Information Act (POPIA), you have specific rights 
                        regarding your personal information.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Right to Access</h4>
                        <p className="text-gray-700 text-sm">
                          Request access to your personal information and details about how it's processed.
                        </p>
                      </div>
                      <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Right to Correction</h4>
                        <p className="text-gray-700 text-sm">
                          Request correction of inaccurate or incomplete personal information.
                        </p>
                      </div>
                      <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Right to Deletion</h4>
                        <p className="text-gray-700 text-sm">
                          Request deletion of your personal information (subject to legal requirements).
                        </p>
                      </div>
                      <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Right to Object</h4>
                        <p className="text-gray-700 text-sm">
                          Object to processing of your personal information for specific purposes.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-3">
                          To exercise any of these rights, please contact our Data Protection Officer:
                        </p>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>privacy@ssrms.co.za</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>+27 11 123 4567</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-3">
                          We will respond to your request within 30 days as required by POPIA.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Protection Officer</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">privacy@ssrms.co.za</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-700">+27 11 123 4567</span>
                          </div>
                          <div className="flex items-start">
                            <FileText className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                            <div className="text-gray-700">
                              <p>SSRMS Data Protection Office</p>
                              <p>123 Business District</p>
                              <p>Johannesburg, 2000</p>
                              <p>South Africa</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Regulator</h3>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-800 mb-2">
                          If you are not satisfied with our response to your privacy concerns, you may 
                          lodge a complaint with the Information Regulator:
                        </p>
                        <div className="text-blue-700 text-sm space-y-1">
                          <p>Information Regulator (South Africa)</p>
                          <p>Email: inforeg@justice.gov.za</p>
                          <p>Phone: +27 12 406 4818</p>
                          <p>Website: www.justice.gov.za/inforeg</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Policy Updates</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          We may update this Privacy Policy from time to time. We will notify you of any 
                          material changes by posting the new Privacy Policy on this page and updating 
                          the "Last updated" date. We encourage you to review this Privacy Policy 
                          periodically for any changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;