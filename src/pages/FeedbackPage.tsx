import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Star, Send, CheckCircle, Clock, Users } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const feedbackStats = [
    { label: 'Total Feedback', value: '2,847', icon: MessageSquare },
    { label: 'Implemented Ideas', value: '156', icon: CheckCircle },
    { label: 'Average Response Time', value: '24h', icon: Clock },
    { label: 'Active Contributors', value: '892', icon: Users }
  ];

  const recentImprovements = [
    {
      title: 'Enhanced Search Functionality',
      description: 'Improved shop search with filters and location-based results',
      votes: 47,
      status: 'Implemented',
      date: 'Jan 2025'
    },
    {
      title: 'Mobile App Dark Mode',
      description: 'Added dark mode support for better user experience',
      votes: 32,
      status: 'In Progress',
      date: 'Dec 2024'
    },
    {
      title: 'Bulk Compliance Updates',
      description: 'Allow shop owners to update multiple compliance items at once',
      votes: 28,
      status: 'Planned',
      date: 'Nov 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <img src="/logo.png" alt="SSRMS Logo" className="w-12 h-12 rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback & Suggestions</h1>
              <p className="text-gray-600">Help us improve the SSRMS platform</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {feedbackStats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <stat.icon className="w-8 h-8 text-teal-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Feedback</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">Your feedback has been submitted successfully. We'll review it within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Type
                  </label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Feedback
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Please provide detailed feedback..."
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>

          {/* Recent Improvements */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Improvements</h2>
              <div className="space-y-6">
                {recentImprovements.map((improvement, index) => (
                  <div key={index} className="border-l-4 border-teal-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{improvement.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{improvement.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{improvement.votes} votes</span>
                          </div>
                          <span className="text-sm text-gray-500">{improvement.date}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        improvement.status === 'Implemented' ? 'bg-green-100 text-green-800' :
                        improvement.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {improvement.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Guidelines */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Guidelines</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Be Specific</h3>
                    <p className="text-sm text-gray-600">Provide detailed information about the issue or suggestion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Include Context</h3>
                    <p className="text-sm text-gray-600">Mention your user role and the specific feature you're referring to</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Be Constructive</h3>
                    <p className="text-sm text-gray-600">Focus on how we can improve rather than just what's wrong</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Response Time</h3>
                    <p className="text-sm text-gray-600">We aim to respond to all feedback within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;