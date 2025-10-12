import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Shield, Target, Award, Heart, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Registered Shops', value: '1,200+', color: 'text-teal-600' },
    { icon: Shield, label: 'Compliance Rate', value: '95%', color: 'text-blue-600' },
    { icon: Award, label: 'Government Partners', value: '50+', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Customer Satisfaction', value: '98%', color: 'text-purple-600' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We prioritize food safety and quality standards to protect communities and build trust in local commerce.'
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'Supporting local entrepreneurs and fostering economic growth in townships and underserved communities.'
    },
    {
      icon: Heart,
      title: 'Transparency',
      description: 'Creating open, honest relationships between shop owners, customers, and government officials.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging technology to modernize traditional business processes and improve accessibility.'
    }
  ];

  const team = [
    {
      name: 'Tshimangadzo Surprise Masia',
      role: 'Chief Executive Officer',
      description: 'Former Director of Small Business Development at DTI with 15+ years in economic empowerment.'
    },
    {
      name: 'Luxolo Mkhathazo',
      role: 'Chief Technology Officer',
      description: 'Tech entrepreneur with expertise in government systems and digital transformation.'
    },
    {
      name: 'Billy Mokoena',
      role: 'Head of Community Relations',
      description: 'Community development specialist with deep township business network connections.'
    },
    {
      name: 'Khanyisa Kamba',
      role: 'Compliance Director',
      description: 'Former municipal health inspector with 20+ years in food safety and business regulation.'
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About SSRMS</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The Spaza Shop Registration & Management System is South Africa's leading digital platform 
            for empowering local entrepreneurs while ensuring quality standards and regulatory compliance.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To create a fair, transparent, and efficient ecosystem for spaza shop operations that 
              supports local entrepreneurship, ensures food safety and quality standards, builds trust 
              between shop owners and customers, and facilitates government oversight and compliance monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="mb-6">
              Founded in 2025, SSRMS emerged from a critical need to address food safety concerns and 
              support local entrepreneurship in South African townships. Following several food safety 
              incidents in informal retail sectors, government officials, community leaders, and 
              technology experts came together to create a solution.
            </p>
            <p className="mb-6">
              Our platform was born from the understanding that traditional paper-based registration 
              and compliance systems were inadequate for the digital age. We recognized that local 
              entrepreneurs needed support, not barriers, while maintaining the highest standards 
              for community safety.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-teal-100 mb-8">
            Be part of the transformation of South Africa's informal retail sector.
          </p>
          <Link
            to="/"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-colors inline-block"
          >
            Get Started Today
          </Link>
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