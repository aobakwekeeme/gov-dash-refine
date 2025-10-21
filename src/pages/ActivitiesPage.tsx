import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, FileText, Star, Heart, ShoppingBag } from 'lucide-react';
import { useActivities } from '../hooks/useActivities';

export default function ActivitiesPage() {
  const { activities, loading } = useActivities(50);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review': return <Star className="w-5 h-5 text-yellow-600" />;
      case 'favorite': return <Heart className="w-5 h-5 text-red-600" />;
      case 'shop_visit': return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'document': return <FileText className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Activities</h1>
          <p className="text-gray-600">View all your recent actions and updates</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="divide-y">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(activity.created_at).toLocaleString('en-ZA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                <p className="text-gray-600">Your recent activities will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}