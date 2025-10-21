import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { validateEmail, validateText } from '../utils/inputValidation';
import { toast } from 'sonner';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const nameValidation = validateText(formData.name, 'Name', 2, 100);
    if (!nameValidation.isValid) {
      toast.error(nameValidation.error);
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.error);
      return;
    }

    const subjectValidation = validateText(formData.subject, 'Subject', 5, 200);
    if (!subjectValidation.isValid) {
      toast.error(subjectValidation.error);
      return;
    }

    const messageValidation = validateText(formData.message, 'Message', 10, 2000);
    if (!messageValidation.isValid) {
      toast.error(messageValidation.error);
      return;
    }

    // Handle form submission
    toast.success('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
              <p className="text-gray-600">Get in touch with the SSRMS team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-teal-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+27 11 123 4567</p>
                    <p className="text-gray-600">+27 21 987 6543</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-teal-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">info@ssrms.co.za</p>
                    <p className="text-gray-600">support@ssrms.co.za</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-teal-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Head Office</h3>
                    <p className="text-gray-600">
                      123 Business District<br />
                      Johannesburg, 2000<br />
                      South Africa
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-teal-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Emergency Support</h3>
                <p className="text-red-700 text-sm">
                  For urgent compliance issues or safety concerns:
                </p>
                <p className="text-red-900 font-medium">+27 82 911 HELP (4357)</p>
                <p className="text-red-700 text-sm">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="compliance">Compliance Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="media">Media Inquiry</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Contact Methods */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MessageSquare className="w-8 h-8 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help from our support team
            </p>
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Phone className="w-8 h-8 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Schedule a Call</h3>
            <p className="text-gray-600 text-sm mb-4">
              Book a consultation with our experts
            </p>
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Book Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Mail className="w-8 h-8 text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <a 
              href="mailto:support@ssrms.co.za"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;