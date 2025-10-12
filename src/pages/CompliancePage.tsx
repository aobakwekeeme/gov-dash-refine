import React, { useState } from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, FileText, Users, Building, Phone, Mail } from 'lucide-react';

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const complianceAreas = [
    {
      id: 'business',
      title: 'Business Registration',
      percentage: 30,
      icon: Building,
      color: 'bg-blue-500',
      requirements: [
        'Valid business registration certificate',
        'Tax clearance certificate',
        'Municipal trading license',
        'Industry-specific permits'
      ]
    },
    {
      id: 'safety',
      title: 'Health & Safety',
      percentage: 40,
      icon: Shield,
      color: 'bg-green-500',
      requirements: [
        'Fire safety compliance certificate',
        'Health department approval',
        'Safety equipment installation',
        'Staff safety training records'
      ]
    },
    {
      id: 'tax',
      title: 'Tax Compliance',
      percentage: 30,
      icon: FileText,
      color: 'bg-purple-500',
      requirements: [
        'SARS tax registration',
        'VAT registration (if applicable)',
        'Monthly tax returns',
        'Annual financial statements'
      ]
    }
  ];

  const certificationLevels = [
    {
      level: 'SSRMS Verified',
      badge: 'bg-blue-100 text-blue-800',
      requirements: 'Basic business registration and contact verification',
      benefits: ['Listed on platform', 'Basic shop profile', 'Customer reviews']
    },
    {
      level: 'Safety Certified',
      badge: 'bg-green-100 text-green-800',
      requirements: 'Health & safety compliance + SSRMS Verified',
      benefits: ['Safety badge display', 'Priority in search results', 'Insurance discounts']
    },
    {
      level: 'Community Trusted',
      badge: 'bg-purple-100 text-purple-800',
      requirements: 'Full compliance across all areas + 6 months good standing',
      benefits: ['Premium listing', 'Featured shop status', 'Government partnership opportunities']
    }
  ];

  const complianceProcess = [
    {
      step: 1,
      title: 'Initial Assessment',
      description: 'Complete our compliance questionnaire and upload required documents',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Document Review',
      description: 'Our compliance team reviews all submitted documentation',
      duration: '3-5 business days'
    },
    {
      step: 3,
      title: 'Site Inspection',
      description: 'On-site visit to verify safety measures and business operations',
      duration: '1 day'
    },
    {
      step: 4,
      title: 'Certification',
      description: 'Receive your compliance certificate and platform benefits',
      duration: '1-2 days'
    }
  ];

  const regulatoryBodies = [
    {
      name: 'Companies and Intellectual Property Commission (CIPC)',
      role: 'Business registration and company compliance',
      contact: 'www.cipc.co.za | 086 100 2472'
    },
    {
      name: 'South African Revenue Service (SARS)',
      role: 'Tax registration and compliance',
      contact: 'www.sars.gov.za | 0800 00 7277'
    },
    {
      name: 'Department of Health',
      role: 'Health and safety regulations for food businesses',
      contact: 'www.health.gov.za | 012 395 8000'
    },
    {
      name: 'Local Municipality',
      role: 'Trading licenses and municipal compliance',
      contact: 'Contact your local municipal offices'
    }
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compliance Standards
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ensuring safe, legal, and trustworthy spaza shops through comprehensive compliance standards and certification processes.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'process', label: 'Process' },
              { id: 'certification', label: 'Certification' },
              { id: 'regulatory', label: 'Regulatory Bodies' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Compliance Areas */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance Areas</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {complianceAreas.map((area) => {
                  const IconComponent = area.icon;
                  return (
                    <div key={area.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-lg ${area.color} bg-opacity-10 mr-3`}>
                          <IconComponent className={`w-6 h-6 ${area.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{area.title}</h3>
                          <p className="text-sm text-gray-600">{area.percentage}% of total score</p>
                        </div>
                      </div>
                      <div className={`w-full bg-gray-200 rounded-full h-2 mb-4`}>
                        <div 
                          className={`h-2 rounded-full ${area.color}`}
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                      <ul className="space-y-2">
                        {area.requirements.map((req, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Compliance Scoring Works</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Scoring Breakdown</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Business Registration: 30 points</li>
                    <li>• Health & Safety: 40 points</li>
                    <li>• Tax Compliance: 30 points</li>
                    <li>• <strong>Total: 100 points</strong></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Minimum Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SSRMS Verified: 30+ points</li>
                    <li>• Safety Certified: 70+ points</li>
                    <li>• Community Trusted: 90+ points</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance Process</h2>
              <div className="space-y-6">
                {complianceProcess.map((step, index) => (
                  <div key={step.step} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start">
                      <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Documents</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Business registration certificate</li>
                    <li>• Tax clearance certificate</li>
                    <li>• Municipal trading license</li>
                    <li>• Lease agreement or property ownership</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Safety Documents</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Fire safety certificate</li>
                    <li>• Health department approval</li>
                    <li>• Insurance certificates</li>
                    <li>• Staff training records</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certification Tab */}
        {activeTab === 'certification' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Certification Levels</h2>
              <div className="space-y-6">
                {certificationLevels.map((cert, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${cert.badge} mb-2`}>
                          {cert.level}
                        </span>
                        <p className="text-gray-600">{cert.requirements}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {cert.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regulatory Bodies Tab */}
        {activeTab === 'regulatory' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Bodies</h2>
              <div className="space-y-4">
                {regulatoryBodies.map((body, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{body.name}</h3>
                    <p className="text-gray-600 mb-2">{body.role}</p>
                    <p className="text-sm text-teal-600">{body.contact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help with Compliance?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">SSRMS Compliance Team</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      +27 11 123 4567
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      compliance@ssrms.co.za
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                  <div className="text-sm text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-teal-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Compliant?</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Start your compliance journey today and join thousands of verified spaza shops across South Africa.
          </p>
          <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Compliance Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;